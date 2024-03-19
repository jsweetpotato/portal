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

let screen = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
});

let potalMesh = null;

const Portal = (scene) => {
  gltfLoader.load("Portalblend3.gltf", (gltf) => {
    gltf.scene.traverse((child) => {
      child.name == "PortalLight"
        ? (child.material = screen)
        : (child.material = material);
    });
    gltf.scene.scale.set(0.7, 0.7, 0.7);
    gltf.scene.position.y = 0.5;
    scene.add(gltf.scene);
  });
};

export default Portal;
