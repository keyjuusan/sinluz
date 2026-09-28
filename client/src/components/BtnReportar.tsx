import { useState, type ComponentProps } from "react";
// import { miApi } from "../libs/axios/api";
import { Ripple } from "./loading-ui/ripple";

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
  ...restProps
}: Props) {
  const [loading, setLoading] = useState(false);

  function reportarApagon(datosReporte: Reporte) {
    setLoading(true);
    const promesa = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (true) {
          resolve("chevere");
        } else {
          reject("no tan chevere");
        }
      }, 1000);
    });
    promesa.then(res=>console.log(res)).catch(e=>console.error(e)).finally(()=>setLoading(false))
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
      className="absolute z-10 top-1/2 left-1/2 -translate-1/2 bg-red-600 text-xl text-white p-2 shadow-md shadow-purple-950 rounded cursor-pointer active:shadow-none w-24.75 disabled:shadow-none disabled:bg-red-400 flex justify-center"
      disabled={loading?true:false}
    >
      {loading ? <Ripple className="size-7 text-center"/> : "Reportar"}
    </button>
  );
}
