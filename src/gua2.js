var log = console.log.bind(console)

// 定义获取图片函数
var imageFromPath = function (path) {
  var img = new Image()
  img.src = path

  return img
}

// 封装挡板类对象，所以paddle的内容放到这个类中
var Paddle = function () {
  var image = imageFromPath('../paddle.png')
  // console.log('paddle', image)
  // 使用工厂定义类的方法
  var o = {
    image : image,
    x:100,
    y:200,
    speed:5, 
  }
  o.moveLeft = function() {
    o.x -= o.speed

  }
  o.moveRight = function() {
    o.x += o.speed

  }
  return o
}

// 封装游戏元素类
var GuaGame = function() {
  var g = {
    actions: {},  // 存储按键和它的回调函数
    keydowns:{},  // 存储按键的状态

  }
  // 画布功能
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  g.canvas = canvas
  g.context = context

  // 定义按键事件状态
  // [event.key] 可以拿到按下的的按键
  // 给按下按键绑定状态，使用定义的 g.keydowns 对象 的 key 赋值
  window.addEventListener('keydown', function(event) {
    g.keydowns[event.key] = true
  })

  // 按下的时候，更新g.keydowns的各对象的状态
  window.addEventListener('keyup', function (event) {
    g.keydowns[event.key] = false
  })

  // 给按键绑定回调函数 (这是一个打表功能)
  g.registerActions = function(key, callback) {
    g.actions[key] = callback
  }

  // 定时器更新画布功能
  setInterval(function() {
    // 在定时器里面循环执行按键对应的事件，更新坐标，更新画布
    var actions = Object.keys(g.actions) 
    for (var i = 0; i < actions.length; i++) {
      var key = actions[i]
      if(g.keydowns[key]) {   // 如果按下，就调用对应的按键回调函数
        g.actions[key]()
      }
    }
    // update
    g.update()
    // clear
    context.clearRect(0, 0, canvas.width, canvas.height)
    // draw
    g.draw()
  }, 1000/30)
  return g
}

 
var __main = function () {

  // 实例化游戏类
  var game = GuaGame()

  // 实例化挡板
  var paddle = Paddle()

  // 给对应的按键 绑定 对应的事件
   game.registerActions('a', function() {
     paddle.moveLeft()
   })

  game.registerActions('d', function () {
    paddle.moveRight()
  })

  // 重写 update函数
  game.update = function() {
  }
  // 重写draw函数
  game.draw = function() {
    game.context.drawImage(paddle.image, paddle.x, paddle.y)
  }
}

__main()