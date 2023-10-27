import * as THREE from "three";
import { GUI } from "lil-gui";

import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";
import { setRenderer, setScene } from "./setUtils";

const gui = new GUI();

const parameters = {
  count: 100,
  radius: 5,
  randomness: 20,
  space: 5,
  pointScale: 2,
  color: "#008cff",
  colorRandomPower: 0.2,
};

let material = null;
let geometry = null;
let mesh = null;

let renderer = null;
let scene = null;

const Lights = (importedRenderer, importedScene) => {
  if (mesh !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(mesh);
  }
  if (renderer === null) renderer = importedRenderer;
  if (scene === null) scene = importedScene;

  geometry = new THREE.BufferGeometry();

  const position = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);
  const aRandoms = new Float32Array(parameters.count * 3);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    const radius = Math.random() * parameters.radius;

    const randomness = Math.random() * parameters.randomness;

    const defaultColor = new THREE.Color(parameters.color);

    const randomX = (Math.random() - 0.5) * randomness;
    const randomY = (Math.random() - 0.5) * randomness;
    const randomZ = (Math.random() - 0.5) * randomness;

    const x = (Math.random() - 0.5) * radius + randomX;

    position[i3] = x < 0 ? x - parameters.space : x + parameters.space;
    position[i3 + 1] = (Math.random() - 0.5) * radius + randomY;
    position[i3 + 2] = (Math.random() - 0.5) * radius + randomZ;

    aRandoms[i3] = (Math.random() - 0.5) * randomness;
    aRandoms[i3 + 1] = (Math.random() - 0.5) * randomness;
    aRandoms[i3 + 2] = (Math.random() - 0.5) * randomness;

    colors[i3] = Math.random() * parameters.colorRandomPower + defaultColor.r;
    colors[i3 + 1] = Math.random() * parameters.colorRandomPower + defaultColor.g;
    colors[i3 + 2] = Math.random() * parameters.colorRandomPower + defaultColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aRandom", new THREE.BufferAttribute(aRandoms, 3));

  material = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    transparent: true,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uSize: { value: 10 * renderer.getPixelRatio() },
      uTime: { value: 0 },
      uScale: { value: parameters.pointScale },
    },
  });

  // material = new THREE.PointsMaterial();

  mesh = new THREE.Points(geometry, material);
  mesh.position.y = 4;
  scene.add(mesh);
};

export { Lights, parameters };
