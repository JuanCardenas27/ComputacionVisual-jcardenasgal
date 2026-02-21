import { useEffect, useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import * as THREE from 'three'
import { computeModelStats, normalizeObject3D } from '../utils/modelUtils'

const RUTAS = {
  OBJ:     '/Cop.obj',
  OBJ_MTL: '/Cop.mtl',
  STL:     '/911.stl',
  GLTF:    '/mazda_rx7.gltf',
}

// -- Preparadores por formato ------------------------------------------------

function buildObjModel(rawObj) {
  const model = rawObj.clone(true)
  // El Cop.obj está exportado con Y‑up (Blender por defecto):
  // no se necesita corrección de eje, solo centrarlo y escalarlo.
  return normalizeObject3D(model)
}

function buildStlModel(geometry) {
  const geo = geometry.clone()
  geo.computeVertexNormals()

  const mat = new THREE.MeshStandardMaterial({
    color: '#c8d4e8',
    roughness: 0.4,
    metalness: 0.25,
  })

  const mesh = new THREE.Mesh(geo, mat)
  mesh.rotation.x = -Math.PI / 2
  return normalizeObject3D(mesh)
}

function buildGltfModel(scene) {
  const model = clone(scene)
  return normalizeObject3D(model)
}

// -- Componente --------------------------------------------------------------

export default function ModelLoader({ activeFormat, onModelInfoChange }) {
  const materiales = useLoader(MTLLoader, RUTAS.OBJ_MTL)
  const objRaw = useLoader(OBJLoader, RUTAS.OBJ, (loader) => {
    materiales.preload()
    loader.setMaterials(materiales)
  })
  const stlGeo  = useLoader(STLLoader,  RUTAS.STL)
  const gltf    = useLoader(GLTFLoader, RUTAS.GLTF)

  const modelos = useMemo(() => {
    const obj  = buildObjModel(objRaw)
    const stl  = buildStlModel(stlGeo)
    const gltfM = buildGltfModel(gltf.scene)

    return {
      OBJ:  { object: obj,   stats: computeModelStats(obj,   'OBJ')  },
      STL:  { object: stl,   stats: computeModelStats(stl,   'STL')  },
      GLTF: { object: gltfM, stats: computeModelStats(gltfM, 'GLTF') },
    }
  }, [gltf.scene, objRaw, stlGeo])

  useEffect(() => {
    if (modelos[activeFormat]) {
      onModelInfoChange(modelos[activeFormat].stats)
    }
  }, [activeFormat, modelos, onModelInfoChange])

  return <primitive object={modelos[activeFormat].object} />
}
