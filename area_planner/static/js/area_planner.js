class AreaPlanner {
  constructor() {
    this.initScene()
    this.setupControls()
    this.gridSize = 100  // Meters
    this.gridDivisions = 100
  }

  initScene() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({antialias: true})
    
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)
    
    // Grid helper (1m squares)
    this.scene.add(new THREE.GridHelper(this.gridSize, this.gridDivisions))
    this.camera.position.set(50, 50, 50)
    this.camera.lookAt(0,0,0)
  }

  setupControls() {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
  }

  animate() {
    requestAnimationFrame(() => this.animate())
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  const planner = new AreaPlanner()
  planner.animate()
})
