import * as THREE from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector";
import { loadingManager, textureLoader } from "../loader";

import vertexShader from "../shaders/reflectorVertex.glsl";
import fragmentShader from "../shaders/reflectorFrag.glsl";
let reflectorMesh = null;

const GenerateReflector = (scene) => {
  const circle = new THREE.CircleGeometry(20, 8);
  reflectorMesh = new Reflector(circle, {
    color: 0xdfffff,
    textureWidth: 1024,
    textureHeight: 1024,
    shader: {
      uniforms: {
        color: { value: null },
        uTime: { value: 0 },
        tDiffuse: { value: null },
        tDudv: { value: null },
        textureMatrix: { value: null },
        uWaveStrength: { value: 0.1 },
        uWaveSpeed: { value: 0.1 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    },
  });
  reflectorMesh.position.y = -0.5;
  reflectorMesh.rotation.x = -Math.PI * 0.5;
  scene.add(reflectorMesh);

  // Test mesh
  const box = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());
  box.position.y = 1;
  scene.add(box);

  // Test light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 6);
  directionalLight.position.set(5, 20, 8);
  scene.add(directionalLight, ambientLight);
};

const dudvMap = textureLoader.load("/waterdudv.jpg");
dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;
dudvMap.generateMipmaps = false;

loadingManager.onLoad = () => (reflectorMesh.material.uniforms.tDudv.value = dudvMap);

export { GenerateReflector, reflectorMesh };
