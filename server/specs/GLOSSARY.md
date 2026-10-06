# SinLuz — Glosario de Negocio

Terminología acordada para nombrar variables, funciones, rutas y tablas de base de datos.

- **reporte:** registro de un corte de suministro eléctrico notificado por un dispositivo. Es la unidad de entrada del sistema.
- **id_usuario:** identificador opaco del dispositivo que reporta (device_id). Se genera en el cliente y no identifica a una persona; no implica autenticación.
- **lat / lng:** coordenadas geográficas del corte en grados decimales (WGS84).
- **creado:** instante (UTC, RFC 3339) en el que el servidor registra el reporte.
- **horas_duracion:** estimación aproximada, en horas enteras (0–168), de cuánto suelen durar los cortes en la zona según la experiencia del usuario. `NULL` = no lo sabe.
- **cooldown:** medida anti-spam. Un mismo `id_usuario` no puede reportar la misma ubicación (±~100 m) más de una vez cada 15 minutos.