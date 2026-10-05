use axum::{Router, http::StatusCode, routing::get};
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    let port = 1234;
    let host = format!("127.0.0.1:{port}");
    let host_copy = host.clone();
    let listener = TcpListener::bind(host).await.unwrap();

    let router = Router::new().route("/api/health", get(|| async {
      StatusCode::OK
    }));
    println!("Servidor iniciado en: http://{}",host_copy);
    axum::serve(listener, router).await.unwrap();
}
