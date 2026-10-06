use std::env;
use std::fmt;

#[derive(Clone, Debug)]
pub struct Config {
    pub database_url: String,
}

impl Config {
    pub fn from_env() -> Result<Self, ErrorConfig> {
        let database_url =
            env::var("DATABASE_URL").map_err(|_| ErrorConfig::VariableAusente("DATABASE_URL"))?;
        Ok(Self { database_url })
    }
}

#[derive(Debug)]
pub enum ErrorConfig {
    VariableAusente(&'static str),
}

impl fmt::Display for ErrorConfig {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ErrorConfig::VariableAusente(nombre) => {
                write!(f, "falta la variable de entorno {nombre}")
            }
        }
    }
}

impl std::error::Error for ErrorConfig {}
