export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function pad(n) {
  return String(n).padStart(2, '0')
}

export function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayKey() {
  return toDateKey(new Date())
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function getMonthLabel(year, month) {
  return new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' })
}

export function listDaysOfMonth(year, month) {
  const daysInMonth = getDaysInMonth(year, month)
  const days = []
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    days.push({ date, key: toDateKey(date) })
  }
  return days
}

// Returns a flat array of 6-7 week-rows of {date, key, inMonth} cells for a month grid.
export function buildMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1)
  const startWeekday = firstDay.getDay()
  const daysInMonth = getDaysInMonth(year, month)
  const prevYear = month === 0 ? year - 1 : year
  const prevMonth = month === 0 ? 11 : month - 1
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth)

  const cells = []
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    const date = new Date(prevYear, prevMonth, d)
    cells.push({ date, key: toDateKey(date), inMonth: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    cells.push({ date, key: toDateKey(date), inMonth: true })
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date
    const date = new Date(last)
    date.setDate(date.getDate() + 1)
    cells.push({ date, key: toDateKey(date), inMonth: false })
  }
  return cells
}

export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export function getWeekStart(date) {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d
}

export function buildWeekDays(weekStart) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    return { date, key: toDateKey(date) }
  })
}

export function getWeekRangeLabel(weekStart) {
  const weekEnd = addDays(weekStart, 6)
  const sameMonthAndYear =
    weekStart.getMonth() === weekEnd.getMonth() && weekStart.getFullYear() === weekEnd.getFullYear()
  const startStr = weekStart.toLocaleDateString('default', { month: 'short', day: 'numeric' })
  const endStr = sameMonthAndYear
    ? weekEnd.toLocaleDateString('default', { day: 'numeric' })
    : weekEnd.toLocaleDateString('default', { month: 'short', day: 'numeric' })
  return `${startStr} – ${endStr}, ${weekEnd.getFullYear()}`
}

export const WEEK_VIEW_START_HOUR = 6
export const WEEK_VIEW_END_HOUR = 23

export function formatHourLabel(hour) {
  const period = hour < 12 ? 'AM' : 'PM'
  const h = hour % 12 || 12
  return `${h} ${period}`
}

export function formatTimeLabel(time) {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const hour12 = h % 12 || 12
  return `${hour12}:${pad(m)} ${period}`
}
