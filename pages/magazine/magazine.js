$(document).ready(function() {
	flipbook.init();
})
var flipbook = {
	ele: '#flipbook',
	eleTotal: '.xs-pages-bottom .total', // 总页数dom
	eleNumber: '.xs-pages-bottom .number', //当前页数dom
	win: $(window),
	width: $(window).width(),
	height: $(window).height(),
	init: function() {
		this.turn();
		this.eventClick();
	},
	turn: function() {
		var $ele = $(flipbook.ele);
		$ele.turn({
			display: $.isTouch ? 'single' : 'double', //single:单页显示 double:双页显示
			cornerSize: 720,
			acceleration: true, // 是否启动硬件加速 如果为触摸设备必须为true
			gradients: true, // 是否显示翻页阴影效果
			autoCenter: false, // 自动居中, 默认false
			elevation: 50, // 转换期间页面的高度
			width: $.isTouch ? width : 1052,
			height: $.isTouch ? height - 55 - 50 : 720,
			duration: 500, // 翻页速度(毫秒), 默认600ms
			direction: 'ltr', //指定翻页电子书从左到右（DIR=ltr，默认值）或从右到左（DIR=rtl）的方向性。
			when: {
				// 翻页前触发
				turning: function(e, page, view) {

				},
				// 翻页后触发
				turned: function(e, page) {

				}
			}
		});
		var totalPages = $ele.turn("pages"); //总页数
		$(flipbook.eleTotal).html(totalPages);

		$ele.turn("peel", "br");
	},
	eventClick: function() {
		$('[xs-event]').click(function() {
			var ele = $(this).attr('xs-event');
			var $ele = $(flipbook.ele);
			switch (ele) {
				case 'previous': // 上一页
					$ele.turn("previous");
					break;
				case 'next': // 下一页
					$ele.turn("next");
					break;
				case 'cover': // 封面
					$ele.turn("page", 1);
					break;
				case 'coverBack': // 封底
					var totalPages = $ele.turn("pages"); //总页数
					$ele.turn("page", totalPages);
					break;
				case 'audio': // bgm
					console.log('audio');
					break;
			}
			var pageCurrent = $ele.turn('page'); // 当前页数
			$(flipbook.eleNumber).html(pageCurrent);
		})
	},

}
// left and right keyboard
$(window).bind('keydown', function(e) {
	var $ele = $(flipbook.ele);
	if (e.keyCode == 37) {
		$ele.turn('previous');
		var page = $ele.turn('page');
		$(flipbook.eleNumber).html(page);
	} else if (e.keyCode == 39) {
		$ele.turn('next');
		var page = $ele.turn('page');
		$(flipbook.eleNumber).html(page);
	}
});



// event();

function event() {
	flipbook.turn("zoom", 1);
	var zoom = flipbook.turn("zoom");
	alert("Current zoom: " + zoom);
}

$(document).on("mousedown touchstart", function(e) {
	// bgmuplay()
});