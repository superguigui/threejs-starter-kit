import { JSONLoader, TextureLoader } from 'three'

/**

  ```
  import preloader from './utils/preloader'
  var manifest = [
    {type: 'Texture', url: './assets/images/diffuse.jpg', id: 'diffuseTexture'},
    {type: 'JsonModel', url: './assets/models/spaceship.json', id: 'spaceshipModel'}
  ]
  preloader.load(manifest, () => {
    const texture = preloader.getTexture('diffuseTexture')
    const geometry = preloader.getGeometry('spaceshipModel')
    const model = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: texture}))
  })
  ```

*/

class Preloader {
  constructor () {
    this.jsonLoader = new JSONLoader()
    this.textureLoader = new TextureLoader()
    this.isLoaded = false
  }

  load (manifest, onComplete) {
    if (!manifest || !manifest.length) return
    this.manifest = manifest
    this.start(onComplete)
  }

  start (onComplete) {
    this.getManifestByType('JsonModel').forEach((value) => {
      value.isLoaded = false
      this.jsonLoader.load(value.url, (geometry) => {
        value.isLoaded = true
        value.geometry = geometry
        if (this.checkManifestCompletion()) {
          onComplete()
        }
      })
    })

    this.getManifestByType('Texture').forEach((value) => {
      value.isLoaded = false
      this.textureLoader.load(value.url, (texture) => {
        value.isLoaded = true
        value.texture = texture
        if (this.checkManifestCompletion()) {
          onComplete()
        }
      })
    })

    this.getManifestByType('Image').forEach((value) => {
      value.isLoaded = false
      const img = new Image()
      img.addEventListener('load', () => {
        value.isLoaded = true
        value.image = img
        if (this.checkManifestCompletion()) {
          onComplete()
        }
      })
      img.src = value.url
    })
  }

  getManifestByType (type) {
    return this.manifest.filter(value => value.type === type)
  }

  checkManifestCompletion () {
    for (let i = 0, l = this.manifest.length; i < l; i++) {
      if (!this.manifest[i].isLoaded) return false
    }
    return true
  }

  getGeometry (id) {
    var item = this.manifest.filter((value) => {
      return value.id === id
    })[0]

    if (item && item.geometry) {
      return item.geometry
    }
    return null
  }

  getTexture (id) {
    var item = this.manifest.filter((value) => {
      return value.id === id
    })[0]

    if (item && item.texture) {
      return item.texture
    }
    return null
  }

  getImage (id) {
    var item = this.manifest.filter((value) => {
      return value.id === id
    })[0]

    if (item && item.image) {
      return item.image
    }
    return null
  }
}

export default new Preloader()
