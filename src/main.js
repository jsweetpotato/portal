import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "lil-gui";

import { GenerateLights, lightsMat, parameters } from "./components/lights";
// import { GenerateReflector, reflectorMat} from "./components/reflector";
import Portal from "./components/portal";
import { GenerateWater, waterMat } from "./components/water";
import { rgbeLoader } from "./loader";

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
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
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
controls.target.set(0, 3, 0);
console.dir(controls);

camera.position.y = 8;
camera.position.z = 20;

/* ----------------------- */
/* ------- Objects ------- */

GenerateLights(renderer, scene);
// GenerateReflector(scene);
GenerateWater(scene);
Portal(scene);

// Test mesh
// const box = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());
// box.position.y = 1;
// scene.add(box);

// Test light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// const directionLight = new THREE.PointLight(0xff6dff, 5, 10, 0);
// const lightHelper = new THREE.SpotLightHelper(directionLight);
// directionLight.position.set(0, 4, -2);
// scene.add(ambientLight);
// scene.add(directionLight);

const envmap2 = rgbeLoader.load("envmap2.hdr", () => {
  envmap2.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = envmap2;
});
scene.backgroundBlurriness = 0.3;
scene.backgroundIntensity = 3;

/* ------------------------ */
/* -------- GUI -------- */

const lights = gui.addFolder("lights");
const lightsColor = lights.addFolder("lightsColor");
const lightsUniforms = lights.addFolder("lightsUniforms");

lights.add(parameters, "count", 5, 100, 5).onFinishChange(GenerateLights);
lights.add(parameters, "radius", 10, 100, 1).onFinishChange(GenerateLights);
lights.add(parameters, "randomness", 2, 20, 1).onFinishChange(GenerateLights);
lights.add(parameters, "space", 2, 10, 1).onFinishChange(GenerateLights);

lightsColor
  .add(parameters, "colorRandomness", 0.1, 1, 0.01)
  .onFinishChange(GenerateLights);
lightsColor.addColor(parameters, "color").onFinishChange(GenerateLights);

lightsUniforms
  .add(parameters, "pointScale", 5, 20, 1)
  .name("uScale")
  .onFinishChange(GenerateLights);
lightsUniforms
  .add(lightsMat.uniforms.uSize, "value", 5, 20, 1)
  .name("uSize")
  .onFinishChange((value) => {
    lightsMat.uniforms.uSize.value = value * renderer.getPixelRatio();
  });

lights
  .add(parameters, "positionY", -2, 10, 0.01)
  .onFinishChange(GenerateLights);

// const reflectorGUI = gui.addFolder("reflector");
// const reflectorUniforms = scene.children[1].material.uniforms;
// reflectorGUI.addColor(reflectorUniforms.color, "value").name("color");
// reflectorGUI
//   .add(reflectorUniforms.uWaveStrength, "value")
//   .min(0)
//   .max(0.2)
//   .step(0.001)
//   .name("waveStrength");
// reflectorGUI
//   .add(reflectorUniforms.uWaveSpeed, "value")
//   .min(0)
//   .max(0.2)
//   .step(0.0001)
//   .name("waveSpeed");

const waterGUI = gui.addFolder("water");
const waterUniforms = waterMat.uniforms;
waterGUI
  .add(waterUniforms.uBigWaveElevation, "value", 0, 2, 0.01)
  .name("uBigWaveElevation");
waterGUI
  .add(waterUniforms.uBigWaveFreqeuncy.value, "x", 0, 1, 0.01)
  .name("uBigWaveFreqeuncyX");
waterGUI
  .add(waterUniforms.uBigWaveFreqeuncy.value, "y", 0, 1, 0.01)
  .name("uBigWaveFreqeuncyY");
waterGUI
  .add(waterUniforms.uBigWaveSpeed.value, "x", 0, 1, 0.01)
  .name("uBigWaveSpeedX");
waterGUI
  .add(waterUniforms.uBigWaveSpeed.value, "y", 0, 1, 0.01)
  .name("uBigWaveSpeedY");

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
  lightsMat.uniforms.uTime.value = elapsedTime;
  waterMat.uniforms.uTime.value = elapsedTime;
  // reflectorMat.uniforms.uTime.value = elapsedTime;
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
