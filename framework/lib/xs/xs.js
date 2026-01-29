// +----------------------------------------------------------------------
// | 常用函数 [ Enabling Developers To Help Enterprises Develop ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2023 https://www.haisong.net All rights reserved.
// +----------------------------------------------------------------------
// | Licensed LPPL ( https://opensource.org/licenses/LPPL-1.3c )
// +----------------------------------------------------------------------
// | Author: XiaoSong <lianghaisong@gmail.com>
// +----------------------------------------------------------------------
// 应用路径 
window.WEBROOT = (function (src) {
    return src.pop(), src.pop(), src.pop(), src.pop(), src.join('/') + '/';
})(document.scripts[document.scripts.length - 1].src.split('/'));
// 脚本路径
window.JSROOT = window.JSROOT || window.WEBROOT + "framework/lib/";
// 图片路径
window.IMGROOT = window.IMGROOT || window.WEBROOT + "framework/images/";
// 视图路径
window.VIEWROOT = window.VIEWROOT || window.WEBROOT + "pages/";
// 当前 URL 的路径部分
window.PATHNAME = window.PATHNAME || window.location.pathname;
console.groupCollapsed('site related path');
console.log('%cweb:%c' + WEBROOT, 'color: #409eff', 'color: #000');
console.log('%cjs:%c' + JSROOT, 'color: #409eff', 'color: #000');
console.log('%cimg:%c' + IMGROOT, 'color: #409eff', 'color: #000');
console.log('%cview:%c' + VIEWROOT, 'color: #409eff', 'color: #000');
console.log('%cJquery:' + $.fn.jquery, 'color: #409eff',);
console.groupEnd();
const xs = {
    init: function () {
        this.statistics('37de6d1bd13598c4b4f2ad9869e201e1');
        this.copyright();
        this.tips();
        this.kefu();
    },

    // tips
    tips: function (options) {
        var defaults = {
            ele: '[xs-tips]',
        };
        var opts = Object.assign({}, defaults, options);
        $(opts.ele).each(function (k, v) {
			console.log(k);
            var index = null;
            var title = $(v).attr('xs-tips')
            $(v).hover(function () {
                index = layer.tips(title, $(v), {
                    tips: [1, '#000000'],
                    time: 4000
                });
            }, function () {
                layer.close(index)
            });


        })
    },
    // ajax 请求
    ajax: function (options) {
        var defaults = {
            url: '',
            method: 'POST',
            contentType: 'application/json;charset-UTF-8',
            dataType: 'json',
            async: true, // 异步true 同步false
            data: {},
            cache: false,
            strData: false,
            headers: {},
            loading: false,
            token: true,
            timeout: 10 * 1000
        };
        var opts = Object.assign({}, defaults, options);
        //url
        var ajaxurl = this.is.http(opts.url) ? opts.url : xsconfig.apiurl + opts.url;

        opts.loading = opts.loading && xslayer.showLoading();
        $.ajax({
            url: ajaxurl,
            type: opts.method,
            contentType: opts.contentType,
            async: opts.async,
            dataType: opts.dataType,
            timeout: opts.timeout,
            data: opts.data,
            cache: opts.cache,
            headers: opts.headers,
            beforeSend: function (xhr) {
                typeof opts.beforeSend === 'function' && opts.beforeSend(xhr);
            },
            success: function (res, status, xhr) {
                typeof opts.success === 'function' && opts.success(res);
            },
            error: function (xhr, status, error) {
                typeof opts.error === 'function' && opts.error(xhr, status);
            },
            complete: function (res) {
                typeof opts.complete === 'function' && opts.complete(res);
            }
        })
    },
    //获取时间戳
    timestamp: function (num) {
        num = parseInt(num) >= 13 ? 13 : 10;
        return Date.parse(new Date()).toString().substr(0, num);
    },
    // 百度统计
    statistics: function (param) {
		var _hmt = _hmt || [];
		(function() {
		  var hm = document.createElement("script");
		  hm.src = "https://hm.baidu.com/hm.js?68ef64aead21637a174ec3bee81725a7";
		  var s = document.getElementsByTagName("script")[0]; 
		  s.parentNode.insertBefore(hm, s);
		})();
    },
    kefu: function () {
        (function (a, b, c, d, e, j, s) {
            a[d] = a[d] || function () {
                (a[d].a = a[d].a || []).push(arguments)
            };
            j = b.createElement(c),
                s = b.getElementsByTagName(c)[0];
            j.async = true;
            j.charset = 'UTF-8';
            j.src = 'https://static.meiqia.com/widget/loader.js';
            s.parentNode.insertBefore(j, s);
        })(window, document, 'script', '_MEIQIA');
        _MEIQIA('entId', '643b4afd754afa75c2379a5c151ba744');
    },
    // 版权所有 ctrl+shift+alt+s
    copyright: function () {
        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if ((e.keyCode == 83 || e.keyCode == 88) && e.altKey && e.ctrlKey && e.shiftKey) {
                var strHtml =
                    '<div class="xstudio-copyright-mask" style="position: fixed;pointer-events: auto;top: 0;left: 0;width: 100%;height: 100%;z-index: 19891015;background-color: rgb(0, 0, 0);opacity: 0.2;"></div><div class="xstudio-copyright"  style="position: fixed;top: 50%;left: 50%;z-index: 19891016;width: 330px;height: 290px;margin-left: -165px;margin-top: -145px;background-color: transparent;padding: 0;border-radius: 2px;box-shadow: 1px 1px 50px rgba(0,0,0,.3);"><div style="padding: 40px 50px;border-radius: 8px; line-height: 25px;font-size: 12px;background-color: #FFFFFF;color: #000000;"><div class="text-center"><a href="http://www.haisong.net"  target="_blank"><img src="' +
                    IMGROOT +
                    '/xstudio.png"></a></div><br>联系作者：lianghaisong@gmail.com<br>官方网站：<a href="http://www.haisong.net" target="_blank">http://www.haisong.net</a><br>版权所有：海松工作室 © 2023<br><br><div style="text-align:center;"><a href="https://gitee.com/haisong/haisong" target="_blank"><img src="https://gitee.com/haisong/haisong/badge/star.svg"></a>    <a href="https://gitee.com/haisong/haisong" target="_blank"><img src="https://gitee.com/haisong/haisong/badge/fork.svg"></a></div></div><a class="xstudio-copyright-close" style="position: absolute;right: 15px;top: 15px;width: 10px;height: 10px;border-radius: 15px;background-color: #333333;" href="javascript:;"></a></div>';
                $('body').append(strHtml);
                $('.xstudio-copyright-close').click(function () {
                    $('.xstudio-copyright').remove();
                    $('.xstudio-copyright-mask').remove()
                })
            } else if (e.keyCode == 27) {
                $('.xstudio-copyright').remove();
                $('.xstudio-copyright-mask').remove()
            }
        };
    },
    // 截取字符串
    strcut: function (str, len, ellipsis) {
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
    // 去除所有html标签
    replaceHtml: function (str) {
        var str = str.replace(/<\/?.+?>/g, ""); //去除所有HTML标签
        str = str.replace(/^[" "||"　"]*/, "").replace(/[" "|"　"]*$/, ""); // 去除头和尾
        str = str.replace(/\s/g, ''); //去除所有空格
        str = str.replace(/(\s*$)/g, ""); //去除右边所有空格
        return str;
    },
    // 去除字符转中全部空格
    trimAll: function (str) {
        str = str.replace(/^[" "||"　"]*/, "").replace(/[" "|"　"]*$/, ""); // 去除头和尾
        str = str.replace(/\s/g, ''); //去除所有空格
        str = str.replace(/(\s*$)/g, ""); //去除右边所有空格
        return str;
    },
    // 去除字符转中全部空格
    trim: function (str) {
        str = str.replace(/^[" "||"　"]*/, "").replace(/[" "|"　"]*$/, ""); // 去除头和尾
        str = str.replace(/\s/g, ''); //去除所有空格
        str = str.replace(/(\s*$)/g, ""); //去除右边所有空格
        return str;
    },
    uuid: function () {
        return (new Date()).getTime() * 1000 + parseInt(Math.random() * 100, 10) % 1000;
    },
    // 获取地址栏参数
    getUrlParam: function (url) {
        var aQuery = '';
        if (url == null || url == "" || typeof (url) == "undefined" || url == "undefined") {
            aQuery = window.location.href.split("?")
        } else {
            aQuery = url.split("?")
        }
        var aGET = new Array();
        if (aQuery.length > 1) {
            var aBuf = aQuery[1].split("&");
            for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
                var aTmp = aBuf[i].split("=");
                aGET[aTmp[0]] = aTmp[1]
            }
        }
        return aGET
    },
    // date
    date: {
        // 格式化时间
        format(date, fmt = 'yyyy-MM-dd') {
            date = new Date(date);
            var week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            // var today = Math.abs(new Date().getDate() - date.getDate());
            // console.log(today == 0 ? '今天' : today);
            const o = {
                'M+': date.getMonth() + 1, // 月份
                'd+': date.getDate(), // 日
                'h+': date.getHours(), // 小时
                'm+': date.getMinutes(), // 分
                's+': date.getSeconds(), // 秒
                'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
                'S': date.getMilliseconds(), // 毫秒
                'w': week[date.getDay()], // 星期几 date.getFullYear() + (date.getMonth() + 1) + date.getDate()
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                }
            }
            return fmt;
        },
        // 日期转换星期几
        week: function (date) {
            var week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            return week[new Date(date).getDay()];
        },
        // 获取count天后的日期
        addDayCount: function (count) {
            var date = new Date();
            date.setDate(date.getDate() + count);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            return y + "-" + m + "-" + d;
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
        timeAgo: function (unixtime) {
            var currTime = Date.parse(new Date());;
            var time = ((parseInt(currTime) / 1000) - parseInt(unixtime));
            if (time > 0) {
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
    // 是否空字符串
    is: {
        empty(param) {
            if (param == null || param == "" || typeof (param) == "undefined" || typeof (param) == "null" || param == "undefined") {
                return true;
            }
            return false;
        },
        //是否包含HTTP type:1 当前网址
        http: function (param, type) {
            if (type == 1) param = window.location.href;
            var Expression = /(http|https):\/\/([\w.]+\/?)\S*/;
            var objExp = new RegExp(Expression);
            if (objExp.test(param) == true) {
                return true;
            } else {
                return false;
            }
        },
        // 是否中文字符
        chinese: function (param) {
            return /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])$/gi.test(param) ? true : false;
        },
        image: function (param) {
            var reg = /\.(png|jpg|gif|jpeg|bmp|webp)$/;
            return reg.test(param);
        },
        array: function (param) {
            return Object.prototype.toString.call(param) === "[object Array]";
        },
        object: function (param) {
            return typeof param === 'object' && param !== null
        },
        json: function (param) {
            if (typeof param == 'string') {
                try {
                    var obj = JSON.parse(param);
                    if (typeof obj == 'object' && obj) {
                        return true;
                    } else {
                        return false;
                    }
                } catch (e) {
                    return false;
                }
            }
        },
        // 判断设备是否是微信
        weixin: function () {
            var UA = navigator.userAgent.toLowerCase();
            if (UA.match(/microMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        },
        // 判断设备是否为手机
        mobileDevice: function () {
            var ua = navigator.userAgent.toLocaleLowerCase();
            var pf = navigator.platform.toLocaleLowerCase();
            var isAndroid = (/android/i).test(ua) || ((/iPhone|iPod|iPad/i).test(ua) && (/linux/i).test(pf)) || (
                /ucweb.*linux/i.test(ua));
            var isIOS = (/iPhone|iPod|iPad/i).test(ua) && !isAndroid;
            var isWinPhone = (/Windows Phone|ZuneWP7/i).test(ua);
            var clientWidth = document.documentElement.clientWidth;
            if (!isAndroid && !isIOS && !isWinPhone && clientWidth > 1024) {
                return false;
            } else {
                return true;
            }
        },
        // 是否手机号
        mobile: function (str) {
            var partten = /^1[2,3,4,5,6,7,8,9]\d{9}$/;
            if (partten.test(str)) {
                return true;
            } else {
                return false;
            }
        }
    },
    /**
     * loadJS 异步加载远程JS
     * @example  BMapGL = loadJS(`//api.map.baidu.com/api?type=webgl&v=1.0&ak=${ak}&callback=BMapGLinit`, "BMapGL", "BMapGLinit")
     * @param {string} src - 必填，需要加载的URL路径
     * @param {string} keyName - 必填，唯一key和JS返回的全局的对象名
     * @param {string} callbackName - 非必填，如果远程JS有callback，则可更有效的判断是否完成加载
     */
    loadJS: function (src, keyName, callbackName) {
        return new Promise((resolve, reject) => {
            let has = document.head.querySelector("script[loadKey=" + keyName + "]")
            if (has) {
                return resolve(window[keyName])
            }
            let script = document.createElement("script")
            script.type = "text/javascript"
            script.src = src
            script.setAttribute("loadKey", keyName)
            document.head.appendChild(script)
            script.onload = () => {
                if (callbackName) {
                    window[callbackName] = () => {
                        return resolve(window[keyName])
                    }
                } else {
                    setTimeout(() => {
                        return resolve(window[keyName])
                    }, 50)
                }
            }
            script.onerror = (err) => {
                return reject(err)
            }
        })
    },
    /**
     * loadCss 异步加载远程css
     * @example
     * @param {string} src - 必填，需要加载的URL路径
     * @param {string} keyName - 必填，唯一key
     */
    loadCss: function (src, keyName) {
        return new Promise((resolve, reject) => {
            let has = document.head.querySelector("link[loadKey=" + keyName + "]")
            if (has) {
                return resolve()
            }
            let link = document.createElement('link')
            link.rel = "stylesheet"
            link.href = src
            link.setAttribute("loadKey", keyName)
            document.head.appendChild(link)
            link.onload = () => {
                return resolve()
            }
            link.onerror = (err) => {
                return reject(err)
            }
        })
    },
    storage: {
        // token
        token: {
            set(val) {
                return storage.local.set('xsToken', val);
            },
            get() {
                return storage.local.get('xsToken');
            },
            remove() {
                return storage.local.remove('xsToken');
            }
        },
        // member
        member: {
            set(val) {
                return storage.local.set('xsMember', val);
            },
            get() {
                return storage.local.get('xsMember');
            },
            remove() {
                return storage.local.remove('xsMember');
            }
        },
        /*
         * localStorage
         * storage.local.get('token')
         * @param  {Function}   set       设置localStorage
         * @param  {Function}   get       获取localStorage
         * @param  {Function}   remove    删除指定localStorage
         * @param  {Function}   clear     全部清除localStorage
         * @return void
        */
        local: {
            // expire 过期时间 秒
            set(key, value, expiretime = 0) {
                var cacheValue = {
                    data: value,
                    expiretime: parseInt(expiretime) === 0 ? 0 : new Date().getTime() + parseInt(expiretime) * 1000
                };
                return localStorage.setItem(key, JSON.stringify(cacheValue));
            },
            get(key) {
                try {
                    var cacheValue = JSON.parse(localStorage.getItem(key));
                    if (cacheValue) {
                        var nowTime = new Date().getTime()
                        if (nowTime > cacheValue.expiretime && cacheValue.expiretime != 0) {
                            localStorage.removeItem(key)
                            return null;
                        }
                        return cacheValue.data
                    }
                    return null
                } catch (err) {
                    return null
                }
            },
            remove(key) {
                return localStorage.removeItem(key);
            },
            clear() {
                return localStorage.clear();
            }
        },
        /*
         * sessionStorage
         * storage.session.get('token')
         * @param  {Function}   set       设置sessionStorage
         * @param  {Function}   get       获取sessionStorage
         * @param  {Function}   remove    删除指定sessionStorage
         * @param  {Function}   clear     全部清除sessionStorage
         * @return void
         */
        session: {
            set(key, value) {
                value = JSON.stringify(value)
                return sessionStorage.setItem(key, value);
            },
            get(key) {
                var value = sessionStorage.getItem(key);
                try {
                    value = JSON.parse(value)
                } catch (err) {
                    return null
                }
                return value;
            },
            remove(key) {
                return sessionStorage.removeItem(key);
            },
            clear() {
                return sessionStorage.clear();
            }
        }
    }
}
