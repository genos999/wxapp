const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const dateDay = date => {
  const day = date.getDate()
  return day
}

const dateMonth = date => {
  const month = date
  return month.toDateString().split(" ")[1]
}

const dateYear = date => {
  const year = date.getFullYear()
  return year
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  dateDay: dateDay,
  dateMonth: dateMonth,
  dateYear: dateYear
}
