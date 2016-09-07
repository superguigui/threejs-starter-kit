import {
  Object3D,
  TorusKnotBufferGeometry,
  MeshStandardMaterial,
  Mesh
} from 'three';

export default class Ball extends Object3D {
  constructor() {
    super();

    const geometry = new TorusKnotBufferGeometry(1, 0.25, 100, 16);
    const material = new MeshStandardMaterial({color: 0xA197C9, roughness: 0.18, metalness: 0.5});
    const mesh = new Mesh(geometry, material);

    this.add(mesh);
  }
}
