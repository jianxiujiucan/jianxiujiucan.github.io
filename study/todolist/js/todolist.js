const inputWrite = document.getElementById("inputWrite");
const buttonAdd = document.getElementById("buttonAdd");
const list = document.getElementById("list");
const todoTips = document.getElementById("todoTips");
const clearAll = document.getElementById("clearAll");
const iconClear = document.getElementById("iconClear");
const todoItem = document.getElementById("todoItem");
const completedItem = document.getElementById("completedItem");

/** 存储的数据 */
let dataBase = [];

if (localStorage.getItem("localData") !== null) {
  // 如果本地有数据，则取本地的数据
  dataBase = JSON.parse(window.localStorage.getItem("localData"));
}

/** 初次渲染列表 */
renderData(dataBase);

/**
 * 渲染列表
 * @param {Array} data 传入的数据
 */
function renderData(data) {
  let elements = "";
  console.log(data,'传入的数据')
  if (data.lenght === 0) {
    list.innerHTML = "暂无数据";
  } else {
    clearAll.style.display = "flex";
    for (let i = 0; i < data.length; i++) {
      elements += `<li data-index="${i}" class="todo-list__item"><input data-index="${i}" class="checkbox" type="checkbox" ${
        data[i].completed ? "checked" : ""
      } onclick="completeTask(this)"><div class="todo-list__content" data-index="${i}"><p class="todo-list__text ${
        data[i].completed ? "is-completed" : ""
      }">${data[i].content}</p><p class="todo-list__time">${transformTime(
        data[i].time
      )}</p></div>
        <div class="todo-list__operate">
          <span class="todo-list__button todo-list__button--edit" data-index="${i}" title="Edit" onclick="editTask(this)"><i class="icon-edit"></i></span>
          <span class="todo-list__button todo-list__button--save" data-index="${i}" title="Save" onclick="saveTask(this)"><i  class="icon-save"></i></span>
          <span class="todo-list__button todo-list__button--delete" data-index="${i}" title="Delete" onclick="deleteTask(this)"><i data-index="${i}"class="icon-delete"></i></span>
        </div></li>`;
    }
    list.innerHTML = elements;
  }
}

/**
 * 日期转换
 * @param {Number} time 
 * @returns 返回格式：年-月-日 时:分:秒
 * @example
 * 2022-08-25 15:30:06
 */
function transformTime(time) {
  const date = new Date(time);
  Y = date.getFullYear() + "-";
  M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  D = date.getDate() + " ";
  h = date.getHours().toString().padStart(2, "0") + ":";
  m = date.getMinutes().toString().padStart(2, "0") + ":";
  s = date.getSeconds().toString().padStart(2, "0");
  return Y + M + D + h + m + s;
}

/**
 * 切换完整列表
 */
todoItem.addEventListener("click", function () {
  this.classList.add("is-active");
  completedItem.classList.remove("is-active");
  renderData(dataBase)
});

/**
 * 切换已完成列表
 */
completedItem.addEventListener("click", function () {
  this.classList.add("is-active");
  todoItem.classList.remove("is-active");
  let newarr = dataBase.slice()
  renderData(newarr.filter((item) => item.completed === true))
});

/**
 * 输入框获取焦点时，隐藏错误提示
 */
inputWrite.addEventListener("focus", () => {
  if (todoTips.classList.contains("is-show")) {
    todoTips.classList.remove("is-show");
  }
});


/**
 * 添加输入框点击时，清除图标显示 
 */
inputWrite.addEventListener("input", () => {
  iconClear.style.display = "block";
});

/**
 * 清除按钮点击时，清空文本框内容
 */
iconClear.addEventListener("click", function () {
  inputWrite.value = "";
  this.style.display = "none";
});

/**
 * 添加按钮点击时，添加数据，并渲染列表
 */
buttonAdd.addEventListener("click", () => {
  if (inputWrite.value === "") {
    todoTips.classList.add("is-show");
  } else {
    dataBase.unshift({
      content: inputWrite.value,
      completed: false,
      time: Date.now(),
    });
    localStorage.setItem("localData", JSON.stringify(dataBase));
    renderData(dataBase);
    inputWrite.value = "";
    iconClear.style.display = "none";
  }
});

/**
 * 编辑任务
 * @param {element} event 
 */
function editTask(event) {
  const contentItems = document.querySelectorAll(".todo-list__content");
  const saveItems = document.querySelectorAll(".todo-list__button--save");
  event.style.display = "none";
  const index = event.dataset.index;
  saveItems[index].style.display = "flex";
  contentItems[
    index
  ].innerHTML = `<input class="input-edit" value=${dataBase[index].content} />`;
}

/**
 * 保存任务
 * @param {element} event 
 */
function saveTask(event) {
  const index = event.dataset.index;
  const value = document.querySelector(".input-edit").value;
  dataBase[index].content = value;
  dataBase[index].time = Date.now();
  localStorage.setItem("localData", JSON.stringify(dataBase));
  renderData(dataBase);
}

/**
 * 删除当前任务
 * @param {element} event 
 */
function deleteTask(event) {
  const index = event.dataset.index;
  dataBase.splice(index, 1);
  localStorage.setItem("localData", JSON.stringify(dataBase));
  renderData(dataBase);
}

/**
 * 点击完成任务
 * @param {*} event 
 */
function completeTask(event) {
  const index = event.dataset.index;
  dataBase[index].completed = true;
  localStorage.setItem("localData", JSON.stringify(dataBase));
  renderData(dataBase);
}

/**
 * 清除所有任务
 */
clearAll.addEventListener("click", () => {
  localStorage.clear();
  dataBase = [];
  renderData(dataBase);
});
