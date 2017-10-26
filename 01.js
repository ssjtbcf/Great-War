var begin = document.getElementById("begin");
var main = document.getElementById("main");
var maindiv = document.getElementById("maindiv");
var end = document.getElementById("end");
var endScore = document.getElementById("endScore");
var maindiv = document.getElementById("maindiv");
var label = document.getElementById("label");
var stop = document.getElementById("zanting");
var chongxin = document.getElementById("chongxin");

var score = 0;

//开始按钮的点击事件
var set;
begin.onclick = function() {
	main.style.display = "none";
	maindiv.style.display = "block";
	// 间歇调用函数
	set = setInterval(start, 20);
}
chongxin.onclick = function() {
	window.location.reload();
	
}


//创建飞机类构造函数
function Plane(hp, x, y, width, height, imagesrc, score, sudu, boomimage) {
	this.planeX = x;
	this.planeY = y;
	this.planeWidth = width;
	this.planeHeight = height;

	//新增节点
	this.planeScore = score;
	this.planeSudu = sudu;
	this.planeisDie = false;
	this.planeHp = hp;	//飞机血量
	this.planeBoomImage = boomimage;


	//创建飞机节点
	this.imageNode = null;
	//初始化图片节点
	this.init = function() {
		this.imageNode = document.createElement('img');
		this.imageNode.style.left = this.planeX + "px";
		this.imageNode.style.top = this.planeY + "px";
		this.imageNode.src = imagesrc;
		maindiv.appendChild(this.imageNode);
	}
	this.init();
	//添加飞机移动方法
	this.planeMove = function() {
		if (score < 5000) {
			this.imageNode.style.top = this.imageNode.offsetTop + this.planeSudu + 'px';
		} else if (score >= 5000 && score < 15000) {
			this.imageNode.style.top = this.imageNode.offsetTop + this.planeSudu + 10 + 'px';
		} else if (score >= 15000 && score < 20000) {
			this.imageNode.style.top = this.imageNode.offsetTop + this.planeSudu + 3 + 'px';
		} else if (score >= 20000 && score < 25000) {
			this.imageNode.style.top = this.imageNode.offsetTop + this.planeSudu + 4 + 'px';
		} else {
			this.imageNode.style.top = this.imageNode.offsetTop + this.planeSudu + 6 + 'px';
		}
	}
}



//创建本方飞机类
function OurPlane(x, y) {
	Plane.call(this, 1, x, y, 66, 80, "image/我的飞机.gif", 0, 0, 'image/本方飞机爆炸.gif');
	this.imageNode.setAttribute('id', 'ourplane');

}
//创建本方飞机
var selfplane = new OurPlane(127, 450);
var ourPlane = document.getElementById('ourplane');

//飞机随鼠标移动
function place() {
	var e = arguments[0] || window.event;
	var selfplaneX = e.clientX;
	var selfplaneY = e.clientY;
	ourPlane.style.left = selfplaneX - 400 - selfplane.planeWidth / 2 + 'px';
	ourPlane.style.top = selfplaneY - selfplane.planeHeight / 2 + 'px';
}
//检测越界
function yuejie() {
	var e = arguments[0] || window.event;
	var mouseX = e.clientX;
	var mouseY = e.clientY;
	if (mouseX < 400 || mouseX > 720 || mouseY < 0 || mouseY > 568) {
		maindiv.removeEventListener('mousemove', place, true);
	} else {
		maindiv.addEventListener('mousemove', place, true);
	}
	// console.log(mouseX,mouseY)
}
// var body = document.getElementsByTagName('body')[0];
// document.body.addEventListener('mousemove', yuejie);


//添加事件
if (document.addEventListener) {

	maindiv.addEventListener('mousemove', place, true); //本方飞机的yidong事件

	document.body.addEventListener('mousemove', yuejie, true); //本方飞机的bianjie事件

	//给本方飞机添加点击事件,暂停
	selfplane.imageNode.addEventListener('click', zanting);

	stop.getElementsByTagName('button')[0].addEventListener('click', zanting);

} else if (document.attachEvent) {

	maindiv.attachEvent('onmousemove', place);

	document.body.attachEvent('onmousemove', yuejie);
	selfplane.imageNode.attachEvent('click', zanting);

	stop.getElementsByTagName('button')[0].attachEvent('click', zanting);
}



