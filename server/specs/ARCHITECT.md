## 1. Visión General del Sistema
- **Nombre del Proyecto:** SinLuz
- **Propósito:** Registrar y visualizar de forma crowdsourced los cortes de suministro eléctrico. Los usuarios reportan apagones; el cliente los muestra sobre un mapa de calor (heatmap) con Leaflet.
- **Patrón de Arquitectura:** Monolito Modular (backend) + SPA con API REST versionada bajo `/api/v1`.

> **Nota:** este documento es una propuesta inicial. Las secciones 2 (Persistencia) y 5 (Roadmap) contienen decisiones provisionales pendientes de confirmar con el usuario.

## 2. Stack Tecnológico Autorizado
El agente de IA no debe utilizar herramientas, frameworks o librerías fuera de este listado:
- **Backend / API:** Rust, axum, tokio, serde / serde_json. Entry point: `server/src/main.rs`.
- **Frontend / UI:** React , Vite , TypeScript, Tailwind CSS , Leaflet + leaflet.heat, vite-plugin-pwa, lucide-react.
- **Base de Datos / Persistencia:** PostgreSQL con SQLx (el driver aún no forma parte de `Cargo.toml`). No puede añadirse sin que la spec activa en `specs/active/` lo ordene explícitamente.
- **Gestión de Estado / Caché:** sin librería de estado global definida todavía; preferir `useReducer`/hooks nativos de React hasta que una spec justifique otra.
- **Datos de prueba:** @faker-js/faker ya está instalado en `client/` para generar datos sintéticos en desarrollo.

## 3. Estructura Global de Carpetas
```text
sinluz/
├── client/                     # SPA React/Vite (pendiente de scaffolding: sin package.json)
│   ├── src/
│   └── public/
├── server/                     # API Rust/axum
│   ├── src/
│   │   ├── main.rs             # Arranque del servidor y composición del Router
│   │   ├── config/             # Variables de entorno y setups iniciales
│   │   ├── modules/            # Módulos encapsulados por dominio de negocio
│   │   └── shared/             # Tipos y utilidades reutilizables
│   ├── specs/
│   │   ├── active/             # Spec en curso (objetivo actual de construcción)
│   │   ├── approved/           # Specs completadas y validadas
│   │   ├── backlog/            # Ideas pendientes
│   │   ├── ARCHITECT.md        # Este documento
│   │   └── GLOSSARY.md         # (opcional) terminología de negocio
│   ├── Cargo.toml
│   └── AGENTS.md               # Reglas operativas del agente
└── .gitignore
```

**Capas dentro de un módulo** (`src/modules/<dominio>/`): `routes` (handlers axum) → `application` (casos de uso) → `domain` (entidades y reglas) → `infra` (persistencia y clientes externos). Los handlers no tocan `domain` directamente.

## 4. Convenciones de Código y Estándares de Ingeniería
Directrices técnicas de alto nivel para mantener la consistencia en todo el repositorio:
- **Nomenclatura:** `snake_case` para módulos, funciones y variables; `PascalCase` para `struct`, `enum` y `trait`; `SCREAMING_SNAKE_CASE` para constantes; `snake_case` en claves de JSON y tablas.
- **Paradigma:** errores como tipos de dominio explícitos (`enum` que implementa `std::error::Error` y `Display`); prohibido `unwrap()`/`expect()`/`panic!` en código de producción; prohibido el uso de tipos dinámicos sin estructura (`serde_json::Value` no es un tipo de dominio válido).
- **Capas HTTP:** los errores se convierten a respuestas en un único punto de la aplicación; los handlers no construyen respuestas a mano.
- **Estrategia Git:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`). Detalle completo en `server/AGENTS.md` §6.
- **Seguridad:** nunca guardar credenciales en código, usar siempre variables de entorno (`.env`). Validar y sanitizar todas las entradas de usuario. No stagear secretos ni `.env`.

## 5. Estado Actual del Sistema y Roadmap
- [x] Entorno Rust 2024 configurado (`Cargo.toml`, toolchain 1.97).
- [x] Servidor axum arrancando en `127.0.0.1:1234` con endpoint `/api/health`.
- [ ] **Spec activa:** `specs/active/01_registrar_reporte.md` — registrar reportes de corte (plantilla, aún sin fleshar).
- [ ] Persistencia de reportes (PostgreSQL / SQLx) — requiere confirmación.
- [ ] Autenticación y autorización de usuarios.
- [ ] Feed de datos para el heatmap del cliente.
- [ ] Scaffolding del cliente (no existe `package.json`).
- [ ] Offline de la PWA (registro de reportes sin conexión).
- [ ] `specs/GLOSSARY.md` con la terminología de negocio en español.
