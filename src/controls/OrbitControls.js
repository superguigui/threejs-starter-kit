import { Vector3, Vector2, Quaternion } from 'three'
import eventOffset from 'mouse-event-offset'
import mouseWheel from 'mouse-wheel'
import clamp from 'clamp'

const Y_UP = new Vector3(0, 1, 0)
const EPSILON = 1e-10

export default class OrbitControls {
  constructor (object, opt = {}) {
    this.onInputDown = this.onInputDown.bind(this)
    this.onInputMove = this.onInputMove.bind(this)
    this.onInputUp = this.onInputUp.bind(this)
    this.handleZoom = this.handleZoom.bind(this)
    this.preventDefault = this.preventDefault.bind(this)
    this.update = this.update.bind(this)
    this.rotateTo = this.rotateTo.bind(this)

    this.object = object
    this.name = opt.name || ''
    this.isTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch

    this.inputDelta = new Vector3()
    this.offset = new Vector3()
    this.upQuat = new Quaternion()
    this.upQuatInverse = new Quaternion()
    this.enabled = true

    this.target = opt.target || new Vector3()
    this.distance = opt.distance || 1
    this.damping = opt.damping || 0.25
    this.rotateSpeed = opt.rotateSpeed || 0.28
    this.zoomSpeed = opt.zoomSpeed || 0.0075

    this.rotate = opt.rotate !== false
    this.zoom = opt.zoom !== false

    this._theta = opt.theta || 0
    this._phi = opt.phi || Math.PI * 0.5

    this.phiBounds = opt.phiBounds || [0, Math.PI]
    this.thetaBounds = opt.thetaBounds || [-Infinity, Infinity]
    this.distanceBounds = opt.distanceBounds || [1, Infinity]

    this.parent = opt.parent || window
    this.element = opt.element
    this.pinchHandler
    this.mouseStart = new Vector2()
    this.clientSize = new Vector2()
    this.tmp = [0, 0]
    this.dragging = false

    this.addEvents()
    this.rotateTo(this._theta, this._phi)
  }

  dispose () {
    this.removeEvents()
  }

  reset () {
    this.inputDelta = new Vector3()
    this.mouseStart = new Vector2()
    this.theta = 0
    this.phi = Math.PI * 0.5
    this._phi = Math.PI * 0.5
    this.inputDelta.x = this.phi
  }

  addEvents () {
    if (this.rotate) {
      if (this.isTouch) {
        this.parent.addEventListener('touchstart', this.onInputDown)
        this.parent.addEventListener('touchmove', this.onInputMove)
        this.parent.addEventListener('touchend', this.onInputUp)
      } else {
        this.parent.addEventListener('mousedown', this.onInputDown)
        this.parent.addEventListener('mousemove', this.onInputMove)
        this.parent.addEventListener('mouseup', this.onInputUp)
      }
    }

    if (this.zoom) {
      mouseWheel(window, this.handleZoom, true)
    }
  }

  removeEvents () {
    this.parent.removeEventListener('mousedown', this.onInputDown)
    this.parent.removeEventListener('mousemove', this.onInputMove)
    this.parent.removeEventListener('mouseup', this.onInputUp)
    this.parent.removeEventListener('touchstart', this.onInputDown)
    this.parent.removeEventListener('touchmove', this.onInputMove)
    this.parent.removeEventListener('touchend', this.onInputUp)
  }

  preventDefault (e) {
    e.preventDefault()
  }

  onInputDown (e) {
    if (!this.enabled) return
    const start = eventOffset(this.isTouch ? e.changedTouches[0] : e, this.element)
    this.mouseStart.set(start[0], start[1])
    if (this.insideBounds(this.mouseStart)) {
      this.dragging = true
    }
  }

  onInputUp () {
    if (!this.enabled) return
    this.dragging = false
  }

  onInputMove (e) {
    if (!this.enabled) return
    if (this.isTouch) this.preventDefault(e)
    const end = eventOffset(this.isTouch ? e.changedTouches[0] : e, this.element)
    if (!this.dragging) return
    const rect = this.getClientSize()
    const dx = (end[0] - this.mouseStart.x) / rect.x
    const dy = (end[1] - this.mouseStart.y) / rect.y
    this.handleRotate(dx, dy)
    this.mouseStart.set(end[0], end[1])
  }

  insideBounds (pos) {
    if (this.element === window || this.element === document || this.element === document.body) {
      return true
    } else {
      const rect = this.element.getBoundingClientRect()
      return pos.x >= 0 && pos.y >= 0 && pos.x < rect.width && pos.y < rect.height
    }
  }

  getClientSize () {
    var source = this.element
    if (source === window || source === document || source === document.body) {
      source = document.documentElement
    }
    return this.clientSize.set(source.clientWidth, source.clientHeight)
  }

  handleRotate (dx, dy) {
    const PI2 = Math.PI * 2
    this.inputDelta.x -= PI2 * dx * this.rotateSpeed
    this.inputDelta.y -= PI2 * dy * this.rotateSpeed
  }

  handleZoom (dx, dy) {
    this.inputDelta.z += dy * this.zoomSpeed
  }

  rotateTo (theta, phi) {
    this._prepareOffset()

    this.theta = theta
    this.phi = phi

    this._computeOffset()
    this._applyTransformation()
  }

  get theta () {
    return this._theta
  }

  set theta (value) {
    this._theta = clamp(value, this.thetaBounds[0], this.thetaBounds[1])
  }

  get phi () {
    return this._phi
  }

  set phi (value) {
    this._phi = clamp(value, this.phiBounds[0], this.phiBounds[1])
    this._phi = clamp(this._phi, EPSILON, Math.PI - EPSILON)
  }

  _prepareOffset () {
    this.upQuat.setFromUnitVectors(this.object.up, Y_UP)
    this.upQuatInverse.copy(this.upQuat).inverse()

    this.offset.subVectors(this.object.position, this.target)
    this.offset.applyQuaternion(this.upQuat)
  }

  _computeOffset () {
    const radius = Math.abs(this.distance) <= EPSILON ? EPSILON : this.distance
    this.offset.x = radius * Math.sin(this.phi) * Math.sin(this.theta)
    this.offset.y = radius * Math.cos(this.phi)
    this.offset.z = radius * Math.sin(this.phi) * Math.cos(this.theta)
  }

  _applyTransformation () {
    this.offset.applyQuaternion(this.upQuatInverse)
    this.object.position.addVectors(this.target, this.offset)
    this.object.lookAt(this.target)
  }

  _applyDamping () {
    const damp = typeof this.damping === 'number' ? this.damping : 1
    this.inputDelta.x *= 1 - damp
    this.inputDelta.y *= 1 - damp
    this.inputDelta.z *= 1 - damp
  }

  update () {
    this._prepareOffset()

    let theta = Math.atan2(this.offset.x, this.offset.z)
    let phi = Math.atan2(Math.sqrt(this.offset.x * this.offset.x + this.offset.z * this.offset.z), this.offset.y)

    theta += this.inputDelta.x
    phi += this.inputDelta.y

    this.theta = theta
    this.phi = phi

    this.distance += this.inputDelta.z
    this.distance = clamp(this.distance, this.distanceBounds[0], this.distanceBounds[1])

    this._computeOffset()
    this._applyTransformation()
    this._applyDamping()
  }
}
