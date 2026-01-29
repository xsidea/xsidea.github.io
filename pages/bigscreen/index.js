var width = window.innerWidth;
var height = window.innerHeight;
// // 创建canvas
var xsBg = document.getElementById('xs-video-bg');
// var canvasEle = document.createElement('canvas');
// canvasEle.id = 'xs-canvas-bg';
// canvasEle.width = width;
// canvasEle.height = height;
// canvasEle.style.backgroundColor = '#FF0000';
// xsBg.appendChild(canvasEle);
// var ctx = canvasEle.getContext("2d");
// var targetBitmap = ctx.createImageData(width, height);
// 创建视频
video = document.createElement("video");
video.autoplay = true;
video.loop = true;
video.src = "./assets/video/video_main.mp4";
video.id = 'xs-video-bg';
video.width = width;
video.height = height;
// video.style.display = 'none';
xsBg.appendChild(video);
// console.log(targetBitmap);
// video.oncanplaythrough = function() {

// 	function play() {
// 		ctx.drawImage(video,0,0);
// 		var imageData = ctx.getImageData(0, 0, width, height);
// 		        for (var i = 0; i < imageData.data.length; i += 4) {
// 		            var r = imageData.data[i];
// 		            var g = imageData.data[i + 1];
// 		            var b = imageData.data[i + 2];

// 		            var c = (r + g + b) / 3;

// 		            targetBitmap.data[i] = 250-imageData.data[i];
// 		            targetBitmap.data[i + 1] = 250-imageData.data[i+1];
// 		            targetBitmap.data[i + 2] = 250-imageData.data[i+2];
// 		            targetBitmap.data[i + 3] = 255;//alpha 通道
// 		        }

// 		        ctx.putImageData(targetBitmap, 0, 0);



// 		window.requestAnimationFrame(play);
// 	}
// 	play();
// }








/***********************************************/
/*

<div id="image-container"></div>

#image-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.image {
  width: 100px;
  height: 100px;
  margin: 10px;
  background-color: #ccc;
}
*/


// $(document).ready(function() {
// 	var screenWidth = $(window).width();
// 	var screenHeight = $(window).height();
// 	var imageWidth = 100;
// 	var imageHeight = 100;
// 	var margin = 10;
// 	var rows = Math.floor(screenHeight / (imageHeight + margin));
// 	var columns = Math.floor(screenWidth / (imageWidth + margin));
// 	var totalImages = rows * columns;
// 	var images = [];

// 	for (var i = 0; i < totalImages; i++) {
// 		images.push('<div class="image"></div>');
// 	}

// 	$('#image-container').html(images.join(''));

// 	$('.image').each(function() {
// 		var randomTop = Math.floor(Math.random() * (screenHeight - imageHeight));
// 		var randomLeft = Math.floor(Math.random() * (screenWidth - imageWidth));
// 		$(this).css({
// 			top: randomTop + 'px',
// 			left: randomLeft + 'px'
// 		});
// 	});
// });
