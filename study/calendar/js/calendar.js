class Calendar {
  constructor() {
    this.date = new Date();
    this.showDays = false;
    this.showMonth = false;
    this.showYear = true;
    this.currentYear = this.date.getFullYear();
    this.currentMonth = this.date.getMonth();
    this.currentDay = this.date.getDate();
    this.slideDown = "380px";
    this.slideUp = "38px";
    this.$changeDate = document.getElementById("changeDate");
    this.$dayWrapper = document.getElementById("dayWrapper");
    this.$weekList = document.getElementById("weekList");
    this.$dateList = document.getElementById("dateList");
    this.$monthList = document.getElementById("monthList");
    this.$yearList = document.getElementById("yearList");
    this.$lastMonth = document.getElementById("lastMonth");
    this.$nextMonth = document.getElementById("nextMonth");
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
    this.showDays = true;
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
        this.date.getMonth() === currentDate.getMonth() &&
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
    for (let i = 1; i <= 48; i++) {
      if (i <= 12) {
        monthDom += `<li class="grid-list__item" data-year=${
          year - 1
        } data-month=${i}>${i}月</li>`;
      } else if (i > 12 && i <= 24) {
        if (
          i - 12 === this.currentMonth + 1 &&
          this.date.getFullYear() === year
        ) {
          monthDom += `<div class="grid-list__item is-current" data-year=${year} data-month=${
            i - 12
          }>${i - 12}月</div>`;
        } else {
          monthDom += `<li class="grid-list__item" data-year=${year} data-month=${
            i - 12
          }>${i - 12}月</li>`;
        }
      } else if (i > 24 && i <= 36) {
        if (i - 24 <= 4) {
          monthDom += `<li class="grid-list__item is-disabled" data-year=${
            year + 1
          } data-month=${i - 24}>${i - 24}月</li>`;
        } else {
          monthDom += `<li class="grid-list__item" data-year=${
            year + 1
          } data-month=${i - 24}>${i - 24}月</li>`;
        }
      } else {
        monthDom += `<li class="grid-list__item is-disabled" data-year=${
          year + 2
        } data-month=${i - 36}>${i - 36}月</li>`;
      }
    }

    monthDom += `</ul>`;
    this.$monthList.innerHTML = monthDom;

    let itemsMonth = document.querySelectorAll(".grid-list__item");
    let that = this;
    for (let itemMonth of itemsMonth) {
      itemMonth.addEventListener("click", function () {
        for (let i = 0; i < itemsMonth.length; i++) {
          that.renderDayList(+this.dataset.year, this.dataset.month - 1);
          that.$dayWrapper.style.display = "block";
          that.$dateList.classList.add("is-show");
          that.$monthList.style.display = "none";
          that.showMonth = false;
        }
      });
    }
  }

  renderYearList(year) {
    this.showYear = true;
    let yearDom = `<ul class="grid-list__items">`;
    let prefix = Number.parseInt(year / 10) * 10;
    console.log(prefix);
    this.$changeDate.innerHTML = `${prefix} - ${prefix + 9}`;
    prefix = prefix - 12;
    console.log(this.currentYear - 100);
    // for (let i = 0; i < 48; i++) {
    //   if (i >= 22) {
    //     yearDom += `<div class="grid-list__item is-disabled" data-year=${
    //       prefix + i
    //     }>${prefix + i}</div>`;
    //   } else if (prefix + i === this.date.getFullYear()) {
    //     yearDom += `<div class="grid-list__item is-current" data-year=${
    //       prefix + i
    //     }>${prefix + i}</div>`;
    //   } else {
    //     yearDom += `<div class="grid-list__item" data-year=${prefix + i}>${
    //       prefix + i
    //     }</div>`;
    //   }
    // }
    let arrayYear = [];
    for (let i = this.currentYear - 100; i <= this.currentYear + 100; i += 4) {
      let arrSub = [];
      for (let j = 0; j <= 3; j++) {
        arrSub.push(i + j);
      }
      arrayYear.push(arrSub);
    }
    console.log(arrayYear);

    yearDom += `</ul>`;
    this.$yearList.innerHTML = yearDom;
    let that = this;
    let itemsYear = document.querySelectorAll(".grid-list__item");
    for (let itemYear of itemsYear) {
      itemYear.addEventListener("click", function () {
        for (let i = 0; i < itemsYear.length; i++) {
          that.renderMonthList(+this.dataset.year);
          that.$monthList.style.display = "block";
          that.$yearList.style.display = "none";
          that.showYear = false;
          that.showMonth = true;
        }
      });
    }
  }

  handleClick() {
    let transitionTime = 300;

    //上个月点击
    this.$lastMonth.addEventListener("click", () => {
      console.log(this.showDays, this.showMonth, this.showYear);
      if (this.showDays) {
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
        }, transitionTime);
      }
      if (this.showMonth) {
        this.currentYear--;
        this.$changeDate.innerHTML = `${this.currentYear}年`;
        document.querySelector(
          ".grid-list__items"
        ).style.transform = `translateY(0)`;
        setTimeout(() => {
          this.renderMonthList(this.currentYear);
        }, transitionTime);
      }
      if (this.showYear) {
        document.querySelector(
          ".grid-list__items"
        ).style.transform = `translateY(0)`;
        this.currentYear -= 10;
        setTimeout(() => {
          this.renderYearList(this.currentYear);
        }, transitionTime);
      }
    });
    // 下个月点击
    this.$nextMonth.addEventListener("click", () => {
      console.log("下个月:", this.showDays, this.showMonth, this.showYear);
      if (this.showDays) {
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
        }, transitionTime);
      }
      // 月份
      if (this.showMonth) {
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
        }, transitionTime);
      }
      // 年份
      if (this.showYear) {
        this.currentYear += 10;
        document.querySelector(
          ".grid-list__items"
        ).style.transform = `translateY(-396px)`;
        setTimeout(() => {
          this.renderYearList(this.currentYear);
        }, transitionTime);
      }
    });

    this.$changeDate.addEventListener("click", () => {
      console.log(this.showDays, this.showMonth, this.showYear);
      if (this.showDays) {
        this.$dayWrapper.style.display = "none";
        this.$monthList.style.display = "block";
        this.$changeDate.innerHTML = `${this.currentYear}年`;
        this.showMonth = true;
        this.showDays = false;
        this.renderMonthList(this.currentYear);
      } else if (this.showMonth) {
        this.$monthList.style.display = "none";
        this.$yearList.style.display = "block";
        this.showMonth = false;
        this.renderYearList(this.currentYear);
      }
    });
  }
}
