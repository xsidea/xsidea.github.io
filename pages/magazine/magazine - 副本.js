var width = $(window).width();
var height = $(window).height();
var magazine = $('#magazine');
magazine.turn({
	width: $.isTouch ? width : 1052,
	height: $.isTouch ? height - 55 - 50 : 720,
	display: $.isTouch ? 'single' : 'double', //single:单页显示 double:双页显示
	acceleration: true, // 硬件加速, 默认true, 如果是触摸设备设置为true
	autoCenter: false, // 自动居中, 默认false
	duration: 500, // 翻页速度(毫秒), 默认600ms
	gradients: true, // 翻页时的阴影渐变, 默认true
	elevation: 50,
	direction: 'ltr',
	turnCorners: 'tl,tr', //
	// hard: 'hard-left' // 设置翻页方式为hard-left  
	when: {
		begin: function() {
			console.log('begin');
			// $('.loading').show();
		},
		// 翻页前触发
		turning: function(e, page, view) {


		},
		// 翻页后触发
		turned: function(e, page) {
			var page = $('#magazine').turn('page'); // 当前页数
			if ($.isTouch) {

				$('.xs-pages-bottom .number').html(page + 1);
			} else {
				$('.xs-pages-bottom .number').html(page)
			}
		},
		// 第一页时触发
		first: function(e, page, ) {
			console.log("第一页时触发");
		},
		// 最后一页时触发
		last: function(e, page, ) {
			console.log("最后一页时触发");
		},
		// 页面开始时
		start: function(e, page, ) {

		},
		// 页面结束时
		end: function(e, page, ) {
			var audio = document.getElementById('audio');
			audio.play();
			// audio.pause();
		},
	}
});

magazine.mousedown(function(event){
	console.log(event);
});

// 自动翻页
// var way = 1;
// setInterval(function() {
// 	if (way == 1) {
// 		$("#magazine").turn("next");
// 		if ($("#magazine").turn("page") == $("#magazine").turn("pages")) {
// 			way = 2;
// 			$("#magazine").turn("options", {
// 				turnCorners: "tl,tr"
// 			});
// 		}
// 	} else {
// 		$("#magazine").turn("previous");
// 		if ($("#magazine").turn("page") == 1) {
// 			way = 1;
// 			$("#magazine").turn("options", {
// 				turnCorners: "bl,br"
// 			});
// 		}
// 	}
// }, 3000);




$(window).ready(function() {

	//总页数
	var total = $("#magazine").turn("pages");
	$('.xs-pages-bottom .total').html(total);
	// 封面
	$('[data-page="cover"]').click(function() {
		$("#magazine").turn("page", 1);
		// 当前页数
		var page = $('#magazine').turn('page');
		$('.xs-pages-bottom .number').html(page);
	})
	// 封底
	$('[data-page="coverBack"]').click(function() {
		var total = $("#magazine").turn("pages");
		$("#magazine").turn("page", total);
		// 当前页数
		var page = $('#magazine').turn('page');
		$('.xs-pages-bottom .number').html(page);
	})
	// 上一页
	$('[data-page="previous"]').click(function() {
		$("#magazine").turn("previous");
		var page = $('#magazine').turn('page'); // 当前页数
		$('.xs-pages-bottom .number').html(page);
	})
	// 下一页
	$('[data-page="next"]').click(function() {
		$("#magazine").turn("next");
		var page = $('#magazine').turn('page'); // 当前页数
		$('.xs-pages-bottom .number').html(page);
	})






});


// left and right keyboard
$(window).bind('keydown', function(e) {
	if (e.keyCode == 37) {
		$('#magazine').turn('previous');
		var page = $('#magazine').turn('page');
		$('.xs-pages-bottom .number').html(page);
	} else if (e.keyCode == 39) {
		$('#magazine').turn('next');
		var page = $('#magazine').turn('page');
		$('.xs-pages-bottom .number').html(page);
	}
});

// resize
window.addEventListener('resize', function() {

});

// 移动端鼠标拖动翻页
$("#magazine").on("touchstart", function(e) {
	if (e.cancelable) {
		if (!e.defaultPrevented) {
			e.preventDefault();
		}
	}
	startX = e.originalEvent.changedTouches[0].pageX,
		startY = e.originalEvent.changedTouches[0].pageY;
});
$("#magazine").on("touchend", function(e) {
	if (e.cancelable) {
		if (!e.defaultPrevented) {
			e.preventDefault();
		}
	}
	moveEndX = e.originalEvent.changedTouches[0].pageX,
		moveEndY = e.originalEvent.changedTouches[0].pageY,
		X = moveEndX - startX,
		Y = moveEndY - startY;

	if (X > 50) {
		//左右滑
		$('#magazine').turn('previous');
	} else if (X < -50) {
		//右左滑
		$('#magazine').turn('next');
	}
});





function isMobile() {
	if (window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
		return true; // 移动端
	} else {
		return false; // PC端
	}
}