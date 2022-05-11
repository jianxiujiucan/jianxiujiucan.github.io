class Calendar {
  constructor() {
    this.date = new Date();
    // this.year = this.date.getFullYear();
    // this.month = this.date.getMonth();
    this.day = this.date.getDate();
    //this.firstDay = new Date(this.year, this.month, 1);
    this.showDays = true;
    this.showMonth = false;
    this.showYear = false;
    this.currentYear = this.date.getFullYear();
    this.currentMonth = this.date.getMonth();
    this.currentDay = this.date.getDate();
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
    // 时分秒渲染
    this.renderTime();
    setInterval(() => {
      this.renderTime();
    }, 1000);

    // 日期渲染
    this.renderDayList(this.currentYear, this.currentMonth);
    this.renderWeekList();

    // 按钮点击
    this.$lastMonth.addEventListener("click", () => {
      if (!this.showMonth) {
        this.currentMonth--;
        if (this.currentMonth < 0) {
          this.currentYear -= 1;
          this.currentMonth = 11;
        }
        document.querySelector('.date-list__items').style.transform = 'translateY(0)';
        setTimeout(() => {
          this.renderDayList(this.currentYear, this.currentMonth);
        },300)
      } else {
        this.currentYear--;
        this.$changeDate.innerHTML = `${currentYear}年`;
      }
      if (this.showYear) {
        this.currentYear -= 10;
        this.renderYearList(this.currentYear);
      }
    });

    this.$nextMonth.addEventListener("click", () => {
      if (this.showDays) {
        this.currentMonth++;
        if (this.currentMonth > 11) {
          this.currentYear += 1;
          this.currentMonth = 0;
        }
        document.querySelector('.date-list__items').style.transform = 'translateY(-340px)';
        setTimeout(() => {
          this.renderDayList(this.currentYear, this.currentMonth);
        }, 300);
      }
      if (this.showMonth) {
        this.currentYear += 1;
        this.$changeDate.innerHTML = `${this.currentYear}年`;
        this.renderMonthList(currentYear);
      }
      if (this.showYear) {
        this.currentYear += 10;
        this.renderYearList(this.currentYear);
      }
    });

    this.$changeDate.addEventListener("click", () => {
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
  renderTime() {
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
    this.$changeDate.innerHTML = `${year}年${parseInt(month) + 1}月`;
    const DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
    let todayDate = new Date(this.currentYear, this.currentMonth);
    let deltaDay = (todayDate.getDay() + 6) % 7;
    let firstDayTime =
      todayDate.getTime() - deltaDay * DAY_MILLISECONDS - 28 * DAY_MILLISECONDS;
    let contentList = `<ul class="date-list__items">`;

    for (let i = 0; i < 105; i++) {
      let currentDate = new Date(firstDayTime + DAY_MILLISECONDS * i);
      if (currentDate.getMonth() !== month) {
        contentList += `<li class="date-list__item is-disabled"><span>${currentDate.getDate()}</span></li>`;
      } else if (
        currentDate.getDate() === this.currentDay &&
        this.date.getMonth() === currentDate.getMonth()
      ) {
        contentList += `<li class="date-list__item is-current"><span>${currentDate.getDate()}</span></li>`;
      } else {
        contentList += `<li class="date-list__item"><span>${currentDate.getDate()}</span></li>`;
      }
    }
    contentList += `</ul>`;
    this.$dateList.innerHTML = contentList;


  }

  renderMonthList(year) {
    this.$changeDate.innerHTML = `${year}年`;
    let monthDom = `<ul class="grid-list__items">`;
    for (let i = 1; i <= 12; i++) {
      if (i === this.currentMonth + 1 && this.date.getFullYear() === year) {
        monthDom += `<div class="grid-list__item is-current" data-year=${year} data-month=${i}>${i}月</div>`;
      } else {
        monthDom += `<div class="grid-list__item" data-year=${year} data-month=${i}>${i}月</div>`;
      }
    }
    for (let i = 1; i <= 4; i++) {
      monthDom += `<div class="grid-list__item is-disabled" data-year=${
        year + 1
      } data-month=${i}>${i}月</div>`;
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
          this.showMonth = false;
        }
      });
    }
  }

  renderYearList(year) {
    this.showYear = true;
    let yearDom = `<ul class="grid-list__items">`;
    const prefix = Number.parseInt(year / 10) * 10;
    this.$changeDate.innerHTML = `${prefix} - ${prefix + 9}`;
    for (let i = 0; i < 16; i++) {
      if (i > 10) {
        yearDom += `<div class="grid-list__item is-disabled" data-year=${
          prefix + i
        }>${prefix + i}</div>`;
      } else if (prefix + i === this.date.getFullYear()) {
        yearDom += `<div class="grid-list__item is-current" data-year=${
          prefix + i
        }>${prefix + i}</div>`;
      } else {
        yearDom += `<div class="grid-list__item" data-year=${prefix + i}>${
          prefix + i
        }</div>`;
      }
    }
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

  getDays(year) {
    if ((year % 4 === 0 && year % 100 != 0) || year % 400 === 0) {
      return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    } else {
      return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    }
  }
}
