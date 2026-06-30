import { listDaysOfMonth, todayKey } from '../utils/dates'
import { computeDayProgress } from '../utils/progress'

export default function TrackerGrid({ habits, logs, year, month, onToggle }) {
  const days = listDaysOfMonth(year, month)
  const today = todayKey()

  return (
    <div className="bg-white rounded-xl border border-leaf-200 shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700">
      <div className="overflow-auto max-h-[70vh]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-leaf-600 text-white dark:bg-leaf-700">
              <th className="sticky top-0 left-0 z-30 bg-leaf-600 px-4 py-3 text-left font-medium min-w-[150px] dark:bg-leaf-700">
                Date
              </th>
              {habits.map(habit => (
                <th
                  key={habit.id}
                  className="sticky top-0 z-20 bg-leaf-600 px-3 py-3 text-center font-medium min-w-[100px] dark:bg-leaf-700"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: habit.color }}
                    />
                    {habit.name}
                  </span>
                </th>
              ))}
              <th className="sticky top-0 z-20 bg-leaf-600 px-4 py-3 text-center font-medium min-w-[130px] dark:bg-leaf-700">
                Daily Progress
              </th>
            </tr>
          </thead>
          <tbody>
            {days.map(({ date, key }) => {
              const dayLog = logs[key] || {}
              const progress = computeDayProgress(habits, dayLog)
              const isToday = key === today
              const isComplete = habits.length > 0 && progress === 100

              return (
                <tr
                  key={key}
                  className={`border-t border-leaf-100 transition-colors dark:border-slate-700 ${
                    isComplete ? 'bg-leaf-100 dark:bg-leaf-900/40' : 'hover:bg-leaf-50 dark:hover:bg-slate-700/50'
                  } ${isToday ? 'ring-1 ring-inset ring-leaf-400' : ''}`}
                >
                  <td
                    className={`sticky left-0 z-10 px-4 py-2.5 font-medium ${
                      isComplete ? 'bg-leaf-100 dark:bg-leaf-900/40' : 'bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={isToday ? 'text-leaf-700 font-semibold dark:text-leaf-200' : 'text-leaf-800 dark:text-leaf-100'}>
                        {date.toLocaleDateString('default', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      {isToday && (
                        <span className="text-[10px] uppercase tracking-wide bg-leaf-600 text-white px-1.5 py-0.5 rounded">
                          Today
                        </span>
                      )}
                    </div>
                  </td>
                  {habits.map(habit => (
                    <td key={habit.id} className="px-3 py-2.5 text-center">
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        style={{ accentColor: habit.color, width: 18, height: 18 }}
                        checked={Boolean(dayLog[habit.id])}
                        onChange={() => onToggle(key, habit.id)}
                      />
                    </td>
                  ))}
                  <td className="px-4 py-2.5 text-center">
                    <span
                      className={`inline-flex items-center justify-center min-w-[3.5rem] px-2 py-1 rounded-full text-xs font-semibold ${
                        isComplete
                          ? 'bg-leaf-600 text-white'
                          : progress > 0
                          ? 'bg-leaf-100 text-leaf-700 dark:bg-leaf-900/50 dark:text-leaf-200'
                          : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {progress}%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
