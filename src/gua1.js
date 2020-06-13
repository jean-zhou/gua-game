var log = console.log.bind(console)

var imageFromPath = function (path) {
  var img = new Image()
  img.src = path
  return img
}

var Paddle = function () {
  var image = imageFromPath('../paddle.png')
  var o = {
    x: 150,
    y: 200,
    speed: 10,
    image: image,
  }
  o.moveLeft = function () {
    o.x -= o.speed
  }
  o.moveRight = function () {
    o.x += o.speed
  }
  return o
}

var Game = function () {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var g = {
    canvas: canvas,
    ctx: ctx,
    actions: {},
    keyDowns: {},
  }

  window.addEventListener('keydown', function (event) {
    g.keyDowns[event.key] = true
  })

  window.addEventListener('keyup', function () {
    g.keyDowns[event.key] = false
  })

  // 1，打表（注册回调）
  g.registerActions = function (keyCode, callback) {
    g.actions[keyCode] = callback
  }

  g.drawImage = function (guaImag) {
    g.ctx.drawImage(guaImag.image, guaImag.x, guaImag.y)
  }

  setInterval(function () {
    var actions = Object.keys(g.actions) 
    for (var i = 0; i < actions.length; i++) {
      var key = actions[i]
      if (g.keyDowns[key]) { 
        g.actions[key]()
      }
    }
    g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height)

    g.draw()
  }, 1000 / 30)
  return g
}

var __main = function () {
  var paddle = Paddle()
  var game = Game()

  game.registerActions('a', function () {
    paddle.moveLeft()
  })
  game.registerActions('d', function () {
    paddle.moveRight()
  })

  game.draw = function () {
    game.drawImage(paddle)
  }
}
__main()

/**
 * 1，注册事件
 * 
 * 代码规范：
 * 1，命名
 * 2，空格，分号，
 * 3，风格统一：命名的风格，逗号分号， 定义数组加s，小驼峰，类名大写，全局变量全大写
 * 4，用const，let
 * 5，优化的规范
 */