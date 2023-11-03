import * as THREE from "three";
import { gltfLoader, textureLoader } from "../loader";

const colorMap = textureLoader.load("baked2.jpg");
const roughnessMap = textureLoader.load("roughness.jpg");
colorMap.flipY = false;
roughnessMap.flipY = false;
const material = new THREE.MeshStandardMaterial({ map: colorMap, roughnessMap: roughnessMap, lightMap: roughnessMap, lightMapIntensity: 2 });

let potalMesh = null;

const Portal = (scene) => {
  gltfLoader.load("Portalblend3.gltf", (gltf) => {
    gltf.scene.traverse((child) => {
      child.material = material;
    });
    gltf.scene.position.y = 0.5;
    scene.add(gltf.scene);
  });
};

export default Portal;
