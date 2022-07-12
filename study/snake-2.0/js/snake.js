import { mySetInterval ,cancelMySetInterval} from './setInterval.js'

/** 蛇移动方向 */
const direction = {
  left: "left",
  right: "right",
  up: "up",
  down: "down",
};

/** 浮层参数 */
const overType = {
  end: "end",
};

const snakeWrapper = document.querySelector(".snake__area");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cover = document.getElementById("cover");
const score = document.getElementById("score");
const buttonStart = document.getElementById("buttonStart");
const buttonTodo = document.getElementById("buttonTodo");
class Snake {
  constructor(params) {
    this.size = params.size || 20; // 每个格子的大小
    this.width = params.width || 500; // 游戏区域的宽度
    this.height = params.height || 500; // 游戏区域的高度
    this.colorFood = params.colorFood || "yellow"; //食物颜色
    this.colorSnake = params.colorSnake || "orange"; //蛇身颜色
    this.colorHead = params.colorHead || "white"; //蛇头颜色
    this.snake = []; // 蛇的身体
    this.keyDown = direction.right; //按键
    this.timer = null; //定时器
    this.food = []; //食物位置数组
    this.speed = 200; //初始速度
    this.isPause = false; //是否暂停
    this.isOver = false; //是否结束
    this.scoreValue = 0; //分数
    this.grid = []; // 格子数
    for (let i = 0; i < this.width / this.size; i++) {
      for (let j = 0; j < this.height / this.size; j++) {
        this.grid.push([i, j]);
      }
    }
  }
  /**
   * 开始渲染
   */
  render() {
    this.reset();
    this._createSnake();
    this._createFood();
    this._getDirection();
    this._moving(this.keyDown);
    buttonTodo.classList.remove("is-disabled");
  }
  /**
   * 重置所有状态和样式
   */
  reset() {
    snakeWrapper.style.width = `${this.width}px`;
    snakeWrapper.style.height = `${this.width}px`;
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.style.background = `${this._createBackgroundGrid('to bottom')}, ${this._createBackgroundGrid('to right')}`;
    cover.style.display = "none";
    score.innerText = 0;
    this.scoreValue = 0;
    this.isOver = false;
    this.isPause = false;
    this.keyDown = direction.right;
  }
  /**
   * 创建蛇身
   */
  _createSnake() {
    this.snake = [
      [2, 1],
      [1, 1],
      [0, 1],
    ];
  }

  /**
   * 创建背景格子
   * @param {string} corner 渐变线的起始点位置，传入的值与css渐变side-or-corner的值对应。
   * @returns 返回渐变的值
   */
  _createBackgroundGrid(corner){
    return `repeating-linear-gradient(${corner},transparent 0 ${
      this.size - 1}px, #fff ${this.size}px)`
  }

  /**
   * 绘制
   */
  _draw() {
    //每次绘制都要清除画布
    ctx.clearRect(0, 0, this.width, this.height);

    // 绘制食物
    ctx.fillStyle = this.colorFood;
    this._fillRect(this.food[0], this.food[1]);

    // 绘制蛇头
    ctx.fillStyle = this.colorHead;
    this._fillRect(this.snake[0][0], this.snake[0][1]);

    // 绘制蛇身
    ctx.fillStyle = this.colorSnake;
    for (let i = 1; i < this.snake.length; i++) {
      this._fillRect(this.snake[i][0], this.snake[i][1]);
    }
  }
  /**
   * 绘制函数
   * @param {number} x x坐标
   * @param {number} y y坐标
   */

  _fillRect(x, y) {
    ctx.fillRect(x * this.size, y * this.size, this.size, this.size);
  }

