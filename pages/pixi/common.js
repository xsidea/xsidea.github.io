const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,    // default: false 反锯齿
    transparent: false, // default: false 透明度
    resolution: 1       // default: 1 分辨率
});
document.body.appendChild(app.view);

// 监听窗口变化
function resize(){
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.view.style.top = "0";
    app.renderer.view.style.left = "0";
    app.renderer.autoResize = true;
    app.renderer.resize(window.innerWidth, window.innerHeight);
}
function renderInit(){
    resize();// 监听窗口变化
}

// 监听窗口变化
window.addEventListener('resize', function () {
    resize();
}, false)

renderInit();
