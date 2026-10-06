mod config;
mod modules;

use axum::{Router, http::StatusCode, routing::get};
use sqlx::postgres::PgPoolOptions;
use tokio::net::TcpListener;

use crate::config::Config;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    let config = match Config::from_env() {
        Ok(config) => config,
        Err(error) => {
            eprintln!("Error de configuración: {error}");
            std::process::exit(1);
        }
    };

    let pool = match PgPoolOptions::new()
        .max_connections(5)
        .connect(&config.database_url)
        .await
    {
        Ok(pool) => pool,
        Err(error) => {
            eprintln!("No se pudo conectar a la base de datos: {error}");
            std::process::exit(1);
        }
    };

    if let Err(error) = sqlx::migrate!("./migrations").run(&pool).await {
        eprintln!("No se pudieron aplicar las migraciones: {error}");
        std::process::exit(1);
    }

    let port = 1234;
    let host = format!("127.0.0.1:{port}");
    let listener = TcpListener::bind(&host).await.unwrap();

    let app = Router::new()
        .route("/api/health", get(|| async { StatusCode::OK }))
        .merge(modules::reportes::routes::router(pool));

    println!("Servidor iniciado en: http://{host}");
    axum::serve(listener, app).await.unwrap();
}
