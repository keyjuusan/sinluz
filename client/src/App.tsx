import InfoClickMap from "./components/InfoClickMap"
import Mapa from "./components/Mapa"

function App() {

  return (
    <div className="dark:bg-gray-900 h-dvh w-dvw">
      <Mapa>
        <InfoClickMap/>
      </Mapa>
    </div>
  )
}

export default App
