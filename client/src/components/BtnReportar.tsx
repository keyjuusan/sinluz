import type { ComponentProps } from "react";

export default function BtnReportar({
  children,
  ...restProps
}: ComponentProps<"button">) {
  function reportarApagon() {

  }
  return (
    <button
      {...restProps}
      onClick={reportarApagon}
      className="absolute z-10 top-1/2 left-1/2 -translate-1/2 bg-red-600 text-xl text-white p-2 shadow-md shadow-purple-950 rounded cursor-pointer active:shadow-none"
    >
      Reportar
    </button>
  );
}
