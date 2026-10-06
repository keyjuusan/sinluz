use std::time::{SystemTime, UNIX_EPOCH};

use axum::{
    Router,
    body::Body,
    http::{Method, Request, StatusCode},
};
use http_body_util::BodyExt;
use serde_json::json;
use sqlx::postgres::PgPoolOptions;
use tower::ServiceExt;

use super::router;

async fn pool_de_prueba() -> sqlx::PgPool {
    dotenvy::dotenv().ok();
    let url = std::env::var("DATABASE_URL").expect("DATABASE_URL no definida");
    let pool = PgPoolOptions::new()
        .connect(&url)
        .await
        .expect("no se pudo conectar a postgres");
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("no se pudieron aplicar las migraciones");
    pool
}

async fn aplicacion() -> (sqlx::PgPool, Router) {
    let pool = pool_de_prueba().await;
    (pool.clone(), router(pool))
}

fn dispositivo_unico() -> String {
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("el reloj debe estar antes de 1970")
        .as_nanos();
    format!("test-dev-{nanos}")
}

async fn post_reporte(app: &Router, body: &str) -> (StatusCode, String) {
    let response = app
        .clone()
        .oneshot(
            Request::builder()
                .method(Method::POST)
                .uri("/api/v1/reportes")
                .header("content-type", "application/json")
                .body(Body::from(body.to_owned()))
                .expect("request inválido"),
        )
        .await
        .expect("el router no respondió");

    let status = response.status();
    let bytes = response
        .into_body()
        .collect()
        .await
        .expect("no se pudo leer el body")
        .to_bytes();
    (
        status,
        String::from_utf8(bytes.to_vec()).expect("body no es utf8"),
    )
}

#[tokio::test]
async fn registra_reporte_valido() {
    let (pool, app) = aplicacion().await;
    let dispositivo = dispositivo_unico();

    let (status, body) = post_reporte(
        &app,
        &json!({
            "id_usuario": dispositivo,
            "lat": -33.4489,
            "lng": -70.6693,
            "horas_duracion": 2
        })
        .to_string(),
    )
    .await;

    assert_eq!(status, StatusCode::CREATED);
    let respuesta: serde_json::Value = serde_json::from_str(&body).expect("respuesta no es json");
    assert!(respuesta["id"].as_str().is_some_and(|id| !id.is_empty()));
    let creado = respuesta["creado"].as_str().expect("falta creado");
    assert!(
        chrono::DateTime::parse_from_rfc3339(creado).is_ok(),
        "creado no es RFC 3339: {creado}"
    );

    let filas: (i64,) = sqlx::query_as("SELECT count(*) FROM reportes WHERE id_usuario = $1")
        .bind(&dispositivo)
        .fetch_one(&pool)
        .await
        .expect("fallo la consulta de verificación");
    assert_eq!(filas.0, 1, "la fila quedó persistida una sola vez");

    let horas: (Option<i16>,) =
        sqlx::query_as("SELECT horas_duracion FROM reportes WHERE id_usuario = $1")
            .bind(&dispositivo)
            .fetch_one(&pool)
            .await
            .expect("fallo la consulta de horas");
    assert_eq!(horas.0, Some(2));
}

