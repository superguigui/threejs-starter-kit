threejs-starter-kit
===================

My current worlflow for quick THREE.js prototypes.

![screenshot](/screenshot.png)

## Usage
After cloning install all node dependencies
```bash
npm i
```

Then launch the main task to open budo livereload server  
```bash
npm start
```

You are good to go !

If you need a minified build just run
```bash
npm run build
```
Then put the `/index.html` and `/index.js` (+ any assets that you might be using) on your server.

## Features
- ES6 with [Babel](http://babeljs.io)
- [Budo](https://github.com/mattdesl/budo) (browserify local server with livereload)
- [Glslify](https://github.com/glslify/glslify) (browserify transform for glsl)
- My personnal [GUI](http://github.com/superguigui/guigui#dev)
- Basic asset preloader (you probably need to extend it for your needs)
- OrbitControls
- Simple setup with my ideal file structure
- Postprocessing with [my fork](https://github.com/superguigui/Wagner) of [spite's WAGNER](https://github.com/spite/Wagner)

## File Structure and coding style
I like to create "Objects" classes in `src/objects` that contain elements from my scene. They usually extend `THREE.Object3D` so that they can be added to a parent, have positions and rotations etc... I also sometime extend `THREE.Mesh` directly but it can be a bit restrictive since in that case you need to prepare all geometries and material in the constructor before the call to `super()` without being able to use `this`.

Also i like to avoid using the `THREE` global keyword and instead I import only the Objects that I need. This is pointless but it might be useful in the tree-shaking future / alternate reality.
```js
import { Object3D, Mesh, MeshBasicMaterial } from THREE
```

I try to respect the [Standard](https://standardjs.com) coding style.
