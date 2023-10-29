import * as THREE from "three";
import { gltfLoader, textureLoader } from "../loader";

const texture = textureLoader.load("baked.jpg");
texture.flipY = false;
const material = new THREE.MeshBasicMaterial({ map: texture });

let potalMesh = null;

const Portal = (scene) => {
  gltfLoader.load("Portalblend.gltf", (gltf) => {
    gltf.scene.traverse((child) => (child.material = material));
    // gltf.scene.position.y = ;
    scene.add(gltf.scene);
  });
};

export default Portal;
