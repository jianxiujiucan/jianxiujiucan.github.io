const inputWrite = document.getElementById("inputWrite");
const buttonAdd = document.getElementById("buttonAdd");
const list = document.getElementById("list");
const todoTips = document.getElementById("todoTips");
const clearAll = document.getElementById("clearAll");
const iconClear = document.getElementById("iconClear");

let db,
  version = 2;
const request = indexedDB.open("listDataBase", version);

//监听数据库错误
request.onerror = function (e) {
  console.log("onerror", e);
};

//监听数据库更新
request.onupgradeneeded = function (e) {
  db = e.target.result;
  let transaction = e.target.transaction;
  if (!db.objectStoreNames.contains("listDataBase")) {
    const objectStore = db.createObjectStore("listDataBase", {
      keyPath: "id",
    });
    objectStore.createIndex("time", "time", {
      unique: true,
    });
    objectStore.createIndex("content", "content", {
      unique: false,
    });
  }
};

//监听数据库连接成功
request.onsuccess = function (e) {
  console.log("onsuccess", e);
  db = e.target.result;
  objectStore = db
    .transaction(["listDataBase"], "readwrite")
    .objectStore("listDataBase");
  renderData(objectStore);
};

//展示所有数据
function renderData(objectStore) {
  list.innerHTML = null;
  let mark = 0;
  let str = "";
  objectStore.openCursor().onsuccess = function (e) {
    let contentText = e.target.result;
    if (contentText) {
      clearAll.style.display = "flex";
      str += `<li data-index="${mark}" class="todo-list__item"><input class="checkbox" type="checkbox"><div class="todo-list__content"><p>${contentText.value.content}</p><p class="todo-list__time">${contentText.value.time}</p></div><div class="todo-list__operate">
            <span class="todo-list__button" title="Edit"><i class="icon-edit"></i></span>
            <span class="todo-list__button" title="Delete"><i class="icon-delete"></i></span>
          </div></li>`;
      mark += 1;
      list.innerHTML = str;
      // listItem.innerText = JSON.stringify(contentText.value.content);
      // list.appendChild(listItem);
      contentText.continue();
    } else {
      if (mark === 0) {
        list.innerHTML = `<li class="todo-list__item"><span class="todo-list__empty">Nothing in here...</span></li>`;
      } else {
        mark = 0;
      }
    }
  };
}

/**
 * 创建数据库
 */
function createData() {
  if (!db) {
    alert("数据库连接中");
  }
  objectStore = db
    .transaction(["listDataBase"], "readwrite")
    .objectStore("listDataBase");
  const content = inputWrite.value;
  const reqest = objectStore.add({
    content,
    time: new Date(),
    id: Date.now(),
  });
  reqest.onsuccess = function (e) {
    console.log("数据新增成功", e);
    renderData(objectStore);
  };

  reqest.onerror = function (e) {
    console.log("数据新增失败", e);
  };
}

inputWrite.addEventListener("focus", () => {
  if (todoTips.classList.contains("is-show")) {
    todoTips.classList.remove("is-show");
  }
});

inputWrite.addEventListener("input", () => {
  iconClear.style.display = "block";
});

iconClear.addEventListener("click", function () {
  inputWrite.value = "";
  this.style.display = "none";
});

buttonAdd.addEventListener("click", () => {
  if (inputWrite.value === "") {
    todoTips.classList.add("is-show");
  } else {
    createData();
    inputWrite.value = "";
    iconClear.style.display = "none";
  }
});

clearAll.addEventListener("click", () => {
  if (!db) {
    alert("数据库连接中");
  }
  objectStore = db
    .transaction(["listDataBase"], "readwrite")
    .objectStore("listDataBase");
  const request = objectStore.clear();
  request.onsuccess = function (e) {
    console.log("数据清空成功", e);
    renderData(objectStore);
  };

  request.onerror = function (e) {
    console.log("数据清空失败", e);
  };
});