  /**
   * 蛇移动
   */
  _moving() {
    if (this.timer) {
      cancelMySetInterval(this.timer);
    }

    this.timer = mySetInterval(() => {
      let [x, y] = this.snake[0];
      switch (this.keyDown) {
        case direction.left:
          x--;
          break;
        case direction.right:
          x++;
          break;
        case direction.up:
          y--;
          break;
        case direction.down:
          y++;
          break;
      }

      // 判断是否撞墙
      if (
        x > this.width / this.size - 1 ||
        x < 0 ||
        y > this.height / this.size - 1 ||
        y < 0
      ) {
        this.showCover("撞墙啦, 游戏结束...(｡•ˇ‸ˇ•｡) ...", overType.end);
        return;
      }
      // 判断是否撞自己
      if (
        this.snake.some((item) => {
          return item[0] === x && item[1] === y;
        })
      ) {
        this.showCover("撞自己啦, 游戏结束...(｡•ˇ‸ˇ•｡) ...", overType.end);
        return;
      }
      // 判断是否走完格子
      if (
        this.snake.length ===
        ((this.width / this.size) * this.height) / this.size
      ) {
        this.showCover("恭喜你, 已经走完啦, 游戏结束＼(＠＾０＾＠)/",overType.end);
        return;
      }

      // 判断是否吃到食物
      this.snake.unshift([x, y]);

      if (x === this.food[0] && y === this.food[1]) {
        this._createFood();
        this._getDirection();
        this.scoreValue += 10;
        score.innerHTML = this.scoreValue;
      } else {
        this.snake.pop();
      }
      this._draw();
    }, this.speed);
  }

  /**
   * 浮层,暂停或结束时弹出
   * @param {string} text 浮层显示的文本
   * @param {string} type 类型,目前参数只有'end'
   */
  showCover(text, type) {
    cover.style.display = "flex";
    cover.innerHTML = `<p>${text}</p>`;
    cancelMySetInterval(this.timer);

    if (type === overType.end) {
      ctx.clearRect(0, 0, this.width, this.height);
      this.isOver = true;
      buttonTodo.classList.add("is-disabled");
    }
    return;
  }

  /**
   * 游戏暂停,暂停时弹出浮层
   */
  pause() {
    if (!this.isPause) {
      this.isPause = true;
      cancelMySetInterval(this.timer);
      this.showCover("游戏暂停中~");
      buttonTodo.innerHTML = "继续"
      return;
    } else {
      cover.style.display = "none";
      this._moving(this.keyDown);
      this.isPause = false;
      buttonTodo.innerHTML = "暂停";
    }
  }

  /**
   * 创建食物
   */
  _createFood() { 
    let tempGrid = [];
    // 创建临时数组，存放非蛇身的坐标
    for (let i = 0; i < this.grid.length; i++) {
      let mark = true;
      for (let j = 0; j < this.snake.length; j++) {
        if (
          this.grid[i][0] === this.snake[j][0] &&
          this.grid[i][1] === this.snake[j][1]
        ) {
          mark = false;
        }
      }
      if (mark) {
        tempGrid.push(this.grid[i]);
      }
    }
    // 随机取出坐标为食物
    const index = this._getRandom(0, tempGrid.length - 1);
    this.food = tempGrid[index];
  }
  /**
   * 获取方向
   */
  _getDirection() {
    document.body.addEventListener("keydown", (e) => {
      if (this.isOver) return;
      //console.log(e, e.key, "key");
      switch (e.key) {
        case "ArrowLeft":
          if (this.keyDown === direction.right || this.isPause) return;
          this.keyDown = direction.left;
          break;
        case "ArrowUp":
          if (this.keyDown === direction.down || this.isPause) return;
          this.keyDown = direction.up;
          break;
        case "ArrowRight":
          if (this.keyDown === direction.left || this.isPause) return;
          this.keyDown = direction.right;
          break;
        case "ArrowDown":
          if (this.keyDown === direction.up || this.isPause) return;
          this.keyDown = direction.down;
          break;
      }
    });
  }

  /**
   * 生成某个范围的随机数
   * @param {number} 范围小值
   * @param {number} 范围大值
   * @returns 返回随机数
   */
  _getRandom(min, max) {
    const index = Math.floor(Math.random() * (max - min + 1) + min);
    return index;
  }
}

let snake = new Snake({});
snake.reset();

/** 监听S和P键，控制暂停和继续 */
document.body.addEventListener("keydown", (e) => {
  if (e.key.toLocaleLowerCase() === "p") {
    snake.pause();
  } else if (e.key.toLocaleLowerCase() === "s") {
    snake.render();
    buttonStart.innerHTML = "重新开始";
  }
});

/** 点击开始或重新开始游戏按钮 */
buttonStart.addEventListener("click", function () {
  let level = 0
  const radios = document.getElementsByName('level')
  for(let i = 0; i< radios.length;i++){
    if(radios[i].checked === true){
      level = radios[i].value
    }
  }
  snake.speed = level;
  snake.render();
  this.innerHTML = "重新开始";
  
});

/** 点击暂停或继续按钮 */
buttonTodo.addEventListener("click", function () {
  snake.pause();
  
});
