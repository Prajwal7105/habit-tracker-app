import { useState } from 'react'
import { generateId } from '../utils/id'
import { parseDateKey, formatTimeLabel } from '../utils/dates'
import Modal from './Modal'

export default function DayModal({ dateKey, note, initialTime, onSave, onClose }) {
  const [text, setText] = useState(note?.text || '')
  const [tasks, setTasks] = useState(note?.tasks || [])
  const [newTask, setNewTask] = useState('')
  const [newTaskTime, setNewTaskTime] = useState(initialTime || '09:00')

  const dateLabel = parseDateKey(dateKey).toLocaleDateString('default', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const sortedTasks = [...tasks].sort((a, b) => (a.time || '').localeCompare(b.time || ''))

  function handleSave() {
    onSave(dateKey, { text, tasks })
    onClose()
  }

  function addTask() {
    const trimmed = newTask.trim()
    if (!trimmed) return
    setTasks(prev => [...prev, { id: generateId('task'), text: trimmed, done: false, time: newTaskTime }])
    setNewTask('')
  }

  function toggleTask(id) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function removeTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <Modal title={dateLabel} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-leaf-600 uppercase tracking-wide mb-1.5 dark:text-leaf-300">
            Notes
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
            placeholder="Anything noteworthy about this day…"
            className="w-full rounded-lg border border-leaf-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400 dark:border-slate-600 dark:bg-slate-700 dark:text-leaf-50 dark:placeholder-leaf-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-leaf-600 uppercase tracking-wide mb-1.5 dark:text-leaf-300">
            Tasks
          </label>
          <div className="space-y-1.5 mb-2 max-h-40 overflow-y-auto">
            {sortedTasks.map(task => (
              <div key={task.id} className="flex items-center gap-2 group">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  style={{ accentColor: '#2f724a' }}
                  className="w-4 h-4 shrink-0"
                />
                {task.time && (
                  <span className="text-[10px] font-medium text-leaf-500 dark:text-leaf-400 shrink-0 w-16">
                    {formatTimeLabel(task.time)}
                  </span>
                )}
                <span
                  className={`flex-1 text-sm ${
                    task.done ? 'line-through text-leaf-400 dark:text-leaf-500' : 'text-leaf-800 dark:text-leaf-100'
                  }`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => removeTask(task.id)}
                  aria-label="Remove task"
                  className="opacity-0 group-hover:opacity-100 text-leaf-400 hover:text-red-500 transition text-xs dark:text-leaf-500"
                >
                  ✕
                </button>
              </div>
            ))}
            {tasks.length === 0 && <p className="text-xs text-leaf-400 dark:text-leaf-500">No tasks yet.</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              placeholder="Add a task…"
              className="flex-1 min-w-[8rem] rounded-lg border border-leaf-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400 dark:border-slate-600 dark:bg-slate-700 dark:text-leaf-50 dark:placeholder-leaf-500"
            />
            <input
              type="time"
              value={newTaskTime}
              onChange={e => setNewTaskTime(e.target.value)}
              aria-label="Task time"
              className="rounded-lg border border-leaf-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400 dark:border-slate-600 dark:bg-slate-700 dark:text-leaf-50 [color-scheme:light] dark:[color-scheme:dark]"
            />
            <button
              onClick={addTask}
              className="px-3 py-1.5 text-sm rounded-lg bg-leaf-100 text-leaf-700 hover:bg-leaf-200 transition dark:bg-slate-700 dark:text-leaf-200 dark:hover:bg-slate-600"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-leaf-300 text-leaf-700 hover:bg-leaf-50 transition dark:border-slate-600 dark:text-leaf-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-lg bg-leaf-600 text-white hover:bg-leaf-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  )
}
