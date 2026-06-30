import { useState } from 'react'
import {
  WEEKDAY_LABELS,
  buildMonthMatrix,
  buildWeekDays,
  getWeekStart,
  getMonthLabel,
  getWeekRangeLabel,
  addDays,
  todayKey,
  formatHourLabel,
  formatTimeLabel,
  WEEK_VIEW_START_HOUR,
  WEEK_VIEW_END_HOUR,
} from '../utils/dates'

const HOURS = Array.from(
  { length: WEEK_VIEW_END_HOUR - WEEK_VIEW_START_HOUR + 1 },
  (_, i) => WEEK_VIEW_START_HOUR + i
)

export default function CalendarView({ notes, onSelectDay }) {
  const [viewMode, setViewMode] = useState('month')
  const [anchorDate, setAnchorDate] = useState(() => new Date())
  const today = todayKey()

  function goToday() {
    setAnchorDate(new Date())
  }

  function goPrev() {
    setAnchorDate(prev =>
      viewMode === 'month' ? new Date(prev.getFullYear(), prev.getMonth() - 1, 1) : addDays(prev, -7)
    )
  }

  function goNext() {
    setAnchorDate(prev =>
      viewMode === 'month' ? new Date(prev.getFullYear(), prev.getMonth() + 1, 1) : addDays(prev, 7)
    )
  }

  const label =
    viewMode === 'month'
      ? getMonthLabel(anchorDate.getFullYear(), anchorDate.getMonth())
      : getWeekRangeLabel(getWeekStart(anchorDate))

  return (
    <div className="bg-white rounded-xl border border-leaf-200 shadow-sm p-4 sm:p-6 dark:bg-slate-800 dark:border-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            aria-label="Previous"
            className="w-8 h-8 grid place-items-center rounded-md border border-leaf-300 text-leaf-700 hover:bg-leaf-100 transition dark:border-slate-600 dark:text-leaf-200 dark:hover:bg-slate-700"
          >
            ‹
          </button>
          <span className="min-w-[11rem] text-center text-sm font-medium text-leaf-800 dark:text-leaf-100">
            {label}
          </span>
          <button
            onClick={goNext}
            aria-label="Next"
            className="w-8 h-8 grid place-items-center rounded-md border border-leaf-300 text-leaf-700 hover:bg-leaf-100 transition dark:border-slate-600 dark:text-leaf-200 dark:hover:bg-slate-700"
          >
            ›
          </button>
          <button
            onClick={goToday}
            className="ml-1 px-2.5 py-1.5 text-xs rounded-md border border-leaf-300 text-leaf-700 hover:bg-leaf-100 transition dark:border-slate-600 dark:text-leaf-200 dark:hover:bg-slate-700"
          >
            Today
          </button>
        </div>

        <div className="inline-flex rounded-lg bg-leaf-100 p-1 dark:bg-slate-700">
          {['month', 'week'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition capitalize ${
                viewMode === mode
                  ? 'bg-white text-leaf-800 shadow-sm dark:bg-slate-600 dark:text-leaf-50'
                  : 'text-leaf-600 hover:text-leaf-800 dark:text-leaf-300 dark:hover:text-leaf-50'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'month' ? (
        <MonthGrid anchorDate={anchorDate} notes={notes} onSelectDay={onSelectDay} today={today} />
      ) : (
        <WeekGrid anchorDate={anchorDate} notes={notes} onSelectDay={onSelectDay} today={today} />
      )}
    </div>
  )
}

function MonthGrid({ anchorDate, notes, onSelectDay, today }) {
  const cells = buildMonthMatrix(anchorDate.getFullYear(), anchorDate.getMonth())

  return (
    <div>
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

function WeekGrid({ anchorDate, notes, onSelectDay, today }) {
  const weekStart = getWeekStart(anchorDate)
  const weekDays = buildWeekDays(weekStart)

  return (
    <div className="overflow-auto max-h-[70vh] border border-leaf-100 rounded-lg dark:border-slate-700">
      <div className="grid grid-cols-[60px_repeat(7,1fr)] min-w-[760px]">
        <div className="sticky top-0 left-0 z-30 bg-white dark:bg-slate-800 border-b border-r border-leaf-100 dark:border-slate-700" />
        {weekDays.map(({ date, key }) => {
          const isToday = key === today
          return (
            <div
              key={key}
              className={`sticky top-0 z-20 bg-white dark:bg-slate-800 border-b border-leaf-100 dark:border-slate-700 px-2 py-2 text-center ${
                isToday ? 'bg-leaf-50 dark:bg-leaf-900/30' : ''
              }`}
            >
              <div className="text-[10px] font-semibold uppercase tracking-wide text-leaf-500 dark:text-leaf-400">
                {date.toLocaleDateString('default', { weekday: 'short' })}
              </div>
              <div
                className={`text-sm font-semibold ${
                  isToday ? 'text-leaf-700 dark:text-leaf-200' : 'text-leaf-800 dark:text-leaf-100'
                }`}
              >
                {date.getDate()}
              </div>
            </div>
          )
        })}

        {HOURS.map(hour => (
          <HourRow key={hour} hour={hour} weekDays={weekDays} notes={notes} onSelectDay={onSelectDay} />
        ))}
      </div>
    </div>
  )
}

function HourRow({ hour, weekDays, notes, onSelectDay }) {
  return (
    <>
      <div className="sticky left-0 z-10 bg-white dark:bg-slate-800 border-r border-t border-leaf-100 dark:border-slate-700 px-2 py-2 text-right text-[11px] text-leaf-400 dark:text-leaf-500">
        {formatHourLabel(hour)}
      </div>
      {weekDays.map(({ key }) => {
        const tasks = (notes[key]?.tasks || []).filter(
          t => t.time && parseInt(t.time.split(':')[0], 10) === hour
        )
        return (
          <button
            key={key}
            onClick={() => onSelectDay(key, `${String(hour).padStart(2, '0')}:00`)}
            className="border-t border-l border-leaf-100 dark:border-slate-700 p-1 min-h-[44px] text-left hover:bg-leaf-50 dark:hover:bg-slate-700/50 transition"
          >
            <div className="flex flex-col gap-1">
              {tasks.map(t => (
                <span
                  key={t.id}
                  className={`block truncate rounded px-1.5 py-0.5 text-[11px] ${
                    t.done
                      ? 'bg-leaf-100 text-leaf-400 line-through dark:bg-slate-700 dark:text-leaf-500'
                      : 'bg-leaf-600 text-white dark:bg-leaf-700'
                  }`}
                >
                  {formatTimeLabel(t.time)} {t.text}
                </span>
              ))}
            </div>
          </button>
        )
      })}
    </>
  )
}
