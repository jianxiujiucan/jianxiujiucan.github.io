class Snake {
  constructor(params) {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext("2d");
    this.cover = document.getElementById('cover');
    this.score = document.getElementById('score');
    this.size = 20 // 每个格子的大小
    this.width = 500; // 游戏区域的宽度
    this.height = 500;  // 游戏区域的高度
    this.snake = []; // 蛇的身体
    this.colorFood = 'orange'; //食物颜色
    this.colorSnake = '#666';   //蛇身颜色
    this.colorHead = 'red';    //蛇头颜色
    
    this.direction = { //蛇移动方向
      left: 'left',
      right: 'right',
      up: 'up',
      down: 'down'
    },
    this.keyDown = this.direction.right; //按键
    this.timer = null; //定时器
    this.food = []; //食物位置数组
    this.speed = 150; //初始速度
    this.isPause = false; //是否暂停
    this.isOver = false; //是否结束
    this.scoreValue = 0; //分数
    this.gameOverCallBack = params.gameOverCallBack; // 游戏结束回调
  }
  /**
   * 开始渲染 
   */
  render() {
    this.init()
    this._createFood()
    this._createSnake()
    this._getDirection()
    this._moving(this.keyDown)
    console.log('开始')
  }
  /**
   * 初始化
   */
  init() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.cover.style.display = 'none';
    this.score.innerText = 0;
    this.isOver = false;
    this.keyDown = this.direction.right
  }
  /**
   * 创建蛇身
   */
  _createSnake() {
    this.snake = [
      [2, 1],
      [1, 1],
      [0, 1]
    ];
  }
  /**
   * 绘制
   */
  _draw() {
    //每次绘制都要清除画布
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 绘制食物
    this.ctx.fillStyle = this.colorFood;
    this.ctx.fillRect(this.food[0] * this.size, this.food[1] * this.size, this.size, this.size);

    // 绘制蛇头
    this.ctx.fillStyle = this.colorHead;
    this.ctx.fillRect(this.snake[0][0] * this.size, this.snake[0][1] * this.size, this.size, this.size);

    // 绘制蛇身
    this.ctx.fillStyle = this.colorSnake;
    for (let i = 1; i < this.snake.length; i++) {
      this.ctx.fillRect(this.snake[i][0] * this.size, this.snake[i][1] * this.size, this.size, this.size);
    }
  }

  _moving() {
    if (this.timer) {
      clearInterval(this.timer)
    }

    this.timer = setInterval(() => {
      let [x, y] = this.snake[0];
      switch (this.keyDown) {
        case this.direction.left:
          x--;
          break
        case this.direction.right:
          x++
          break
        case this.direction.up:
          y--
          break
        case this.direction.down:
          y++
          break
      }

      // 判断是否撞墙
      if (x > this.width / this.size - 1 || x < 0 || y > this.height / this.size - 1 || y < 0) {
        this.showCover('撞墙啦, 游戏结束...(｡•ˇ‸ˇ•｡) ...', 'end')
        return
      }
      // 判断是否撞自己
      if (this.snake.some((item) => {
        return item[0] === x && item[1] === y
      })) {
        this.showCover('撞自己啦, 游戏结束...(｡•ˇ‸ˇ•｡) ...', 'end')
        return
      }
      // 判断是否走完格子
      if (this.snake.length === this.width / this.size * this.height / this.size) {
        this.showCover('恭喜你, 已经走完啦, 游戏结束＼(＠＾０＾＠)/', 'end')
        return
      }
      // 判断是否吃到食物
      if (x === this.food[0] && y === this.food[1]) {
        this.snake.unshift([x, y])
        this._createFood()
        this._getDirection()
        this.scoreValue += 10
        this.score.innerHTML = this.scoreValue
      } else {
        this.snake.unshift([x, y])
        this.snake.pop()
      }
      this._draw()
    }, this.speed);
  }

  /**
   * 浮层,暂停或结束时弹出
   * @param {string} text 文本
   * @param {string} type 类型
   */
  showCover(text, type) {
    this.cover.style.display = 'flex'
    this.cover.innerHTML = `<p>${text}</p>`
    clearInterval(this.timer)
    if (type === 'end') {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.isOver = true;
      if ("function" === typeof this.gameOverCallBack) {
        this.gameOverCallBack();
      }
    }
    return
  }
  /**
   * 游戏暂停,暂停时弹出浮层
  */
  pause() {
    if (!this.isPause) {
      this.isPause = true
      clearInterval(this.timer)
      this.showCover('游戏暂停中~')
      return
    } else {
      console.log('取消暂停')
      this.cover.style.display = 'none'
      this._moving(this.keyDown)
      this.isPause = false
    }
  }
  /**
   * 获取食物
   */
  _createFood() {
    this.food = [this._randomNumber(), this._randomNumber()]
    this.snake.forEach(item => {
      if (this.food[0] === item[0] && this.food[1] === item[1]) {
        return this._createFood()
      }
    })
  }
  /**
   * 获取方向
  */ 
  _getDirection() {
    document.body.addEventListener('keydown', (e) => {
      if (this.isOver) return
      console.log(e.key,'key')
      switch (e.key) {
        case 'ArrowLeft':
          if (this.keyDown === this.direction.right || this.isPause) return
          this.keyDown = this.direction.left;
          break;
        case 'ArrowUp':
          if (this.keyDown === this.direction.down || this.isPause) return
          this.keyDown = this.direction.up;
          break;
        case 'ArrowRight':
          if (this.keyDown === this.direction.left  || this.isPause) return
          this.keyDown = this.direction.right;
          break;
        case 'ArrowDown':
          if (this.keyDown === this.direction.up  || this.isPause) return
          this.keyDown = this.direction.down;
          break;
        case 's':
        case 'S':
          this.pause()  
          break;
      }
    })
  }
  /**
   * 随机位置
   * @returns {number}
  */
  _randomNumber() {
    return parseInt((this.width / this.size - 1) * Math.random())
  }
}