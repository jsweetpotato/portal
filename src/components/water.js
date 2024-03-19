import * as THREE from "three";

import vertexShader from "../shaders/waterVertex.glsl";
import fragmentShader from "../shaders/waterFrag.glsl";

let waterMat = null;

const GenerateWater = (scene) => {
  waterMat = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uBigWaveElevation: { value: 0.5 },
      uBigWaveFreqeuncy: { value: new THREE.Vector2(0.2, 0.5) },
      uBigWaveSpeed: { value: new THREE.Vector2(0.2, 0.5) },
    },
  });
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60, 256, 256),
    waterMat
  );
  mesh.position.y = -1;
  mesh.rotation.x = -Math.PI * 0.5;
  scene.add(mesh);
};

export { GenerateWater, waterMat };
