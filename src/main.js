import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "lil-gui";

import { Lights, parameters } from "./components/generateLights";
import Reflector from "./components/reflector";

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

/* --------------------- */
/* --- Util Settings --- */
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

controls.enableDamping = true;

camera.position.y = 10;
camera.position.z = 30;

/* ----------------------- */
/* ------- Objects ------- */

Reflector(camera, scene);
Lights(renderer, scene);

/* ------------------------ */
/* -------- GUI -------- */

export const lights = gui.addFolder("lights");

lights.add(parameters, "count").min(50).max(1000).step(20).onFinishChange(Lights);
lights.add(parameters, "radius").min(10).max(100).step(1).onFinishChange(Lights);
lights.add(parameters, "randomness").min(2).max(20).step(1).onFinishChange(Lights);
lights.add(parameters, "space").min(2).max(10).step(1).onFinishChange(Lights);
lights.add(parameters, "colorRandomPower").min(0.1).max(1).step(0.01).onFinishChange(Lights);
lights.addColor(parameters, "color").onFinishChange(Lights);

lights.add(parameters, "pointScale").min(5).max(20).step(1).onFinishChange(Lights);
lights
  .add(scene.children[1].material.uniforms.uSize, "value")
  .name("uSize")
  .min(5)
  .max(20)
  .step(1)
  .onFinishChange((value) => {
    scene.children[1].material.uniforms.uSize.value = value * renderer.getPixelRatio();
  });

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
console.log(scene.children);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  scene.children[1].material.uniforms.uTime.value = elapsedTime;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
