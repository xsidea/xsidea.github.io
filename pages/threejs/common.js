import * as THREE from '../../framework/lib/threejs/three.module.js';
import {
	TWEEN
} from '../../framework/lib/threejs/tween.module.min.js';
import {
	TrackballControls
} from '../../framework/lib/threejs/TrackballControls.js';
import {
	OrbitControls
} from '../../framework/lib/threejs/OrbitControls.js';
import {
	CSS3DRenderer,
	CSS3DObject
} from '../../framework/lib/threejs/CSS3DRenderer.js';

let camera, scene, renderer, controls;
const containerEl = document.getElementById('container');

// 创建图像
function createImages(){
	
}

// 创建场景
function createScene() {
	scene = new THREE.Scene();
}
// 创建相机
function createCamera() {
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 3000;

}
// 创建Helper
function createHelper() {
	// 网格
	var gridHelper = new THREE.GridHelper(4, 12, 0x888888, 0xffffff);
	gridHelper.position.set(0, 0, 0);
	gridHelper.material.opacity = 0.1;
	gridHelper.material.transparent = true;
	scene.add(gridHelper);
	// 添加一个三维坐标轴，x轴红色、y轴绿色、z轴蓝色
	const axesHelper = new THREE.AxesHelper(3);
	axesHelper.layers.enableAll();
	scene.add(axesHelper);
}
// 创建渲染器
function createRenderer() {
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	containerEl.appendChild(renderer.domElement);

}
// 创建控制器
function createControls() {
	controls = new TrackballControls( camera, renderer.domElement );
	controls.minDistance = 0;
	controls.maxDistance = Infinity;
	controls.addEventListener( 'change', function(){
		renderer.render(scene, camera);
	});
}
// 创建光源
function createLight() {
	// 平行光
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	scene.add(directionalLight);

}
// 动画
function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);

}

function init() {
	createScene();
	createCamera();
	createHelper();
	createRenderer();
	createControls();
	createLight();
	animate();
}
// 窗口改变大小
window.addEventListener('resize', function() {
	// 更新相机
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	//更新renderer
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
},false);


init();
