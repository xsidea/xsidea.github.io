var xs = {
	version: '1.1.3.20240229',
	init: function(options) {
		var defaults = {
			param: ''
		};
		var opts = Object.assign({}, defaults, options);
	},
	//获取时间戳
	timestamp: function() {
		return Date.parse(new Date()).toString().substr(0, 10);
	},
	//获取code
	code: function(data) {
		return xs.is.empty(data) ? xs.md5.res(config.apiKey + xs.timestamp()) : xs.md5.res(config.apiKey + data + xs.timestamp());
	},
	// 百度统计
	statistics: function() {
		var _hmt = _hmt || [];
		(function() {
			var hm = document.createElement("script");
			hm.src = "https://hm.baidu.com/hm.js?" + config.statistics;
			var s = document.getElementsByTagName("script")[0];
			s.parentNode.insertBefore(hm, s);
		})();
	},
	swiper: function(options) {
		var defaults = {
			obj: "",
			autoplay: true,
			delay: 4000,
			direction: 'horizontal', //horizontal , vertical
			loop: true,
			loopedSlides: 1,
			slidesPerView: 1,
			slidesPerColumn: 1,
			spaceBetween: 0,
			centeredSlides: true,
			freeMode: false,
		}
		var opts = $.extend(defaults, options);
		var myswiper = "swiper-" + xs.str.guid();
		if (typeof Swiper == 'undefined') return false;
		if (opts.autoplay) {
			opts.autoplay = {
				delay: opts.delay,
				stopOnLastSlide: false,
				disableOnInteraction: false
			}
		}
		myswiper = new Swiper(opts.obj, {
			slidesPerView: opts.slidesPerView,
			slidesPerColumn: opts.slidesPerColumn,
			spaceBetween: opts.spaceBetween,
			centeredSlides: opts.centeredSlides,
			loopedSlides: opts.loopedSlides,
			direction: opts.direction,
			autoplay: opts.autoplay,
			loop: opts.loop,
			roundLengths: true, //将slide的宽和高取整(四舍五入)
			freeMode: opts.freeMode,
			grid: {
				rows: opts.rows,
			},
			navigation: {
				nextEl: opts.obj + ' .swiper-button-next',
				prevEl: opts.obj + ' .swiper-button-prev',
			},
			pagination: {
				el: opts.obj + ' .swiper-pagination',
				clickable: true,
			}
		});

		myswiper.on('slideChange', function() {

		});
	},
	url: {
		// 当前网址
		herf: function() {
			var pages = getCurrentPages(); // 当前页
			var prevPage = pages[pages.length - 2]; //上个页面
			return pages.route;
		},
		//获取URL传递的参数
		param: function(name) {
			let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
		/**
		 * 对象转url参数
		 * @param {*} data,对象
		 * @param {*} isPrefix,是否自动加上"?"
		 */
		params: function(data = {}, isPrefix = true, arrayFormat = 'brackets') {
			let prefix = isPrefix ? '?' : ''
			let _result = []
			if (['indices', 'brackets', 'repeat', 'comma'].indexOf(arrayFormat) == -1) arrayFormat = 'brackets';
			for (let key in data) {
				let value = data[key]
				// 去掉为空的参数
				if (['', undefined, null].indexOf(value) >= 0) {
					continue;
				}
				// 如果值为数组，另行处理
				if (value.constructor === Array) {
					// e.g. {ids: [1, 2, 3]}
					switch (arrayFormat) {
						case 'indices':
							// 结果: ids[0]=1&ids[1]=2&ids[2]=3
							for (let i = 0; i < value.length; i++) {
								_result.push(key + '[' + i + ']=' + value[i])
							}
							break;
						case 'brackets':
							// 结果: ids[]=1&ids[]=2&ids[]=3
							value.forEach(_value => {
								_result.push(key + '[]=' + _value)
							})
							break;
						case 'repeat':
							// 结果: ids=1&ids=2&ids=3
							value.forEach(_value => {
								_result.push(key + '=' + _value)
							})
							break;
						case 'comma':
							// 结果: ids=1,2,3
							let commaStr = "";
							value.forEach(_value => {
								commaStr += (commaStr ? "," : "") + _value;
							})
							_result.push(key + '=' + commaStr)
							break;
						default:
							value.forEach(_value => {
								_result.push(key + '[]=' + _value)
							})
					}
				} else {
					_result.push(key + '=' + value)
				}
			}
			return _result.length ? prefix + _result.join('&') : ''
		}
	},
	//本地缓存
	storage: {
		cookie: {
			set: function(val) {
				return xs.storage.set(config.request.cookieStorage, val);
			},
			get: function() {
				return xs.storage.get(config.request.cookieStorage);
			},
			clear: function() {
				return xs.storage.clear(config.request.cookieStorage);
			}
		},
		//获取token
		token: {
			set: function(val) {
				return xs.storage.set(config.request.tokenStorage, val);
			},
			get: function() {
				return xs.storage.get(config.request.tokenStorage);
			},
			clear: function() {
				return xs.storage.clear(config.request.tokenStorage);
			}
		},
		// config
		config: {
			set: function(key, val) {
				return xs.storage.set(config.request.configStorage, val);
			},
			get: function(key) {
				return xs.storage.get(config.request.configStorage) ? storage.get(config.configStorage)[key] : '';
			},
			clear: function() {
				return xs.storage.clear(config.request.configStorage);
			}
		},
		// memberinfo
		member: {
			set: function(val) {
				return xs.storage.set(config.request.memberStorage, val);
			},
			get: function() {
				return xs.storage.get(config.request.memberStorage);
			},
			clear: function() {
				return xs.storage.clear(config.request.memberStorage);
			}
		},
		set(key, value) {
			if (xs.is.empty(key) || xs.is.empty(value)) return false;
			value = JSON.stringify(value);
			try {
				return localStorage.setItem(key, value);
			} catch (e) {
				return null
			}
			
		},
		get(key) {
			if (xs.is.empty(key)) return false;
			try {
				var value = localStorage.getItem(key);
				if (xs.is.json(value)) {
					return JSON.parse(value);
				} else {
					return value;
				}
			} catch (err) {
				return null
			}
			return value;
		},
		remove(key) {
			return localStorage.removeItem(key);
		},
		clear(key) {
			if (xs.is.empty(key)) {
				return localStorage.clear();
			} else {
				try {
					return localStorage.removeItem(key);
				} catch (e) {
					return null
				}
			}
		}
	},
	//数组
	array: {
		//排序 type asc:升序 desc:降序
		sort: function(arr, type) {
			var tmp;
			for (let i = 0; i < arr.length; i++) {
				for (let j = 0; j < arr.length; j++) {
					if (type == 'desc') {
						if (arr[j] < arr[j + 1]) {
							tmp = arr[j];
							arr[j] = arr[j + 1];
							arr[j + 1] = tmp;
						}
					} else {
						if (arr[j] > arr[j + 1]) {
							tmp = arr[j];
							arr[j] = arr[j + 1];
							arr[j + 1] = tmp;
						}
					}
				}
			}
			return arr;
		},
		//去重
		removal: function(arr) {
			var tmpArray = [];
			for (var i = 0; i < arr.length; i++) {
				if (tmpArray.indexOf(arr[i]) == -1) {
					tmpArray.push(arr[i]);
				}
			}
			return tmpArray;
		},
		//过滤
		filter: function(arr, val) {
			var tmpArray = [];
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].toString().indexOf(val) != -1) {
					tmpArray.push(arr[i]);
				}
			}
			return tmpArray;
		},
		// 将扁平化数据转换成树形 pid默认0
		buildTree: function(data, pid = 0) {
			let tree = [];
			let children = data.filter(item => item.pid === pid);
			for (let child of children) {
				child.children = xs.array.buildTree(data, child.id);
				tree.push(child);
			}
			return tree;
		},
		// 将‘,’分隔的字符串转换成数组
		convertToArray(str, split) {
			split = xs.is.empty(split) ? ',' : split;
			return str.split(split);
		}
	},
	str: {
		objectToParams: function(obj) {
			return Object.keys(obj).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join('&');
		},
		// 千位分隔符 一般用于金额格式化
		money: function(num) {
			if (isNaN(num)) return num;
			num = typeof(num) === 'number' ? num.toFixed(2) : typeof(num) === 'string' ? (Math.round(parseFloat(num) * 100) / 100) : 0; // 如果是数字则四舍五入到并保留2位
			var newNum = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return newNum;
		},
		//分割字符串为数组
		toArray: function(str, split) {
			split = xs.is.empty(split) ? ',' : split;
			var tmpArr = xs.is.empty(str) ? str : str.split(split);
			return tmpArr;
		},
		//删除最后一个字符
		delChar: function(source, str) {
			if (xs.is.empty(source)) return false;
			str = xs.is.empty(str) ? ',' : str;
			source = (source.substring(source.length - 1) == str) ? source.substring(0, source.length - 1) : source;
			return source;
		},
		//去除所有html标签
		delHtml: function(str) {
			var str = str.replace(/<\/?.+?>/g, ""); //去除所有HTML标签
			str = str.replace(/&nbsp;/ig, "");
			str = str.replace(/^[" "||"　"]*/, "").replace(/[" "|"　"]*$/, ""); // 去除头和尾
			str = str.replace(/\s/g, ''); //去除所有空格
			str = str.replace(/(\s*$)/g, ""); //去除右边所有空格
			return str;
		},
		//去除字符空格
		trim: function(str, pos = 'both') {
			str = str.replace(/\&nbsp;/g, '');

			if (pos == 'both') {
				return str.replace(/^\s+|\s+$/g, ""); // 前后
			} else if (pos == "left") {
				return str.replace(/^\s*/, ''); // 前
			} else if (pos == 'right') {
				return str.replace(/(\s*$)/g, ""); // 后
			} else if (pos == 'all') {
				return str.replace(/\s+/g, ""); // 所有
			} else {
				return str;
			}
		},
		//替换特殊字符
		special: function(str) {
			if (xs.is.empty(str)) return false;
			let pattern = /[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？]/g;
			return str.replace(pattern, "");
		},
		//获取字符串长度
		length: function(str) {
			var realLength = 0,
				len = str.length,
				charCode = -1;
			for (var i = 0; i < len; i++) {
				charCode = str.charCodeAt(i);
				if (charCode >= 0 && charCode <= 128) realLength += 1;
				else realLength += 2;
			}
			return realLength;
		},
		//截取字符串 一个中文为2个长度
		substr: function(str, len, ellipsis) {
			if (!str || str == '') return '';
			var ellipsis = false,
				strlen = 0,
				result = "";
			for (var i = 0; i < str.length; i++) {
				if (strlen >= len) {
					if (ellipsis) {
						return result + "...";
					} else {
						return result;
					}
				}
				if (str.charCodeAt(i) > 128) {
					strlen += 2;
				} else {
					strlen++;
				}
				result += str.charAt(i);
			}
			return result;
		},
		//生成随机数
		random: function(num) {
			var chars = ['2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
			var result = "";
			for (var i = 0; i < num; i++) {
				var id = Math.ceil(Math.random() * 35);
				result += chars[id];
			}
			return result;
		},
		/**
		 * 本算法来源于简书开源代码，详见：https://www.jianshu.com/p/fdbf293d0a85
		 * 全局唯一标识符（uuid，Globally Unique Identifier）,也称作 uuid(Universally Unique IDentifier) 
		 * 一般用于多个组件之间,给它一个唯一的标识符,或者v-for循环的时候,如果使用数组的index可能会导致更新列表出现问题
		 * 最可能的情况是左滑删除item或者对某条信息流"不喜欢"并去掉它的时候,会导致组件内的数据可能出现错乱
		 * v-for的时候,推荐使用后端返回的id而不是循环的index
		 * @param {Number} len uuid的长度
		 * @param {Boolean} firstU 将返回的首字母置为"xs"
		 * @param {Number} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
		 */
		guid: function(len = 32, firstU = true, radix = null) {
			let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
			let uuid = [];
			radix = radix || chars.length;

			if (len) {
				// 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
				for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
			} else {
				let r;
				// rfc4122标准要求返回的uuid中,某些位为固定的字符
				uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
				uuid[14] = '4';

				for (let i = 0; i < 36; i++) {
					if (!uuid[i]) {
						r = 0 | Math.random() * 16;
						uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
					}
				}
			}
			// 移除第一个字符,并用u替代,因为第一个字符为数值时,该guid不能用作id或者class
			if (firstU) {
				uuid.shift();
				return 'xs' + uuid.join('');
			} else {
				return uuid.join('');
			}
		},

		// 隐藏手机号中间4个字符
		strSub: function(str) {
			var reg = /^(\d{3})\d{4}(\d{4})$/;
			return str.replace(reg, "$1****$2");
		},
	},
	is: {
		//是否是微信
		weixin: function() {
			var UA = window.navigator.userAgent.toLowerCase();
			if (UA.match(/microMessenger/i) == 'micromessenger') {
				return true;
			} else {
				return false;
			}
		},
		//是否为空
		empty: function(value) {
			switch (typeof value) {
				case 'undefined':
					return true;
				case 'string':
					if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
					break;
				case 'boolean':
					if (!value) return true;
					break;
				case 'number':
					if (0 === value || isNaN(value)) return true;
					break;
				case 'object':
					if (null === value || value.length === 0) return true;
					for (var i in value) {
						return false;
					}
					return true;
			}
			return false;
		},
		//是否对象
		object: function(data) {
			return Object.prototype.toString.call(data) === '[object Object]';
		},
		//是否空对象
		emptyObject: function(data) {
			return xs.is.object(data) && Object.keys(data).length === 0;
		},
		//是否包含HTTP type:1 当前网址
		http: function(str, type) {
			str = type == 1 ? window.location.href : str;
			var Expression = /(http|https):\/\/([\w.]+\/?)\S*/;
			var objExp = new RegExp(Expression);
			if (objExp.test(str) == true) {
				return true;
			} else {
				return false;
			}
		},
		// 是否图片
		image: function(str) {
			var reg = /\.(png|jpg|gif|jpeg|bmp|webp)$/;
			return reg.test(str);
		},
		// 是否视频
		video: function(str) {
			const ext = ['webm', 'mp4', 'ogg', 'mov'];
			const extension = str.split('.').pop().toLowerCase(); // 获取扩展名
			return ext.includes(extension);
		},
		//是否json字符串
		json: function(str) {
			if (typeof str == 'string') {
				try {
					var obj = JSON.parse(str);
					if (typeof obj == 'object' && obj) {
						return true;
					} else {
						return false;
					}
				} catch (e) {
					return false;
				}
			}
			return false;
		},
	},
	// 格式化
	date: {
		//获取最近day天的日期和礼拜天数
		dateData: function(param) {
			//小于10补0
			var strFormat = function(str) {
				return str < 10 ? `0${str}` : str
			};
			var timeStamp = function(time) {
				const dates = new Date(time)
				const year = dates.getFullYear()
				const month = dates.getMonth() + 1
				const date = dates.getDate()
				const day = dates.getDay()
				const hour = dates.getHours()
				const min = dates.getMinutes()
				const days = ['日', '一', '二', '三', '四', '五', '六']
				// 在uni-app中获取系统信息
				const systemInfo = uni.getSystemInfoSync();
				return {
					//注:此处ios系统如"-"分割无法显示,只能用"/"分割符
					allDate: `${year}/${strFormat(month)}/${strFormat(date)}`,
					date: `${strFormat(month)}/${strFormat(date)}`, //返回的日期 07-01
					day: `${strFormat(date)}`, //返回的日期 07-01
					week: `周${days[day]}`, //返回的礼拜天数  星期一
					hour: strFormat(hour) + ':' + strFormat(min) //返回的时钟 08:00
				}
			};
			const time = []
			const date = new Date()
			const now = date.getTime() //获取当前日期的时间戳
			let timeStr = 3600 * 24 * 1000 //一天的时间戳
			param = xs.regExp.num(param) ? param : 7;

			for (let i = 0; i < param; i++) {
				const timeObj = {}
				timeObj.allDate = timeStamp(now + timeStr * i).allDate //日期
				timeObj.date = timeStamp(now + timeStr * i).date //保存日期
				timeObj.day = timeStamp(now + timeStr * i).day //保存日期
				timeObj.timeStamp = now + timeStr * i //保存时间戳
				if (i == 0) {
					timeObj.week = '今天'
				} else if (i == 1) {
					timeObj.week = '明天'
				} else if (i == 2) {
					timeObj.week = '后天'
				} else {
					timeObj.week = timeStamp(now + timeStr * i).week
				}
				time.push(timeObj)
			}
			return time
		},
		// 获取days天后的日期
		adjust: function(date, days = 0) {
			if (arguments.length < 2) {
				console.log('参数格式错误');
			} else if (typeof date === 'string') {
				date = new Date(date);
			}

			if (!(date instanceof Date)) {
				console.log('参数格式错误');
				return;
			}
			const newDate = new Date(date.getTime());
			newDate.setDate(date.getDate() + days);
			const y = newDate.getFullYear();
			const m = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1;
			const d = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate();
			return {
				year: y,
				month: m,
				date: xs.date.format(newDate),
				day: newDate.getDay()
			};
		},
		//时间戳格式化
		format: function(dateTime = null, format = 'yyyy-MM-dd') {
			// 如果为null,则格式化当前时间
			if (!dateTime) dateTime = Number(new Date());
			// 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
			if (dateTime.toString().length == 10) dateTime *= 1000;
			var time = new Date(dateTime);
			var o = {
				"M+": time.getMonth() + 1, //月份
				"d+": time.getDate(), //日
				"h+": time.getHours(), //小时
				"m+": time.getMinutes(), //分
				"s+": time.getSeconds(), //秒
				"q+": Math.floor((time.getMonth() + 3) / 3), //季度
				"S": time.getMilliseconds() //毫秒
			};
			if (/(y+)/.test(format)) format = (format).replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o) {
				if (new RegExp("(" + k + ")").test(format)) {
					format = (format).replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				}
			}
			return format;
		},
		// 欢迎词
		welcome(date) {
			date = xs.is.empty(date) ? new Date() : date;
			const hour = new Date(date).getHours();
			if (hour < 6) return '凌晨好';
			else if (hour < 9) return '早上好';
			else if (hour < 12) return '上午好';
			else if (hour < 14) return '中午好';
			else if (hour < 17) return '下午好';
			else if (hour < 19) return '傍晚好';
			else if (hour < 22) return '晚上好';
			else return '夜里好';
		},
		// 时间戳为几分钟前
		timeAgo: function(unixtime) {
			var currTime = Date.parse(new Date());
			var time = ((parseInt(currTime) / 1000) - parseInt(unixtime));
			if (time < 0) {
				// 少于一分钟 
				if (time < 60) {
					return "等等";
				}

				// 秒转分钟 
				var minuies = time / 60;
				if (minuies < 60) {
					return Math.floor(minuies) + "分钟后";
				}
				// 秒转小时 
				var hours = time / 3600;
				if (hours < 24) {
					return Math.floor(hours) + "小时后";
				}
				//秒转天数 
				var days = time / 3600 / 24;
				if (days < 30) {
					return Math.floor(days) + "天后";
				}
				//秒转月 
				var months = time / 3600 / 24 / 30;
				if (months < 12) {
					return Math.floor(months) + "月后";
				}
				//秒转年 
				var years = time / 3600 / 24 / 30 / 12;
				return Math.floor(years) + "年后";
			} else {
				time = Math.abs(time);
				// 少于一分钟 
				if (time < 60) {
					return "刚刚";
				}
				// 秒转分钟 
				var minuies = time / 60;
				if (minuies < 60) {
					return Math.floor(minuies) + "分钟前";
				}
				// 秒转小时 
				var hours = time / 3600;
				if (hours < 24) {
					return Math.floor(hours) + "小时前";
				}
				//秒转天数 
				var days = time / 3600 / 24;
				if (days < 30) {
					return Math.floor(days) + "天前";
				}
				//秒转月 
				var months = time / 3600 / 24 / 30;
				if (months < 12) {
					return Math.floor(months) + "月前";
				}
				//秒转年 
				var years = time / 3600 / 24 / 30 / 12;
				return Math.floor(years) + "年前";
			}
		}
	},
	image: {
		base64: function(options) {
			var defaults = {
				image: '',
				type: 'png', // png jpeg bmp
			};
			var opts = Object.assign({}, defaults, options);
			const fileContent = uni.getFileSystemManager().readFile({
				filePath: opts.image,
				encoding: 'base64', // 这里指定编码为base64  
				success: function(res) {
					typeof opts.success == 'function' && opts.success('data:image/' + opts.type + ';base64,' + res.data)
				}
			});
		}
	},
	//MD5加密
	md5: {
		safe_add: function(x, y) {
			var lsw = (x & 0xFFFF) + (y & 0xFFFF)
			var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
			return (msw << 16) | (lsw & 0xFFFF)
		},
		rol: function(num, cnt) {
			return (num << cnt) | (num >>> (32 - cnt))
		},
		cmn: function(q, a, b, x, s, t) {
			return xs.md5.safe_add(xs.md5.rol(xs.md5.safe_add(xs.md5.safe_add(a, q), xs.md5.safe_add(x, t)), s),
				b)
		},
		ff: function(a, b, c, d, x, s, t) {
			return xs.md5.cmn((b & c) | ((~b) & d), a, b, x, s, t)
		},
		gg: function(a, b, c, d, x, s, t) {
			return xs.md5.cmn((b & d) | (c & (~d)), a, b, x, s, t)
		},
		hh: function(a, b, c, d, x, s, t) {
			return xs.md5.cmn(b ^ c ^ d, a, b, x, s, t)
		},
		ii: function(a, b, c, d, x, s, t) {
			return xs.md5.cmn(c ^ (b | (~d)), a, b, x, s, t)
		},
		core: function(x) {
			var a = 1732584193
			var b = -271733879
			var c = -1732584194
			var d = 271733878
			for (var i = 0; i < x.length; i += 16) {
				var olda = a
				var oldb = b
				var oldc = c
				var oldd = d
				a = xs.md5.ff(a, b, c, d, x[i + 0], 7, -680876936)
				d = xs.md5.ff(d, a, b, c, x[i + 1], 12, -389564586)
				c = xs.md5.ff(c, d, a, b, x[i + 2], 17, 606105819)
				b = xs.md5.ff(b, c, d, a, x[i + 3], 22, -1044525330)
				a = xs.md5.ff(a, b, c, d, x[i + 4], 7, -176418897)
				d = xs.md5.ff(d, a, b, c, x[i + 5], 12, 1200080426)
				c = xs.md5.ff(c, d, a, b, x[i + 6], 17, -1473231341)
				b = xs.md5.ff(b, c, d, a, x[i + 7], 22, -45705983)
				a = xs.md5.ff(a, b, c, d, x[i + 8], 7, 1770035416)
				d = xs.md5.ff(d, a, b, c, x[i + 9], 12, -1958414417)
				c = xs.md5.ff(c, d, a, b, x[i + 10], 17, -42063)
				b = xs.md5.ff(b, c, d, a, x[i + 11], 22, -1990404162)
				a = xs.md5.ff(a, b, c, d, x[i + 12], 7, 1804603682)
				d = xs.md5.ff(d, a, b, c, x[i + 13], 12, -40341101)
				c = xs.md5.ff(c, d, a, b, x[i + 14], 17, -1502002290)
				b = xs.md5.ff(b, c, d, a, x[i + 15], 22, 1236535329)
				a = xs.md5.gg(a, b, c, d, x[i + 1], 5, -165796510)
				d = xs.md5.gg(d, a, b, c, x[i + 6], 9, -1069501632)
				c = xs.md5.gg(c, d, a, b, x[i + 11], 14, 643717713)
				b = xs.md5.gg(b, c, d, a, x[i + 0], 20, -373897302)
				a = xs.md5.gg(a, b, c, d, x[i + 5], 5, -701558691)
				d = xs.md5.gg(d, a, b, c, x[i + 10], 9, 38016083)
				c = xs.md5.gg(c, d, a, b, x[i + 15], 14, -660478335)
				b = xs.md5.gg(b, c, d, a, x[i + 4], 20, -405537848)
				a = xs.md5.gg(a, b, c, d, x[i + 9], 5, 568446438)
				d = xs.md5.gg(d, a, b, c, x[i + 14], 9, -1019803690)
				c = xs.md5.gg(c, d, a, b, x[i + 3], 14, -187363961)
				b = xs.md5.gg(b, c, d, a, x[i + 8], 20, 1163531501)
				a = xs.md5.gg(a, b, c, d, x[i + 13], 5, -1444681467)
				d = xs.md5.gg(d, a, b, c, x[i + 2], 9, -51403784)
				c = xs.md5.gg(c, d, a, b, x[i + 7], 14, 1735328473)
				b = xs.md5.gg(b, c, d, a, x[i + 12], 20, -1926607734)
				a = xs.md5.hh(a, b, c, d, x[i + 5], 4, -378558)
				d = xs.md5.hh(d, a, b, c, x[i + 8], 11, -2022574463)
				c = xs.md5.hh(c, d, a, b, x[i + 11], 16, 1839030562)
				b = xs.md5.hh(b, c, d, a, x[i + 14], 23, -35309556)
				a = xs.md5.hh(a, b, c, d, x[i + 1], 4, -1530992060)
				d = xs.md5.hh(d, a, b, c, x[i + 4], 11, 1272893353)
				c = xs.md5.hh(c, d, a, b, x[i + 7], 16, -155497632)
				b = xs.md5.hh(b, c, d, a, x[i + 10], 23, -1094730640)
				a = xs.md5.hh(a, b, c, d, x[i + 13], 4, 681279174)
				d = xs.md5.hh(d, a, b, c, x[i + 0], 11, -358537222)
				c = xs.md5.hh(c, d, a, b, x[i + 3], 16, -722521979)
				b = xs.md5.hh(b, c, d, a, x[i + 6], 23, 76029189)
				a = xs.md5.hh(a, b, c, d, x[i + 9], 4, -640364487)
				d = xs.md5.hh(d, a, b, c, x[i + 12], 11, -421815835)
				c = xs.md5.hh(c, d, a, b, x[i + 15], 16, 530742520)
				b = xs.md5.hh(b, c, d, a, x[i + 2], 23, -995338651)
				a = xs.md5.ii(a, b, c, d, x[i + 0], 6, -198630844)
				d = xs.md5.ii(d, a, b, c, x[i + 7], 10, 1126891415)
				c = xs.md5.ii(c, d, a, b, x[i + 14], 15, -1416354905)
				b = xs.md5.ii(b, c, d, a, x[i + 5], 21, -57434055)
				a = xs.md5.ii(a, b, c, d, x[i + 12], 6, 1700485571)
				d = xs.md5.ii(d, a, b, c, x[i + 3], 10, -1894986606)
				c = xs.md5.ii(c, d, a, b, x[i + 10], 15, -1051523)
				b = xs.md5.ii(b, c, d, a, x[i + 1], 21, -2054922799)
				a = xs.md5.ii(a, b, c, d, x[i + 8], 6, 1873313359)
				d = xs.md5.ii(d, a, b, c, x[i + 15], 10, -30611744)
				c = xs.md5.ii(c, d, a, b, x[i + 6], 15, -1560198380)
				b = xs.md5.ii(b, c, d, a, x[i + 13], 21, 1309151649)
				a = xs.md5.ii(a, b, c, d, x[i + 4], 6, -145523070)
				d = xs.md5.ii(d, a, b, c, x[i + 11], 10, -1120210379)
				c = xs.md5.ii(c, d, a, b, x[i + 2], 15, 718787259)
				b = xs.md5.ii(b, c, d, a, x[i + 9], 21, -343485551)
				a = xs.md5.safe_add(a, olda)
				b = xs.md5.safe_add(b, oldb)
				c = xs.md5.safe_add(c, oldc)
				d = xs.md5.safe_add(d, oldd)
			}
			return [a, b, c, d]
		},
		binl2hex: function(binarray) {
			var hex_tab = "0123456789abcdef"
			var str = ""
			for (var i = 0; i < binarray.length * 4; i++) {
				str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[
					i >> 2] >> ((i %
					4) * 8)) & 0xF)
			}
			return str
		},
		str2binl: function(str) {
			var nblk = ((str.length + 8) >> 6) + 1
			var blks = new Array(nblk * 16)
			for (var i = 0; i < nblk * 16; i++) blks[i] = 0
			for (var i = 0; i < str.length; i++)
				blks[i >> 2] |= (str.charCodeAt(i) & 0xFF) << ((i % 4) * 8)
			blks[i >> 2] |= 0x80 << ((i % 4) * 8)
			blks[nblk * 16 - 2] = str.length * 8
			return blks
		},
		res: function(str) {
			return xs.md5.binl2hex(xs.md5.core(xs.md5.str2binl(str)))
		}
	},

};

// 滚动条距离顶部100px时，添加active
document.addEventListener('DOMContentLoaded', function() {
	if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
		$('.xs-header').addClass("active");
	} else {
		$('.xs-header').removeClass("active");
	}
	window.onscroll = function() {
		if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
			$('.xs-header').addClass("active");
		} else {
			$('.xs-header').removeClass("active");
		}
	};
});