import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Stars } from '@react-three/drei'
import { useControls } from 'leva'
import './App.css'

// ─────────────────────────────────────────────
// Modelos GLB – reciben escala como prop
// ─────────────────────────────────────────────

function SunModel({ scale }) {
  const { scene } = useGLTF('/models/sol.glb')
  const meshRef = useRef()
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.25
  })
  return <primitive ref={meshRef} object={scene} scale={scale} />
}

function EarthModel({ scale }) {
  const { scene } = useGLTF('/models/tierra_v1.1.glb')
  const meshRef = useRef()
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.5
  })
  return <primitive ref={meshRef} object={scene} scale={scale} />
}

function SaturnModel({ scale }) {
  const { scene } = useGLTF('/models/la_vaca_saturno_saturnito_3d_model_free_download.glb')
  const meshRef = useRef()
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.3
  })
  return <primitive ref={meshRef} object={scene} scale={scale} />
}

function MoonModel({ scale }) {
  const { scene } = useGLTF('/models/luna.glb')
  return <primitive object={scene} scale={scale} />
}

// ─────────────────────────────────────────────
// NIVEL 3 – Luna orbita alrededor de la Tierra
// ─────────────────────────────────────────────
function MoonOrbit({ speed, moonScale }) {
  const groupRef = useRef()
  const angle = useRef(0)
  // Radio fijo – no depende del tamaño de ningún planeta
  const orbitRadius = 12

  useFrame((_, delta) => {
    angle.current += delta * speed
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle.current) * orbitRadius
      groupRef.current.position.z = Math.sin(angle.current) * orbitRadius
    }
  })

  return (
    <group ref={groupRef}>
      {/* NIVEL 3: Luna – hijo de la Tierra */}
      <MoonModel scale={moonScale} />
    </group>
  )
}

// ─────────────────────────────────────────────
// NIVEL 2 – Tierra (+ Luna) orbita alrededor del Sol
// ─────────────────────────────────────────────
function EarthOrbit({ speed, moonSpeed, earthScale, moonScale, sunScale }) {
  const groupRef = useRef()
  const angle = useRef(Math.PI * 0.3)
  // Radio fijo – solo depende del Sol, nunca del tamaño de la Tierra
  const orbitRadius = sunScale * 10 + 40

  useFrame((_, delta) => {
    angle.current += delta * speed
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle.current) * orbitRadius
      groupRef.current.position.z = Math.sin(angle.current) * orbitRadius
    }
  })

  return (
    <group ref={groupRef}>
      {/* NIVEL 2: Tierra – hijo del Sol */}
      <EarthModel scale={earthScale} />
      {/* NIVEL 3: Luna – hijo de la Tierra */}
      <MoonOrbit speed={moonSpeed} moonScale={moonScale} />
    </group>
  )
}

// ─────────────────────────────────────────────
// NIVEL 2 – Saturno orbita alrededor del Sol
// ─────────────────────────────────────────────
function SaturnOrbit({ speed, saturnScale, sunScale }) {
  const groupRef = useRef()
  const angle = useRef(Math.PI)
  // Radio fijo – solo depende del Sol, nunca del tamaño de Saturno ni la Tierra
  const orbitRadius = sunScale * 10 + 140

  useFrame((_, delta) => {
    angle.current += delta * speed
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle.current) * orbitRadius
      groupRef.current.position.z = Math.sin(angle.current) * orbitRadius
    }
  })

  return (
    <group ref={groupRef}>
      {/* NIVEL 2: Saturno – hijo del Sol */}
      <SaturnModel scale={saturnScale} />
    </group>
  )
}

// ─────────────────────────────────────────────
// NIVEL 1 – Nodo Padre: Sol
// ─────────────────────────────────────────────
function SolarSystem() {
  // ── Controles del nodo PADRE (Sol) ───────────
  const {
    'Rotación X': rotX,
    'Rotación Y': rotY,
    'Rotación Z': rotZ,
    'Traslación X': posX,
    'Traslación Y': posY,
    'Traslación Z': posZ,
  } = useControls('🌞 Nodo Padre — Sol', {
    'Rotación X': { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    'Rotación Y': { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    'Rotación Z': { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    'Traslación X': { value: 0, min: -20, max: 20, step: 0.1 },
    'Traslación Y': { value: 0, min: -20, max: 20, step: 0.1 },
    'Traslación Z': { value: 0, min: -20, max: 20, step: 0.1 },
  })

  // ── Tamaños individuales de cada cuerpo ──────
  const {
    'Sol': sunScale,
    'Tierra': earthScale,
    'Saturno': saturnScale,
    'Luna': moonScale,
  } = useControls('📐 Tamaños', {
    'Sol':     { value: 3,   min: 0.5, max: 12, step: 0.1 },
    'Tierra':  { value: 80,  min: 0.2, max: 200, step: 0.1 },
    'Saturno': { value: 2.5, min: 0.2, max: 10, step: 0.1 },
    'Luna':    { value: 0.5, min: 0.1, max: 4,  step: 0.05 },
  })

  // ── Velocidades de órbita ─────────────────────
  const {
    'Tierra (vel.)': earthSpeed,
    'Saturno (vel.)': saturnSpeed,
    'Luna (vel.)': moonSpeed,
  } = useControls('🪐 Órbitas — Velocidades', {
    'Tierra (vel.)':  { value: 0.35, min: 0, max: 3, step: 0.01 },
    'Saturno (vel.)': { value: 0.18, min: 0, max: 3, step: 0.01 },
    'Luna (vel.)':    { value: 1.2,  min: 0, max: 5, step: 0.01 },
  })

  return (
    <group
      rotation={[rotX, rotY, rotZ]}
      position={[posX, posY, posZ]}
    >
      {/* Luz puntual en el Sol */}
      <pointLight intensity={5} distance={800} color="#fff8e0" />

      {/* NIVEL 1: Sol */}
      <SunModel scale={sunScale} />

      {/* NIVEL 2: Tierra + NIVEL 3: Luna */}
      <EarthOrbit
        speed={earthSpeed}
        moonSpeed={moonSpeed}
        sunScale={sunScale}
        earthScale={earthScale}
        moonScale={moonScale}
      />

      {/* NIVEL 2: Saturno */}
      <SaturnOrbit
        speed={saturnSpeed}
        sunScale={sunScale}
        saturnScale={saturnScale}
      />
    </group>
  )
}

// ─────────────────────────────────────────────
// App principal
// ─────────────────────────────────────────────
export default function App() {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 80, 180], fov: 60 }}
        gl={{ antialias: true }}
      >
        {/* Luz ambiental brillante */}
        <ambientLight intensity={2.5} color="#c8d8ff" />
        {/* Luz de hemisferio: cielo azulado + suelo cálido */}
        <hemisphereLight skyColor="#aac8ff" groundColor="#ffd080" intensity={1.5} />

        {/* Fondo estrellado */}
        <Stars
          radius={200}
          depth={80}
          count={8000}
          factor={8}
          saturation={1}
          fade={false}
          speed={0.5}
        />

        {/* Sistema Solar jerárquico */}
        <SolarSystem />

        {/* Controles de cámara con ratón */}
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  )
}
