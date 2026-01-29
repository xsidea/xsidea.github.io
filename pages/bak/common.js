// +----------------------------------------------------------------------
// | xstudio [ Enabling Developers To Help Enterprises Develop ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2022 https://www.haisong.net All rights reserved.
// +----------------------------------------------------------------------
// | Licensed LPPL ( https://opensource.org/licenses/LPPL-1.3c )
// +----------------------------------------------------------------------
// | Author: XiaoSong <lianghaisong@gmail.com>
// +----------------------------------------------------------------------


// 自适应
function adaption() {
    var time,
        docEl = document.documentElement;
    var refreshRem = function () {
        var clientWidth = docEl.clientWidth;
        if (clientWidth >= 1920) {
            docEl.style.fontSize = 10 * (clientWidth / 1920) + 'px';

        } else {
            docEl.style.fontSize = '10px'; //1rem  = 10px
        }
    };
    addEventListener('resize', function () {
        clearTimeout(time); // 防止执行两次
        time = setTimeout(refreshRem, 300);
    }, false);
    addEventListener('pageshow', function (e) {
        // 浏览器后退的时候重新计算
        if (e.persisted) {
            clearTimeout(time);
            time = setTimeout(refreshRem, 300);
        }
    }, false);
    document.addEventListener("DOMContentLoaded", function (e) {
        refreshRem();
    }, false);
}

// 初始化
function init() {
    adaption();
}

// 监听窗口变化
window.addEventListener('resize', function () {
    adaption();
}, false)

init();