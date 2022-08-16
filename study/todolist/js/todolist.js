(function () {
  /**
   * 输入框
   */
  const inputWriteDom = document.getElementById("inputWrite");

  /**
   * 添加按钮
   */
  const buttonAddDom = document.getElementById("buttonAdd");

  /**
   * 待办列表
   */
  const toDoListDom = document.getElementById("list");

  /**
   * 待办提示
   */
  const todoTipsDom = document.getElementById("todoTips");

  /**
   * 清除按钮
   */
  const clearAllButtonDom = document.getElementById("clearAll");

  /**
   * 清除icon
   */
  const iconClearDom = document.getElementById("iconClear");

  /**
   * 待办tab
   */
  const todoTabDom = document.getElementById("todoTabItem");

  /**
   * 已办tab
   */
  const completeTabDom = document.getElementById("completedTabItem");

  /**
   * tab的所有节点
   */

  const tabsItems = document.querySelectorAll(".todo-tabs__item");

  /**
   * 全部tab
   */
  const allTabDom = document.getElementById("allTabItem");

  /**
   * 搜索框
   */
  const inputSearchDom = document.getElementById("inputSearch");

  /**
   * 搜索icon
   */
  const iconSearchDom = document.getElementById("iconSearch");

  /** 清除搜索内容icon */
  const iconSearchClearDom = document.getElementById("iconSearchClear");

  /**
   * 列表状态
   */
  const todoTypeList = {
    all: 0,
    todo: 1,
    completed: 2,
  };

  /**
   * 日期转换
   * @param {Number} time 时间
   * @returns 返回格式：年/月/日 时:分:秒
   * @example
   *
   * transformTime(1660543723967)
   * // => 2022/08/25 15:30:06
   */
  function transformTime(time) {
    const date = new Date(time);
    return date.toLocaleString();
  }

  const todoApp = {
    /**
     * 待办数据
     */
    localTodoData: [],
    todoType: todoTypeList.all,
    todoSearch: "",
    getTodoDataList() {
      if (localStorage.getItem("localTodoData") !== null) {
        // 如果本地有数据，则取本地的数据
        this.localTodoData = JSON.parse(localStorage.getItem("localTodoData"));
      }
      if (localStorage.getItem("todoType") !== null) {
        // 如果本地有数据，则取本地的数据
        this.todoType = Number(localStorage.getItem("todoType"));
      }
    },
    /**
     * 渲染列表
     */
    renderList() {
      let todoList = "";
      let todoListItem = "";

      switch (this.todoType) {
        case todoTypeList.all:
          todoList = this.localTodoData.sort(
            (a, b) => a.isCompleted - b.isCompleted
          );
          break;
        case todoTypeList.todo:
          todoList = this.localTodoData.filter((item) => !item.isCompleted);
          break;
        case todoTypeList.completed:
          todoList = this.localTodoData.filter((item) => item.isCompleted);
          break;
      }

      if (this.todoSearch) {
        todoList = this.localTodoData.filter((item) => item.content.match(new RegExp(this.todoSearch)))
      }

      if (todoList.length === 0) {
        todoListItem = `<li class="todo-list__item is-empty">There wasn't anything...</li>`;
      } else {
        clearAllButtonDom.style.display = "flex";

        for (let i = 0; i < todoList.length; i++) {
          const isEdit = todoList[i].isEdit;
          const isComplete = todoList[i].isCompleted;
          const time = todoList[i].time;

          const tempContent = isEdit
            ? `<div class="todo-list__content">
            <input class="input-edit" value=${todoList[i].content} />
          </div>`
            : `<div class="todo-list__content ${
                isComplete ? "is-completed" : ""
              }">
            <p class="todo-list__text ">
              ${todoList[i].content}
            </p>
            <p class="todo-list__time">
              ${transformTime(time)}
            </p>
          </div>`;

          const tempOperate = isEdit
            ? `<div class="todo-list__operate">
            <a class="todo-list__button icon-save" data-time="${time}" title="Save"></a>
            <b class="todo-list__button icon-delete" data-time="${time}" title="Delete"></b>
          </div>`
            : `<div class="todo-list__operate">
            <i class="todo-list__button icon-edit" data-time="${time}" title="Edit"></i>
            <b class="todo-list__button icon-delete" data-time="${time}" title="Delete"></b>
          </div>`;

          const tempTodoItem = `
          <li class="todo-list__item">
            <input data-time="${time}" class="checkbox" type="checkbox" ${
            isComplete ? "checked" : ""
          }>
            ${tempContent}
            ${tempOperate}
          </li>`;

          todoListItem += tempTodoItem;
        }
      }

      toDoListDom.innerHTML = todoListItem;
    },

    /**
     * 清除todo输入框内容
     */
    clearInputWrite() {
      inputWriteDom.value = "";
    },


    /**
     * 切换到全部任务的标签页
     */
    handleChangeAllTab() {
      inputSearchDom.value = "";
      this.todoSearch = "";
      allTabDom.classList.add("is-active");
      completeTabDom.classList.remove("is-active");
      todoTabDom.classList.remove("is-active");

      this.todoType = todoTypeList.all;
      localStorage.setItem("todoType", this.todoType);
      this.getTodoDataList();

      this.renderList();
    },


    /**
     * 切换待办任务的标签页
     */
    handleChangeTodoTab() {
      inputSearchDom.value = "";
      this.todoSearch = "";

      todoTabDom.classList.add("is-active");
      completeTabDom.classList.remove("is-active");
      allTabDom.classList.remove("is-active");

      this.todoType = todoTypeList.todo;

      localStorage.setItem("todoType", this.todoType);

      this.getTodoDataList();
      this.renderList();
    },

    /**
     * 切换已完成任务的标签页
     */
    handleChangeCompleteTab() {
      inputSearchDom.value = "";
      this.todoSearch = "";

      completeTabDom.classList.add("is-active");
      todoTabDom.classList.remove("is-active");
      allTabDom.classList.remove("is-active");

      this.todoType = todoTypeList.completed;

      localStorage.setItem("todoType", this.todoType);

      this.getTodoDataList();
      this.renderList();
    },

    /**
     * 切换tab
     */
    handleChangeTab() {
      todoTabDom.addEventListener("click", () => this.handleChangeTodoTab());

      completeTabDom.addEventListener("click", () =>
        this.handleChangeCompleteTab()
      );

      allTabDom.addEventListener("click", () => this.handleChangeAllTab());
    },

    /**
     * 输入框获取焦点时，隐藏错误提示
     */
    hideTipsWhenFocus() {
      inputWriteDom.addEventListener("focus", () => {
        if (todoTipsDom.classList.contains("is-show")) {
          todoTipsDom.classList.remove("is-show");
        }
      });
    },

    /**
     * 切换清除图标显示隐藏
     */
    toggleClearIconWhenInput() {
      inputWriteDom.addEventListener("input", () => {
        if (inputWriteDom.value === "") {
          iconClearDom.style.display = "none";
        } else {
          iconClearDom.style.display = "block";
        }
      });
    },

    /**
     * 清除按钮点击时，清空文本框内容
     */
    handleClickClearIcon() {
      iconClearDom.addEventListener("click", () => {
        this.clearInputWrite();
        iconClearDom.style.display = "none";
      });
    },

    /**
     * 添加按钮点击时，添加数据，并渲染列表
     */
    handleClickAdd() {
      buttonAddDom.addEventListener("click", () => {
        this.handleAddTask();
      });
    },

    /**
     * 按下回车键（包括108键盘的小键盘）时，添加数据，并渲染列表
     */
    handleEnterKeyAdd() {
      document.body.addEventListener("keydown", (e) => {
        if (e.code === "Enter" || e.code === "NumpadEnter") {
          this.handleAddTask();
        }
      });
    },

    /**
     * 添加数据，并渲染列表
     */
    handleAddTask() {
      if (inputWriteDom.value.trim() === "") {
        todoTipsDom.classList.add("is-show");
      } else {
        const addTodoItem = {
          content: inputWriteDom.value,
          isCompleted: false,
          isEdit: false,
          time: Date.now(),
        };
        this.localTodoData.unshift(addTodoItem);
        localStorage.setItem(
          "localTodoData",
          JSON.stringify(this.localTodoData)
        );

        iconClearDom.style.display = "none";

        this.renderList();

        this.clearInputWrite();
      }
    },

    /** 点击搜索 */
    handleSearchTodo() {
      iconSearchDom.addEventListener("click", () => {
        this.todoSearch = inputSearchDom.value;
        this.getTodoDataList();
        this.renderList();
      });
    },

    /** 清空搜索内容，清空搜索列表 */
    handleClearSearchInput() {
      iconSearchClearDom.addEventListener("click", () => {
        inputSearchDom.value = "";
        this.todoSearch = "";
        this.getTodoDataList();
        this.renderList();
      });
    },

    /**
     * 清除所有任务
     */
    handleClearAll() {
      clearAllButtonDom.addEventListener("click", () => {
        localStorage.clear();
        this.localTodoData = [];

        localStorage.setItem(
          "localTodoData",
          JSON.stringify(this.localTodoData)
        );
        this.renderList();
      });
    },

    /** 获取索引值 */
    getCurTodoIndex(time) {
      return this.localTodoData.findIndex((todo) => todo.time === time);
    },

    /** 列表点击事件 */
    handleClickTodoItem() {
      toDoListDom.addEventListener("click", (e) => {
        const type = e.target.nodeName;
        const time = Number(e.target.dataset.time);
        const index = this.getCurTodoIndex(time);
        switch (type) {
          case "I":
            this.editTask(index);
            break;
          case "A":
            const content =
              e.target.parentNode.parentNode.children[1].children[0].value;
            this.saveTask(index, content);
            break;
          case "B":
            this.deleteTask(index);
            break;
          case "INPUT":
            time && this.completeTask(index);
          default:
            break;
        }
      });
    },

    /**
     * 编辑任务
     * @param {number} 索引值
     */
    editTask(index) {
      this.localTodoData[index].isEdit = true;
      this.renderList();
    },

    /**
     * 保存任务
     * @param {number} 索引值
     * @param {string} 任务的内容
     */
    saveTask(index, content) {
      const tempTodo = this.localTodoData[index];

      this.localTodoData[index] = {
        ...tempTodo,
        isEdit: false,
        content,
        time: Date.now(),
      };

      localStorage.setItem("localTodoData", JSON.stringify(this.localTodoData));

      this.renderList();
    },

    /**
     * 删除当前任务
     * @param {number} 索引值
     */
    deleteTask(index) {
      this.localTodoData.splice(index, 1);

      localStorage.setItem("localTodoData", JSON.stringify(this.localTodoData));

      this.renderList();
    },

    /**
     * 点击完成任务
     * @param {number} 索引值
     */
    completeTask(index) {
      this.localTodoData[index].isCompleted =
        !this.localTodoData[index].isCompleted;

      localStorage.setItem("localTodoData", JSON.stringify(this.localTodoData));

      this.renderList();
    },

    /**
     * 同步tab激活信息
     * @param {number} index
     */
    handleChageTab(index) {
      for (let i = 0; i < tabsItems.length; i++) {
        tabsItems[i].classList.remove("is-active");
      }
      tabsItems[index].classList.add("is-active");
    },

    /** 绑定监听事件 */
    bindListeners() {
      this.handleChangeTab();
      this.hideTipsWhenFocus();
      this.toggleClearIconWhenInput();
      this.handleClickClearIcon();
      this.handleClickAdd();
      this.handleClearAll();
      this.handleClickTodoItem();
      this.handleEnterKeyAdd();
      this.handleSearchTodo();
      this.handleClearSearchInput();
    },
    
    render() {
      this.getTodoDataList();
      this.renderList();
      this.bindListeners();
    },
  };

  /** 切换tab时更新数据 */
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      todoApp.getTodoDataList();
      todoApp.handleChageTab(Number(localStorage.getItem("todoType")));
      todoApp.renderList();
    }
  });

  /** 刷新页面重置tab状态 */
  window.onload = () => {
    this.todoType = todoTypeList.all;
    localStorage.setItem("todoType", this.todoType);
  };

  todoApp.render();
})();
