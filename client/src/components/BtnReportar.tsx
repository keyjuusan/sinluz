import { useState, type ComponentProps } from "react";
import { Ripple } from "./loading-ui/ripple";
import L, { Map } from "leaflet";
import optionsHeatLayer from "@/lib/leaflet/optionsHeatLayer";
import { miApi } from "@/lib/axios/api";

interface Reporte {
  latitud: number;
  longitud: number;
  idUser: number;
}

interface Props extends ComponentProps<"button"> {
  reporte: Reporte;
}

export default function BtnReportar({
  children,
  reporte,
  className,
  ...restProps
}: Props) {
  const [loading, setLoading] = useState(false);

  function reportarApagon(datosReporte: Reporte) {
    setLoading(true);

    const simularPeticion = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (true) {

          resolve("chevere");
          return;
        }
        reject("no tan chevere");
      }, 2000);
    });
    simularPeticion
      .then((res) => console.log(res))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));

    // miApi
    //   .post("/reporte/", datosReporte)
    //   .then(() => {
    //     console.log("reporte registrado!");
    //   })
    //   .catch((e) => console.error("No se pudo registrar el reporte:", e))
    //   .finally(() => setLoading(false));
  }
  return (
    <button
      {...restProps}
      onClick={() => reportarApagon(reporte)}
      className={`bg-red-600 text-xl text-white p-2 rounded cursor-pointer active:shadow-none w-24.75 disabled:shadow-none disabled:bg-red-400 flex justify-center ${className}`}
      disabled={loading ? true : false}
    >
      {loading ? <Ripple className="size-7 text-center" /> : "Reportar"}
    </button>
  );
}
