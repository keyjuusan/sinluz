# Spec: [Nombre Corto y Claro de la Funcionalidad]

## 1. Visión General e Impacto
- **Objetivo:** [Explica brevemente QUÉ se va a construir y para qué sirve].
- **Contexto:** [Menciona si interactúa con código existente o si es un módulo totalmente nuevo].

## 2. Modelos de Datos / Contratos (Si aplica)
[Define aquí las estructuras de datos, tipos de TypeScript/Python o tablas de base de datos que se necesitan]
```typescript
// Ejemplo de estructura esperada (puedes borrarlo o adaptarlo):
interface Ejemplo {
  id: string;
  createdAt: Date;
}
```

## 3. Reglas de Negocio (Criterios de Aceptación)
El agente de IA debe cumplir obligatoriamente con las siguientes reglas lógicas:
- [ ] **Regla 1 (Entradas):** [Ej: Debe validar que el correo contenga un '@'].
- [ ] **Regla 2 (Proceso):** [Ej: Debe encriptar la contraseña usando la librería X].
- [ ] **Regla 3 (Límites):** [Ej: El límite máximo de intentos permitidos es 3].
- [ ] **Regla 4 (Salidas):** [Ej: Si falla, debe lanzar un error tipo ValidationError].

## 4. Comportamiento de la Interfaz / API (Si aplica)
- **Ruta / Endpoint / Función:** `[Ej: POST /api/v1/auth/login o función validarDato()]`
- **Casos de Éxito:** [Qué debe devolver si todo sale bien (ej: Status 200 + Token)].
- **Casos de Error:** [Qué códigos o mensajes debe devolver si algo falla (ej: Status 400 + Mensaje)].

## 5. Estrategia de Pruebas Obligatoria (Tests)
El agente debe escribir y pasar con éxito los siguientes escenarios de prueba automatizados:
- **Pruebas de Camino Feliz (Happy Path):**
  - [ ] [Ej: Validar login con credenciales correctas].
- **Pruebas de Borde y Errores (Edge Cases):**
  - [ ] [Ej: Validar comportamiento cuando el correo no tiene formato válido].
  - [ ] [Ej: Validar comportamiento ante strings vacíos o nulos].

## 6. Pasos Sugeridos para la Implementación (Orden de Ejecución)
*Instrucción para la IA: Sigue este orden estrictamente para evitar pérdida de contexto:*
1. Crear/modificar los tipos y modelos de datos descritos en la Sección 2.
2. Implementar la lógica central y las reglas de negocio de la Sección 3.
3. Crear el script o archivo de pruebas de la Sección 5.
4. Ejecutar el comando de tests del proyecto y corregir hasta obtener un 100% de éxito.
