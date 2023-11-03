import * as THREE from "three";
import vertexShader from "../shaders/lightsVertex.glsl";
import fragmentShader from "../shaders/lightsFrag.glsl";

const parameters = {
  count: 30,
  radius: 5,
  randomness: 20,
  space: 5,
  pointScale: 10,
  color: "#008cff",
  colorRandomness: 0.2,
};

let material = null;
let geometry = null;
export let lightsMesh = null;

let renderer = null;
let scene = null;

const GenerateLights = (importedRenderer, importedScene) => {
  if (lightsMesh !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(lightsMesh);
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
    position[i3 + 1] = (Math.random() - 0.5) * radius + randomY + 3;
    position[i3 + 2] = (Math.random() - 0.5) * radius + randomZ;

    aRandoms[i3] = (Math.random() - 0.5) * randomness;
    aRandoms[i3 + 1] = (Math.random() - 0.5) * randomness;
    aRandoms[i3 + 2] = (Math.random() - 0.5) * randomness;

    colors[i3] = Math.random() * parameters.colorRandomness + defaultColor.r;
    colors[i3 + 1] = Math.random() * parameters.colorRandomness + defaultColor.g;
    colors[i3 + 2] = Math.random() * parameters.colorRandomness + defaultColor.b;
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
      uSize: { value: 5 * renderer.getPixelRatio() },
      uTime: { value: 0 },
      uScale: { value: parameters.pointScale },
    },
  });

  // material = new THREE.PointsMaterial();

  lightsMesh = new THREE.Points(geometry, material);
  lightsMesh.position.y = 4;
  scene.add(lightsMesh);
};

export { GenerateLights, parameters };
