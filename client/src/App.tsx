import BtnReportar from "./components/BtnReportar";
import Mapa from "./components/Mapa";

function App() {
  return (
    <div className="h-dvh w-dvw relative">
      <Mapa />
      <BtnReportar />
      <span className="absolute bottom-0 z-10 bg-gray-700 text-amber-50 w-full text-center">
        ... sin conexión ...
      </span>
    </div>
  );
}

export default App;
