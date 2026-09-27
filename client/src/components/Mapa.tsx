import { MapContainer, TileLayer } from "react-leaflet";
import type { PropsWithChildren } from "react";

export default function Mapa({children}:PropsWithChildren) {
  return (
    <div className="w-full h-full">
      <MapContainer
        center={[7.671410908357838, -426.35180664062506]}
        zoom={7}
        // scrollWheelZoom={false}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}

      </MapContainer>
    </div>
  );
}
