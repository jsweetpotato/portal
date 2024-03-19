import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

export const loadingManager = new THREE.LoadingManager();
loadingManager.onError = (url) => {
  throw new Error(`${url}로드 실패`);
};

export const textureLoader = new THREE.TextureLoader(loadingManager);

export const gltfLoader = new GLTFLoader(loadingManager);

export const rgbeLoader = new RGBELoader(loadingManager);
