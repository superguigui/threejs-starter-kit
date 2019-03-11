import { Object3D, EquirectangularReflectionMapping } from 'three'
import { preloader } from '../loader'

export default class Torus extends Object3D {
  constructor () {
    super()

    this.scale.setScalar(2)
    this.rotation.y = Math.PI * -0.25
    
    const helmet = preloader.get('helmet')
    const envMap = preloader.get('env')
    envMap.mapping = EquirectangularReflectionMapping
    helmet.scene.children[0].material.envMap = preloader.get('env')
    
    this.add(helmet.scene)
  }
}
