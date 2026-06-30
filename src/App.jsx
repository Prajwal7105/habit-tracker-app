import { useEffect, useState } from 'react'
import { loadData, saveData } from './utils/storage'
import { generateId } from './utils/id'
import { getMonthLabel } from './utils/dates'
import { exportToCSV } from './utils/csv'
import { getInitialTheme, saveTheme } from './utils/theme'
import TabNav from './components/TabNav'
import MonthNav from './components/MonthNav'
import TrackerGrid from './components/TrackerGrid'
import CalendarView from './components/CalendarView'
import StatsDashboard from './components/StatsDashboard'
import HabitManagerModal from './components/HabitManagerModal'
import DayModal from './components/DayModal'
import ThemeToggle from './components/ThemeToggle'

const TABS = [
  { id: 'tracker', label: 'Daily Tracker' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'stats', label: 'Statistics' },
]

export default function App() {
  const [data, setData] = useState(() => loadData())
  const [activeTab, setActiveTab] = useState('tracker')
  const [theme, setTheme] = useState(() => getInitialTheme())

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const [habitManagerOpen, setHabitManagerOpen] = useState(false)
  const [activeDay, setActiveDay] = useState(null)

  useEffect(() => {
    saveData(data)
  }, [data])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    saveTheme(theme)
  }, [theme])

  function toggleTheme() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  const { habits, logs, notes } = data

  function toggleLog(dateKey, habitId) {
    setData(prev => {
      const dayLog = { ...(prev.logs[dateKey] || {}) }
      dayLog[habitId] = !dayLog[habitId]
      return { ...prev, logs: { ...prev.logs, [dateKey]: dayLog } }
    })
  }

  function addHabit(name, color) {
    const newHabit = { id: generateId('habit'), name, color }
    setData(prev => ({ ...prev, habits: [...prev.habits, newHabit] }))
  }

  function updateHabit(id, updates) {
    setData(prev => ({
      ...prev,
      habits: prev.habits.map(h => (h.id === id ? { ...h, ...updates } : h)),
    }))
  }

  function deleteHabit(id) {
    setData(prev => {
      const nextLogs = {}
      Object.entries(prev.logs).forEach(([key, dayLog]) => {
        const { [id]: _removed, ...rest } = dayLog
        nextLogs[key] = rest
      })
      return {
        ...prev,
        habits: prev.habits.filter(h => h.id !== id),
        logs: nextLogs,
      }
    })
  }

  function saveNote(dateKey, noteData) {
    setData(prev => ({ ...prev, notes: { ...prev.notes, [dateKey]: noteData } }))
  }

  function openDay(dateKey, time) {
    setActiveDay({ key: dateKey, time })
  }

  function goToToday() {
    const n = new Date()
    setYear(n.getFullYear())
    setMonth(n.getMonth())
  }

  function changeMonth(delta) {
    let m = month + delta
    let y = year
    if (m < 0) {
      m = 11
      y -= 1
    } else if (m > 11) {
      m = 0
      y += 1
    }
    setMonth(m)
    setYear(y)
  }

  return (
    <div className="min-h-screen bg-leaf-50 text-leaf-900 dark:bg-slate-900 dark:text-leaf-50">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-leaf-200 shadow-sm dark:bg-slate-800/90 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <h1 className="text-xl font-semibold text-leaf-800 dark:text-leaf-100">Habit Tracker</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button
              onClick={() => setHabitManagerOpen(true)}
              className="px-3 py-2 text-sm rounded-lg border border-leaf-300 text-leaf-700 hover:bg-leaf-100 transition dark:border-slate-600 dark:text-leaf-200 dark:hover:bg-slate-700"
            >
              Manage Habits
            </button>
            <button
              onClick={() => exportToCSV(habits, logs)}
              className="px-3 py-2 text-sm rounded-lg bg-leaf-600 text-white hover:bg-leaf-700 transition"
            >
              Export CSV
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-3 flex flex-wrap items-center justify-between gap-3">
          <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />
          {activeTab !== 'calendar' && (
            <MonthNav
              label={getMonthLabel(year, month)}
              onPrev={() => changeMonth(-1)}
              onNext={() => changeMonth(1)}
              onToday={goToToday}
            />
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {habits.length === 0 && (
          <div className="mb-6 rounded-xl border border-dashed border-leaf-300 bg-white p-6 text-center text-leaf-600 dark:border-slate-600 dark:bg-slate-800 dark:text-leaf-300">
            No habits yet. Click <span className="font-medium">Manage Habits</span> to add your first one.
          </div>
        )}

        {activeTab === 'tracker' && (
          <TrackerGrid habits={habits} logs={logs} year={year} month={month} onToggle={toggleLog} />
        )}

        {activeTab === 'calendar' && <CalendarView notes={notes} onSelectDay={openDay} />}

        {activeTab === 'stats' && (
          <StatsDashboard habits={habits} logs={logs} year={year} month={month} theme={theme} />
        )}
      </main>

      {habitManagerOpen && (
        <HabitManagerModal
          habits={habits}
          onAdd={addHabit}
          onUpdate={updateHabit}
          onDelete={deleteHabit}
          onClose={() => setHabitManagerOpen(false)}
        />
      )}

      {activeDay && (
        <DayModal
          dateKey={activeDay.key}
          note={notes[activeDay.key]}
          initialTime={activeDay.time}
          onSave={saveNote}
          onClose={() => setActiveDay(null)}
        />
      )}
    </div>
  )
}
