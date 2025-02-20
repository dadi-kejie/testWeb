//Vanilla JS

//PLAY IN FULL PAGE VIEW!


window.addEventListener("DOMContentLoaded", game);

//General sprite load
var sprite = new Image();
var spriteExplosion = new Image();
sprite.src = 'https://marclopezavila.github.io/planet-defense-game/img/sprite.png';

window.onload = function() {
    spriteExplosion.src = 'https://marclopezavila.github.io/planet-defense-game/img/explosion.png';
};

//Game
function game() {

    //Canvas
    var canvas = document.getElementById('canvas'),
        ctx    = canvas.getContext('2d'),
        cH     = ctx.canvas.height = window.innerHeight,
        cW     = ctx.canvas.width  = window.innerWidth ;

    //Game
    var bullets    = [],
        asteroids  = [],
        explosions = [],
        destroyed  = 0,
        record     = 0,
        count      = 0,
        playing    = false,
        gameOver   = false,
        _planet    = {deg: 0};

    //Player
    var player = {
        posX   : -35,
        posY   : -(100+82),
        width  : 70,
        height : 79,
        deg    : 0
    };

    canvas.addEventListener('click', action);
    canvas.addEventListener('mousemove', action);
    window.addEventListener("resize", update);

    function update() {
        cH = ctx.canvas.height = window.innerHeight;
        cW = ctx.canvas.width  = window.innerWidth ;
    }

    function move(e) {
        player.deg = Math.atan2(e.offsetX - (cW/2), -(e.offsetY - (cH/2)));
    }

    function action(e) {
        e.preventDefault();
        if(playing) {
            var bullet = {
                x: -8,
                y: -179,
                sizeX : 2,
                sizeY : 10,
                realX : e.offsetX,
                realY : e.offsetY,
                dirX  : e.offsetX,
                dirY  : e.offsetY,
                deg   : Math.atan2(e.offsetX - (cW/2), -(e.offsetY - (cH/2))),
                destroyed: false
            };

            bullets.push(bullet);
        } else {
            var dist;
            if(gameOver) {
                dist = Math.sqrt(((e.offsetX - cW/2) * (e.offsetX - cW/2)) + ((e.offsetY - (cH/2 + 45 + 22)) * (e.offsetY - (cH/2+ 45 + 22))));
                if (dist < 27) {
                    if(e.type == 'click') {
                        gameOver   = false;
                        count      = 0;
                        bullets    = [];
                        asteroids  = [];
                        explosions = [];
                        destroyed  = 0;
                        player.deg = 0;
                        canvas.removeEventListener('contextmenu', action);
                        canvas.removeEventListener('mousemove', move);
                        canvas.style.cursor = "default";
                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            } else {
                dist = Math.sqrt(((e.offsetX - cW/2) * (e.offsetX - cW/2)) + ((e.offsetY - cH/2) * (e.offsetY - cH/2)));

                if (dist < 27) {
                    if(e.type == 'click') {
                        playing = true;
                        canvas.removeEventListener("mousemove", action);
                        canvas.addEventListener('contextmenu', action);
                        canvas.addEventListener('mousemove', move);
                        canvas.setAttribute("class", "playing");
                        canvas.style.cursor = "default";
                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            }
        }
    }

    function fire() {
        var distance;

        for(var i = 0; i < bullets.length; i++) {
            if(!bullets[i].destroyed) {
                ctx.save();
                ctx.translate(cW/2,cH/2);
                ctx.rotate(bullets[i].deg);

                ctx.drawImage(
                    sprite,
                    211,
                    100,
                    50,
                    75,
                    bullets[i].x,
                    bullets[i].y -= 20,
                    19,
                    30
                );

                ctx.restore();

                //Real coords
                bullets[i].realX = (0) - (bullets[i].y + 10) * Math.sin(bullets[i].deg);
                bullets[i].realY = (0) + (bullets[i].y + 10) * Math.cos(bullets[i].deg);

                bullets[i].realX += cW/2;
                bullets[i].realY += cH/2;

                //Collision
                for(var j = 0; j < asteroids.length; j++) {
                    if(!asteroids[j].destroyed) {
                        distance = Math.sqrt(Math.pow(
                                asteroids[j].realX - bullets[i].realX, 2) +
                            Math.pow(asteroids[j].realY - bullets[i].realY, 2)
                        );

                        if (distance < (((asteroids[j].width/asteroids[j].size) / 2) - 4) + ((19 / 2) - 4)) {
                            destroyed += 1;
                            asteroids[j].destroyed = true;
                            bullets[i].destroyed   = true;
                            explosions.push(asteroids[j]);
                        }
                    }
                }
            }
        }
    }

    function planet() {
        ctx.save();
        ctx.fillStyle   = 'white';
        ctx.shadowBlur    = 100;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor   = "#999";

        ctx.arc(
            (cW/2),
            (cH/2),
            100,
            0,
            Math.PI * 2
        );
        ctx.fill();

        //Planet rotation
        ctx.translate(cW/2,cH/2);
        ctx.rotate((_planet.deg += 0.1) * (Math.PI / 180));
        ctx.drawImage(sprite, 0, 0, 200, 200, -100, -100, 200,200);
        ctx.restore();
    }

    function _player() {

        ctx.save();
        ctx.translate(cW/2,cH/2);

        ctx.rotate(player.deg);
        ctx.drawImage(
            sprite,
            200,
            0,
            player.width,
            player.height,
            player.posX,
            player.posY,
            player.width,
            player.height
        );

        ctx.restore();

        if(bullets.length - destroyed && playing) {
            fire();
        }
    }

    function newAsteroid() {

        var type = random(1,4),
            coordsX,
            coordsY;

        switch(type){
            case 1:
                coordsX = random(0, cW);
                coordsY = 0 - 150;
                break;
            case 2:
                coordsX = cW + 150;
                coordsY = random(0, cH);
                break;
            case 3:
                coordsX = random(0, cW);
                coordsY = cH + 150;
                break;
            case 4:
                coordsX = 0 - 150;
                coordsY = random(0, cH);
                break;
        }

        var asteroid = {
            x: 278,
            y: 0,
            state: 0,
            stateX: 0,
            width: 134,
            height: 123,
            realX: coordsX,
            realY: coordsY,
            moveY: 0,
            coordsX: coordsX,
            coordsY: coordsY,
            size: random(1, 3),
            deg: Math.atan2(coordsX  - (cW/2), -(coordsY - (cH/2))),
            destroyed: false
        };
        asteroids.push(asteroid);
    }

    function _asteroids() {
        var distance;

        for(var i = 0; i < asteroids.length; i++) {
            if (!asteroids[i].destroyed) {
                ctx.save();
                ctx.translate(asteroids[i].coordsX, asteroids[i].coordsY);
                ctx.rotate(asteroids[i].deg);

                ctx.drawImage(
                    sprite,
                    asteroids[i].x,
                    asteroids[i].y,
                    asteroids[i].width,
                    asteroids[i].height,
                    -(asteroids[i].width / asteroids[i].size) / 2,
                    asteroids[i].moveY += 1/(asteroids[i].size),
                    asteroids[i].width / asteroids[i].size,
                    asteroids[i].height / asteroids[i].size
                );

                ctx.restore();

                //Real Coords
                asteroids[i].realX = (0) - (asteroids[i].moveY + ((asteroids[i].height / asteroids[i].size)/2)) * Math.sin(asteroids[i].deg);
                asteroids[i].realY = (0) + (asteroids[i].moveY + ((asteroids[i].height / asteroids[i].size)/2)) * Math.cos(asteroids[i].deg);

                asteroids[i].realX += asteroids[i].coordsX;
                asteroids[i].realY += asteroids[i].coordsY;

                //Game over
                distance = Math.sqrt(Math.pow(asteroids[i].realX -  cW/2, 2) + Math.pow(asteroids[i].realY - cH/2, 2));
                if (distance < (((asteroids[i].width/asteroids[i].size) / 2) - 4) + 100) {
                    gameOver = true;
                    playing  = false;
                    canvas.addEventListener('mousemove', action);
                }
            } else if(!asteroids[i].extinct) {
                explosion(asteroids[i]);
            }
        }

        if(asteroids.length - destroyed < 10 + (Math.floor(destroyed/6))) {
            newAsteroid();
        }
    }

    function explosion(asteroid) {
        ctx.save();
        ctx.translate(asteroid.realX, asteroid.realY);
        ctx.rotate(asteroid.deg);

        var spriteY,
            spriteX = 256;
        if(asteroid.state == 0) {
            spriteY = 0;
            spriteX = 0;
        } else if (asteroid.state < 8) {
            spriteY = 0;
        } else if(asteroid.state < 16) {
            spriteY = 256;
        } else if(asteroid.state < 24) {
            spriteY = 512;
        } else {
            spriteY = 768;
        }

        if(asteroid.state == 8 || asteroid.state == 16 || asteroid.state == 24) {
            asteroid.stateX = 0;
        }

        ctx.drawImage(
            spriteExplosion,
            asteroid.stateX += spriteX,
            spriteY,
            256,
            256,
            - (asteroid.width / asteroid.size)/2,
            -(asteroid.height / asteroid.size)/2,
            asteroid.width / asteroid.size,
            asteroid.height / asteroid.size
        );
        asteroid.state += 1;

        if(asteroid.state == 31) {
            asteroid.extinct = true;
        }

        ctx.restore();
    }

    function start() {
        if(!gameOver) {
            //Clear
            ctx.clearRect(0, 0, cW, cH);
            ctx.beginPath();

            //Planet
            planet();

            //Player
            _player();

            if(playing) {
                _asteroids();

                ctx.font = "20px Verdana";
                ctx.fillStyle = "white";
                ctx.textBaseline = 'middle';
                ctx.textAlign = "left";
                ctx.fillText('Record: '+record+'', 20, 30);

                ctx.font = "40px Verdana";
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = 'middle';
                ctx.strokeText(''+destroyed+'', cW/2,cH/2);
                ctx.fillText(''+destroyed+'', cW/2,cH/2);

            } else {
                ctx.drawImage(sprite, 428, 12, 70, 70, cW/2 - 35, cH/2 - 35, 70,70);
            }
        } else if(count < 1) {
            count = 1;
            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.rect(0,0, cW,cH);
            ctx.fill();

            ctx.font = "60px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER",cW/2,cH/2 - 150);

            ctx.font = "20px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Total destroyed: "+ destroyed, cW/2,cH/2 + 140);

            record = destroyed > record ? destroyed : record;

            ctx.font = "20px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("RECORD: "+ record, cW/2,cH/2 + 185);

            ctx.drawImage(sprite, 500, 18, 70, 70, cW/2 - 35, cH/2 + 40, 70,70);

            canvas.removeAttribute('class');
        }
    }

    function init() {
        window.requestAnimationFrame(init);
        start();
    }

    init();

    //Utils
    function random(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }

    if(~window.location.href.indexOf('full')) {
        var full = document.getElementsByTagName('a');
        full[0].setAttribute('style', 'display: none');
    }
}// 等待文档加载完成后启动游戏
window.addEventListener("DOMContentLoaded", game);

// 通用精灵图加载
var sprite = new Image(); // 创建精灵图对象
var spriteExplosion = new Image(); // 创建爆炸精灵图对象
sprite.src = 'https://marclopezavila.github.io/planet-defense-game/img/sprite.png'; // 设置精灵图的源

// 窗口加载后设置爆炸精灵图的源
window.onload = function() {
    spriteExplosion.src = 'https://marclopezavila.github.io/planet-defense-game/img/explosion.png';
};

// 游戏主函数
function game() {

    // 创建画布和上下文
    var canvas = document.getElementById('canvas'), // 获取画布元素
        ctx    = canvas.getContext('2d'), // 获取 2D 绘图上下文
        cH     = ctx.canvas.height = window.innerHeight, // 设置画布高度为窗口高度
        cW     = ctx.canvas.width  = window.innerWidth; // 设置画布宽度为窗口宽度

    // 初始化游戏变量
    var bullets    = [], // 子弹数组
        asteroids  = [], // 陨石数组
        explosions = [], // 爆炸数组
        destroyed  = 0, // 被摧毁的陨石数量
        record     = 0, // 最高分记录
        count      = 0, // 计数器
        playing    = false, // 游戏是否进行中
        gameOver   = false, // 游戏是否结束
        _planet    = {deg: 0}; // 行星的旋转角度

    // 玩家对象
    var player = {
        posX   : -35, // 玩家飞船的 X 坐标
        posY   : -(100 + 82), // 玩家飞船的 Y 坐标
        width  : 70, // 玩家飞船的宽度
        height : 79, // 玩家飞船的高度
        deg    : 0 // 玩家飞船的旋转角度
    };

    // 画布事件监听
    canvas.addEventListener('click', action); // 监听点击事件
    canvas.addEventListener('mousemove', action); // 监听鼠标移动事件
    window.addEventListener("resize", update); // 监听窗口大小变化事件

    // 更新画布大小
    function update() {
        // 更新画布的高度和宽度
        cH = ctx.canvas.height = window.innerHeight;
        cW = ctx.canvas.width  = window.innerWidth;
    }

    // 处理移动
    function move(e) {
        // 计算玩家飞船的角度
        player.deg = Math.atan2(e.offsetX - (cW / 2), -(e.offsetY - (cH / 2)));
    }

    // 处理用户动作（点击或移动鼠标）
    function action(e) {
        e.preventDefault(); // 防止默认事件
        if (playing) {
            // 如果正在游戏中，则发射子弹
            var bullet = {
                x: -8, // 子弹初始 X 坐标
                y: -179, // 子弹初始 Y 坐标
                sizeX: 2, // 子弹宽度
                sizeY: 10, // 子弹高度
                realX: e.offsetX, // 子弹的真实 X 坐标
                realY: e.offsetY, // 子弹的真实 Y 坐标
                dirX: e.offsetX, // 子弹的目标 X 坐标
                dirY: e.offsetY, // 子弹的目标 Y 坐标
                deg: Math.atan2(e.offsetX - (cW / 2), -(e.offsetY - (cH / 2))), // 计算子弹的角度
                destroyed: false // 子弹是否被摧毁
            };

            bullets.push(bullet); // 将子弹添加到数组中
        } else {
            var dist; // 存储计算的距离
            if (gameOver) {
                // 如果游戏结束，检查是否重新开始
                dist = Math.sqrt(((e.offsetX - cW / 2) * (e.offsetX - cW / 2)) + ((e.offsetY - (cH / 2 + 45 + 22)) * (e.offsetY - (cH / 2 + 45 + 22))));
                if (dist < 27) { // 如果点击位置在按钮区域内
                    if (e.type == 'click') {
                        // 重新开始游戏
                        gameOver = false;
                        count = 0;
                        bullets = [];
                        asteroids = [];
                        explosions = [];
                        destroyed = 0;
                        player.deg = 0;
                        canvas.removeEventListener('contextmenu', action);
                        canvas.removeEventListener('mousemove', move);
                        canvas.style.cursor = "default"; // 恢复鼠标指针样式
                    } else {
                        canvas.style.cursor = "pointer"; // 鼠标指针变为手型
                    }
                } else {
                    canvas.style.cursor = "default"; // 恢复鼠标指针样式
                }
            } else {
                // 游戏进行中，检查首次点击开始游戏
                dist = Math.sqrt(((e.offsetX - cW / 2) * (e.offsetX - cW / 2)) + ((e.offsetY - cH / 2) * (e.offsetY - cH / 2)));

                if (dist < 27) { // 如果点击位置在按钮区域内
                    if (e.type == 'click') {
                        // 开始游戏
                        playing = true;
                        canvas.removeEventListener("mousemove", action);
                        canvas.addEventListener('contextmenu', action);
                        canvas.addEventListener('mousemove', move);
                        canvas.setAttribute("class", "playing"); // 设置画布状态为正在游戏
                        canvas.style.cursor = "default"; // 恢复鼠标指针样式
                    } else {
                        canvas.style.cursor = "pointer"; // 鼠标指针变为手型
                    }
                } else {
                    canvas.style.cursor = "default"; // 恢复鼠标指针样式
                }
            }
        }
    }

    // 发射子弹
    function fire() {
        var distance; // 存储子弹与陨石的距离

        for (var i = 0; i < bullets.length; i++) {
            if (!bullets[i].destroyed) { // 如果子弹未被摧毁
                ctx.save(); // 保存当前绘图状态
                ctx.translate(cW / 2, cH / 2); // 移动到画布中心
                ctx.rotate(bullets[i].deg); // 根据角度旋转

                // 绘制子弹
                ctx.drawImage(
                    sprite,
                    211, // 精灵图中子弹的起始 X 坐标
                    100, // 精灵图中子弹的起始 Y 坐标
                    50,  // 子弹在精灵图中的宽度
                    75,  // 子弹在精灵图中的高度
                    bullets[i].x, // 子弹在画布中的位置 X
                    bullets[i].y -= 20, // 子弹在画布中的位置 Y，向上移动
                    19, // 子弹绘制的宽度
                    30  // 子弹绘制的高度
                );

                ctx.restore(); // 恢复绘图状态

                // 更新真实坐标
                bullets[i].realX = (0) - (bullets[i].y + 10) * Math.sin(bullets[i].deg);
                bullets[i].realY = (0) + (bullets[i].y + 10) * Math.cos(bullets[i].deg);

                bullets[i].realX += cW / 2; // 更新 X 坐标
                bullets[i].realY += cH / 2; // 更新 Y 坐标

                // 碰撞检测
                for (var j = 0; j < asteroids.length; j++) {
                    if (!asteroids[j].destroyed) { // 如果陨石未被摧毁
                        distance = Math.sqrt(Math.pow(
                            asteroids[j].realX - bullets[i].realX, 2) +
                            Math.pow(asteroids[j].realY - bullets[i].realY, 2)
                        );

                        // 如果子弹与陨石碰撞
                        if (distance < (((asteroids[j].width / asteroids[j].size) / 2) - 4) + ((19 / 2) - 4)) {
                            destroyed += 1; // 增加被摧毁的计数
                            asteroids[j].destroyed = true; // 陨石标记为被摧毁
                            bullets[i].destroyed   = true; // 子弹标记为被摧毁
                            explosions.push(asteroids[j]); // 添加到爆炸数组
                        }
                    }
                }
            }
        }
    }

    // 绘制行星
    function planet() {
        ctx.save(); // 保存当前绘图状态
        ctx.fillStyle = 'white'; // 设置填充颜色为白色
        ctx.shadowBlur = 100; // 设置阴影模糊程度
        ctx.shadowOffsetX = 0; // 设置阴影 X 偏移量
        ctx.shadowOffsetY = 0; // 设置阴影 Y 偏移量
        ctx.shadowColor = "#999"; // 设置阴影颜色

        // 绘制行星
        ctx.arc(
            (cW / 2), // 行星中心 X
            (cH / 2), // 行星中心 Y
            100, // 行星半径
            0, // 起始角度
            Math.PI * 2 // 结束角度
        );
        ctx.fill(); // 填充行星颜色

        // 行星旋转
        ctx.translate(cW / 2, cH / 2); // 移动到画布中心
        ctx.rotate((_planet.deg += 0.1) * (Math.PI / 180)); // 旋转行星
        ctx.drawImage(sprite, 0, 0, 200, 200, -100, -100, 200, 200); // 绘制行星
        ctx.restore(); // 恢复绘图状态
    }

    // 绘制玩家飞船
    function _player() {
        ctx.save(); // 保存当前绘图状态
        ctx.translate(cW / 2, cH / 2); // 移动到画布中心

        ctx.rotate(player.deg); // 根据玩家飞船的角度旋转
        ctx.drawImage(
            sprite,
            200, // 精灵图中飞船的起始 X 坐标
            0, // 精灵图中飞船的起始 Y 坐标
            player.width, // 飞船的宽度
            player.height, // 飞船的高度
            player.posX, // 飞船在画布中的位置 X
            player.posY, // 飞船在画布中的位置 Y
            player.width, // 绘制时的宽度
            player.height // 绘制时的高度
        );

        ctx.restore(); // 恢复绘图状态

        if (bullets.length - destroyed && playing) {
            fire(); // 如果有未被摧毁的子弹，调用发射函数
        }
    }

    // 创建新的陨石
    function newAsteroid() {
        var type = random(1, 4), // 生成随机陨石类型
            coordsX, // 陨石的 X 坐标
            coordsY; // 陨石的 Y 坐标

        // 根据类型决定陨石的生成坐标
        switch(type) {
            case 1: // 从上方生成
                coordsX = random(0, cW); // 随机生成 X 坐标
                coordsY = 0 - 150; // Y 坐标设置为顶部外部
                break;
            case 2: // 从右侧生成
                coordsX = cW + 150; // X 坐标设置为右侧外部
                coordsY = random(0, cH); // 随机生成 Y 坐标
                break;
            case 3: // 从下方生成
                coordsX = random(0, cW); // 随机生成 X 坐标
                coordsY = cH + 150; // Y 坐标设置为底部外部
                break;
            case 4: // 从左侧生成
                coordsX = 0 - 150; // X 坐标设置为左侧外部
                coordsY = random(0, cH); // 随机生成 Y 坐标
                break;
        }

        // 创建新的陨石对象
        var asteroid = {
            x: 278, // 精灵图中陨石的起始 X 坐标
            y: 0, // 精灵图中陨石的起始 Y 坐标
            state: 0, // 陨石的当前状态
            stateX: 0, // 当前状态的 X 坐标
            width: 134, // 陨石的宽度
            height: 123, // 陨石的高度
            realX: coordsX, // 陨石的真实 X 坐标
            realY: coordsY, // 陨石的真实 Y 坐标
            moveY: 0, // 陨石的 Y 轴移动量
            coordsX: coordsX, // 初始 X 坐标
            coordsY: coordsY, // 初始 Y 坐标
            size: random(1, 3), // 随机生成的大小
            deg: Math.atan2(coordsX - (cW / 2), -(coordsY - (cH / 2))), // 计算陨石的角度
            destroyed: false // 陨石是否被摧毁
        };
        asteroids.push(asteroid); // 将新陨石添加到陨石数组
    }

    // 绘制所有陨石
    function _asteroids() {
        var distance; // 存储陨石与玩家的距离

        for (var i = 0; i < asteroids.length; i++) {
            if (!asteroids[i].destroyed) { // 如果陨石未被摧毁
                ctx.save(); // 保存当前绘图状态
                ctx.translate(asteroids[i].coordsX, asteroids[i].coordsY); // 移动到陨石位置
                ctx.rotate(asteroids[i].deg); // 根据角度旋转

                // 绘制陨石
                ctx.drawImage(
                    sprite,
                    asteroids[i].x, // 精灵图中陨石的起始 X 坐标
                    asteroids[i].y, // 精灵图中陨石的起始 Y 坐标
                    asteroids[i].width, // 陨石的宽度
                    asteroids[i].height, // 陨石的高度
                    -(asteroids[i].width / asteroids[i].size) / 2, // 绘制时的中心 X 坐标
                    asteroids[i].moveY += 1 / (asteroids[i].size), // Y 坐标向下移动
                    asteroids[i].width / asteroids[i].size, // 绘制时的宽度
                    asteroids[i].height / asteroids[i].size // 绘制时的高度
                );

                ctx.restore(); // 恢复绘图状态

                // 更新陨石的真实坐标
                asteroids[i].realX = (0) - (asteroids[i].moveY + ((asteroids[i].height / asteroids[i].size) / 2)) * Math.sin(asteroids[i].deg);
                asteroids[i].realY = (0) + (asteroids[i].moveY + ((asteroids[i].height / asteroids[i].size) / 2)) * Math.cos(asteroids[i].deg);

                asteroids[i].realX += asteroids[i].coordsX; // 更新 X 坐标
                asteroids[i].realY += asteroids[i].coordsY; // 更新 Y 坐标

                // 碰撞检测，检查陨石是否触碰到行星
                distance = Math.sqrt(Math.pow(asteroids[i].realX - cW / 2, 2) + Math.pow(asteroids[i].realY - cH / 2, 2));
                if (distance < (((asteroids[i].width / asteroids[i].size) / 2) - 4) + 100) { // 如果陨石与行星碰撞
                    gameOver = true; // 游戏结束
                    playing = false; // 停止游戏
                    canvas.addEventListener('mousemove', action); // 重新添加鼠标移动事件监听
                }
            } else if (!asteroids[i].extinct) { // 如果陨石已被摧毁且未消失
                explosion(asteroids[i]); // 播放爆炸效果
            }
        }

        // 根据摧毁的数量来生成新陨石
        if (asteroids.length - destroyed < 10 + (Math.floor(destroyed / 6))) {
            newAsteroid(); // 创建新的陨石
        }
    }

    // 绘制陨石爆炸效果
    function explosion(asteroid) {
        ctx.save(); // 保存当前绘图状态
        ctx.translate(asteroid.realX, asteroid.realY); // 移动到陨石的位置
        ctx.rotate(asteroid.deg); // 根据角度旋转

        var spriteY, // 爆炸精灵图的 Y 坐标
            spriteX = 256; // 爆炸精灵图的 X 坐标
        if (asteroid.state == 0) {
            spriteY = 0; // 初始状态
            spriteX = 0; // 初始 X 坐标
        } else if (asteroid.state < 8) {
            spriteY = 0; // 第一阶段动画
        } else if (asteroid.state < 16) {
            spriteY = 256; // 第二阶段动画
        } else if (asteroid.state < 24) {
            spriteY = 512; // 第三阶段动画
        } else {
            spriteY = 768; // 第四阶段动画
        }

        if (asteroid.state == 8 || asteroid.state == 16 || asteroid.state == 24) {
            asteroid.stateX = 0; // 重置 X 坐标
        }

        // 绘制爆炸效果
        ctx.drawImage(
            spriteExplosion, // 爆炸精灵图
            asteroid.stateX += spriteX, // 更新 X 坐标
            spriteY, // Y 坐标
            256, // 精灵图中的宽度
            256, // 精灵图中的高度
            - (asteroid.width / asteroid.size) / 2, // 绘制时的中心 X 坐标
            - (asteroid.height / asteroid.size) / 2, // 绘制时的中心 Y 坐标
            asteroid.width / asteroid.size, // 绘制时的宽度
            asteroid.height / asteroid.size // 绘制时的高度
        );
        asteroid.state += 1; // 增加动画状态

        // 如果动画完毕，将陨石标记为消失
        if (asteroid.state == 31) {
            asteroid.extinct = true;
        }

        ctx.restore(); // 恢复绘图状态
    }

    // 游戏主循环
    function start() {
        if (!gameOver) {
            // 清空画布
            ctx.clearRect(0, 0, cW, cH); // 清空指定区域
            ctx.beginPath(); // 开始绘制新路径

            // 绘制行星
            planet();

            // 绘制玩家飞船
            _player();

            if (playing) { // 如果游戏进行中
                _asteroids(); // 绘制陨石

                // 绘制得分信息
                ctx.font = "20px Verdana"; // 设置字体和大小
                ctx.fillStyle = "white"; // 设置文本颜色
                ctx.textBaseline = 'middle'; // 设置文本基线
                ctx.textAlign = "left"; // 设置文本对齐方式
                ctx.fillText('Record: ' + record + '', 20, 30); // 绘制记录信息

                ctx.font = "40px Verdana"; // 设置字体和大小
                ctx.fillStyle = "white"; // 设置文本颜色
                ctx.strokeStyle = "black"; // 设置文本轮廓颜色
                ctx.textAlign = "center"; // 设置文本对齐方式
                ctx.textBaseline = 'middle'; // 设置文本基线
                ctx.strokeText('' + destroyed + '', cW / 2, cH / 2); // 绘制得分轮廓
                ctx.fillText('' + destroyed + '', cW / 2, cH / 2); // 绘制得分
            } else {
                // 游戏结束后显示的图标
                ctx.drawImage(sprite, 428, 12, 70, 70, cW / 2 - 35, cH / 2 - 35, 70, 70);
            }
        } else if (count < 1) { // 如果游戏结束且计数器未更新
            count = 1; // 更新计数器
            ctx.fillStyle = 'rgba(0,0,0,0.75)'; // 设置半透明黑色背景
            ctx.rect(0, 0, cW, cH); // 绘制背景矩形
            ctx.fill(); // 填充矩形

            ctx.font = "60px Verdana"; // 设置字体和大小
            ctx.fillStyle = "white"; // 设置文本颜色
            ctx.textAlign = "center"; // 设置文本对齐方式
            ctx.fillText("GAME OVER", cW / 2, cH / 2 - 150); // 显示游戏结束信息

            ctx.font = "20px Verdana"; // 设置字体和大小
            ctx.fillStyle = "white"; // 设置文本颜色
            ctx.textAlign = "center"; // 设置文本对齐方式
            ctx.fillText("Total destroyed: " + destroyed, cW / 2, cH / 2 + 140); // 显示摧毁数量

            // 更新记录
            record = destroyed > record ? destroyed : record;

            ctx.font = "20px Verdana"; // 设置字体和大小
            ctx.fillStyle = "white"; // 设置文本颜色
            ctx.textAlign = "center"; // 设置文本对齐方式
            ctx.fillText("RECORD: " + record, cW / 2, cH / 2 + 185); // 显示最高记录

            ctx.drawImage(sprite, 500, 18, 70, 70, cW / 2 - 35, cH / 2 + 40, 70, 70); // 显示重来图标
            canvas.removeAttribute('class'); // 移除正在游戏状态的类
        }
    }

    // 初始化请求动画帧
    function init() {
        window.requestAnimationFrame(init); // 循环调用自己以创建动画
        start(); // 开始绘制
    }

    init(); // 启动游戏

    // 工具函数：生成随机数
    function random(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from; // 返回一个指定范围内的随机整数
    }

    // 对于 URL 中包含 'full' 的情形，隐藏全屏链接
    if (~window.location.href.indexOf('full')) {
        var full = document.getElementsByTagName('a');
        full[0].setAttribute('style', 'display: none'); // 隐藏全屏链接
    }
}