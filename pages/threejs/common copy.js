// +----------------------------------------------------------------------
// | xstudio [ Enabling Developers To Help Enterprises Develop ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2022 https://www.haisong.net All rights reserved.
// +----------------------------------------------------------------------
// | Licensed LPPL ( https://opensource.org/licenses/LPPL-1.3c )
// +----------------------------------------------------------------------
// | Author: XiaoSong <lianghaisong@gmail.com>
// +----------------------------------------------------------------------
import * as THREE from '../../framework/lib/threejs/three.module.js';
import { TWEEN } from '../../framework/lib/threejs/tween.module.min.js';
import { TrackballControls } from '../../framework/lib/threejs/TrackballControls.js';
import { OrbitControls } from '../../framework/lib/threejs/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from '../../framework/lib/threejs/CSS3DRenderer.js';
var camera, scene, renderer, controls;
var table = [], objects = [];
var targets = {
    table: [],
    sphere: [],
    helix: [],
    grid: []
};
var containerEl = document.getElementById('container');
// 创建场景
function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
}

// 创建 Helper
function createHelper() {
    // 网格
    var gridHelper = new THREE.GridHelper(100, 20, 0xFF0000, 0x000000);
    gridHelper.position.set(0, 0, 0);
    gridHelper.material.opacity = 0.1;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // 添加一个三维坐标轴，x轴红色、y轴绿色、z轴蓝色
    var axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);
}

// 创建透视投影相机
function createCamera() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100000);
    camera.position.set(0, 0, 3000);
    // camera.lookAt(0, 0, 0);
    scene.add(camera);
}

// 创建控制器
function createControls() {
    controls = new TrackballControls(camera, renderer.domElement);
    // controls.enableDamping = true;// 使用阻尼,指定是否有惯性
    // controls.dampingFactor = 0.25;// 动态阻尼系数 就是鼠标拖拽旋转灵敏度，阻尼越小越灵敏
    // controls.enableZoom = true;// 是否可以缩放
    // controls.autoRotate = false;//是否自动旋转
    controls.minDistance = 500;//设置相机距离原点的最近距离
    controls.maxDistance = 6000;//设置相机距离原点的最远距离
    // controls.enablePan = true;//启用或禁用摄像机平移
    // 监听相机变化
    controls.addEventListener('change', function () {
        // console.log(camera.position);
    })
}

// 创建几何体
function createGeometry() {
    // var geometry = new THREE.BoxGeometry(1, 1, 1);
    // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // var cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);
}

// 创建光源
function createLight() {


}


// 创建渲染器
function createRenderer() {
    // renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerEl.appendChild(renderer.domElement);
}

// 动画
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
    
}

// 创建节点
function createElement() {
    // images
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
    // table
    for (let i = 1; i < table.length; i++) {
        var element = document.createElement('div');
        element.className = 'element';

        var img = document.createElement('img');
        img.className = 'img';
        img.src = table[i][0];
        img.width = '90px';
        img.height = '136px'
        element.appendChild(img);

        const objectCSS = new CSS3DObject(element);
        objectCSS.position.x = Math.random() * 4000 - 2000;
        objectCSS.position.y = Math.random() * 4000 - 2000;
        objectCSS.position.z = Math.random() * 4000 - 2000;
        scene.add(objectCSS);

        objects.push(objectCSS);
        //
        const object = new THREE.Object3D();
        object.position.x = (table[i][1] * 160) - 1330;
        object.position.y = -(table[i][2] * 90) + 990;

        targets.table.push(object);
    }

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
function render() {
    renderer.render(scene, camera);
}
// 创建主循环
function init() {
    createScene();
    createHelper();
    createCamera();
   
    
    createLight();
    createGeometry();
    createElement();
    createRenderer();
    createControls();
    animate();
}


// 监听窗口变化
window.addEventListener('resize', function () {
    // 更新相机
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    //更新renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}, false)

// 初始化
window.onload = () => {
    init();
};


