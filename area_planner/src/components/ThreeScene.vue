<template>
  <div ref="sceneContainer" class="three-scene"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const emit = defineEmits(['building-placed'])
const sceneContainer = ref(null)

let scene, camera, renderer, controls, raycaster, mouse
let currentPlacementBuilding = null

onMounted(() => {
  initScene()
  initRaycaster()
  animate()
})

onUnmounted(() => {
  cleanupScene()
})

function initScene() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  sceneContainer.value.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  camera.position.set(0, 10, 20)
  controls.update()

  // Add grid
  const gridHelper = new THREE.GridHelper(100, 100)
  scene.add(gridHelper)
}

function initRaycaster() {
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  sceneContainer.value.addEventListener('mousemove', onMouseMove, false)
  sceneContainer.value.addEventListener('click', onMouseClick, false)
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  if (currentPlacementBuilding) {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children)
    
    if (intersects.length > 0) {
      currentPlacementBuilding.position.copy(intersects[0].point)
    }
  }
}

function onMouseClick() {
  if (currentPlacementBuilding) {
    emit('building-placed', {
      typeId: currentPlacementBuilding.userData.typeId,
      x: currentPlacementBuilding.position.x,
      y: currentPlacementBuilding.position.z
    })
    currentPlacementBuilding = null
  }
}

function startPlacementMode(buildingType) {
  const geometry = new THREE.BoxGeometry(
    buildingType.footprint.x, 
    5, 
    buildingType.footprint.y
  )
  const material = new THREE.MeshBasicMaterial({ 
    color: 0x00ff00, 
    transparent: true, 
    opacity: 0.7 
  })
  
  currentPlacementBuilding = new THREE.Mesh(geometry, material)
  currentPlacementBuilding.userData.typeId = buildingType.id
  scene.add(currentPlacementBuilding)
}

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

function cleanupScene() {
  renderer.dispose()
  controls.dispose()
}

// Expose method to parent component
defineExpose({
  startPlacementMode
})
</script>

<style scoped>
.three-scene {
  flex-grow: 1;
  height: 100%;
}
</style>
