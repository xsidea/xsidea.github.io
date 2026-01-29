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
import {TWEEN} from '../../framework/lib/threejs/tween.module.min.js';
import {TrackballControls} from '../../framework/lib/threejs/TrackballControls.js';
import {OrbitControls} from '../../framework/lib/threejs/OrbitControls.js';
import {CSS3DRenderer,CSS3DObject} from '../../framework/lib/threejs/CSS3DRenderer.js';
import Stats from '../../framework/lib/threejs/stats.module.js';
var xsThree = {
	scene: null,
	camera: null,
	mesh: null,
	renderer: null,
	clock: null,
	stats: null,
	controls: null,
	table: [],
	object: [],
	bodyEl: document.body,
	container: document.getElementById('container'),
	width: window.innerWidth,
	height: window.innerHeight,
	// 创建场景
	createScene: function() {
		this.scene = new THREE.Scene();
		// 场景背景颜色
		this.scene.background = new THREE.Color(0xffffff);
		// 添加一个三维坐标轴，x轴红色、y轴绿色、z轴蓝色
		var axes = new THREE.AxesHelper(3);
		this.scene.add(axes);
	},
	// 创建透视投影相机
	createCamera: function() {
		this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
		this.camera.position.set(0, 40, 30);
		this.camera.lookAt(0, 0, 0);
	},
	createHelper: function() {
		var grid = new THREE.GridHelper(100, 20, 0xFF0000, 0x000000);
		grid.material.opacity = 0.1;
		grid.material.transparent = true;
		this.scene.add(grid);

		var axesHelper = new THREE.AxesHelper(10);
		this.scene.add(axesHelper);
	},
	// 帧率左上角
	createStats: function() {
		var stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '10px';
		stats.domElement.style.left = '10px';
		this.container.appendChild(stats.domElement);
	},
	// 创建渲染器
	createRenderer: function() {
		this.renderer = new THREE.WebGLRenderer({
			antialias: true //抗锯齿;
		})
		this.renderer.setSize(this.width, this.height);
		this.container.appendChild(this.renderer.domElement);
	},
	createControl: function() {
		var controls = new OrbitControls(this.camera, this.renderer.domElement);
		// 使用阻尼,指定是否有惯性
		controls.enableDamping = true;
		// 动态阻尼系数 就是鼠标拖拽旋转灵敏度，阻尼越小越灵敏
		controls.dampingFactor = 0.25;
		
		controls.enableZoom = true;// 是否可以缩放
		
		controls.autoRotate = false;//是否自动旋转
		//设置相机距离原点的最近距离
		controls.minDistance = 10;
		//设置相机距离原点的最远距离
		controls.maxDistance = 600;
		//启用或禁用摄像机平移
		controls.enablePan = true;
		this.controls = controls;

		// 监听相机变化
		let that = this;
		this.controls.addEventListener('change', function() {
			console.log(that.camera.position);
		})
	},
	createLight: function() {
		// 环境光
		let light = new THREE.AmbientLight(0x606060);
		this.scene.add(light);
		// 平行光源
		var directionalLight = new THREE.DirectionalLight(0xBCD2EE);
		directionalLight.position.set(1, 0.75, 0.5);
		this.scene.add(directionalLight);
	},
	createGeometry: function() {
		var geometry = new THREE.BoxGeometry(5, 5, 5); //new THREE.PlaneGeometry(300, 300, 8, 8) //new THREE.BoxGeometry(5, 5, 5);;
		//使用Phong光照模型的材质，适合镜面、金属等
		var material = new THREE.MeshBasicMaterial({
			color: 0x77ee1c,
			wireframe: true, //将几何体渲染为线框
		});
		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.set(0, 0, 0);
		this.scene.add(this.mesh);
	},
	render: function() {
		//这里不能直接用this.render,第二次调用自身时,this就变成了window
		//requestAnimationFrame的this是window对象，如同setTimeout,setinterval
		requestAnimationFrame(this.render.bind(this));
		this.controls.update();
		this.renderer.render(this.scene, this.camera);

	},
	// 初始化
	init: function() {
		this.createScene();
		this.createHelper();
		this.createCamera();
		this.createRenderer();
		this.createLight();
		this.createGeometry();
		this.createControl();
		this.createStats();
		this.render();
	},
}

// 监听窗口变化
window.addEventListener('resize', function() {
	//更新sizes
	xsThree.width = window.innerWidth;
	xsThree.height = window.innerHeight;
	// 更新相机
	xsThree.camera.aspect = xsThree.width / xsThree.height;
	xsThree.camera.updateProjectionMatrix();
	//更新renderer
	xsThree.renderer.setSize(xsThree.width, xsThree.height);
	xsThree.renderer.render(xsThree.scene, xsThree.camera);
}, false)

// keyboard navigation events
document.addEventListener('keydown', function(ev) {
	var keyCode = ev.keyCode || ev.which;
	switch (keyCode) {
		case 37:
			//left;
			break;
		case 39:
			//right;
			break;
	}
});

if ('ontouchstart' in window) {
	// touchstart touchmove touchend   e.targetTouches[0]
	window.addEventListener('touchstart', function(e) {
		e.preventDefault();
		this.ontouchmove = function(e) {

		}
		this.ontouchend = function(e) {
			this.ontouchmove = null;
		}
	})
} else {
	// onmousedown onmousemove onmouseup 
	document.onmousedown = function(e) {
		this.onmousemove = function(e) {

		}
		this.onmouseup = function(e) {
			this.onmousemove = null;
		}
	}
}

xsThree.init();
