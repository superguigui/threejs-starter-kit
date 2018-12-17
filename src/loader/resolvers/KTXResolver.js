import KTXLoader from '../loaders/KTXLoader'
import { LinearFilter } from 'three'

export class KTXResolver {
  constructor() {
    this.type = 'ktx'
    this.loader = new KTXLoader()
  }

  resolve(item) {
    return new Promise(resolve => {
      this.loader.load(item.url, texture => {
        texture.minFilter = texture.magFilter = LinearFilter
        resolve(Object.assign(item, { texture }))
      })
    })
  }

  get(item) {
    return item.texture
  }
}
