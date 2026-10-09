import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L, { Map } from "leaflet";
import "leaflet.heat"; // Importa el plugin para que Leaflet reconozca L.heatLayer
import optionsHeatLayer from "@/lib/leaflet/optionsHeatLayer";

export const ModernHeatmapLayer = ({ points }) => {
  const [latLngWS, setLatLngWS] = useState([]);
  const wsRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    // CORRECCIÓN 1: Almacenamos la función de limpieza de los puntos fijos
    const limpiarPuntosProps = graficarLatLngs(map, points);

    // 1. Crear conexión (Solo si no está ya conectado, manteniendo el WS abierto permanentemente)
    if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
      wsRef.current = new WebSocket(import.meta.env.VITE_BASE_URL_API_WS);

      wsRef.current.onopen = () => {
        console.log("WebSocket conectado");
      };

      wsRef.current.onmessage = (event) => {
        // CORRECCIÓN 2: Parseamos event.data porque llega como string JSON
        const data = JSON.parse(event.data);
        const { lat, lng, horas_duracion: horas } = data;
        const HORA_CRITICA = 7;
        const intensidad =
          Math.max(1, Math.min(HORA_CRITICA, horas)) / HORA_CRITICA;
        setLatLngWS((prev) => [...prev, [lat, lng, intensidad]]);
      };
    }

    const wsCurrent = wsRef.current;

    // CORRECCIÓN 3: Almacenamos la función de limpieza de los puntos dinámicos
    const limpiarPuntosWS = graficarLatLngs(map, latLngWS);

    // 2. Limpieza al desmontar o actualizar
    return () => {
      // CORRECCIÓN 4: Ejecutamos las limpiezas de Leaflet antes de pintar las nuevas capas
      if (limpiarPuntosProps) limpiarPuntosProps();
      if (limpiarPuntosWS) limpiarPuntosWS();

      // Ya no cerramos wsCurrent.close() aquí directamente para dejarlo abierto,
      // pero puedes descomentarlo si cambias de opinión más adelante.
    };

  }, [map, points, latLngWS]); // Se vuelve a ejecutar únicamente si cambia el mapa o el array de puntos

  return null; // No renderiza HTML, es un componente puramente lógico
};

function graficarLatLngs(map: Map, points) {
  // Si el mapa no está listo o no hay puntos, no hacemos nada
  if (!map || !points || points.length === 0) return;

  // MEDIDA DE PRIVACIDAD: Ofuscamos las coordenadas sumando un ruido de ~500 metros
  const factorRuido = 0.005;
  const puntosSeguros = points.map(([lat, lng, intensidad]) => {
    const latConRuido = lat + (Math.random() - 0.5) * factorRuido;
    const lngConRuido = lng + (Math.random() - 0.5) * factorRuido;

    // Pasamos la intensidad (0.16 a 1.0) calculada previamente en base a las horas sin luz
    return [latConRuido, lngConRuido, intensidad || 1];
  });

  // Creamos la capa de calor directamente en la instancia de Leaflet
  const heatLayer = L.heatLayer(puntosSeguros, optionsHeatLayer).addTo(map);

  // FUNCIÓN DE LIMPIEZA: React desmontará la capa vieja si los puntos cambian
  return () => {
    if (map && heatLayer) {
      map.removeLayer(heatLayer);
    }
  };
}
