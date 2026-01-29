// +----------------------------------------------------------------------
// | xstudio [ Enabling Developers To Help Enterprises Develop ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2022 https://www.haisong.net All rights reserved.
// +----------------------------------------------------------------------
// | Licensed LPPL ( https://opensource.org/licenses/LPPL-1.3c )
// +----------------------------------------------------------------------
// | Author: XiaoSong <lianghaisong@gmail.com>
// +----------------------------------------------------------------------
$(document).ready(function() {
	// 获取滚动容器和内容
	var container = $('.scroll-container');
	var content = $('.scroll-content');

	// 获取内容的宽度和高度
	var contentWidth = content.width();
	var contentHeight = content.height();

	// 复制内容并添加到容器中
	content.clone().appendTo(container);

	// 设置容器的宽度和高度
	container.width(contentWidth);
	container.height(contentHeight);

	// 定义滚动函数
	function scroll(direction) {
		var distance;

		if (direction == 'up') {
			distance = contentHeight;
		} else if (direction == 'down') {
			distance = -contentHeight;
		} else if (direction == 'left') {
			distance = contentWidth;
		} else if (direction == 'right') {
			distance = -contentWidth;
		}
		console.log(container.scrollLeft());
		container.animate({
			scrollTop: '+=' + distance,
			scrollLeft: '+=' + distance
		}, 1000, function() {
			if (direction == 'up' && container.scrollTop() >= contentHeight) {
				container.scrollTop(0);
			} else if (direction == 'down' && container.scrollTop() == 0) {
				container.scrollTop(contentHeight);
			} else if (direction == 'left' && container.scrollLeft() >= contentWidth) {
				
				container.scrollLeft(0);
			} else if (direction == 'right' && container.scrollLeft() == 0) {
				container.scrollLeft(contentWidth);
			}
		});
	}

	// 定时滚动
	setInterval(function() {
		scroll('left');
	}, 300);
});
