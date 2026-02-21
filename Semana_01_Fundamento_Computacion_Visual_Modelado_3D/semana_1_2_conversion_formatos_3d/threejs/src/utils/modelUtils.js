import * as THREE from 'three'

export const FORMAT_OPTIONS = ['OBJ', 'STL', 'GLTF']

function agregarOverlays(mesh) {
  if (mesh.userData.overlaysReady || !mesh.geometry) return

  // Aristas
  const aristaGeo = new THREE.EdgesGeometry(mesh.geometry)
  const aristaMat = new THREE.LineBasicMaterial({
    color: '#39d353',
    transparent: true,
    opacity: 0.55,
  })
  const aristas = new THREE.LineSegments(aristaGeo, aristaMat)
  aristas.renderOrder = 1

  // Vértices
  const puntosmat = new THREE.PointsMaterial({
    color: '#f0c34e',
    size: 0.012,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  })
  const puntos = new THREE.Points(mesh.geometry, puntosmat)
  puntos.renderOrder = 2

  mesh.add(aristas)
  mesh.add(puntos)
  mesh.userData.overlaysReady = true
}

function configurarSombras(objeto) {
  objeto.traverse((nodo) => {
    if (!nodo.isMesh) return
    nodo.castShadow    = true
    nodo.receiveShadow = true
    if (!nodo.material) {
      nodo.material = new THREE.MeshStandardMaterial({
        color: '#c8d4e8',
        roughness: 0.5,
        metalness: 0.15,
      })
    }
    agregarOverlays(nodo)
  })
}

export function normalizeObject3D(objeto, tamanoObjetivo = 2.6) {
  const caja    = new THREE.Box3().setFromObject(objeto)
  const tamaño  = caja.getSize(new THREE.Vector3())
  const centro  = caja.getCenter(new THREE.Vector3())
  const ejeMax  = Math.max(tamaño.x, tamaño.y, tamaño.z)

  if (ejeMax > 0) {
    objeto.scale.multiplyScalar(tamanoObjetivo / ejeMax)
  }

  objeto.position.sub(centro.multiplyScalar(objeto.scale.x))
  configurarSombras(objeto)
  return objeto
}

export function computeModelStats(objeto, formato) {
  let numVertices = 0
  let numCaras    = 0

  objeto.traverse((nodo) => {
    if (!nodo.isMesh || !nodo.geometry) return

    const geo = nodo.geometry
    const pos = geo.getAttribute('position')

    if (pos) numVertices += pos.count

    if (geo.index) {
      numCaras += Math.floor(geo.index.count / 3)
    } else if (pos) {
      numCaras += Math.floor(pos.count / 3)
    }
  })

  return { format: formato, vertices: numVertices, faces: numCaras }
}
