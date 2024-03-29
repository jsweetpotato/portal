import * as THREE from "three";
import { rgbeLoader, gltfLoader, textureLoader } from "../loader";

import fragment from "../shaders/screenFrag.glsl";
import vertex from "../shaders/screenVertex.glsl";

// const envmap = rgbeLoader.load("envmap2.hdr", () => {
//   envmap.mapping = THREE.EquirectangularReflectionMapping;
// });

const colorMap = textureLoader.load("baked3.jpg");
const lightMap = textureLoader.load("roughness.jpg");
colorMap.flipY = lightMap.flipY = false;
const material = new THREE.MeshBasicMaterial({
  map: colorMap,
  reflectivity: 2,
  lightMap: colorMap,
  lightMapIntensity: 12,
});

let screenMat = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#AAD5FF") },
    uColor2: { value: new THREE.Color("#FFFFF0") },
    uColor3: { value: new THREE.Color("#d83de6") },
    uColor4: { value: new THREE.Color("#7FFF00") },
  },
});

let potalMesh = null;

const Portal = (scene) => {
  gltfLoader.load("Portalblend3.gltf", (gltf) => {
    gltf.scene.traverse((child) => {
      child.name == "PortalLight" ? (child.material = screenMat) : (child.material = material);
    });
    gltf.scene.scale.set(0.7, 0.7, 0.7);
    gltf.scene.position.y = 0.5;
    scene.add(gltf.scene);
  });
};

export { Portal, screenMat };
