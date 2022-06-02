new Vue({
  el: "#app",
  data: {
    date: new Date(),
    weekList: ["一", "二", "三", "四", "五", "六", "日"],
    currentYear: 0,
    currentMonth: 0,
    currentDay: 0,
    dateList: [],
    timeDate: "",
    dateData: {},
    year: "",
    month: "",
    day: "",
    firstDay: "",
    lastDay: "",
    time: "",
    activeDay: true,
    changeDate: "",
    slide: -190,
    transitionTime: 400,
    styleObject: {
      transform: "translateY(-190px)",
      transition: "transform 0.4s"
    }
  },

  mounted() {
    this.renderAll();
  },

  methods: {
    renderAll() {
      this.getDate();
      this.renderTime();
      this.renderDayList(this.currentYear, this.currentMonth);
    },

    getDate() {
      this.currentYear = this.date.getFullYear();
      this.currentMonth = this.date.getMonth();
      this.currentDay = this.date.getDate();
    },
    renderTime() {
      this.createTime();
      this.timeDate = `${this.date.getFullYear()}年${this.date.getMonth() + 1}月${
        this.date.getDate()
      }日`;
      setInterval(() => {
        this.createTime();
      }, 1000);
    },
    createTime() {
      let hour = this.date.getHours().toString().padStart(2, "0");
      let minute = this.date.getMinutes().toString().padStart(2, "0");
      let second = this.date.getSeconds().toString().padStart(2, "0");
      this.time = `${hour}:${minute}:${second}`;
    },
    

    renderDayList(year, month) {
      const DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
      let date = new Date(year, month);
      let deltaDay = (date.getDay() + 6) % 7;
      let firstDayTime =
        date.getTime() - deltaDay * DAY_MILLISECONDS - 35 * DAY_MILLISECONDS;
      this.dateList = [];
      this.changeDate = `${year}年${parseInt(month) + 1}月`
      for (let i = 0; i < 112; i++) {
        const currentDate = new Date(firstDayTime + DAY_MILLISECONDS * i);
        if (currentDate.getMonth() !== month && i >= 28 && i <= 77) {
          const lastMonthObject = {
            day: currentDate.getDate(),
            disabled: true,
          };
          this.dateList.push(lastMonthObject);
        } else if (
          currentDate.getDate() === this.date.getDate() &&
          currentDate.getMonth() === this.date.getMonth() &&
          currentDate.getFullYear() === this.date.getFullYear()
        ) {
          const currentObject = {
            day: currentDate.getDate(),
            current: true,
          };
          this.dateList.push(currentObject);
        } else {
          const currentObject = {
            day: currentDate.getDate(),
          };
          this.dateList.push(currentObject);
        }
        if (currentDate.getDate() === 1 && i < 14) {
          if (i < 7) {
            this.slide = "0px";
          } else {
            this.slide = "-38px";
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
    },

    //上个月
    handlePrev() {
      this.showLastMonths()
    },
    //下个月
    handleNext() {
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentYear += 1;
        this.currentMonth = 0;
      }
      this.renderDayList(this.currentYear, this.currentMonth);
    },

    showLastMonths() {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentYear -= 1;
        this.currentMonth = 11;
      }
      //this.styleObject.transform = `translateY(${this.slide}px)`;
      this.styleObject = {
        transform: `translateY(${this.slide})`,
        transition: `transform ${this.transitionTime}ms`
      }
      console.log(this.styleObject)
      setTimeout(() => {
        this.renderDayList(this.currentYear, this.currentMonth);
        this.styleObject = {
          transform: `translateY(-190px)`,
          transition: "unset"
        }
      }, this.transitionTime);
    },
  },
});
