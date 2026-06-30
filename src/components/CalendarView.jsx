import { buildMonthMatrix, todayKey, WEEKDAY_LABELS } from '../utils/dates'

export default function CalendarView({ year, month, notes, onSelectDay }) {
  const cells = buildMonthMatrix(year, month)
  const today = todayKey()

  return (
    <div className="bg-white rounded-xl border border-leaf-200 shadow-sm p-4 sm:p-6 dark:bg-slate-800 dark:border-slate-700">
      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAY_LABELS.map(label => (
          <div
            key={label}
            className="text-center text-xs font-semibold text-leaf-500 uppercase tracking-wide dark:text-leaf-400"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {cells.map(({ date, key, inMonth }) => {
          const note = notes[key]
          const hasNote = Boolean(note?.text && note.text.trim().length > 0)
          const tasks = note?.tasks || []
          const isToday = key === today

          return (
            <button
              key={key}
              onClick={() => onSelectDay(key)}
              className={`relative aspect-square rounded-lg border p-2 text-left transition flex flex-col ${
                inMonth
                  ? 'border-leaf-200 bg-white hover:bg-leaf-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'
                  : 'border-transparent bg-leaf-50/50 dark:bg-slate-900/40'
              } ${isToday ? 'ring-2 ring-leaf-500' : ''}`}
            >
              <span
                className={`text-sm font-medium ${
                  inMonth ? 'text-leaf-800 dark:text-leaf-100' : 'text-leaf-300 dark:text-leaf-600'
                }`}
              >
                {date.getDate()}
              </span>
              <div className="mt-auto flex items-center gap-1.5">
                {hasNote && <span className="w-1.5 h-1.5 rounded-full bg-leaf-500 shrink-0" />}
                {tasks.length > 0 && (
                  <span className="text-[10px] text-leaf-500 dark:text-leaf-400">
                    {tasks.filter(t => t.done).length}/{tasks.length}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