#[tokio::test]
async fn acepta_duracion_nula_y_omitida() {
    let (pool, app) = aplicacion().await;
    let con_null = dispositivo_unico();
    let omitida = dispositivo_unico();

    let (status, _) = post_reporte(
        &app,
        &json!({
            "id_usuario": con_null,
            "lat": -33.45,
            "lng": -70.67,
            "horas_duracion": null
        })
        .to_string(),
    )
    .await;
    assert_eq!(status, StatusCode::CREATED);

    let (status, _) = post_reporte(
        &app,
        &format!(r#"{{"id_usuario":"{omitida}","lat":-33.46,"lng":-70.68}}"#),
    )
    .await;
    assert_eq!(status, StatusCode::CREATED);

    for dispositivo in [con_null, omitida] {
        let es_nulo: (bool,) =
            sqlx::query_as("SELECT horas_duracion IS NULL FROM reportes WHERE id_usuario = $1")
                .bind(&dispositivo)
                .fetch_one(&pool)
                .await
                .expect("fallo la consulta de verificación");
        assert!(es_nulo.0, "se debió persistir NULL para {dispositivo}");
    }
}

#[tokio::test]
async fn acepta_coordenadas_en_limites() {
    let (_, app) = aplicacion().await;

    let (status, _) = post_reporte(
        &app,
        &json!({
            "id_usuario": dispositivo_unico(),
            "lat": 90.0,
            "lng": 180.0
        })
        .to_string(),
    )
    .await;
    assert_eq!(status, StatusCode::CREATED);

    let (status, _) = post_reporte(
        &app,
        &json!({
            "id_usuario": dispositivo_unico(),
            "lat": -90.0,
            "lng": -180.0
        })
        .to_string(),
    )
    .await;
    assert_eq!(status, StatusCode::CREATED);
}

#[tokio::test]
async fn rechaza_coordenadas_fuera_de_rango() {
    let (_, app) = aplicacion().await;

    let (status, body) = post_reporte(
        &app,
        &json!({
            "id_usuario": dispositivo_unico(),
            "lat": 90.1,
            "lng": 12.0
        })
        .to_string(),
    )
    .await;
    assert_eq!(status, StatusCode::BAD_REQUEST);
    assert!(body.contains("lat fuera de rango"), "body: {body}");

    let (status, body) = post_reporte(
        &app,
        &json!({
            "id_usuario": dispositivo_unico(),
            "lat": 12.0,
            "lng": -180.1
        })
        .to_string(),
    )
    .await;
    assert_eq!(status, StatusCode::BAD_REQUEST);
    assert!(body.contains("lng fuera de rango"), "body: {body}");
}

#[tokio::test]
async fn rechaza_device_invalido() {
    let (_, app) = aplicacion().await;

    let (status, body) = post_reporte(
        &app,
        &json!({
            "id_usuario": "abc1234",
            "lat": 12.0,
            "lng": 45.0
        })
        .to_string(),
    )
    .await;
    assert_eq!(status, StatusCode::BAD_REQUEST);
    assert!(body.contains("id_usuario"), "body: {body}");

    let (status, body) = post_reporte(
        &app,
        &json!({
            "id_usuario": "device-invalido!",
            "lat": 12.0,
            "lng": 45.0
        })
        .to_string(),
    )
    .await;
    assert_eq!(status, StatusCode::BAD_REQUEST);
    assert!(body.contains("id_usuario"), "body: {body}");
}

#[tokio::test]
async fn rechaza_duracion_fuera_de_rango() {
    let (_, app) = aplicacion().await;

    let (status, body) = post_reporte(
        &app,
        &json!({
            "id_usuario": dispositivo_unico(),
            "lat": 12.0,
            "lng": 45.0,
            "horas_duracion": 169
        })
        .to_string(),
    )
    .await;
    assert_eq!(status, StatusCode::BAD_REQUEST);
    assert!(body.contains("horas_duracion"), "body: {body}");

    let (status, _) = post_reporte(
        &app,
        &json!({
            "id_usuario": dispositivo_unico(),
            "lat": 12.0,
            "lng": 46.0,
            "horas_duracion": 168
        })
        .to_string(),
    )
    .await;
    assert_eq!(status, StatusCode::CREATED);
}

#[tokio::test]
async fn rechaza_campo_desconocido() {
    let (_, app) = aplicacion().await;
    let (status, _) = post_reporte(
        &app,
        &json!({
            "id_usuario": dispositivo_unico(),
            "lat": 12.0,
            "lng": 45.0,
            "foo": 1
        })
        .to_string(),
    )
    .await;
    assert_eq!(status, StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn rechaza_json_malformado_o_vacio() {
    let (_, app) = aplicacion().await;

    let (status, body) = post_reporte(&app, "esto-no-es-json").await;
    assert_eq!(status, StatusCode::BAD_REQUEST);
    assert!(
        body.contains("cuerpo de solicitud inválido"),
        "body: {body}"
    );

    let (status, _) = post_reporte(&app, "").await;
    assert_eq!(status, StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn aplica_cooldown_misma_ubicacion() {
    let (_, app) = aplicacion().await;
    let dispositivo = dispositivo_unico();
    let cuerpo = json!({
        "id_usuario": dispositivo,
        "lat": -33.45,
        "lng": -70.67
    })
    .to_string();

    let (status, _) = post_reporte(&app, &cuerpo).await;
    assert_eq!(status, StatusCode::CREATED);

    let (status, body) = post_reporte(&app, &cuerpo).await;
    assert_eq!(status, StatusCode::TOO_MANY_REQUESTS);
    assert!(body.contains("cooldown"), "body: {body}");
}

#[tokio::test]
async fn permite_otra_ubicacion_mismo_dispositivo() {
    let (_, app) = aplicacion().await;
    let dispositivo = dispositivo_unico();

    for (lat, lng) in [(-33.45, -70.67), (-32.45, -69.67)] {
        let (status, _) = post_reporte(
            &app,
            &json!({ "id_usuario": dispositivo, "lat": lat, "lng": lng }).to_string(),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED);
    }
}

#[tokio::test]
async fn permite_otro_dispositivo_misma_ubicacion() {
    let (_, app) = aplicacion().await;

    for _ in 0..2 {
        let (status, _) = post_reporte(
            &app,
            &json!({
                "id_usuario": dispositivo_unico(),
                "lat": -33.45,
                "lng": -70.67
            })
            .to_string(),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED);
    }
}
