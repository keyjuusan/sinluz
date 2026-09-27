import InfoClickMap from "./InfoClickMap";
import LeafletMap from "./LeafletMap";

export default function Mapa() {
  return (
    <LeafletMap>
      <InfoClickMap/>
    </LeafletMap>
  );
}
