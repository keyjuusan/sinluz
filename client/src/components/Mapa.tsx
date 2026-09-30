// import { ModernHeatmapLayer } from "@/components/ModernHeatmapLayer";
import InfoClickMap from "./InfoClickMap";
import LeafletMap from "./LeafletMap";

export default function Mapa() {
  // const coordenadasUsuarios = [
  //     [7.671410908357838, -426.35180664062506],
  //   ];
  return (
    <LeafletMap >
      <InfoClickMap />
      {/*<ModernHeatmapLayer points={coordenadasUsuarios} />*/}
    </LeafletMap>
  );
}
