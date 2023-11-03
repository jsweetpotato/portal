import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "lil-gui";

import { GenerateLights, lightsMesh, parameters } from "./components/lights";
import { GenerateReflector, reflectorMesh } from "./components/reflector";
import Portal from "./components/portal";

THREE.ColorManagement.enabled = false;

const canvas = document.querySelector(".webgl-canvas");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/* ------- Util Base ------- */

let time = { value: 0 };
const gui = new GUI();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
const controls = new OrbitControls(camera, canvas);
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.shadowMap.enabled = true;

/* --------------------- */
/* --- Util Settings --- */
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

controls.enableDamping = true;

camera.position.y = 8;
camera.position.z = 30;

/* ----------------------- */
/* ------- Objects ------- */

GenerateLights(renderer, scene);
GenerateReflector(scene);
Portal(scene);

// Test mesh
// const box = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());
// box.position.y = 1;
// scene.add(box);

// Test light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
const directionLight = new THREE.PointLight(0xff6dff, 5, 10, 0);
// const lightHelper = new THREE.SpotLightHelper(directionLight);
directionLight.position.set(0, 4, -2);
scene.add(ambientLight, directionLight);

/* ------------------------ */
/* -------- GUI -------- */

const lights = gui.addFolder("lights");

lights.add(parameters, "count").min(5).max(100).step(5).onFinishChange(GenerateLights);
lights.add(parameters, "radius").min(10).max(100).step(1).onFinishChange(GenerateLights);
lights.add(parameters, "randomness").min(2).max(20).step(1).onFinishChange(GenerateLights);
lights.add(parameters, "space").min(2).max(10).step(1).onFinishChange(GenerateLights);
lights.add(parameters, "colorRandomness").min(0.1).max(1).step(0.01).onFinishChange(GenerateLights);
lights.addColor(parameters, "color").onFinishChange(GenerateLights);

lights.add(parameters, "pointScale").min(5).max(20).step(1).name("uScale").onFinishChange(GenerateLights);
lights
  .add(lightsMesh.material.uniforms.uSize, "value")
  .name("uSize")
  .min(5)
  .max(20)
  .step(1)
  .onFinishChange((value) => {
    lightsMesh.material.uniforms.uSize.value = value * renderer.getPixelRatio();
  });

const reflectorGUI = gui.addFolder("reflector");
const reflectorUniforms = scene.children[1].material.uniforms;
reflectorGUI.addColor(reflectorUniforms.color, "value").name("color");
reflectorGUI.add(reflectorUniforms.uWaveStrength, "value").min(0).max(0.2).step(0.001).name("waveStrength");
reflectorGUI.add(reflectorUniforms.uWaveSpeed, "value").min(0).max(0.2).step(0.0001).name("waveSpeed");

/* ------------------------ */
/* -------- Events -------- */

const handleResize = () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

window.addEventListener("resize", handleResize);

/* ----------------------- */
/* ------- Animate ------- */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  lightsMesh.material.uniforms.uTime.value = elapsedTime;
  reflectorMesh.material.uniforms.uTime.value = elapsedTime;
  // Update controls
  controls.update();
  // box.position.y = Math.sin(elapsedTime) * 3 + 4;
  // box.position.x = Math.cos(elapsedTime) * 3;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
