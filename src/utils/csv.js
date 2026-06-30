import { todayKey } from './dates'

function escapeCsvField(field) {
  const str = String(field)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportToCSV(habits, logs) {
  const dateKeys = Object.keys(logs).sort()
  const header = ['Date', ...habits.map(h => h.name), 'Progress %']

  const rows = dateKeys.map(key => {
    const dayLog = logs[key] || {}
    const values = habits.map(h => (dayLog[h.id] ? 'Yes' : 'No'))
    const doneCount = habits.filter(h => dayLog[h.id]).length
    const progress = habits.length ? Math.round((doneCount / habits.length) * 100) : 0
    return [key, ...values, `${progress}%`]
  })

  const csvContent = [header, ...rows]
    .map(row => row.map(escapeCsvField).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `habit-tracker-export-${todayKey()}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
