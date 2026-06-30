import { parseDateKey, toDateKey } from './dates'

export function computeDayProgress(habits, dayLog) {
  if (!habits.length) return 0
  const done = habits.filter(h => dayLog && dayLog[h.id]).length
  return Math.round((done / habits.length) * 100)
}

// Consecutive 100%-complete days ending at (or just before, if today isn't
// finished yet) the given date key. An incomplete "today" doesn't zero out
// an existing streak from prior days.
export function computeStreak(habits, logs, fromKey) {
  if (!habits.length) return 0

  const cursor = parseDateKey(fromKey)
  if (computeDayProgress(habits, logs[toDateKey(cursor)]) < 100) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  while (true) {
    const key = toDateKey(cursor)
    if (computeDayProgress(habits, logs[key]) === 100) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}
