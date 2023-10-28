import * as THREE from "three";

export const loadingManager = new THREE.LoadingManager();
loadingManager.onError = (url) => {
  throw new Error(`${url}로드 실패`);
};

export const textureLoader = new THREE.TextureLoader(loadingManager);
