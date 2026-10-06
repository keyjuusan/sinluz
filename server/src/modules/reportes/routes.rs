use axum::{
    Json, Router,
    extract::{State, rejection::JsonRejection},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::post,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::PgPool;

use crate::modules::reportes::application::{ErrorRegistro, registrar_reporte};
use crate::modules::reportes::domain::ErrorValidacion;
use crate::modules::reportes::infra::PostgresRepositorioReportes;

pub fn router(pool: PgPool) -> Router {
    let repositorio = PostgresRepositorioReportes::new(pool);
    Router::new()
        .route("/api/v1/reportes", post(crear_reporte))
        .with_state(repositorio)
}

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SolicitudCrearReporte {
    pub id_usuario: String,
    pub lat: f64,
    pub lng: f64,
    pub horas_duracion: Option<u16>,
}

#[derive(Debug, Serialize)]
pub struct RespuestaRegistroReporte {
    pub id: String,
    pub creado: String,
}

pub async fn crear_reporte(
    State(repositorio): State<PostgresRepositorioReportes>,
    solicitud: Result<Json<SolicitudCrearReporte>, JsonRejection>,
) -> Result<(StatusCode, Json<RespuestaRegistroReporte>), ErrorHttp> {
    let Json(solicitud) = solicitud.map_err(ErrorHttp::SolicitudInvalida)?;

    let reporte = registrar_reporte(
        &repositorio,
        &solicitud.id_usuario,
        solicitud.lat,
        solicitud.lng,
        solicitud.horas_duracion,
    )
    .await
    .map_err(ErrorHttp::desde_registro)?;

    Ok((
        StatusCode::CREATED,
        Json(RespuestaRegistroReporte {
            id: reporte.id,
            creado: reporte.creado.to_rfc3339(),
        }),
    ))
}

#[derive(Debug)]
pub enum ErrorHttp {
    SolicitudInvalida(JsonRejection),
    Validacion(ErrorValidacion),
    CooldownActivo,
    Interno,
}

impl ErrorHttp {
    fn desde_registro(error: ErrorRegistro) -> Self {
        match error {
            ErrorRegistro::Validacion(validacion) => ErrorHttp::Validacion(validacion),
            ErrorRegistro::CooldownActivo => ErrorHttp::CooldownActivo,
            ErrorRegistro::Persistencia(_) => ErrorHttp::Interno,
        }
    }
}

impl IntoResponse for ErrorHttp {
    fn into_response(self) -> Response {
        let (status, mensaje) = match self {
            ErrorHttp::SolicitudInvalida(rechazo) => (
                StatusCode::BAD_REQUEST,
                format!("cuerpo de solicitud inválido: {rechazo}"),
            ),
            ErrorHttp::Validacion(error) => (StatusCode::BAD_REQUEST, error.to_string()),
            ErrorHttp::CooldownActivo => (
                StatusCode::TOO_MANY_REQUESTS,
                "cooldown activo: espera 15 minutos antes de reportar la misma ubicación"
                    .to_owned(),
            ),
            ErrorHttp::Interno => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "error interno del servidor".to_owned(),
            ),
        };
        (status, Json(json!({ "error": mensaje }))).into_response()
    }
}

#[cfg(test)]
mod tests;
