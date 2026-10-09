import { useState, type ComponentProps } from "react";
import { Ripple } from "./loading-ui/ripple";
import type { ReporteRequestType } from "@/types";
import { miApi } from "@/lib/axios/api";
import toast from "react-hot-toast";

interface Props extends ComponentProps<"button"> {
  reporte: ReporteRequestType;
}

export default function BtnReportar({
  children,
  reporte,
  className,
  ...restProps
}: Props) {
  const [loading, setLoading] = useState(false);

  function reportarApagon() {
    setLoading(true);

    navigator.geolocation.getCurrentPosition((position) => {
      const datosReporte: ReporteRequestType = {
        horas_duracion: 8,
        id_usuario: "usuarioo",
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      toast.promise(
        miApi
          .post("/reportes", datosReporte)
          .finally(() => setLoading(false)),
        {
          success:
            "Reportado exitosamente! Le invitamos a cosultar todos los reportes",
          error: (err) => err.response?.data?.error ?? err.message,
          loading: "Enviando reporte...",
        },
      );
    })


    //     const simularPeticion = new Promise((resolve, reject) => {
    //       setTimeout(() => {
    //         if (true) {
    //
    //           resolve("chevere");
    //           return;
    //         }
    //         reject("no tan chevere");
    //       }, 2000);
    //     });
    //     simularPeticion
    //       .then((res) => console.log(res))
    //       .catch((e) => console.error(e))
    //       .finally(() => setLoading(false));

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
