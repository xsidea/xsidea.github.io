// +----------------------------------------------------------------------
// | xstudio [ Enabling Developers To Help Enterprises Develop ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2022 https://www.haisong.net All rights reserved.
// +----------------------------------------------------------------------
// | Licensed LPPL ( https://opensource.org/licenses/LPPL-1.3c )
// +----------------------------------------------------------------------
// | Author: XiaoSong <lianghaisong@gmail.com>
// +----------------------------------------------------------------------
var config = {
    rows: 4,//纵向排列时行数
    columns: 5,//横向排列时列数
    spacing: 20,// 间距像素
    // imgWidth: 260, // 图片纵向排列时默认宽度
    // imgHeight: 230, // 图片横向排列时默认高度
    direction: 'horizontal', //排列方向 横:horizontal 纵:vertical
    rollDirection: 'left',// 滚动方向 上 up 下 down 左 left 右 right
    container: '#container',
    width: document.body.offsetWidth,//窗口可视区域宽度+边线和滚动条
    height: document.body.offsetHeight,//窗口可视区域高度+边线和滚动条

    distance: 1, //移动距离像素
    speed: 10, // 速度
    timer: null, // 定时器
}

function createImages() {
    var that = this;
    $.ajax({
        url: '../../framework/json/img.json',
        methord: 'GET',
        dataType: 'json',
        success: function (res) {
            var strHtml = '';
            if (res.status == 1) {
                $(res.list).each(function (k, v) {
                    strHtml += '<div class="item">';
                    strHtml += '<div class="img"><img src="../..' + v.src + '" draggable="false"/></div>';
                    strHtml += '<div class="info hidden">' + k + '：This content is hidden</div>';
                    strHtml += '</div>';
                })
                $(config.container).html(strHtml);
                that.autoArrange(); // 根据方向自动排列
            }

        }
    })
}
// 根据方向自动排列
function autoArrange() {
    let that = this;
    // 当前宽高比 16:9 为 1.77778  32:9 为 3.55556 
    var currentRate = parseFloat((window.screen.width / window.screen.height).toFixed(5));
    // 图片数量
    var imgNum = $(config.container).find('.img').length;
    // 横向排列 每行高度
    var imgHeight = config.height / config.rows;
    // 纵向排列 每列宽度
    var imgWidth = config.width / config.columns;
    if (config.direction == 'horizontal') {
        /********************  横向排列  ********************/
        // 每行多少个图片
        var rowImgNum = parseInt(imgNum / config.rows);

        // 每几个包裹起来
        $('.item').slice($('.item:nth-child(' + rowImgNum + 'n)').each(function (i) {
            $('.item').slice(i * rowImgNum, i * rowImgNum + rowImgNum).wrapAll('<div class="itemBox"></div>');
        }).length * rowImgNum).wrapAll('<div class="itemBox"></div>');

        $(that.container).find('.item').each(function (k, v) {
            $(v).css({
                'white-space': 'nowrap',
                'margin-bottom': config.spacing / 10 + 'rem',
                'height': parseInt((imgHeight - config.spacing) / 10) + 'rem', // 除以10为了转换rem
            })
            $(v).find('.img').css({
                'margin-right': '2rem',
                'height': parseInt((imgHeight - config.spacing) / 10) + 'rem', // 除以10为了转换rem
                'display': 'inline-block'
            })
        })
        imagesRoll();

    } else {
        // 纵向排列

    }




    console.log('宽:' + config.width + ',' + '高:' + config.height);
    console.log(config.direction == 'horizontal' ? '行高：' + parseInt(imgHeight / 10) + 'rem' : '列宽：' + parseInt(imgWidth / 10) + 'rem');
    console.log('图片总数:' + imgNum);
    console.log('总' + (config.direction == 'horizontal' ? '行数:' + config.rows : '列数' + config.columns));
    console.log('每' + (config.direction == 'horizontal' ? '行' : '列') + '显示:' + rowImgNum);
}
// 左右滚动
function imagesRoll() {
    let that = this;
    $(that.container).find('.item').each(function (k, v) {
        // 克隆第一张和最后一张图片
        var firstImg = $(v).find('.img').first();
        var lastImg = $(v).find('.img').last();
        // 将图片插入图片容器最前面和最后面
        $(v).prepend(lastImg.clone());
        $(v).append(firstImg.clone());

        var itemWidth = $(v).width();
        config.timer = setInterval(function () {
            var left = $(v).offset().left;

            if (config.rollDirection === 'right' && config.direction === 'horizontal') left += config.speed;
            if (config.rollDirection === 'left' && config.direction === 'horizontal') left -= config.speed;

            $(v).animate({
                marginLeft: '-=5'
            }, 0, function () {
                var s = Math.abs(parseInt($(v).css("margin-left")));
                if (s >= itemWidth) {
                    $(v).find(".img").slice(0, 1).appendTo($(v));
                    $(v).css("margin-left", 0);
                }
            });

        }, 20)




    })
    config.timer = setInterval(function () {

    }, 2000);


    // $('.item').animate({
    //     scrollLeft: -$('.item').width()
    // }, 200, function () {
    //     $('.item').append($('.item .img:first').clone());
    //     $('.item .img:first').remove();
    // });

    // /*将left值置为0*/
    // $('.item').animate({
    //     left: 0
    // }, 0);
}
// 音效 方波：square 正弦波：sine 三角波：triangle 锯齿波：sawtooth
function soundEffect(url) {
    if (isEmpty(url)) {
        // 创建音频上下文  
        var audioCtx = new AudioContext();
        var source = null;
        var stopSound = function () {
            if (source) {
                source.stop(0); //立即停止
            }
        }
        var playSound = function () {
            source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.loop = false; //循环播放
            source.connect(audioCtx.destination);
            source.start(0); //立即播放
        }
        var initSound = function (arrayBuffer) {
            audioCtx.decodeAudioData(arrayBuffer, function (buffer) { //解码成功时的回调函数
                audioBuffer = buffer;
                playSound();
            }, function (e) { //解码出错时的回调函数
                console.log(e);
            });
        }
        var url = '../../framework/audio/click.mp3';
        var xhr = new XMLHttpRequest(); //通过XHR下载音频文件
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function (e) { //下载完成
            initSound(this.response);
        };
        xhr.send();
    } else {
        var audioCtx = new AudioContext();
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);

        gainNode.connect(audioCtx.destination);
        oscillator.type = 'triangle'; //音调类型  square sine triangle sawtooth
        oscillator.frequency.value = 100.00;
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
        oscillator.start(audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
        oscillator.stop(audioCtx.currentTime + 1);
    }
}
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
// 是否空字符串
function isEmpty(param) {
    if (param == null || param == "" || typeof (param) == "undefined" || typeof (param) == "null" || param == "undefined") {
        return true;
    }
    return false;
}
// 初始化
function init() {
    createImages();
    adaption();
}

// 监听窗口变化
window.addEventListener('resize', function () {
    autoArrange();
}, false)

init();