//创建敌方飞机构造函数
function Enemy(hp, a, b, width, height, imagesrc, score, sudu, boomimage) {
	Plane.call(this, hp, random(a, b), -170, width, height, imagesrc, score, sudu, boomimage);
}
//创建随机数函数,确定敌机坐标
function random(min, max) {
	return Math.random() * (max - min) + min;
}

//创建子弹类构造函数
function Bullet(x, y, width, height, imagesrc) {
	this.bulletX = x;
	this.bulletY = y;
	this.bulletWidth = width;
	this.bulletHeight = height;
	//创建子弹节点
	this.bulletimageNode = null;

	this.bulletAttack = 1;
	//初始化子弹图片节点
	this.init = function() {
		this.bulletimageNode = document.createElement('img');
		this.bulletimageNode.style.left = this.bulletX + "px";
		this.bulletimageNode.style.top = this.bulletY + "px";
		this.bulletimageNode.src = imagesrc;
		maindiv.appendChild(this.bulletimageNode);
	}
	this.init();

	//添加子弹移动方法
	this.bulletMove = function() {
		this.bulletimageNode.style.top = this.bulletimageNode.offsetTop - 20 + 'px';
	}

}
//创建子弹
function AddBullet(x, y) {
	Bullet.call(this, x, y, 6, 14, 'image/bullet1.png');
	// this.bulletimageNode.setAttribute('id', 'bullett');
}



//循环方法
var bgpositionY = 0;

var mark1 = 0; //创建敌机时机
var mark2 = 0; //创建敌机类型时机
var enemys = []; //创建敌机数组
var bullets = [] //创建子弹数组
var k = 0;

