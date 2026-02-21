import { useState } from 'react'
import './App.css'
import Scene from './components/Scene'
import UIControls from './components/UIControls'

const ESTADO_INICIAL = {
  format: 'OBJ',
  vertices: 0,
  faces: 0,
}

function App() {
  const [formatoActivo, setFormatoActivo] = useState('OBJ')
  const [infoModelo, setInfoModelo] = useState(ESTADO_INICIAL)

  return (
    <div className="root-shell">
      <UIControls
        activeFormat={formatoActivo}
        onFormatChange={setFormatoActivo}
        modelInfo={infoModelo}
      />

      <div className="visor-area">
        <header className="visor-header">
          <span className="visor-badge">3D</span>
          <h1>Explorador de Formatos</h1>
          <p>Compara geometría y materiales entre <em>OBJ</em>, <em>STL</em> y <em>GLTF</em></p>
        </header>

        <div className="canvas-frame">
          <Scene
            activeFormat={formatoActivo}
            onModelInfoChange={setInfoModelo}
          />
        </div>
      </div>
    </div>
  )
}

export default App
