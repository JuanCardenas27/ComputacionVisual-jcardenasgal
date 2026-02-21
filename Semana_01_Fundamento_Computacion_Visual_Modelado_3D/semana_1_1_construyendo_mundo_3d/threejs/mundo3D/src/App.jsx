import { useState, useEffect, useMemo, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Html, useProgress } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader"
import { EdgesGeometry } from "three"
import "./App.css"

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div style={{ color: "#555", fontFamily: "sans-serif", fontSize: 14 }}>
        Cargando… {progress.toFixed(0)}%
      </div>
    </Html>
  )
}

function Model({ mode, onStats }) {
  const mtl = useLoader(MTLLoader, "/models/Hamburger_01.mtl")
  const obj = useLoader(OBJLoader, "/models/Hamburger_01.obj", (loader) => {
    mtl.preload()
    loader.setMaterials(mtl)
  })

  const meshChildren = useMemo(() => {
    const result = []
    obj.traverse((child) => {
      if (child.isMesh) {
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach((mat) => {
          mat.transparent = false
          mat.opacity = 1
          mat.depthWrite = true
          mat.needsUpdate = true
        })
        result.push(child)
      }
    })
    return result
  }, [obj])

  useEffect(() => {
    let vertices = 0
    let faces = 0
    let edges = 0
    meshChildren.forEach((m) => {
      const pos = m.geometry.attributes.position
      if (pos) vertices += pos.count
      if (m.geometry.index) faces += m.geometry.index.count / 3
      else if (pos) faces += pos.count / 3
      const edgesGeo = new EdgesGeometry(m.geometry)
      edges += edgesGeo.attributes.position.count / 2
      edgesGeo.dispose()
    })
    onStats({ vertices, faces: Math.round(faces), edges: Math.round(edges) })
  }, [meshChildren, onStats])

  if (mode === "caras") {
    return <primitive object={obj} />
  }

  const ghostFill = meshChildren.map((mesh) => (
    <mesh key={mesh.uuid + "_ghost"} geometry={mesh.geometry}>
      <meshPhongMaterial
        color="#c8d4e8"
        transparent
        opacity={0.18}
        depthWrite={false}
        side={2}
      />
    </mesh>
  ))

  if (mode === "aristas") {
    return (
      <group>
        {ghostFill}
        {meshChildren.map((mesh) => (
          <lineSegments key={mesh.uuid}>
            <edgesGeometry args={[mesh.geometry]} />
            <lineBasicMaterial color="#1b2d4f" transparent opacity={0.85} />
          </lineSegments>
        ))}
      </group>
    )
  }

  if (mode === "vertices") {
    return (
      <group>
        {ghostFill}
        {meshChildren.map((mesh) => (
          <points key={mesh.uuid}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[mesh.geometry.attributes.position.array, 3]}
              />
            </bufferGeometry>
            <pointsMaterial color="#1b2d4f" size={3} sizeAttenuation={false} transparent opacity={0.9} />
          </points>
        ))}
      </group>
    )
  }

  return null
}

export default function App() {
  const [mode, setMode] = useState("caras")
  const [stats, setStats] = useState({ vertices: 0, faces: 0, edges: 0 })

  const modes = [
    { key: "vertices", label: "Vértices" },
    { key: "aristas",  label: "Aristas"  },
    { key: "caras",    label: "Caras"    },
  ]

  return (
    <div className="app-layout">
      <aside className="panel">
        <h2 className="panel-title">🍔 Mundo 3D</h2>

        <section className="panel-section">
          <h3 className="section-label">Modo de visualización</h3>
          <div className="btn-group">
            {modes.map(({ key, label }) => (
              <button
                key={key}
                className={`mode-btn${mode === key ? " active" : ""}`}
                onClick={() => setMode(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="panel-section">
          <h3 className="section-label">Estadísticas</h3>
          <ul className="stats-list">
            <li><span>Vértices</span><strong>{stats.vertices.toLocaleString()}</strong></li>
            <li><span>Caras</span><strong>{stats.faces.toLocaleString()}</strong></li>
            <li><span>Aristas</span><strong>{stats.edges.toLocaleString()}</strong></li>
          </ul>
        </section>

        <section className="panel-section hint">
          <p>Orbita · Zoom · Desplaza</p>
        </section>
      </aside>

      <main className="canvas-wrapper">
        <Canvas
          camera={{ position: [0, 1.5, 4], fov: 45 }}
          style={{ background: "#cdd5e0" }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-5, -5, -5]} intensity={0.4} />

          <Suspense fallback={<Loader />}>
            <Model mode={mode} onStats={setStats} />
          </Suspense>

          <OrbitControls makeDefault />
        </Canvas>
      </main>
    </div>
  )
}