function start() {
	//背景滚动
	maindiv.style.backgroundPositionY = bgpositionY + "px";
	bgpositionY += 0.5;


	//创建敌机对象
	//Enemy(a,b,width,height,imagesrc)
	mark1++;
	if (mark1 == 30) { //开始创建敌机
		mark2++;
		if (mark2 % 7 == 0) { //创建中型飞机
			enemys.push(new Enemy(10, 0, 269, 46, 60, 'image/enemy3_fly_1.png', 1000, random(1, 2), 'image/中飞机爆炸.gif'))
		}
		if (mark2 % 19 == 0) { //创建大型飞机
			enemys.push(new Enemy(30, 0, 205, 110, 164, 'image/enemy2_fly_1.png', 1500, 0.7, 'image/大飞机爆炸.gif'));
		} else { //创建小型飞机
			enemys.push(new Enemy(5, 0, 290, 34, 24, 'image/enemy1_fly_1.png', 500, random(1, 3), 'image/小飞机爆炸.gif'));
		}
		mark1 = 0;
	}
	//敌机移动
	var enemyLen = enemys.length;
	for (var i = 0; i < enemyLen; i++) {
		if (enemys[i].planeisDie != true) {
			enemys[i].planeMove();
			//判断敌机是否出界
			if (enemys[i].imageNode.offsetTop > 568) {
				maindiv.removeChild(enemys[i].imageNode);
				enemys.splice(i, 1);
				enemyLen--;
			}
		}
		//敌机爆炸,移除节点
		if (enemys[i].planeisDie == true) {
			k += 2;
			if (k % 20 == 0) {
				maindiv.removeChild(enemys[i].imageNode);

				enemys.splice(i, 1);

				enemysLen--;
			}
		}
	}


	//创建子弹
	// var bulletX = selfplane.imageNode.offsetLeft + selfplane.planeWidth / 2;
	// var bulletY = selfplane.imageNode.offsetTop - 10;



	if (mark1 % 3 == 0) {
		// bullets.push(new AddBullet(bulletX, bulletY));
		var bullet1 = new AddBullet(parseInt(selfplane.imageNode.style.left)+ 33,parseInt(selfplane.imageNode.style.top) );
		// var bullet2 = new AddBullet(parseInt(selfplane.imageNode.style.left), parseInt(selfplane.imageNode.style.top) );
		// var bullet3 = new AddBullet(parseInt(selfplane.imageNode.style.left) + 66, parseInt(selfplane.imageNode.style.top) );
		// var bullet4 = new AddBullet(parseInt(selfplane.imageNode.style.left)+ 16.5,parseInt(selfplane.imageNode.style.top) );
		// var bullet5 = new AddBullet(parseInt(selfplane.imageNode.style.left)+ 49.5,parseInt(selfplane.imageNode.style.top) );




		bullets.push(bullet1);
		// bullets.push(bullet2);
		// bullets.push(bullet3);
		// bullets.push(bullet4);
		// bullets.push(bullet5);



	}
	//遍历子弹   让子弹飞
	var bulletLen = bullets.length;
	for (var i = 0; i < bulletLen; i++) {
		bullets[i].bulletMove();
		//判断子弹是否出界
		if (bullets[i].bulletimageNode.offsetTop < 0) {
			maindiv.removeChild(bullets[i].bulletimageNode);
			bullets.splice(i, 1);
			bulletLen--;
		}
	}



	//碰撞检测
	for (var i = 0; i < bulletLen; i++) {
		for (var j = 0; j < enemyLen; j++) {
			//检测本机与敌机碰撞
			if (enemys[j].planeisDie == false) {

				if (enemys[j].imageNode.offsetLeft + enemys[j].planeWidth >= selfplane.imageNode.offsetLeft + 20 && enemys[j].imageNode.offsetLeft <= selfplane.imageNode.offsetLeft + selfplane.planeWidth - 20) {

					if (enemys[j].imageNode.offsetTop + enemys[j].planeHeight >= selfplane.imageNode.offsetTop + 30 && enemys[j].imageNode.offsetTop <= selfplane.imageNode.offsetTop + selfplane.planeHeight - 10) {

						selfplane.imageNode.src = 'image/本方飞机爆炸.gif';
						//碰撞移除事件
						if (document.removeEventListener) {

							maindiv.removeEventListener('mousemove', place, true);
							document.body.removeEventListener('mousemove', yuejie, true);
						} else if (document.detachEvent) {

							maindiv.detachEvent('onmousemove', place);
							document.body.detachEvent('onmousemove', yuejie);

						}
						//清除定时器
						clearInterval(set);

						end.style.display = 'block';

						endScore.innerHTML = score;
					}
				}


				//判断子弹与敌机的碰撞
				if (bullets[i].bulletimageNode.offsetLeft + bullets[i].bulletWidth >= enemys[j].imageNode.offsetLeft && bullets[i].bulletimageNode.offsetLeft <= enemys[j].imageNode.offsetLeft + enemys[j].planeWidth) {
					if (bullets[i].bulletimageNode.offsetTop + bullets[i].bulletHeight >= enemys[j].imageNode.offsetTop && bullets[i].bulletimageNode.offsetTop <= enemys[j].imageNode.offsetTop + enemys[j].planeHeight) {

						//判断血量与攻击力的差值
						enemys[j].planeHp = enemys[j].planeHp - bullets[i].bulletAttack;
						//血量为0
						if (enemys[j].planeHp == 0) {


							enemys[j].planeisDie = true;


							enemys[j].imageNode.src = enemys[j].planeBoomImage;

							//分数变量
							score += enemys[j].planeScore;
							label.innerHTML = score;

						}
							//碰撞时移除子弹节点
						maindiv.removeChild(bullets[i].bulletimageNode);
						bullets.splice(i, 1);
						bulletLen--;

						break;

					}
				}

			}
		}
	}
}

var num = 0;
	//暂停界面
function zanting() {
	if (num == 0) {//暂停
		stop.style.display = 'block';
		if (document.removeEventListener) {
			//暂停后移除事件
			maindiv.removeEventListener('mousemove', place, true);
			document.body.removeEventListener('mousemove', yuejie, true);

		} else if (document.detachEvent) {

			maindiv.detachEvent('onmousemove', place);
			document.body.detachEvent('onmousemove', yuejie);
		}
		//清除定时器
		clearInterval(set);
		num = 1;
	} else {//继续
		stop.style.display = 'none';
			//继续后,添加事件
		if (document.addEventListener) {

			maindiv.addEventListener('mousemove', place, true);
			document.body.addEventListener('mousemove', yuejie, true);

		} else if (document.attachEvent) {

			maindiv.attachEvent('onmousemove', place);
			document.body.attachEvent('onmousemove', yuejie);
		}
		//开启定时器
		set = setInterval(start, 20);
		num = 0;
	}

}

//重新开始函数

function again() {
	window.location.reload();
}