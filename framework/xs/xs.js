/**
 * xs工具类
 * @namespace xs
 */
const xs = {
	/**
	 * 打开页面
	 * @param {string} url
	 * @param {string} type switchTab:跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
	 * @param {string} type reLaunch:关闭所有页面，打开到应用内的某个页面
	 * @param {string} type redirectTo:关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面
	 * @param {string} type navigateTo:保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面
	 * @param {function} success
	 * @param {function} fail
	 */
	open: function(options) {
		var defaults = {
			url: '',
			type: 'navigateTo'
		};
		var opts = Object.assign({}, defaults, options);
		if (!xs.is.empty(opts.url)) {
			switch (opts.type) {
				case 'switchTab':
					uni.switchTab({
						url: opts.url,
						success: function() {
							typeof opts.success === 'function' && opts.success(opts);
						},
						fail: function() {
							typeof opts.fail === 'function' && opts.fail(opts);
						}
					})
					break;
				case 'reLaunch':
					uni.reLaunch({
						url: opts.url,
						success: function() {
							typeof opts.success === 'function' && opts.success(opts);
						},
						fail: function() {
							typeof opts.fail === 'function' && opts.fail(opts);
						}
					})
					break;
				case 'redirectTo':
					uni.redirectTo({
						url: opts.url,
						success: function(res) {
							typeof opts.success === 'function' && opts.success(opts);
						},
						fail: function() {
							typeof opts.fail === 'function' && opts.fail(opts);
						}
					})
					break;
				case 'navigateTo':
					uni.navigateTo({
						url: opts.url,
						success: function() {
							typeof opts.success === 'function' && opts.success(opts);
						},
						fail: function() {
							typeof opts.fail === 'function' && opts.fail(opts);
						}
					})
					break;
			}
		}
	},
	/**
	 * 获取时间戳
	 * @param {number} [num=10] - 时间戳长度,默认10位
	 * @return {string} 时间戳字符串
	 */
	timestamp: (num = 10) => {
		num = parseInt(num) >= 13 ? 13 : 10;
		return Date.now().toString().substr(0, num);
	},
	/**
	 * 获取code
	 * @param {string} [data] - 附加数据
	 * @return {string} 生成的code
	 */
	code: (data) => {
		const code = xs.crypto.md5(config.companyKey + xs.timestamp());
		const codeData = xs.crypto.md5(config.companyKey + data + xs.timestamp());
		return xs.is.empty(data) ? code : codeData;
	},
	/**
	 * 发送网络请求
	 * @param {Object} options - 请求配置选项
	 * @return {Promise} 返回一个Promise对象
	 */
	request: function(options) {
		// 默认配置
		var defaults = {
			url: '',
			method: 'GET',
			dataType: 'json',
			data: {},
			header: {
				"Content-Type": "application/json"
			},
			loading: true,
			setCookie: false, // 登录时是否保存cookie
			cookie: false, // 提交时是否使用cookie
			timeout: 6 * 1000,
			success: null,
			fail: null
		};
		// 合并用户配置和默认配置
		let opts = Object.assign({}, defaults, options);
		// 处理三网平台参数
		let platform = config.platform == 'default' ? '&companyid=' + config.companyid + '&code=' + xs.code(opts
			.code) + '&timestamp=' + xs.timestamp() : '';
		// 构建完整的请求URL
		let ajaxurl = /^http(s*):\/\//.test(opts.url) ? opts.url : config.apiUrl + opts.url + platform;
		// 添加token到请求头
		config.request.tokenName === false ? '' : opts.header[config.request.tokenName] = xs.storage.token
			.get();
		// 如果需要，添加cookie到请求头
		if (opts.cookie) opts.header['cookie'] = xs.storage.cookie.get();
		// 对POST请求设置特定的Content-Type
		if (opts.method.toLowerCase() == 'post') opts.header['Content-Type'] =
			'application/x-www-form-urlencoded';
		// 如果需要，显示加载动画
		opts.loading && xs.layer.showLoading();
		// 返回Promise对象
		return new Promise(function(resolve, reject) {
			uni.request({
				url: ajaxurl, // 完整的请求URL
				method: opts.method, // 请求方法（GET、POST等）
				data: opts.data, // 请求数据
				header: opts.header, // 请求头
				dataType: opts.dataType, // 预期服务器返回的数据类型
				timeout: opts.timeout, // 请求超时时间（毫秒）
				withCredentials: true, // 跨域请求时是否携带凭证（cookies）
				crossDomain: true, // 是否允许跨域请求
				success: (res) => {
					// 处理Cookie
					if (opts.setCookie && res.header["Set-Cookie"].length > 200) {
						let cookie = res.header["Set-Cookie"];
						cookie = cookie.replace(/path=\/,/g, "")
							.replace(/path=\/;/g, "")
							.replace(/path=\//g, "")
							.replace(/HttpOnly,/g, "")
							.replace(/\s+/g, "");
						xs.storage.cookie.set(cookie);
					}
					// 从配置中获取响应相关的字段名
					var codeName = config.response.statusName;
					var statusCode = config.response.statusCode;
					var msgName = config.response.msgName;
					var dataName = config.response.dataName;
					// 401
					if (res.statusCode === 401) {
						if (typeof opts.error == 'function') {
							opts.error(res.data);
						} else {
							xs.layer.toast({
								msg: '登录失效，请重新登录',
								success: function() {
									xs.open({
										type: 'switchTab',
										url: '/pages/index/member'
									})
								}
							});
						}
						return false;
					} else if (res.statusCode === 200) {
						// 返回的数据不规范则调用callback
						if (opts.callback) {
							resolve(res);
							typeof opts.callback == 'function' && opts.callback(res.data);
						} else {
							// code == 200
							if (res.data[codeName] == statusCode) {
								resolve(res.data);
								typeof opts.success == 'function' && opts.success(res.data[
									dataName]);
							} else {
								resolve(res.data);
								typeof opts.fail == 'function' ? opts.fail(res.data) : xs
									.layer.toast({
										msg: res.data[msgName] || ''
									});
							}
						}
					}
				},
				fail: (res) => {
					opts.error && opts.error(res);
					xs.layer.toast({
						msg: '请求失败,请联系管理员'
					});
					reject(res);
				},
				complete: (res) => {
					// 隐藏加载动画
					opts.loading && xs.layer.hideLoading();
					opts.complete && opts.complete(res);
				}
			})

		})
	},
	/**
	 * 算法工具集
	 * @namespace xs.algo
	 */
	algo: {
		_boundaryCheckingState: true, // 是否进行越界检查的全局开关
		/**
		 * 把错误的数据转正
		 * @private
		 * @example strip(0.09999999999999998)=0.1
		 */
		strip: function(num, precision = 15) {
			return +parseFloat(Number(num).toPrecision(precision));
		},
		/**
		 * 返回数字的数字长度
		 * @private
		 * @param {*number} num Input number
		 */
		digitLength: function(num) {
			const eSplit = num.toString().split(/[eE]/);
			const len = (eSplit[0].split('.')[1] || '').length - +(eSplit[1] || 0);
			return len > 0 ? len : 0;
		},
		/**
		 * 把递归操作扁平迭代化
		 * @param {number[]} arr 要操作的数字数组
		 * @param {function} operation 迭代操作
		 * @private
		 */
		iteratorOperation: function(arr, operation) {
			const [num1, num2, ...others] = arr;
			let res = operation(num1, num2);

			others.forEach((num) => {
				res = operation(res, num);
			});

			return res;
		},
		/**
		 * 把小数转成整数,如果是小数则放大成整数
		 * @private
		 * @param {*number} num 输入数
		 */
		float2Fixed: function(num) {
			if (num.toString().indexOf('e') === -1) {
				return Number(num.toString().replace('.', ''));
			}
			const dLen = xs.algo.digitLength(num);
			return dLen > 0 ? strip(Number(num) * Math.pow(10, dLen)) : Number(num);
		},
		/**
		 * 检测数字是否越界，如果越界给出提示
		 * @private
		 * @param {*number} num 输入数
		 */
		checkBoundary: function(num) {
			if (xs.algo._boundaryCheckingState) {
				if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
					console.warn(`${num} 超出了精度限制，结果可能不正确`);
				}
			}
		},
		/**
		 * 加
		 */
		plus: function(...nums) {
			if (nums.length > 2) {
				return xs.algo.iteratorOperation(nums, plus);
			}
			const [num1, num2] = nums;
			// 取最大的小数位
			const baseNum = Math.pow(10, Math.max(xs.algo.digitLength(num1), xs.algo.digitLength(num2)));
			// 把小数都转为整数然后再计算
			return (xs.algo.times(num1, baseNum) + xs.algo.times(num2, baseNum)) / baseNum;
		},

		/**
		 * 減
		 */
		minus: function(...nums) {
			if (nums.length > 2) {
				return xs.algo.iteratorOperation(nums, minus);
			}
			const [num1, num2] = nums;
			const baseNum = Math.pow(10, Math.max(xs.algo.digitLength(num1), xs.algo.digitLength(num2)));
			return (xs.algo.times(num1, baseNum) - xs.algo.times(num2, baseNum)) / baseNum;
		},
		/**
		 * 乘
		 */
		times: function(...nums) {
			if (nums.length > 2) {
				return xs.algo.iteratorOperation(nums, times);
			}
			const [num1, num2] = nums;
			const num1Changed = xs.algo.float2Fixed(num1);
			const num2Changed = xs.algo.float2Fixed(num2);
			const baseNum = xs.algo.digitLength(num1) + xs.algo.digitLength(num2);
			const leftValue = num1Changed * num2Changed;
			xs.algo.checkBoundary(leftValue);
			return leftValue / Math.pow(10, baseNum);
		},
		/**
		 * 除
		 */
		divide: function(...nums) {
			if (nums.length > 2) {
				return xs.algo.iteratorOperation(nums, divide);
			}

			const [num1, num2] = nums;
			const num1Changed = xs.algo.float2Fixed(num1);
			const num2Changed = xs.algo.float2Fixed(num2);
			xs.algo.checkBoundary(num1Changed);
			xs.algo.checkBoundary(num2Changed);
			// 重要，这里必须用strip进行修正
			return xs.algo.times(num1Changed / num2Changed, xs.algo.strip(Math.pow(10, xs.algo.digitLength(
				num2) - xs.algo.digitLength(num1))));
		},
	},
	/**
	 * 判断工具集
	 * @namespace xs.is
	 */
	is: {
		/**
		 * 判断是否为空
		 * @param {*} param - 要判断的值
		 * @return {boolean} 是否为空
		 */
		empty: (param) => {
			if (typeof param === 'number') return false;
			if (param == null || param === "" || param === undefined) return true;
			if (Array.isArray(param) && param.length === 0) return true;
			if (typeof param === 'object' && param !== null) {
				return Object.keys(param).length === 0 || JSON.stringify(param) === '{}' || JSON.stringify(
					param) === '[]';
			}
			return false;
		},

		/**
		 * 判断是否包含http
		 * @param {string} str - 要判断的字符串
		 * @param {number} [type=0] - 判断类型,1表示判断当前网址
		 * @return {boolean} 是否包含http
		 */
		http: (str, type = 0) => {
			if (type === 1) str = window.location.href;
			const httpRegex = /^(https?:\/\/)([\w.]+\/?)\S*/;
			return httpRegex.test(str);
		},
		/**
		 * 判断是否为中文字符
		 * @param {string} str - 要判断的字符串
		 * @return {boolean} 是否为中文字符
		 */
		chinese: (str) => /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])$/gi.test(str),

		/**
		 * 判断是否为图片
		 * @param {string} str - 要判断的字符串
		 * @return {boolean} 是否为图片
		 */
		image: (str) => /\.(png|jpg|gif|jpeg|bmp|webp)$/i.test(str),

		/**
		 * 判断是否为对象
		 * @param {*} obj - 要判断的值
		 * @return {boolean} 是否为对象
		 */
		object: (obj) => typeof obj === 'object' && obj !== null
	},
	/**
	 * 加密工具集
	 * @namespace xs.crypto
	 */
	crypto: {
		/**
		 * MD5加密
		 * @param {string} data - 需要加密的数据
		 * @return {string} MD5加密后的字符串
		 */
		md5(data) {
			return cryptojs.MD5(data).toString()
		},
		// BASE64加解密
		base64: {
			/**
			 * BASE64加密
			 * @param {string} data - 需要加密的数据
			 * @return {string} BASE64加密后的字符串
			 */
			encrypt(data) {
				return cryptojs.enc.Base64.stringify(cryptojs.enc.Utf8.parse(data))
			},
			/**
			 * BASE64解密
			 * @param {string} cipher - 需要解密的BASE64字符串
			 * @return {string} 解密后的原始字符串
			 */
			decrypt(cipher) {
				return cryptojs.enc.Base64.parse(cipher).toString(cryptojs.enc.Utf8)
			}
		},
		// AES加解密
		aes: {
			/**
			 * AES加密
			 * @param {string} data - 需要加密的数据
			 * @param {string} secretKey - 加密密钥
			 * @param {object} [configs={}] - 加密配置选项
			 * @param {string} [configs.iv] - 初始化向量
			 * @param {string} [configs.mode='ECB'] - 加密模式
			 * @param {string} [configs.padding='Pkcs7'] - 填充方式
			 * @return {string} AES加密后的字符串
			 */
			encrypt(data, secretKey, configs = {}) {
				secretKey = config.secretKey || secretKey;
				if (secretKey.length % 16 != 0) {
					console.warn("[error]: 秘钥长度需为16的倍数，否则解密将会失败。")
				}
				const result = cryptojs.AES.encrypt(data, cryptojs.enc.Utf8.parse(secretKey), {
					iv: cryptojs.enc.Utf8.parse(configs.iv || ""),
					mode: cryptojs.mode[configs.mode || "ECB"],
					padding: cryptojs.pad[configs.padding || "Pkcs7"]
				})
				return result.toString()
			},
			/**
			 * AES解密
			 * @param {string} cipher - 需要解密的AES加密字符串
			 * @param {string} secretKey - 解密密钥
			 * @param {object} [configs={}] - 解密配置选项
			 * @param {string} [configs.iv] - 初始化向量
			 * @param {string} [configs.mode='ECB'] - 解密模式
			 * @param {string} [configs.padding='Pkcs7'] - 填充方式
			 * @return {string} 解密后的原始字符串
			 */
			decrypt(cipher, secretKey, configs = {}) {
				secretKey = config.secretKey || secretKey;
				const result = cryptojs.AES.decrypt(cipher, cryptojs.enc.Utf8.parse(secretKey), {
					iv: cryptojs.enc.Utf8.parse(configs.iv || ""),
					mode: cryptojs.mode[configs.mode || "ECB"],
					padding: cryptojs.pad[configs.padding || "Pkcs7"]
				})
				return cryptojs.enc.Utf8.stringify(result);
			}
		}
	},
	/**
	 * 本地缓存工具集
	 * @namespace xs.storage
	 */
	storage: {
		cookie: {
			set(val) {
				return xs.storage.local.set(config.request.cookieStorage, val);
			},
			get() {
				return xs.storage.local.get(config.request.cookieStorage);
			},
			clear() {
				return xs.storage.local.clear(config.request.cookieStorage);
			}
		},
		//获取token
		token: {
			set(val, expireTime) {
				return xs.storage.local.set(config.request.tokenStorage, val, expireTime);
			},
			get() {
				return xs.storage.local.get(config.request.tokenStorage);
			},
			clear() {
				return xs.storage.local.clear(config.request.tokenStorage);
			}
		},
		// config
		config: {
			set(key, val) {
				return xs.storage.local.set(config.configStorage, val);
			},
			get(key) {
				return xs.storage.local.get(config.configStorage);
			},
			clear() {
				return xs.storage.local.clear(config.configStorage);
			}
		},
		// localStorage
		local: {
			/**
			 * @description 设置本地存储
			 * @param {String} key 存储的键名
			 * @param {*} value 存储的值
			 * @param {Number} expireTime 过期时间（分钟），0表示永不过期
			 */
			set: function(key, value, expireTime = 0) {
				value = xs.crypto.aes.encrypt(JSON.stringify(value));
				let cacheValue = {
					value: value,
					expireTime: parseInt(expireTime) === 0 ? 0 : new Date().getTime() + parseInt(
						expireTime) * 60 * 1000
				}
				try {
					uni.setStorageSync(key, JSON.stringify(cacheValue));
				} catch (e) {
					console.log(e.message);
				}
			},
			/**
			 * @description 获取本地存储
			 * @param {String} key 存储的键名
			 * @return {*} 存储的值，如果过期或不存在则返回null
			 */
			get: function(key) {
				try {
					const cacheValue = JSON.parse(uni.getStorageSync(key));
					if (cacheValue) {
						let nowTime = new Date().getTime()
						if (nowTime > cacheValue.expireTime && cacheValue.expireTime != 0) {
							uni.removeStorageSync(key);
							return null;
						}
						//解密
						cacheValue.value = JSON.parse(xs.crypto.aes.decrypt(cacheValue.value))
						return cacheValue.value
					}
					return null
				} catch (e) {
					return null
				}
			},
			/**
			 * @description 清除本地存储
			 * @param {String} [key] 要清除的键名，如果不提供则清除所有存储
			 */
			clear: function(key) {
				if (xs.is.empty(key)) {
					uni.clearStorageSync()
				} else {
					try {
						uni.removeStorageSync(key);
					} catch (e) {
						console.log(e.message);
					}
				}
			}
		},
	},
	/**
	 * 日期工具集
	 * @namespace xs.date
	 */
	date: {
		/**
		 * 格式化日期
		 * @param {Date|string|number} date - 日期
		 * @param {string} fmt - yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等
		 * @return {string} 格式化后的日期字符串
		 */
		format: (dateTime = null, fmt = 'yyyy-MM-dd') => {
			// 如果为null,则格式化当前时间
			if (!dateTime) dateTime = Number(new Date());
			// 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
			if (dateTime.toString().length == 10) dateTime *= 1000;
			let date = new Date(dateTime);
			let ret;
			let opt = {
				"y+": date.getFullYear().toString(), // 年
				"m+": (date.getMonth() + 1).toString(), // 月
				"d+": date.getDate().toString(), // 日
				"h+": date.getHours().toString(), // 时
				"M+": date.getMinutes().toString(), // 分
				"s+": date.getSeconds().toString(), // 秒
				"q+": Math.floor((date.getMonth() + 3) / 3), //季度
				"S": date.getMilliseconds() //毫秒
			};
			for (let k in opt) {
				ret = new RegExp("(" + k + ")").exec(fmt);
				if (ret) {
					fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length,
						"0")))
				};
			};
			return fmt;
		},
		/**
		 * 时间戳转为多久之前
		 * @param String timestamp 时间戳
		 * @param String | Boolean format 如果为时间格式字符串，超出一定时间范围，返回固定的时间格式；如果为布尔值false，无论什么时间，都返回多久以前的格式
		 */
		timeFrom: (dateTime = null, format = 'yyyy-mm-dd') => {
			// 如果为null,则格式化当前时间
			if (!dateTime) dateTime = Number(new Date());
			// 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
			if (dateTime.toString().length == 10) dateTime *= 1000;
			let timestamp = +new Date(Number(dateTime));
			let timer = (Number(new Date()) - timestamp) / 1000;
			// 如果小于5分钟,则返回"刚刚",其他以此类推
			let tips = '';
			switch (true) {
				case timer < 300:
					tips = '刚刚';
					break;
				case timer >= 300 && timer < 3600:
					tips = parseInt(timer / 60) + '分钟前';
					break;
				case timer >= 3600 && timer < 86400:
					tips = parseInt(timer / 3600) + '小时前';
					break;
				case timer >= 86400 && timer < 2592000:
					tips = parseInt(timer / 86400) + '天前';
					break;
				default:
					// 如果format为false，则无论什么时间戳，都显示xx之前
					if (format === false) {
						if (timer >= 2592000 && timer < 365 * 86400) {
							tips = parseInt(timer / (86400 * 30)) + '个月前';
						} else {
							tips = parseInt(timer / (86400 * 365)) + '年前';
						}
					} else {
						tips = xs.date.format(timestamp, format);
					}
			}
			return tips;
		},

		/**
		 * 获取欢迎词
		 * @param {Date} [date=new Date()] - 日期
		 * @return {string} 欢迎词
		 */
		welcome: (date = new Date()) => {
			const hour = new Date(date).getHours();
			if (hour < 6) return '凌晨好';
			if (hour < 9) return '早上好';
			if (hour < 12) return '上午好';
			if (hour < 14) return '中午好';
			if (hour < 17) return '下午好';
			if (hour < 19) return '傍晚好';
			if (hour < 22) return '晚上好';
			return '夜里好';
		},

		/**
		 * 获取增加的日期信息
		 * @param {Date|string} [date=new Date()] - 日期
		 * @param {number} [AddDayCount=0] - 增加的天数
		 * @return {Object} 日期信息对象
		 */
		getDate: (date = new Date(), AddDayCount = 0) => {
			if (typeof date !== 'object') {
				date = date.replace(/-/g, '/');
			}
			const dd = new Date(date);
			dd.setDate(dd.getDate() + AddDayCount);

			const y = dd.getFullYear();
			const m = (dd.getMonth() + 1).toString().padStart(2, '0');
			const d = dd.getDate().toString().padStart(2, '0');
			return {
				fullDate: `${y}-${m}-${d}`,
				year: y,
				month: m,
				date: d,
				day: dd.getDay()
			};
		}
	},
	/**
	 * URL工具集
	 * @namespace xs.url
	 */
	url: {
		/**
		 * 获取当前页面路径
		 */
		page() {
			const pages = getCurrentPages();
			const route = pages[pages.length - 1]?.route;
			// 某些特殊情况下(比如页面进行redirectTo时的一些时机)，pages可能为空数组
			return `/${route ? route : ''}`
		},
		/**
		 * @description 对象转url参数
		 * @param {object} data,对象
		 * @param {Boolean} isPrefix,是否自动加上"?"
		 * @param {string} arrayFormat 规则 indices|brackets|repeat|comma
		 */
		params: function(data = {}, isPrefix = true, arrayFormat = 'brackets') {
			const prefix = isPrefix ? '?' : ''
			const _result = []
			if (['indices', 'brackets', 'repeat', 'comma'].indexOf(arrayFormat) == -1) arrayFormat = 'brackets'
			for (const key in data) {
				const value = data[key]
				// 去掉为空的参数
				if (['', undefined, null].indexOf(value) >= 0) {
					continue
				}
				// 如果值为数组，另行处理
				if (value.constructor === Array) {
					// e.g. {ids: [1, 2, 3]}
					switch (arrayFormat) {
						case 'indices':
							// 结果: ids[0]=1&ids[1]=2&ids[2]=3
							for (let i = 0; i < value.length; i++) {
								_result.push(`${key}[${i}]=${value[i]}`)
							}
							break
						case 'brackets':
							// 结果: ids[]=1&ids[]=2&ids[]=3
							value.forEach((_value) => {
								_result.push(`${key}[]=${_value}`)
							})
							break
						case 'repeat':
							// 结果: ids=1&ids=2&ids=3
							value.forEach((_value) => {
								_result.push(`${key}=${_value}`)
							})
							break
						case 'comma':
							// 结果: ids=1,2,3
							let commaStr = ''
							value.forEach((_value) => {
								commaStr += (commaStr ? ',' : '') + _value
							})
							_result.push(`${key}=${commaStr}`)
							break
						default:
							value.forEach((_value) => {
								_result.push(`${key}[]=${_value}`)
							})
					}
				} else {
					_result.push(`${key}=${value}`)
				}
			}
			return _result.length ? prefix + _result.join('&') : ''
		}
	},
	/**
	 * 字符串工具集
	 * @namespace xs.str
	 */
	str: {
		/**
		 * 截取字符串
		 * @param {string} str - 需要截取的字符串
		 * @param {number} len - 截取长度
		 * @param {boolean} [ellipsis=false] - 是否在截取后添加省略号
		 * @return {string} 截取后的字符串
		 */
		cut: function(str, len, ellipsis) {
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
		/**
		 * 隐藏手机号中间4个字符
		 * @param {string|number} str - 需要处理的手机号
		 * @return {string} 处理后的手机号，中间4位被*替代
		 */
		subMobile: function(str) {
			str = String(str);
			var reg = /^(\d{3})\d{4}(\d{4})$/;
			return str.replace(reg, "$1****$2");
		},
		/**
		 * 全局唯一标识符
		 * @param {Number} len uuid的长度
		 * @param {Boolean} firstU 将返回的首字母置为"S"
		 * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
		 */
		guid: function(len = 32, firstU = true, radix = null) {
			const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
			const uuid = []
			radix = radix || chars.length

			if (len) {
				// 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
				for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
			} else {
				let r
				// rfc4122标准要求返回的uuid中,某些位为固定的字符
				uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
				uuid[14] = '4'

				for (let i = 0; i < 36; i++) {
					if (!uuid[i]) {
						r = 0 | Math.random() * 16
						uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
					}
				}
			}
			// 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
			if (firstU) {
				uuid.shift()
				return `u${uuid.join('')}`
			}
			return uuid.join('')
		},
		/**
		 * 数字格式化
		 * @param {number|string} number 要格式化的数字
		 * @param {number} decimals 保留几位小数
		 * @param {string} decimalPoint 小数点符号
		 * @param {string} thousandsSeparator 千分位符号
		 * @returns {string} 格式化后的数字
		 */
		priceFormat: function(number, decimals = 0, decimalPoint = '.', thousandsSeparator = ',') {
			number = (`${number}`).replace(/[^0-9+-Ee.]/g, '')
			const n = !isFinite(+number) ? 0 : +number
			const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
			const sep = (typeof thousandsSeparator === 'undefined') ? ',' : thousandsSeparator
			const dec = (typeof decimalPoint === 'undefined') ? '.' : decimalPoint
			let s = ''

			s = (prec ? round(n, prec) + '' : `${Math.round(n)}`).split('.')
			const re = /(-?\d+)(\d{3})/
			while (re.test(s[0])) {
				s[0] = s[0].replace(re, `$1${sep}$2`)
			}

			if ((s[1] || '').length < prec) {
				s[1] = s[1] || ''
				s[1] += new Array(prec - s[1].length + 1).join('0')
			}
			return s.join(dec)
		},
		/**
		 * 日期的月或日补零操作
		 * @param {String} value 需要补零的值
		 */
		padZero: function(value) {
			return `00${value}`.slice(-2)
		},
		/**
		 * 随机字符串
		 * @param {Number} count 几位
		 */
		randomStr: function(count) {
			const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			const randomStrings = [];
			for (let i = 0; i < count; i++) {
				let randomString = '';
				const length = Math.floor(Math.random() * 10) + 5; // 随机生成 5 到 14 位长度的字符串
				for (let j = 0; j < length; j++) {
					randomString += characters[Math.floor(Math.random() * characters.length)];
				}
				randomStrings.push(randomString);
			}
			return randomStrings;
		},
		/**
		 * 取一个区间数
		 * @param {Number} min 最小值
		 * @param {Number} max 最大值
		 * @param {Number} decimal 保留几位小数
		 */
		randomNumber: function(min, max, decimal = 0) {
			if (min >= 0 && max > 0 && max >= min) {
				const gab = max - min + 1
				let randomValue = Math.floor(Math.random() * gab + min)
				if (decimal > 0) {
					randomValue = (Math.random() * gab + min).toFixed(decimal);
				}
				return randomValue
			}
			return 0
		},
		/**
		 * 去除空格
		 * @param String str 需要去除空格的字符串
		 * @param String pos both(左右)|left|right|all 默认both
		 */
		trim: function(str, pos = 'both') {
			str = String(str)
			if (pos == 'both') {
				return str.replace(/^\s+|\s+$/g, '')
			}
			if (pos == 'left') {
				return str.replace(/^\s*/, '')
			}
			if (pos == 'right') {
				return str.replace(/(\s*$)/g, '')
			}
			if (pos == 'all') {
				return str.replace(/\s+/g, '')
			}
			return str
		},
		/**
		 * 删除最后一个字符
		 * @param {Object} str
		 * @param {Object} separator 默认删除','
		 */
		removeLast: function(str, separator = ',') {
			const lastChar = str[str.length - 1];
			if (lastChar === separator) {
				return str.slice(0, -1);
			}
			return str;
		},
		/**
		 * 删除首字符
		 * @param {Object} str
		 * @param {Object} separator 默认删除','
		 */
		removeFirst: function(str, separator = ',') {
			if (str[0] === separator) {
				return str.slice(1);
			}
			return str;
		},
		/**
		 * 去除所有html标签
		 * @param {Object} str
		 */
		replaceHtml: function(str) {
			return str.replace(/<\/?.+?\/?>/g, '');
		},
	},

	/**
	 * 数组工具集
	 * @namespace xs.array
	 */
	array: {
		/**
		 * 数组排序
		 * @param {Array} arr - 要排序的数组
		 * @param {string|Function} key - 排序的键或自定义排序函数
		 * @param {string} [order='asc'] - 排序顺序，'asc' 为升序，'desc' 为降序
		 * @return {Array} 排序后的新数组
		 */
		sort: function(arr, key, order = 'asc') {
			if (!Array.isArray(arr)) {
				return arr;
			}
			const sortedArr = [...arr];
			sortedArr.sort((a, b) => {
				let compareResult;
				if (typeof key === 'function') {
					compareResult = key(a, b);
				} else if (typeof key === 'string') {
					compareResult = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
				} else {
					compareResult = a < b ? -1 : a > b ? 1 : 0;
				}
				return order === 'desc' ? -compareResult : compareResult;
			});
			return sortedArr;
		},
		/**
		 * 将扁平数组转换为树形结构
		 * @param {Array} arr - 要转换的数组
		 * @param {string} [idKey='id'] - 标识每个项目的唯一键名
		 * @param {string} [pidKey='pid'] - 父项目标识的键名
		 * @param {string} [childrenKey='children'] - 子项目数组的键名
		 * @return {Array} 转换后的树形结构数组
		 */
		tree: function(arr, idKey = 'id', pidKey = 'pid', childrenKey = 'children') {
			const tree = [];
			const map = {};
			// 首先，创建一个以id为键的映射
			arr.forEach(item => {
				map[item[idKey]] = {
					...item,
					[childrenKey]: []
				};
			});
			// 然后，遍历数组构建树形结构
			arr.forEach(item => {
				const node = map[item[idKey]];
				if (item[pidKey] && map[item[pidKey]]) {
					map[item[pidKey]][childrenKey].push(node);
				} else {
					tree.push(node);
				}
			});
			return tree;
		}
	},
	/**
	 * 弹层工具集
	 * @namespace xs.layer
	 */
	layer: {
		//显示消息提示框
		toast: function(options) {
			var defaults = {
				icon: "none", //success,loading,none
				duration: 2000,
				position: 'center', //top  center  bottom
				mask: true,
			};
			var opts = Object.assign({}, defaults, options);
			if (xs.is.empty(msg)) return false;
			setTimeout(() => {
				uni.showToast({
					title: opts.msg,
					icon: opts.icon,
					duration: opts.duration,
					position: opts.position,
					mask: opts.mask,
					success: function(res) {
						if (!xs.is.empty(opts.url)) {
							setTimeout(() => {
								uni.reLaunch({
									url: opts.url,
								})
							}, opts.duration)
						} else {
							setTimeout(() => {
								typeof opts.success == "function" && opts.success(
									res);
							}, opts.duration)
						}
					},
					fail: function(e) {},
					complete: function(e) {}
				})
			}, 100)
		},
		showLoading: (options) => {
			let defaults = {
				mask: true // 是否显示透明蒙层，防触摸穿透，默认：true
			};
			let opts = Object.assign({}, defaults, options);
			uni.showLoading({
				title: opts.title || 'Loding',
				mask: opts.mask,
				success: () => {
					typeof opts.success === 'function' && opts.success();
				},
				fail: () => {
					typeof opts.fail === 'function' && opts.fail();
				},
				complete: () => {
					typeof opts.complete === 'function' && opts.complete();
				}
			});
		},
		hideLoading: () => {
			uni.hideLoading();
		},
		modal: (options) => {
			let defaults = {
				title: '提示',
				content: '确认吗？',
				showCancel: true, // 是否显示取消按钮
				cancelText: '取消', // 取消按钮的文字
				cancelColor: '#000000', // 取消按钮的文字颜色
				confirmText: "确定", // 确定按钮的文字
				confirmColor: "#3c76ff", // 确定按钮的文字颜色 
			};
			let opts = Object.assign({}, defaults, options);
			uni.showModal({
				title: opts.title,
				content: opts.content,
				showCancel: opts.showCancel,
				cancelText: opts.cancelText,
				cancelColor: opts.cancelColor,
				confirmText: opts.confirmText,
				confirmColor: opts.confirmColor,
				success: function(res) {
					if (res.confirm) {
						typeof opts.success === 'function' && opts.success();
					} else if (res.cancel) {
						typeof opts.cancel === 'function' && opts.cancel();
					}
				}
			});
		},
	},
	map: {
		//小程序合法域名添加 https://apis.map.qq.com
		qqmap: (options) => {
			let defaults = {
				location: '', // '39.984060,116.307520'
				key: config.qqmap
			};
			let opts = Object.assign({}, defaults, options);
			let QQMapWX = require('./qqmap.js');
			let qqmapsdk = new QQMapWX({
				key: opts.key
			});
			qqmapsdk.reverseGeocoder({
				location: opts.location,
				success: (res) => {
					typeof opts.success === 'function' && opts.success(res.result);
				}
			})
		},
		//根据经纬度计算距离
		distance: (options) => {
			let defaults = {
				lng: 0, // 当前经度
				lat: 0, // 当前纬度 
				lngHost: 0, // 坐标点经度
				latHost: 0, // 坐标点纬度
				radius: 1, // 半径范围 公里
				type: 1 //1:是否在半径范围内 2:返回距离
			};
			let opts = Object.assign({}, defaults, options);
			let _lat1 = opts.lat * Math.PI / 180.0;
			let _lat2 = opts.latHost * Math.PI / 180.0;
			let a = _lat1 - _lat2;
			let b = opts.lng * Math.PI / 180.0 - opts.lngHost * Math.PI / 180.0;
			let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(_lat1) * Math.cos(_lat2) *
				Math.pow(Math.sin(
					b / 2), 2)));
			s = s * 6378.137; // 地球半径  
			s = Math.round(s * 10000) / 10000; // km
			s = s.toFixed(2); // 保留两位小数
			if (opts.type == 2) {
				return s;
			} else {
				if (s * 1000 < Number(Number(opts.radius) + 100)) {
					return false;
				} else {
					return true;
				}
			}
		},
		// 获取当前位置
		getLocation: (options) => {
			const defaults = {
				type: 'wgs84', //默认为 wgs84 返回 gps 坐标，gcj02 返回国测局坐标
				geocode: false, //是否解析地址信息 仅App平台支持
				isHighAccuracy: false, //开启高精度定位
			};
			let opts = Object.assign({}, defaults, options);
			uni.getSetting({
				success(res) {

					let authSetting = res.authSetting;

					if (authSetting['scope.userLocation'] == false) {
						xs.layer.toast({
							msg: '',
							success: function() {
								uni.openSetting({
									success(res) {
										//console.log(res.authSetting)
									}
								});
							}
						})
					} else {
						uni.getLocation({
							type: opts.type,
							geocode: true,
							isHighAccuracy: opts.isHighAccuracy,
							success: function(res) {
								// console.log(res);
								typeof opts.success === 'function' && opts.success(res);
							},
							fail: function(err) {
								// console.log(err);
								typeof opts.fail === 'function' && opts.fail(err);
							}
						});
					}
				}
			})
		},
		//
		//地图选点事件
		chooseLocation: (options) => {
			const defaults = {
				latitude: '',
				longitude: '',
			};
			let opts = Object.assign({}, defaults, options);
			// const that = this,
			// 	key = '6GWBZ-Z77WD-XSP4L-HJLGW-FHTTZ-FEBRQ', //使用在腾讯位置服务申请的key
			// 	referer = '腾讯位置服务地图选点'; //调用插件的app的名称
			// wx.navigateTo({
			// 	url: `plugin://chooseLocation/index?key=${key}&referer=${referer}`
			// });
			uni.chooseLocation({
				latitude: opts.latitude,
				longitude: opts.longitude,
				success: function(res) {
					typeof opts.success === 'function' && opts.success(res);
				},
				fail: function(err) {
					typeof opts.fail === 'function' && opts.fail(err);
				}
			});

		},

		//百度坐标转高德坐标
		baiduAmap: function(lng, lat) {
			let X_PI = Math.PI * 3000.0 / 180.0;
			let x = lng - 0.0065;
			let y = lat - 0.006;
			let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
			let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
			let _lng = z * Math.cos(theta);
			let _lat = z * Math.sin(theta);
			return {
				lng: _lng,
				lat: _lat
			}
		},
		//高德、腾讯坐标转百度坐标
		amapBaidu: function(lng, lat) {
			let X_PI = Math.PI * 3000.0 / 180.0;
			let x = lng,
				y = lat;
			let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
			let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
			let _lng = z * Math.cos(theta) + 0.0065;
			let _lat = z * Math.sin(theta) + 0.006;
			return {
				lng: _lng,
				lat: _lat
			};
		},
		// WGS-84 转 GCJ-02
		wgsTogcj: function(lng, lat) {
			let a = 6378245.0;
			let ee = 0.00669342162296594323;
			if (xsMap.inChina(lng, lat)) {
				return {
					lng: lng,
					lat: lat
				};
			} else {
				let dlat = xsMap.transformlat(lng - 105.0, lat - 35.0);
				let dlng = xsMap.transformlng(lng - 105.0, lat - 35.0);
				let radlat = lat / 180.0 * Math.PI;
				let magic = Math.sin(radlat);
				magic = 1 - ee * magic * magic;
				let sqrtmagic = Math.sqrt(magic);
				dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * Math.PI);
				dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * Math.PI);
				let _lat = lat + dlat;
				let _lng = lng + dlng;
				return {
					lng: _lng,
					lat: _lat
				};
			}
		},
		// GCJ-02 转换为 WGS-84
		gcjTowgs: function(lng, lat) {
			let a = 6378245.0;
			let ee = 0.00669342162296594323;
			if (xsMap.inChina(lng, lat)) {
				return {
					lng: lng,
					lat: lat
				};
			} else {
				let dlat = xsMap.transformlat(lng - 105.0, lat - 35.0);
				let dlng = xsMap.transformlng(lng - 105.0, lat - 35.0);
				let radlat = lat / 180.0 * Math.PI;
				let magic = Math.sin(radlat);
				magic = 1 - ee * magic * magic;
				let sqrtmagic = Math.sqrt(magic);
				dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * Math.PI);
				dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * Math.PI);
				let _lat = lat + dlat;
				let _lng = lng + dlng;
				return {
					lng: lng * 2 - _lng,
					lat: lat * 2 - _lat
				};
			}
		},
		// 判断是否在国内 纬度 3.86~53.55, 经度 73.66~135.05
		inChina: function(lng, lat) {
			return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
		},
		// 计算经度坐标偏移
		transformlat: function(lng, lat) {
			let _lat = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math
				.abs(lng));
			_lat += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0;
			_lat += (20.0 * Math.sin(lat * Math.PI) + 40.0 * Math.sin(lat / 3.0 * Math.PI)) * 2.0 / 3.0;
			_lat += (160.0 * Math.sin(lat / 12.0 * Math.PI) + 320 * Math.sin(lat * Math.PI / 30.0)) * 2.0 / 3.0;
			return _lat;
		},
		// 计算纬度坐标偏移
		transformlng: function(lng, lat) {
			let _lng = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(
				lng));
			_lng += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0;
			_lng += (20.0 * Math.sin(lng * Math.PI) + 40.0 * Math.sin(lng / 3.0 * Math.PI)) * 2.0 / 3.0;
			_lng += (150.0 * Math.sin(lng / 12.0 * Math.PI) + 300.0 * Math.sin(lng / 30.0 * Math.PI)) * 2.0 /
				3.0;
			return _lng;
		},
	},
	/**
	 * 正则工具集
	 * @namespace xs.regxp
	 */
	regxp: {
		/**
		 * 验证电子邮箱格式
		 */
		email: function(value) {
			return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value)
		},

		/**
		 * 验证手机格式
		 */
		mobile: function(value) {
			return /^1([3589]\d|4[5-9]|6[1-2,4-7]|7[0-8])\d{8}$/.test(value)
		},

		/**
		 * 验证URL格式
		 */
		url: function(value) {
			return /^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z].[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)$/
				.test(value)
		},

		/**
		 * 验证日期格式
		 */
		date: function(value) {
			if (!value) return false
			// 判断是否数值或者字符串数值(意味着为时间戳)，转为数值，否则new Date无法识别字符串时间戳
			if (number(value)) value = +value
			return !/Invalid|NaN/.test(new Date(value).toString())
		},

		/**
		 * 验证ISO类型的日期格式
		 */
		dateISO: function(value) {
			return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value)
		},

		/**
		 * 验证十进制数字
		 */
		number: function(value) {
			return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value)
		},

		/**
		 * 验证字符串
		 */
		string: function(value) {
			return typeof value === 'string'
		},

		/**
		 * 验证整数
		 */
		digits: function(value) {
			return /^\d+$/.test(value)
		},

		/**
		 * 验证身份证号码
		 */
		idCard: function(value) {
			return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(
				value
			)
		},

		/**
		 * 是否车牌号
		 */
		carNo: function(value) {
			// 新能源车牌
			const xreg =
				/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
			// 旧车牌
			const creg =
				/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
			if (value.length === 7) {
				return creg.test(value)
			}
			if (value.length === 8) {
				return xreg.test(value)
			}
			return false
		},

		/**
		 * 金额,只允许2位小数
		 */
		amount: function(value) {
			// 金额，只允许保留两位小数
			return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(value)
		},

		/**
		 * 中文
		 */
		chinese: function(value) {
			const reg = /^[\u4e00-\u9fa5]+$/gi
			return reg.test(value)
		},

		/**
		 * 只能输入字母
		 */
		letter: function(value) {
			return /^[a-zA-Z]*$/.test(value)
		},

		/**
		 * 只能是字母或者数字
		 */
		enOrNum: function(value) {
			// 英文或者数字
			const reg = /^[0-9a-zA-Z]*$/g
			return reg.test(value)
		},

		/**
		 * 验证是否包含某个值
		 */
		contains: function(value, param) {
			return value.indexOf(param) >= 0
		},

		/**
		 * 验证一个值范围[min, max]
		 */
		range: function(value, param) {
			return value >= param[0] && value <= param[1]
		},

		/**
		 * 验证一个长度范围[min, max]
		 */
		rangeLength: function(value, param) {
			return value.length >= param[0] && value.length <= param[1]
		},

		/**
		 * 是否固定电话
		 */
		landline: function(value) {
			const reg = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/
			return reg.test(value)
		},

		/**
		 * 判断是否为空
		 */
		empty: function(value) {
			switch (typeof value) {
				case 'undefined':
					return true
				case 'string':
					if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true
					break
				case 'boolean':
					if (!value) return true
					break
				case 'number':
					if (value === 0 || isNaN(value)) return true
					break
				case 'object':
					if (value === null || value.length === 0) return true
					for (const i in value) {
						return false
					}
					return true
			}
			return false
		},

		/**
		 * 是否json字符串
		 */
		jsonString: function(value) {
			if (typeof value === 'string') {
				try {
					const obj = JSON.parse(value)
					if (typeof obj === 'object' && obj) {
						return true
					}
					return false
				} catch (e) {
					return false
				}
			}
			return false
		},

		/**
		 * 是否数组
		 */
		array: function(value) {
			if (typeof Array.isArray === 'function') {
				return Array.isArray(value)
			}
			return Object.prototype.toString.call(value) === '[object Array]'
		},

		/**
		 * 是否对象
		 */
		object: function(value) {
			return Object.prototype.toString.call(value) === '[object Object]'
		},

		/**
		 * 是否短信验证码
		 */
		code: function(value, len = 6) {
			return new RegExp(`^\\d{${len}}$`).test(value)
		},

		/**
		 * 是否函数方法
		 * @param {Object} value
		 */
		func: function(value) {
			return typeof value === 'function'
		},

		/**
		 * 是否promise对象
		 * @param {Object} value
		 */
		promise: function(value) {
			return object(value) && func(value.then) && func(value.catch)
		},

		/** 是否图片格式
		 * @param {Object} value
		 */
		image: function(value) {
			const newValue = value.split('?')[0]
			const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i
			return IMAGE_REGEXP.test(newValue)
		},

		/**
		 * 是否视频格式
		 * @param {Object} value
		 */
		video: function(value) {
			const VIDEO_REGEXP = /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv|m3u8)/i
			return VIDEO_REGEXP.test(value)
		},

		/**
		 * 是否为正则对象
		 * @param {Object}
		 * @return {Boolean}
		 */
		regExp: function(o) {
			return o && Object.prototype.toString.call(o) === '[object RegExp]'
		},
	}



};
