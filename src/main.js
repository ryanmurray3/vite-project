import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// Load bee.glb model(put it in the public folder)
const loader = new GLTFLoader();
loader.load('/bee.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(1, 1, 1);
  model.position.y = -3;
  scene.add(model);
}, undefined, (error) => {
  console.error('Error loading bee.glb:', error);
});

// Setup scence, camera, and renderer
const scene = new THREE.Scene();
scene.background = null; // Set background to null for transparency

// code to add a cube (optional, for testing purposes)
// Uncomment the following lines to add a cube to the scene
// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);
camera.lookAt(0, 1.5, 0); // Look at the center of the scene

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Enable alpha for transparency
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);
const ambient = new THREE.AmbientLight(new THREE.AmbientLight(0x404040));
scene.add(ambient);


// Add controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


// Animate
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

