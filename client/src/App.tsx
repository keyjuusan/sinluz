import React, { useState } from "react";
const Mapa = React.lazy(()=>import("./components/Mapa"))

import Menu from "./components/Menu";

function App() {
  const [verMapa, setVerMapa] = useState(false);

  return (
    <div className="h-dvh w-dvw relative">
      {verMapa ? (
        <Mapa/>
      ) : (
        <Menu setVerMapa={setVerMapa}/>
      )}
      {/* Botón flotante para regresar al menú oscuro (opcional, por si quieres probar) */}
      {verMapa && (
        <button
          onClick={() => setVerMapa(false)}
          className="absolute top-4 right-4 bg-gray-900 text-white p-2 rounded shadow-md"
        >
          Volver
        </button>
      )}
      {/*<span className="absolute bottom-0 z-10 bg-gray-700 text-amber-50 w-full text-center">
        ... sin conexión ...
      </span>*/}
    </div>
  );
}

export default App;
