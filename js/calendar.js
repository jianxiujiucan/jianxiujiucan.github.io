let $dateList = document.getElementById('dateList')
let $buttonLast = document.getElementById('lastMonth')
let $buttonNext = document.getElementById('nextMonth')
let $timeText = document.getElementById('timeText')
let $timeDate = document.getElementById('timeDate')
let $changeDate = document.getElementById('changeDate')
let $yearList = document.getElementById('yearList')
let $monthList = document.getElementById('monthList')
let $dayList = document.getElementById('dayList')
let date = new Date()
let currentYear = date.getFullYear() //当前年份
let currentMonth = date.getMonth() // 当前月份
let currentDay = date.getDate() //当前几号
let showDays = true // 展示日期
let showMonth = false // 展示月份
let showYear = false // 展示年份

renderDays(currentYear, currentMonth)
renderTime()

// 顶部时分秒
setInterval(() => {
  renderTime()
}, 1000)

function renderTime() {
  let date = new Date()
  let hour = date.getHours().toString().padStart(2, '0')
  let minute = date.getMinutes().toString().padStart(2, '0')
  let second = date.getSeconds().toString().padStart(2, '0')
  $timeText.innerHTML = `${hour}:${minute}:${second}`
}

$timeDate.innerHTML = `${currentYear}年${currentMonth + 1}月${currentDay}日`


// 判断是否是闰年
function isLeapYear(year) {
  if (year % 4 === 0 && year % 100 != 0 || year % 400 === 0) {
    return 29
  } else {
    return 28
  }
}

// 渲染日期
function renderDays(year, month) {
  showDays = true
  $changeDate.innerHTML = `${year}年${parseInt(month) + 1}月`
  let contentList = ``
  let days = [31, isLeapYear(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] // 当年月份的天数数组
  let firstDay = new Date(year, month, 1) //当前月份第一天信息
  let items = 0 // 元素计数

  // 上个月日期生成
  for (let i = firstDay.getDay() - 1; i >= 0; i--) {
    let over = month === 0 ? 31 : days[month - 1]
    contentList += `<div class="item is-disabled"><span>${over - i}</span></div>`
    items++
  }
  // 当前月份日期生成
  for (let i = 1; i <= days[month]; i++) {
    if (i === currentDay && month === date.getMonth() && year === date.getFullYear()) { //当天选中态

      contentList += `<div class="item is-current"><span>${i}</span></div>`
    } else {
      contentList += `<div class="item"><span>${i}</span></div>`
    }
    items++
  }

  // 下个月日期生成
  let lastDay = new Date(year, month, days[month])

  for (let i = 1; i < 7 - lastDay.getDay(); i++) {
    contentList += `<div class="item is-disabled"><span>${i}</span></div>`
    items++
  }

  // 如果当前月份不足6行，则填充1行，保证每次生成6行。
  if (items < 42) {
    for (let i = 1; i <= 7; i++) {
      contentList += `<div class="item is-disabled"><span>${i}</span></div>`
    }
  }
  $dateList.innerHTML = contentList //将生成的dom结构填充到页面里

  // 日期选中态
  $dateList.addEventListener('click', function (e) {
    if (document.querySelector('.is-active') != null) {
      document.querySelector('.is-active').classList.remove('is-active')
    }
    e.target.parentNode.classList.add('is-active')
  })
}

//渲染月份
function renderMonths(year) {
  $changeDate.innerHTML = `${year}年`
  let monthDom = ''
  for (let i = 1; i <= 12; i++) {
    if (i === currentMonth + 1 && date.getFullYear() === year) {
      monthDom += `<div class="month-item is-current" data-year=${year} data-month=${i}>${i}月</div>`
    } else {
      monthDom += `<div class="month-item" data-year=${year} data-month=${i}>${i}月</div>`
    }
  }
  for (let i = 1; i <= 4; i++) {
    monthDom += `<div class="month-item is-disabled" data-year=${year + 1} data-month=${i}>${i}月</div>`
  }
  $monthList.innerHTML = monthDom

  let itemsMonth = document.querySelectorAll('.month-item')
  for (let itemMonth of itemsMonth) {
    itemMonth.addEventListener('click', function () {
      for (let i = 0; i < itemsMonth.length; i++) {
        renderDays(+this.dataset.year, this.dataset.month - 1)
        $dayList.style.display = 'block'
        $dateList.classList.add('is-show')
        $monthList.style.display = 'none'
        showMonth = false
      }
    });
  }
}

// 渲染年份
function renderYears(year) {
  showYear = true
  let yearDom = ''
  const prefix = Number.parseInt(year / 10) * 10;
  $changeDate.innerHTML = `${prefix} - ${prefix + 9}`
  for (let i = 0; i < 16; i++) {
    if (i > 10) {
      yearDom += `<div class="month-item is-disabled" data-year=${prefix + i}>${prefix + i}</div>`
    } else if (prefix + i === date.getFullYear()) {
      yearDom += `<div class="month-item is-current" data-year=${prefix + i}>${prefix + i}</div>`
    } else {
      yearDom += `<div class="month-item" data-year=${prefix + i}>${prefix + i}</div>`
    }
  }
  $yearList.innerHTML = yearDom

  let itemsYear = document.querySelectorAll('.month-item')
  for (let itemYear of itemsYear) {
    itemYear.addEventListener('click', function () {
      for (let i = 0; i < itemsYear.length; i++) {
        renderMonths(+this.dataset.year)
        $monthList.style.display = 'grid'
        $yearList.style.display = 'none'
        showYear = false
        showMonth = true
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 切换年份月份
  $changeDate.addEventListener('click', () => {
    if (showDays) {
      $dayList.style.display = 'none'
      $monthList.style.display = 'grid'
      $changeDate.innerHTML = `${currentYear}年`
      showMonth = true
      showDays = false
      renderMonths(currentYear)
    } else if (showMonth) {
      $monthList.style.display = 'none'
      $yearList.style.display = 'grid'
      showMonth = false
      renderYears(currentYear)
    }
  })

  // 切换上一年/上一月
  $buttonLast.addEventListener('click', () => {
    if (!showMonth) {
      currentMonth--
      if (currentMonth < 0) {
        currentYear -= 1
        currentMonth = 11
      }
      renderDays(currentYear, currentMonth)
    } else {
      currentYear -= 1
      $changeDate.innerHTML = `${currentYear}年`
      renderMonths(currentYear)
    }

    if (showYear) {
      currentYear -= 10
      console.log(currentYear)
      renderYears(currentYear)
    }
  })

  // 切换下一年/下一月
  $buttonNext.addEventListener('click', () => {
    if (showDays) {
      currentMonth++
      if (currentMonth > 11) {
        currentYear += 1
        currentMonth = 0
      }
      renderDays(currentYear, currentMonth)
    }
    if (showMonth) {
      currentYear += 1
      $changeDate.innerHTML = `${currentYear}年`
      renderMonths(currentYear)
    }
    if (showYear) {
      currentYear += 10
      console.log(currentYear)
      renderYears(currentYear)
    }
  })


});