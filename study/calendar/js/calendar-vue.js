new Vue({
  el: "#app",
  data: {
    activeClass: '',
    weekList: ['日', '一', '二', '三', '四', '五', '六'],
    days: [],
    dateList: [],
    date: '',
    timeDate: '',
    dateData: {},
    year: '',
    month: '',
    day: '',
    firstDay: '',
    lastDay: '',
    time: '',
    activeDay: true,
  },

  mounted() {
    this.renderAll()
  },

  methods: {
    renderAll() {
      this.getDate()
      this.renderTime()
      this.renderDays(this.dateData)
    },

    getDate() {
      let date = new Date()
      this.dateData = {
        year: date.getFullYear(),
        month: date.getMonth(),
        today: date.getDate(),
      }
    },
    timer() {
      let date = new Date()
      let hour = date.getHours().toString().padStart(2, '0')
      let minute = date.getMinutes().toString().padStart(2, '0')
      let second = date.getSeconds().toString().padStart(2, '0')
      this.time = `${hour}:${minute}:${second}`
    },
    renderTime() {
      this.timer()
      this.timeDate = `${this.dateData.year}年${this.dateData.month + 1}月${this.dateData.today}日`
      setInterval(() => {
        this.timer()
      }, 1000)
    },
    renderDays(dateData) {
      this.date = new Date()
      let {
        year,
        month,
        today
      } = dateData

      let days = [31, this.isLeapYear(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      let firstDay = new Date(year, month, 1)
      let items = 0 // 元素计数
      this.dateList = []

      for (let i = firstDay.getDay() - 1; i >= 0; i--) {
        let over = month === 0 ? 31 : days[month - 1]
        let lastMonthObject = {
          day: over - i,
          disabled: true,
        }
        this.dateList.push(lastMonthObject)
        items++
      }

      for (let i = 1; i <= days[month]; i++) {
        let currentMonthObject = {
          day: i,
        }
        if (i === today && month === this.date.getMonth() && year === this.date.getFullYear()) {
          currentMonthObject.current = true
        }
        this.dateList.push(currentMonthObject)
        items++
      }

      let lastDay = new Date(year, month, days[month])
      for (let i = 1; i < 7 - lastDay.getDay(); i++) {
        let nextMonthObject = {
          day: i,
          disabled: true,
        }
        this.dateList.push(nextMonthObject)
        items++
      }

      // 如果当前月份不足6行，则填充1行，保证每次生成6行。
      if (items < 42) {
        for (let i = 1; i <= 7; i++) {
          let stuffObject = {
            day: i,
            disabled: true,
          }
          this.dateList.push(stuffObject)
        }
      }
    },

    //是否闰年
    isLeapYear(year) {
      if (year % 4 === 0 && year % 100 != 0 || year % 400 === 0) {
        return 29
      } else {
        return 28
      }
    },
    //上个月
    handlePrev() {
      this.dateData.month--
      if (this.dateData.month < 0) {
        this.dateData.year -= 1
        this.dateData.month = 11
      }
      this.renderDays(this.dateData)
    },
    //下个月
    handleNext() {
      this.dateData.month++
      if (this.dateData.month > 11) {
        this.dateData.year += 1
        this.dateData.month = 0
      }
      this.renderDays(this.dateData)
    },
    handleActive(index) {
      this.activeClass = index;
    },
    handleShowMonth() {

    }
  }
})