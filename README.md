# gua-game
# gua-game

## 1，实现功能：挡板左右移动
实现方案：
1）获取图片上下文
2）载入挡板图片
3）添加事件，设置按下状态，根据事件更新按下状态
4）设置定时器，每一个时间更新挡板图片的坐标，
5）在定时器中刷新画布，重新根据坐标渲染画布（以达到移动的效果）
```js
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var x = 150
var y = 200
var speed = 5
// 加载图片
var img = new Image()
img.src = '../paddle.png'
img.onload = function () {
  context.drawImage(img, x, y)
}
var leftDown = false
var rightDown = false
window.addEventListener('keydown', function (event) {
  var k = event.key
  if (k == 'a') {
    leftDown = true
  } else if (k == 'd') {
    rightDown = true
  }
})
window.addEventListener('keyup', function () {
  var k = event.key
  if (k == 'a') {
    leftDown = false
  } else if (k == 'd') {
    rightDown = false
  }
})
setInterval(function () {
  if (leftDown) {
    x -= speed
  } else if (rightDown) {
    x += speed
  }
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.drawImage(img, x, y)
}, 1000 / 30)
```

## 2，实现功能：封装挡板作为一个类
实现方案：
1，定义函数的一个入口
2，封装paddle对象，将与之有关的都封装起来
3，所以在使用这个对象的时候，就需要使用实例的特性方法修改
比如坐标的修改 就是paddle.x -= paddle.speed
```js
// 定义获取图片函数 
var imageFromPath = function (path) {   // 修改 单独封装图片获取的函数
  var img = new Image()
  img.src = path
  return img
}
// 封装挡板类对象，所以paddle的内容放到这个类中 
var Paddle = function () {             // 修改，定义一个paddle类
  var image = imageFromPath('../paddle.png')
  // 使用工厂定义类的方法
  var o = {
    image : image,
    x:100,
    y:200,
    speed:5, 
  }
  return o
}
 
var __main = function () {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  // 实例化挡板
  var paddle = Paddle()
  var leftDown = false
  var rightDown = false
  window.addEventListener('keydown', function (event) {
    var k = event.key
    if (k == 'a') {
      leftDown = true
    } else if (k == 'd') {
      rightDown = true
    }
  })
  window.addEventListener('keyup', function () {
    var k = event.key
    if (k == 'a') {
      leftDown = false
    } else if (k == 'd') {
      rightDown = false
    }
  })
  setInterval(function () {
    if (leftDown) {
      paddle.x -= paddle.speed
    } else if (rightDown) {
      paddle.x += paddle.speed
    }
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(paddle.image, paddle.x, paddle.y)
  }, 1000 / 30)
}
__main()
```
出现一个报错：找不到image
原因分析：是因为定义paddle类的时候，没有返回这个类的工厂o，所以导致实例化不成功。

## 3，实现功能：不能在对象实例化以后的外面去修改它的值，而是直接调用它的方法
1，定义o的moveLeft 和 moveRight方法（不能再外面修改实例，而是需要调用实例的 方法）
```js
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
  o.moveLeft = function() {   // 修改，在类内部定义方法
    o.x -= o.speed
  }
  o.moveRight = function() {    // 修改，在类内部定义方法
    o.x += o.speed
  }
  return o
}
 
var __main = function () {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  // 实例化挡板
  var paddle = Paddle()
  var leftDown = false
  var rightDown = false
  window.addEventListener('keydown', function (event) {
    var k = event.key
    if (k == 'a') {
      leftDown = true
    } else if (k == 'd') {
      rightDown = true
    }
  })
  window.addEventListener('keyup', function () {
    var k = event.key
    if (k == 'a') {
      leftDown = false
    } else if (k == 'd') {
      rightDown = false
    }
  })
  setInterval(function () {
    if (leftDown) {
      paddle.moveLeft()  // 修改 ，直接引入实例的方法
    } else if (rightDown) {
      paddle.moveRight()  // 修改，直接引入实例的方法
    }
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(paddle.image, paddle.x, paddle.y)
  }, 1000 / 30)
}
__main()
```
好处：这样可以由一个人单独做paddle，使用的时候直接引入文件，利于团队分工


## 4，需要把所有游戏的构成元素抽离出主函数，主函数只保留游戏元素的实例
方案：
1，抽离所有的游戏元素，封装为游戏类
2，然后在主函数中，实例化game以后，就每次更新game就可以，其他的内容需要放到类里面
具体实现：
1，把更新画布的操作也放在游戏类
2，更新画布的步骤是update坐标，清空画布，再重新draw画布，所以需要在类里面注册方法，在外面调用方法
3，在主函数中，重写 update函数和draw（因为需要使用到主函数里面的leftDown的状态）
```js
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
  var g = {}
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  g.canvas = canvas
  g.context = context
  setInterval(function() {
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
  var leftDown = false
  var rightDown = false
  window.addEventListener('keydown', function (event) {
    var k = event.key
    if (k == 'a') {
      leftDown = true
    } else if (k == 'd') {
      rightDown = true
    }
  })
  window.addEventListener('keyup', function () {
    var k = event.key
    if (k == 'a') {
      leftDown = false
    } else if (k == 'd') {
      rightDown = false
    }
  })
  // 重写 update函数
  game.update = function() {
    if (leftDown) {
      paddle.moveLeft()
    } else if (rightDown) {
      paddle.moveRight()
    }
  }
  // 重写draw函数
  game.draw = function() {
    game.context.drawImage(paddle.image, paddle.x, paddle.y)
  }
}
__main()
```

## 5，把按键事件也定义在game类里面，这样就可以给一堆的按键注册事件，而不会影响主函数
方案：【 打表】
在类里面定义一个状态，给每一个需要定义的状态按键进行回调函数操作，把操作的按键和事件对应起来（可能就是他们说的打表，一个名称对应一个事件）
【打表的写法】
1，定义一个表（对象有 key， value）
2，根据key，执行对应的 value，所以需要使用一个注册函数，把这两个东西对应起来，这个是给对应的key赋值value回调函数
  g.registerActions = function(key, callback) {
    g.actions[key] = callback
  }
3，遍历这个表，根据key，对应的把表中所有的value回调函数绑定起来，当有对应的key，就执行对应的函数
所以可以使用 Object.keys 可以返回一个可以枚举的数组以便遍历 
4，在游戏中，需要根据 key的状态来执行对应的 value函数，
    var actions = Object.keys(g.actions) // Object.keys 可以返回一个可以枚举的数组以便遍历
    for (var i = 0; i < actions.length; i++) {
      var key = actions[i]
      if(g.keydowns[key]) {   // 如果按下，就调用对应的按键回调函数
        g.actions[key]()
      }
    }
游戏的具体执行：
1，在game类中，给定义一个存储按键和它的回调函数的对象
2，再定义一个按键的按下状态对象，保存按键 和 它的按下状态，[event.key] 可以拿到按下的的按键
3，根据事件修改存储的按键的状态
4，定义给按键绑定的事件，就是使用打表的方法，把按键和回调绑定起来
5，在主函数中，直接根据对应的按键，调用对应的事件
6，删除原来定义的left状态和对应的函数
```js
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
```