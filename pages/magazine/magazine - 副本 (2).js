var width = $(window).width();
var height = $(window).height();
var flipbook = $('#flipbook');



flipbook.turn({
	display: $.isTouch ? 'single' : 'double', //single:单页显示 double:双页显示
	acceleration: true, // 是否启动硬件加速 如果为触摸设备必须为true
	gradients: true, // 是否显示翻页阴影效果
	autoCenter: false, // 自动居中, 默认false
	elevation: 50, // 转换期间页面的高度
	width: $.isTouch ? width : 1052,
	height: $.isTouch ? height - 55 - 50 : 720,
	duration: 500, // 翻页速度(毫秒), 默认600ms
	when: {
		// 翻页前触发
		turning: function(e, page, view) {

		},
		// 翻页后触发
		turned: function(e, page) {

		}
	}
});
clickPages();
event();

function event() {
	flipbook.turn("zoom", 1);

	var zoom = flipbook.turn("zoom");
	alert("Current zoom: " + zoom);
}

function clickPages() {
	//总页数
	var total = flipbook.turn("pages");
	$('.xs-pages-bottom .total').html(total);
	// 封面
	$('[data-page="cover"]').click(function() {
		flipbook.turn("page", 1);
		// 当前页数
		var page = flipbook.turn('page');
		$('.xs-pages-bottom .number').html(page);
	})
	// 封底
	$('[data-page="coverBack"]').click(function() {
		var total = flipbook.turn("pages");
		flipbook.turn("page", total);
		// 当前页数
		var page = flipbook.turn('page');
		$('.xs-pages-bottom .number').html(page);
	})
	// 上一页
	$('[data-page="previous"]').click(function() {
		flipbook.turn("previous");
		var page = flipbook.turn('page'); // 当前页数
		$('.xs-pages-bottom .number').html(page);
	})
	// 下一页
	$('[data-page="next"]').click(function() {
		flipbook.turn("next");
		var page = flipbook.turn('page'); // 当前页数
		$('.xs-pages-bottom .number').html(page);
	})
}


$(document).on("mousedown touchstart", "#jp_container_bgmusic", function(e) {
	// e.stopPropagation()
});
$(document).on("mousedown touchstart", function() {
	// bgmuplay()
});

function xsClick() {
	$('[xs-event]').click(function() {
		var ele = $(this).attr('xs-event');
		var flipbook = $('#flipbook');
		var totalPages = flipbook.turn("pages"); //总页数
		switch (ele) {
			case 'previous': // 上一页
				flipbook.turn("previous");
				break;
			case 'next': // 下一页
				flipbook.turn("next");
				break;
			case 'cover': // 封面
				flipbook.turn("page", 1);
				break;
			case 'coverBack': // 封底
				flipbook.turn("page", totalPages);
				break;
			case 'audio': // bgm
				console.log('audio');
				break;
		}
		var pageCurrent = flipbook.turn('page'); // 当前页数
		$('.xs-pages-bottom .number').html(pageCurrent);
	})
}
xsClick();