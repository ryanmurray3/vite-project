import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

let beeModel;
let mixer;
const draggableObjects = [];

const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);
camera.lookAt(0, 1.5, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 2;
controls.minAzimuthAngle = -Math.PI / 4;
controls.maxAzimuthAngle = Math.PI / 4;

// Load model
const loader = new GLTFLoader();
loader.load('/bee_animated.glb', (gltf) => {
  beeModel = gltf.scene;
  beeModel.scale.set(1, 1, 1);
  beeModel.position.y = -3;
  scene.add(beeModel);
  draggableObjects.push(beeModel);

  mixer = new THREE.AnimationMixer(beeModel);
  const action = mixer.clipAction(gltf.animations[0]);
  action.play();

  const dragControls = new DragControls(draggableObjects, camera, renderer.domElement);
  dragControls.addEventListener('dragstart', () => controls.enabled = false);
  dragControls.addEventListener('dragend', () => controls.enabled = true);
  dragControls.addEventListener('drag', (event) => {
    const obj = event.object;
    obj.position.y = -2; // Lock Y
    obj.position.z = 0;  // Lock Z
  });
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (mixer) mixer.update(clock.getDelta());
  if (beeModel) {
    const t = performance.now() * 0.001;
    beeModel.position.y = -2 + Math.sin(t) * 0.1;
  }
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
