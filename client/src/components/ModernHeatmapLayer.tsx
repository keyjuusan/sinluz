import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat'; // Importa el plugin para que Leaflet reconozca L.heatLayer
import optionsHeatLayer from '@/lib/leaflet/optionsHeatLayer';

export const ModernHeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
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
  }, [map, points]); // Se vuelve a ejecutar únicamente si cambia el mapa o el array de puntos

  return null; // No renderiza HTML, es un componente puramente lógico
};
