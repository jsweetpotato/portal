import * as THREE from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import vertexShader from "./src/glsl/vertexShader.glsl";
import fragmentShader from "./src/glsl/fragmentShader.glsl";
import Gui from "lil-gui";

const canvas = document.querySelector(".main-canvas");

// *---Loader---*
const loadingManager = new THREE.LoadingManager();
loadingManager.onError = (url) => {
  throw new Error(`"${url}" 파일을 로드하는데 문제가 발생했습니다.`);
};
loadingManager.onLoad = () => console.log("loaded");

// *---Scene---*
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1d112f);

// *---Camera---*
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;
camera.position.y = 2;

// *---Light---*
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(2, 10, 8);
scene.add(directionalLight, ambientLight);

// *---Controls---*
new OrbitControls(camera, canvas);

// *---Renderer---*
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);

// *---Object---*
const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0.5 }));
sphere.position.y = 2;
scene.add(sphere);

const circle = new THREE.CircleGeometry(5, 64);

const uniformsmirror = {
  color: {
    value: null,
  },

  time: {
    value: 0,
  },

  tDiffuse: {
    value: null,
  },

  tDudv: {
    value: null,
  },

  textureMatrix: {
    value: null,
  },

  uWaveStrength: {
    value: 0.1,
  },
  uWaveSpeed: {
    value: 0.1,
  },
};

const reflector = new Reflector(circle, {
  color: 0xdfffff,
  textureWidth: 1024,
  textureHeight: 1024,
  shader: {
    uniforms: uniformsmirror,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  },
});
reflector.position.y = -0.5;
reflector.rotation.x = -Math.PI * 0.5;
scene.add(reflector);

// *---Gui---*
const gui = new Gui();
gui.addColor(reflector.material.uniforms.color, "value");
gui.add(reflector.material.uniforms.uWaveStrength, "value", 0, 0.2, 0.001);
gui.add(reflector.material.uniforms.uWaveSpeed, "value", 0, 0.2, 0.001);

// *---Event---*
const resize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener("resize", resize);

// *---Animate---*
const time = new THREE.Clock();
const animate = () => {
  const elapsedTime = time.getElapsedTime();
  sphere.position.y = Math.sin(elapsedTime * 2) * 0.5 + 1;
  reflector.material.uniforms.time.value = elapsedTime;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

// *---mapping---*
const dudvMap = new THREE.TextureLoader().load("textures/waterdudv.jpg", function () {
  animate();
});

dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;
reflector.material.uniforms.tDudv.value = dudvMap;
