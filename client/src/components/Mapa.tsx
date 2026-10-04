// import { ModernHeatmapLayer } from "@/components/ModernHeatmapLayer";
import { useEffect, useState } from "react";
import InfoClickMap from "./InfoClickMap";
import LeafletMap from "./LeafletMap";
import { ModernHeatmapLayer } from "./ModernHeatmapLayer";
import type { ReporteType } from "@/types";
import { mockReportes } from "@/mocks";

const simulacionGetReportes = new Promise<ReporteType[]>((resolve,reject) => {
  setTimeout(() => {
    resolve(mockReportes)
  },1000)
})

export default function Mapa() {
  // 1. Modificamos el tipo del estado para soportar [lat, lng, intensidad?]
  const [coordenadasReportes, setCoordenadasReportes] = useState<[number, number, number?][]>()

  useEffect(() => {
    simulacionGetReportes.then((reportes) => {
      // 2. Mapeamos calculando la intensidad basada en el tiempo sin luz
      const coordenadas = reportes.map(reporte => {
        // NOTA: Asegúrate de cambiar 'horasSinLuz' por el nombre exacto de la propiedad en tu 'ReporteType'
        const horas = reporte.horas || 1;

        // Limitamos entre 1 y la cantidad critica de horas, luego dividimos entre la cantidad critica de horas para obtener el rango (0.16 a 1.0)
        const HORA_CRITICA = 7
        const intensidad = Math.max(1, Math.min(HORA_CRITICA, horas)) / HORA_CRITICA;
        // console.log(intensidad)

        return [reporte.latitud, reporte.longitud, intensidad] as [number, number, number];
      });

      setCoordenadasReportes(coordenadas);
    });
  }, [])

  return (
    <LeafletMap >
      {/*<InfoClickMap />*/}
      <ModernHeatmapLayer points={coordenadasReportes} />
    </LeafletMap>
  );
}
