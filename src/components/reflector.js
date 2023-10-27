import * as THREE from "three";

const Reflector = (camera, scene) => {
  const box = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
  scene.add(box);
};

export default Reflector;
