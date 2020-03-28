//  1，加载一个图片作为挡板
//  2，挡板需要左右移动
// 3.22 自己修改的挡板移动

// 获取画布
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// console.log('canvas', canvas)

var log = console.log.bind(console)
// 设置横条坐标，移动坐标
var x = 150
var y = 200

// 加载图片
var img = new Image();   // 创建img元素
img.src = '../paddle.png'; // 设置图片源地址

img.onload = function () {
  // 加载图片
  ctx.drawImage(img, x, y)
}
/*
1，检测到按下的状态，拿到是a，还是d
2，如果是a，就需要左移动，如果是d，就右移动
3，根据如果是左移动，就是setInterval，x -10，如果是右，就 setInterval x + 10，所以要拿到左右移动的状态
*/

// 根据一个按键的状态来设置
// 设置是否按下的状态
var isAKeyDown = false
var isDKeyDown = false

window.addEventListener('keydown', function () {
  var k = event.key
  // log('event', event)
  if (k == 'a') {
    isAKeyDown = true
  } else if (k == 'd') {
    isDKeyDown = true
  }
  keyDown(isAKeyDown, isDKeyDown)
})

window.addEventListener('keyup', function () {
  var k = event.key
  // log('event', event)
  if (k == 'a') {
    isAKeyDown = false
  } else if (k == 'd') {
    isDKeyDown = false
  }
  keyDown(isAKeyDown, isDKeyDown)
})

// 需要封装一个函数
var keyDown = function (isAKeyDown, isDKeyDown) {
  log('isAKeyDown, isDKeyDown', isAKeyDown, isDKeyDown)
  if (isAKeyDown) {
    x -= 10
    setInterval(function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, x, y)
    }, 1000 / 30)
  } else if (isDKeyDown) {
    x += 10
    setInterval(function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, x, y)
    }, 1000 / 30)
  }
}