import * as THREE from '../../framework/lib/threejs/three.module.js';
import { TWEEN } from '../../framework/lib/threejs/tween.module.min.js';
import { TrackballControls } from '../../framework/lib/threejs/TrackballControls.js';
import { OrbitControls } from '../../framework/lib/threejs/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from '../../framework/lib/threejs/CSS3DRenderer.js';
// xsThree.init();
var table = [];
var camera, scene, renderer, controls;
var objects = [];
var targets = {
    table: [],
    sphere: [],
    helix: [],
    grid: []
};


createImages();
init();
animate();

function createImages() {
    var row = 1;
    var col = 1;
    for (var i = 1; i < 121; i++) {
        var file = [];
        file[0] = '/framework/images/thumb/' + i + '.jpeg';
        file[1] = col++;
        file[2] = row;
        table[i] = file;

        if (col > 15) {
            col = 1;
            row++;
        }
    }
}

function init() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 3000;
    camera.lookAt({
        x: 0,
        y: 0,
        z: 0
    });
    scene = new THREE.Scene();
    console.log(table[1][0]);
    // table
    for (let i = 1; i < table.length; i++) {
        var element = document.createElement('div');
        element.className = 'element';

        var img = document.createElement('img');
        img.className = 'img';
        img.src = table[i][0];
        element.appendChild(img);

        const objectCSS = new CSS3DObject(element);
        objectCSS.position.x = Math.random() * 4000 - 2000;
        objectCSS.position.y = Math.random() * 4000 - 2000;
        objectCSS.position.z = Math.random() * 4000 - 2000;
        scene.add(objectCSS);

        objects.push(objectCSS);
        //
        const object = new THREE.Object3D();
        object.position.x = (table[i][1] * 160) - 2000;
        object.position.y = -(table[i][2] * 90) + 960;

        targets.table.push(object);
    }
    // sphere
    const vector = new THREE.Vector3();
    for (let i = 0, l = objects.length; i < l; i++) {
        const phi = Math.acos(-1 + (2 * i) / l);
        const theta = Math.sqrt(l * Math.PI) * phi;
        const object = new THREE.Object3D();
        object.position.setFromSphericalCoords(800, phi, theta);
        vector.copy(object.position).multiplyScalar(2);
        object.lookAt(vector);
        targets.sphere.push(object);
    }
    // helix
    for (let i = 0, l = objects.length; i < l; i++) {
        const theta = i * 0.175 + Math.PI;
        const y = -(i * 8) + 450;
        const object = new THREE.Object3D();
        object.position.setFromCylindricalCoords(900, theta, y);
        vector.x = object.position.x * 2;
        vector.y = object.position.y;
        vector.z = object.position.z * 2;
        object.lookAt(vector);
        targets.helix.push(object);
    }
    // grid
    for (let i = 0; i < objects.length; i++) {
        const object = new THREE.Object3D();
        object.position.x = ((i % 5) * 400) - 800;
        object.position.y = (-(Math.floor(i / 5) % 5) * 400) + 800;
        object.position.z = (Math.floor(i / 25)) * 1000 - 2000;
        targets.grid.push(object);
    }


    //
    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
    //

    controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.autoRotate = true;//是否自动旋转
    controls.addEventListener('change', render);

    const buttonTable = document.getElementById('table');
    buttonTable.addEventListener('click', function () {
        transform(targets.table, 2000);
    });

    const buttonSphere = document.getElementById('sphere');
    buttonSphere.addEventListener('click', function () {
        transform(targets.sphere, 2000);
    });

    const buttonHelix = document.getElementById('helix');
    buttonHelix.addEventListener('click', function () {
        transform(targets.helix, 2000);
    });

    const buttonGrid = document.getElementById('grid');
    buttonGrid.addEventListener('click', function () {
        transform(targets.grid, 2000);
    });


    //
    transform(targets.table, 2000);
}

function transform(targets, duration) {
    TWEEN.removeAll();
    for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        const target = targets[i];
        new TWEEN.Tween(object.position)
            .to({
                x: target.position.x,
                y: target.position.y,
                z: target.position.z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        new TWEEN.Tween(object.rotation)
            .to({
                x: target.rotation.x,
                y: target.rotation.y,
                z: target.rotation.z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }

    new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(render)
        .start();

}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
}

function render() {
    renderer.render(scene, camera);
}

window.addEventListener('resize', function () {
    // 更新相机
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    //更新renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    render();

}, false)
