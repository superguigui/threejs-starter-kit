threejs-starter-kit
===================

My current worlflow for quick THREE.js prototypes.

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

## File Structure
I like to create "Objects" classes that extend THREE.Object3D so that they can be added to the main scene and have positions and rotations etc... You can also extend THREE.Mesh but it can be a bit restrictive since you will need to prepare all geometries and material in the constructor before the call to `super()` without being able to use `this`.
