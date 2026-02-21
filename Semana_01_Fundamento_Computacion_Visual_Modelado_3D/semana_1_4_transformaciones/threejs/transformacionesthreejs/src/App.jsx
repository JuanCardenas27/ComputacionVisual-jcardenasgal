import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, Stars } from '@react-three/drei'
import './App.css'

// ─── Cubo Animado ────────────────────────────────────────────────────────────
// Aplica las tres transformaciones geométricas en cada frame:
//   1. Traslación  → trayectoria circular con sin/cos
//   2. Rotación    → incremento continuo sobre todos los ejes
//   3. Escala      → pulso suave basado en Math.sin(elapsedTime)

function AnimatedCube() {
  const meshRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime

    // 1. TRASLACIÓN — trayectoria circular en XY, senoidal en Z
    const radius = 2.5
    meshRef.current.position.x = Math.cos(t * 0.8) * radius
    meshRef.current.position.y = Math.sin(t * 0.8) * radius
    meshRef.current.position.z = Math.sin(t * 1.2) * 1.2

    // 2. ROTACIÓN — incremento por eje en cada frame
    meshRef.current.rotation.x += 0.012
    meshRef.current.rotation.y += 0.018
    meshRef.current.rotation.z += 0.008

    // 3. ESCALA — pulso suave oscilando entre 0.6 y 1.4
    const s = 1 + 0.4 * Math.sin(t * 2)
    meshRef.current.scale.set(s, s, s)
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#7c3aed"
        metalness={0.3}
        roughness={0.4}
        emissive="#3b0764"
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

// ─── Esfera de referencia (estática) ─────────────────────────────────────────
function StaticSphere() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshStandardMaterial color="#f59e0b" metalness={0.5} roughness={0.3} />
    </mesh>
  )
}

// ─── Escena completa ──────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* Iluminación */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <pointLight position={[-4, -2, -4]} intensity={0.6} color="#a78bfa" />

      {/* Objetos */}
      <AnimatedCube />
      <StaticSphere />

      {/* Referencia visual */}
      <Grid
        args={[12, 12]}
        position={[0, -3.5, 0]}
        cellColor="#4c1d95"
        sectionColor="#7c3aed"
        fadeDistance={20}
      />
      <Stars radius={40} depth={30} count={1500} factor={3} fade />

      {/* Bonus: OrbitControls para navegar la escena */}
      <OrbitControls enableDamping dampingFactor={0.08} />
    </>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <div className="app-container">
      {/* HUD informativo */}
      <div className="hud">
        <h1>Transformaciones 3D</h1>
        <ul>
          <li><span className="dot dot-translate" /> Traslación — trayectoria circular</li>
          <li><span className="dot dot-rotate" />  Rotación   — incremento por frame</li>
          <li><span className="dot dot-scale" />   Escala     — pulso con Math.sin</li>
        </ul>
        <p className="hint">🖱 Arrastra para orbitar · Scroll para zoom</p>
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 0, 9], fov: 60 }}
        style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}

export default App
