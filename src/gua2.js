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

  // 相撞的方法，这里是判断两个图片相撞，参数传入另外一个图片
  // 判断相撞，所以是返回一个boolean
  o.collide = function(ball) {
    // 看传入图片的坐标和原来的图片的坐标
    if( ball.y + ball.image.height > o.y) {
      // 条件判断里面的并且，可以写成双重判断
      if( ball.x > o.x && ball.x < o.x + o.image.width) {
        // 相撞的时候
        return true
      }
    }
    return false
  }
  return o
}

// 添加ball元素
var Ball = function () {
  var image = imageFromPath('../ball.png')
  var o = {
    image: image,
    x: 100,
    y: 200,
    // 对于ball来说，由于会反弹，所以需要两个速度，
    // 在反弹的时候，x 的坐标不变，但是y 的坐标向反方向移动
    // 
    speedX: 5,
    speedY: 5,
    fired:false
  }
  o.fire = function() {
    o.fired = true
  }
  o.move = function() {
    // 需要在move里面修改ball的坐标
    // ball的横纵坐标都需要修改
    // 坐标加上速度
    // 根据paddle的想法，需要有一个按键修改状态， f
    // 然后注册发射的事件 fire
    // 发射的时候，需要更新横纵坐标 move
    if (o.fired) {
      // 需要判断是否撞墙，继续move
      if (o.x < 0 || o.x + o.image.width > 400) {
        o.speedX = - o.speedX
      }

      if (o.y < 0 || o.y + o.image.height> 300) {
        o.speedY = - o.speedY
      }
      // move
      o.x += o.speedX
      o.y += o.speedY
    }
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

  // 给画布添加元素
  g.drawImage = function(guaImag) {
    g.context.drawImage(guaImag.image, guaImag.x, guaImag.y)

  }
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

//  主函数，保持一个函数接口
var __main = function () {

  // 实例化游戏类
  var game = GuaGame()

  // 实例化挡板
  var paddle = Paddle()

  // 实例化一个球
  var ball = Ball()

  // 给对应的按键 绑定 对应的事件
   game.registerActions('a', function() {
     paddle.moveLeft()
   })

  game.registerActions('d', function () {
    paddle.moveRight()
  })

  // 给 f 注册事件
  // 点击的时候更新fire的状态
  // 然后在画布更新的时候更新 ball的坐标然后重新渲染
  game.registerActions('f', function () {
    ball.fire()
  })

  // 重写 update函数
  // 每一次更新paddle坐标的时候，也需要更新ball的坐标
  game.update = function() {
    //  这个时候需要使ball动
    ball.move()
    // 这里是执行相撞以后的方法
    if (paddle.collide(ball)) {
      // 判断相撞，就取反坐标
      ball.speedY = - ball.speedY
    }

  }
  // 重写draw函数，画paddle 还需要画ball
  game.draw = function() {
    game.drawImage(paddle)
    game.drawImage(ball)
  }
}

__main()