import THREE from 'three';

export default class Ball extends THREE.Object3D {
  constructor() {
    super();

    const geometry = new THREE.TorusKnotBufferGeometry(1, 0.25, 100, 16);
    const material = new THREE.MeshStandardMaterial({color: 0xff6838, roughness: 0.18, metalness: 0.5});
    const mesh = new THREE.Mesh(geometry, material);

    this.add(mesh);
  }
}
