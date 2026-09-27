import { useMapEvents } from "react-leaflet"

export default function InfoClickMap() {
  useMapEvents({
    click: (e) => {
      const {lat,lng} = e.latlng
      console.log(`lat: ${lat}`);
      console.log(`lng: ${lng}`)
    }
  })
  return null
}
