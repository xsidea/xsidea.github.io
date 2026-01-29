var width = $(window).width();
var height = $(window).height();



var w1 = document.body.clientWidth - 20;
var flipbook = $('#flipbook');
var scale = 1,
	rotate = 90;

window.onload = function() {
	var url = '/pages/magazine/magazine/pdf.pdf';
	//此处传递pdf路径
	getpdf(url)
}

function getpdf(url) {
	var loadingTask = pdfjsLib.getDocument(url) //获取pdf的文件信息
	loadingTask.promise.then(function(pdf) {
		//根据总页数添加固定的div和canvas
		for (let i = 1; i <= pdf.numPages; i++) {
			var id = 'canvaspage' + i;
			var div = document.createElement('div');
			div.innerHTML = '<canvas id="' + id + '" class="page"></canvas>';
			flipbook.append(div);
			setcanvas(i, pdf, id);
		}

		//调用turn
		loadapp();
	})
}

var setcanvas = function(i, pdf, id) {
	pdf.getPage(i).then(function(page) {
		var viewport = page.getViewport({
			scale: scale
		})
		var canvas = document.getElementById(id);
		var context = canvas.getContext('2d');


		//根据宽高判断是否需要旋转
		if (viewport.height / viewport.width >= 1.42) {

			var newScale = 1440 / viewport.height;
			var newViewport = page.getViewport({
				scale: newScale,
				rotation: rotate
			})
			var outputScale = window.devicePixelRatio;

			canvas.width = Math.floor(newViewport.width * outputScale);
			canvas.height = Math.floor(newViewport.height * outputScale);
			canvas.style.width = Math.floor(newViewport.width) + "px";
			canvas.style.height = Math.floor(newViewport.height) + "px";

			var transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

			var renderContext = {
				canvasContext: context,
				transform: transform,
				viewport: newViewport
			}
			page.render(renderContext)

			return;
		}

		//根据每张图的宽高，按标准重新计算缩放比例
		var newScale = 900 / viewport.height

		var newViewport = page.getViewport({
			scale: newScale
		})
		var outputScale = window.devicePixelRatio

		canvas.width = Math.floor(newViewport.width * outputScale);
		canvas.height = Math.floor(newViewport.height * outputScale);
		canvas.style.width = Math.floor(newViewport.width) + "px";
		canvas.style.height = Math.floor(newViewport.height) + "px";

		var transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] :
			null;

		var renderContext = {
			canvasContext: context,
			transform: transform,
			viewport: newViewport
		}
		page.render(renderContext);

	})
}

function loadapp() {
	flipbook.turn({
		display: $.isTouch ? 'single' : 'double', //single:单页显示 double:双页显示
		acceleration: true, // 是否启动硬件加速 如果为触摸设备必须为true
		gradients: true, // 是否显示翻页阴影效果
		autoCenter: false, // 自动居中, 默认false
		elevation: 50, // 转换期间页面的高度
		width: $.isTouch ? width : 1052,
		height: $.isTouch ? height - 55 - 50 : 720,
		duration: 500, // 翻页速度(毫秒), 默认600ms
	});
}