import BtnReportar from "./BtnReportar";

export default function Menu({setVerMapa}) {
  return (
    <div className="bg-gray-950 w-full h-full absolute top-0 justify-center flex items-center flex-col gap-10">
      <h1 className="text-4xl">¿Se te fue la luz?</h1>
      <div className="flex flex-col gap-4 w-3/10">
        <BtnReportar
          className="w-full"
          reporte={{
            idUser: 1,
            latitud: 7.671410908357838,
            longitud: -426.35180664062506,
          }}
        />
        <button
          onClick={() => setVerMapa(true)}
          className=" bg-white text-black p-2 rounded w-full"
        >
          Ver Reportes
        </button>
      </div>
    </div>
  );
}
