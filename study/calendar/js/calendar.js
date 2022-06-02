class Calendar {
  constructor() {
    this.date = new Date();
    this.isShowDays = false;
    this.isShowMonths = false;
    this.isShowYears = true;
    this.currentYear = this.date.getFullYear();
    this.currentMonth = this.date.getMonth();
    this.currentDay = this.date.getDate();
    this.slideDown = "380px";
    this.slideUp = "38px";
    this.transitionTime = 300;
    this.$changeDate = document.getElementById("changeDate");
    this.$dayWrapper = document.getElementById("dayWrapper");
    this.$weekList = document.getElementById("weekList");
    this.$dateList = document.getElementById("dateList");
    this.$monthList = document.getElementById("monthList");
    this.$yearList = document.getElementById("yearList");
    this.$lastMonth = document.getElementById("lastMonth");
    this.$nextMonth = document.getElementById("nextMonth");
    this.$timeDate = document.getElementById("timeDate");
  }
  render() {
    this.renderTime();
    //this.renderDayList(this.currentYear, this.currentMonth);
    this.renderWeekList();
    this.handleClick();
    //this.renderMonthList(this.currentYear);
    this.renderYearList(this.currentYear);
  }

  renderTime() {
    this.createTime();
    this.$timeDate.innerHTML = `${this.currentYear}年${
      this.currentMonth + 1
    }月${this.currentDay}日`;
    setInterval(() => {
      this.createTime();
    }, 1000);
  }

  createTime() {
    let date = new Date();
    let hour = date.getHours().toString().padStart(2, "0");
    let minute = date.getMinutes().toString().padStart(2, "0");
    let second = date.getSeconds().toString().padStart(2, "0");
    document.getElementById(
      "timeText"
    ).innerHTML = `${hour}:${minute}:${second}`;
  }

  renderWeekList() {
    let week = ["一", "二", "三", "四", "五", "六", "日"];
    let weekList = ``;
    for (let i = 0; i < 7; i++) {
      weekList += `<span class="week-list__item">${week[i]}</span>`;
    }
    this.$weekList.innerHTML = weekList;
  }

  renderDayList(year, month) {
    this.isShowDays = true;
    this.$changeDate.innerHTML = `${year}年${parseInt(month) + 1}月`;
    const DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
    let date = new Date(year, month);
    let deltaDay = (date.getDay() + 6) % 7;
    let firstDayTime =
      date.getTime() - deltaDay * DAY_MILLISECONDS - 35 * DAY_MILLISECONDS;
    let contentList = `<ul class="date-list__items">`;

    for (let i = 0; i < 112; i++) {
      let currentDate = new Date(firstDayTime + DAY_MILLISECONDS * i);
      if (currentDate.getMonth() !== month && i >= 28 && i <= 77) {
        contentList += `<li class="date-list__item is-disabled"><span>${currentDate.getDate()}</span></li>`;
      } else if (
        currentDate.getDate() === this.currentDay &&
        currentDate.getMonth() === this.date.getMonth() &&
        currentDate.getFullYear() === this.date.getFullYear()
      ) {
        contentList += `<li class="date-list__item is-current"><span>${currentDate.getDate()}</span></li>`;
      } else {
        contentList += `<li class="date-list__item"><span>${currentDate.getDate()}</span></li>`;
      }
      if (currentDate.getDate() === 1 && i < 14) {
        if (i < 7) {
          this.slideUp = "0px";
        } else {
          this.slideUp = "38px";
        }
      }
      if (i === 70) {
        if (currentDate.getDate() > 7 || currentDate.getDate() === 1) {
          this.slideDown = "380px";
        } else {
          this.slideDown = "342px";
        }
      }
    }
    contentList += `</ul>`;
    this.$dateList.innerHTML = contentList;
  }

  renderMonthList(year) {
    this.$changeDate.innerHTML = `${year}年`;
    let monthDom = `<ul class="grid-list__items">`;
    let perYears = year - 1;
    for (let j = 0; j < 4; j++) {
      for (let i = 1; i <= 12; i++) {
        if (
          i === this.currentMonth + 1 &&
          this.date.getFullYear() === perYears + j
        ) {
          monthDom += `<li class="grid-list__item is-current" data-year="${
            perYears + j
          }
        " data-month="${i}">${i}月</li>`;
        } else if (j === 2) {
          monthDom += `<li class="grid-list__item is-disabled" data-year="${
            perYears + j
          }" data-month="${i}">${i}月</li>`;
        } else {
          monthDom += `<li class="grid-list__item" data-year="${
            perYears + j
          }" data-month="${i}">${i}月</li>`;
        }
      }
    }
    monthDom += `</ul>`;
    this.$monthList.innerHTML = monthDom;

    let itemsMonth = document.querySelectorAll(".grid-list__item");
    let that = this;
    for (let itemMonth of itemsMonth) {
      itemMonth.addEventListener("click", function () {
        for (let i = 0; i < itemsMonth.length; i++) {
          console.log(+this.dataset.year, this.dataset.month - 1);
          that.renderDayList(+this.dataset.year, this.dataset.month - 1);
          that.$dayWrapper.style.display = "block";
          that.$dateList.classList.add("is-show");
          that.$monthList.style.display = "none";
          that.isShowMonths = false;
        }
      });
    }
  }

  renderYearList(year) {
    console.log(year);
    this.isShowYears = true;
    let yearDom = `<ul class="grid-list__items">`;
    let prefix = Number.parseInt(year / 10) * 10;
    this.$changeDate.innerHTML = `${prefix} - ${prefix + 9}`;

    let arrayYear = [];
    for (
      let i = this.date.getFullYear() - 100;
      i <= this.date.getFullYear() + 100;
      i += 4
    ) {
      let arrSub = [];
      for (let j = 0; j < 4; j++) {
        if(i + j <= this.date.getFullYear() + 100){
        arrSub.push(i + j);
        }
      }
      arrayYear.push(arrSub);
    }
    console.log(arrayYear)
    let mark = 0;
    for (let i = 0; i < arrayYear.length; i++) {
      //console.log(arrayYear[i])
      for (let j = 0; j < 4; j++) {
        //console.log(arrayYear[i][j]);
        if (arrayYear[i][j] === this.currentYear) {
          mark = i;
        }
      }
    }
    let yearList = [];
    
    for (let i = mark - 4; i < mark + 6; i++) {
      for (let j = 0; j < arrayYear[i].length; j++) {
        yearList.push(arrayYear[i][j]);
      }
    }
    
    console.log(yearList);
    for (let i = 0; i < yearList.length; i++) {
      if (yearList[i] < prefix || yearList[i] > prefix + 9) {
        yearDom += `<li class="grid-list__item is-disabled" data-year=${yearList[i]}>${yearList[i]}</li>`;
      } else {
        yearDom += `<li class="grid-list__item" data-year="${yearList[i]}"><span>${yearList[i]}</span></li>`;
      }
    }

    yearDom += `</ul>`;
    //console.log(yearDom);
    this.$yearList.innerHTML = yearDom;

    let that = this;
    let itemsYear = document.querySelectorAll(".grid-list__item");
    for (let itemYear of itemsYear) {
      itemYear.addEventListener("click", function () {
        for (let i = 0; i < itemsYear.length; i++) {
          that.renderMonthList(+this.dataset.year);
          that.$monthList.style.display = "block";
          that.$yearList.style.display = "none";
          that.isShowYears = false;
          that.isShowMonths = true;
        }
      });
    }
  }

  handleClick() {
    //向上箭头点击
    this.$lastMonth.addEventListener("click", () => {
      console.log(this.isShowDays, this.isShowMonths, this.isShowYears);
      if (this.isShowDays) {
        this.showLastDays();
      }
      if (this.isShowMonths) {
        this.showLastMonths();
      }
      if (this.isShowYears) {
        this.showLastYears();
      }
    });
    // 下个月点击
    this.$nextMonth.addEventListener("click", () => {
      if (this.isShowDays) {
        this.showNextDays();
      }
      // 月份
      if (this.isShowMonths) {
        this.showNextMonths();
      }
      // 年份
      if (this.isShowYears) {
        this.showNextYears();
      }
    });

    this.$changeDate.addEventListener("click", () => {
      console.log(this.isShowDays, this.isShowMonths, this.isShowYears);
      if (this.isShowDays) {
        this.$dayWrapper.style.display = "none";
        this.$monthList.style.display = "block";
        this.$changeDate.innerHTML = `${this.currentYear}年`;
        this.isShowMonths = true;
        this.isShowDays = false;
        this.renderMonthList(this.currentYear);
      } else if (this.isShowMonths) {
        this.$monthList.style.display = "none";
        this.$yearList.style.display = "block";
        this.isShowMonths = false;
        this.renderYearList(this.currentYear);
      }
    });
  }

  showLastDays() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentYear -= 1;
      this.currentMonth = 11;
    }
    document.querySelector(
      ".date-list__items"
    ).style.transform = `translateY(-${this.slideUp})`;
    setTimeout(() => {
      this.renderDayList(this.currentYear, this.currentMonth);
    }, this.transitionTime);
  }

  showLastMonths() {
    this.currentYear--;
    this.$changeDate.innerHTML = `${this.currentYear}年`;
    document.querySelector(
      ".grid-list__items"
    ).style.transform = `translateY(0)`;
    setTimeout(() => {
      this.renderMonthList(this.currentYear);
    }, this.transitionTime);
  }

  showLastYears() {
    document.querySelector(
      ".grid-list__items"
    ).style.transform = `translateY(0)`;
    this.currentYear -= 10;
    setTimeout(() => {
      this.renderYearList(this.currentYear);
    }, this.transitionTime);
  }
  showNextDays() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentYear += 1;
      this.currentMonth = 0;
    }
    document.querySelector(
      ".date-list__items"
    ).style.transform = `translateY(-${this.slideDown})`;
    setTimeout(() => {
      this.renderDayList(this.currentYear, this.currentMonth);
    }, this.transitionTime);
  }
  showNextMonths() {
    this.currentYear++;
    this.$changeDate.innerHTML = `${this.currentYear}年`;
    document.querySelector(
      ".grid-list__items"
    ).style.transform = `translateY(-396px)`;
    document.querySelectorAll(".is-disabled").forEach((item) => {
      item.classList.remove("is-disabled");
    });
    setTimeout(() => {
      this.renderMonthList(this.currentYear);
    }, this.transitionTime);
  }
  
  showNextYears() {
    this.currentYear += 10;
    document.querySelector(
      ".grid-list__items"
    ).style.transform = `translateY(-396px)`;
    setTimeout(() => {
      this.renderYearList(this.currentYear);
    }, 1000);
  }

  showLastYears() {
    document.querySelector(
      ".grid-list__items"
    ).style.transform = `translateY(0)`;
    this.currentYear -= 10;
    setTimeout(() => {
      this.renderYearList(this.currentYear);
    }, this.transitionTime);
  }
}
