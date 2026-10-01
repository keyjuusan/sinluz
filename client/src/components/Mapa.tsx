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
  const [coordenadasReportes,setCoordenadasReportes] = useState<[number,number][]>()
  // const coordenadasUsuarios = [
  //     [7.671410908357838, -426.35180664062506],
  //   ];
  useEffect(() => {
    simulacionGetReportes.then((reportes) => {
      let coordenadas = []
      reportes.map(reporte => {
        coordenadas.push([reporte.latitud,reporte.longitud])
      })
      setCoordenadasReportes(coordenadas)
    })
  },[])
  return (
    <LeafletMap >
      <InfoClickMap />
      <ModernHeatmapLayer points={coordenadasReportes} />
    </LeafletMap>
  );
}
