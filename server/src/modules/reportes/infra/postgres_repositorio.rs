use chrono::{DateTime, Utc};
use sqlx::PgPool;

use crate::modules::reportes::domain::Reporte;

pub const UMBRAL_COINCIDENCIA_GRADOS: f64 = 0.001;

#[derive(Clone)]
pub struct PostgresRepositorioReportes {
    pool: PgPool,
}

impl PostgresRepositorioReportes {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn existe_reporte_reciente(
        &self,
        id_usuario: &str,
        lat: f64,
        lng: f64,
    ) -> Result<bool, sqlx::Error> {
        let encontrado: Option<i32> = sqlx::query_scalar(
            "SELECT 1
             FROM reportes
             WHERE id_usuario = $1
               AND ABS(lat - $2) < $4
               AND ABS(lng - $3) < $4
               AND creado > now() - interval '15 minutes'
             LIMIT 1",
        )
        .bind(id_usuario)
        .bind(lat)
        .bind(lng)
        .bind(UMBRAL_COINCIDENCIA_GRADOS)
        .fetch_optional(&self.pool)
        .await?;
        Ok(encontrado.is_some())
    }

    pub async fn insertar_reporte(
        &self,
        id_usuario: &str,
        lat: f64,
        lng: f64,
        creado: DateTime<Utc>,
        horas_duracion: Option<u16>,
    ) -> Result<Reporte, sqlx::Error> {
        let id: String = sqlx::query_scalar(
            "INSERT INTO reportes (id_usuario, lat, lng, creado, horas_duracion)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id::text",
        )
        .bind(id_usuario)
        .bind(lat)
        .bind(lng)
        .bind(creado)
        .bind(horas_duracion.map(|horas| horas as i16))
        .fetch_one(&self.pool)
        .await?;

        Ok(Reporte {
            id,
            id_usuario: id_usuario.to_owned(),
            lat,
            lng,
            creado,
            horas_duracion,
        })
    }
}
