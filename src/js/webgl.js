var Webgl = (function(){

    function Webgl(width, height){
        // Basic three.js setup
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
        this.camera.position.z = 500;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x2D2D2D);

        // Directly add objects
        this.someObject = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: true}));
        this.someObject.position.set(-60, 0, 0);
        this.scene.add(this.someObject);

        // Or create container classes for them to simplify your code
        this.someOtherObject = new Sphere();
        this.someOtherObject.position.set(60, 0, 0);
        this.scene.add(this.someOtherObject);
    }

    Webgl.prototype.resize = function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

    Webgl.prototype.render = function() {    
        this.renderer.render(this.scene, this.camera);

        this.someObject.rotation.y += 0.01;
        this.someObject.rotation.x += 0.01;

        this.someOtherObject.update();
    };

    return Webgl;

})();