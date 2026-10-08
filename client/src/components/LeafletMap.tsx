import { MapContainer, TileLayer } from "react-leaflet";
import type { PropsWithChildren } from "react";

export default function LeafletMap({children}:PropsWithChildren) {
  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[7.671410908357838, -66.09375000000001]}
        zoom={7}
        // scrollWheelZoom={false}
        className="w-full h-full z-0"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}

      </MapContainer>
      <button className="absolute top-0 right-0 bg-amber-50">Tocame</button>
    </div>
  );
}
