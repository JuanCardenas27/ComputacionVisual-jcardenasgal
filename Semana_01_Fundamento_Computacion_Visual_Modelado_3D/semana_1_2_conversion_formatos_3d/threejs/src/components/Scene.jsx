import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Suspense } from 'react'
import ModelLoader from './ModelLoader'

function Iluminacion() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[8, 10, 6]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight position={[-6, 4, -6]} intensity={0.4} color="#a0c8ff" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.35}
        penumbra={0.6}
        intensity={0.8}
        castShadow={false}
      />
    </>
  )
}

function Piso() {
  return (
    <Grid
      position={[0, -1.45, 0]}
      args={[20, 20]}
      cellSize={0.5}
      cellThickness={0.4}
      cellColor="#2a3040"
      sectionSize={2.5}
      sectionThickness={0.8}
      sectionColor="#39d353"
      fadeDistance={18}
      fadeStrength={1.5}
      infiniteGrid
    />
  )
}

export default function Scene({ activeFormat, onModelInfoChange }) {
  return (
    <Canvas
      shadows
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [3.5, 2.8, 5.5], fov: 52 }}
      gl={{ antialias: true, toneMappingExposure: 1.1 }}
    >
      <color attach="background" args={['#0d1117']} />
      <fog attach="fog" args={['#0d1117', 14, 26]} />
      <Iluminacion />
      <Piso />
      <Suspense fallback={null}>
        <ModelLoader
          activeFormat={activeFormat}
          onModelInfoChange={onModelInfoChange}
        />
      </Suspense>
      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        minDistance={1.2}
        maxDistance={14}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}
