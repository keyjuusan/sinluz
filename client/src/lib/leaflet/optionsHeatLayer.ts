import type { HeatMapOptions } from "leaflet";

const optionsHeatLayer: HeatMapOptions = {
  radius: 30,     // Puntos grandes y difusos para ocultar ubicaciones exactas
  blur: 7,       // Bordes muy suaves
  maxZoom:8,     // Clave: evita que al hacer zoom el mapa revele el punto nítido
  gradient: {     // Paleta de colores térmica estándar
    // 0.4: 'blue',
    // 0.8: 'yellow',
    1.0: 'red'
  }
}

export default optionsHeatLayer;
