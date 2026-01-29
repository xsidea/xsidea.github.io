var api = {
	url: {

	},
	// 随机背景
	background: function() {
		var imgArrr = [
			'bg/1.webp', 'bg/2.webp', 'bg/3.webp', 'bg/4.webp', 'bg/5.webp',
			'bg/6.webp', 'bg/7.webp', 'bg/8.webp', 'bg/9.webp', 'bg/10.webp',
			'bg/11.webp', 'bg/12.webp', 'bg/13.webp', 'bg/14.webp', 'bg/15.webp',
			'bg/16.webp', 'bg/17.webp', 'bg/18.webp', 'bg/19.webp', 'bg/20.webp',
			'bg/21.webp', 'bg/22.webp', 'bg/23.webp', 'bg/24.webp', 'bg/25.webp',
			'bg/26.webp', 'bg/27.webp', 'bg/28.webp', 'bg/29.webp', 'bg/30.webp',
			'bg/31.webp', 'bg/32.webp', 'bg/33.webp', 'bg/34.webp', 'bg/35.webp'
		];
		var index = Math.floor((Math.random() * imgArrr.length));
		$('.xs-banner').css({
			'background-image': 'url(' + IMGROOT + imgArrr[index] + ')'
		});
	},
	// 一言 hitokoto.cn 
	hitokoto: function(options) {
		var defaults = {
			ele: '.hitokoto',
		};
		var opts = Object.assign({}, defaults, options);
		xs.ajax({
			url: 'https://v1.hitokoto.cn/',
			success: function(res) {
				$(opts.ele).html(res.hitokoto);
			}
		})
	}

}
