import type { HeatMapOptions } from "leaflet";

/**
 * Configuración optimizada para Leaflet HeatLayer.
 * Mantiene la privacidad de los puntos y suaviza las transiciones visuales.
 */
const optionsHeatLayer: HeatMapOptions = {
  radius: 25,
  blur: 15,
  maxZoom: 8,
  max: 1.0,          // Fijamos que 1.0 (6 horas) sea el tope del color
  minOpacity: 0.25,  // Hace visible el reporte de 1 hora aunque esté aislado

  // Paleta de degradado de criticidad (de menos horas a más horas sin luz)
  gradient: {
    0.16: '#ffeda0', // 1 Hora: Amarillo claro (Afectación inicial)
    0.33: '#fed976', // 2 Horas: Amarillo oscuro
    0.50: '#feb24c', // 3 Horas: Naranja brillante
    0.66: '#fd8d3c', // 4 Horas: Naranja oscuro
    0.83: '#fc4e2a', // 5 Horas: Rojo vivo
    1.00: '#bd0026'  // 6 Horas o más: Rojo sangre/oscuro (Zona crítica)
  }
};

export default optionsHeatLayer;
