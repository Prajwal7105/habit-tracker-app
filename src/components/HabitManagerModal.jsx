import { useState } from 'react'
import Modal from './Modal'

const COLOR_PALETTE = [
  '#2f724a', '#3f8f5f', '#5fab7c', '#0d9488',
  '#2563eb', '#7c3aed', '#d97706', '#dc2626', '#475569',
]

export default function HabitManagerModal({ habits, onAdd, onUpdate, onDelete, onClose }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLOR_PALETTE[0])
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed, color)
    setName('')
    setColor(COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)])
  }

  function startEdit(habit) {
    setEditingId(habit.id)
    setEditingName(habit.name)
  }

  function commitEdit(habit) {
    const trimmed = editingName.trim()
    if (trimmed && trimmed !== habit.name) {
      onUpdate(habit.id, { name: trimmed })
    }
    setEditingId(null)
  }

  return (
    <Modal title="Manage Habits" onClose={onClose} wide>
      <div className="space-y-4">
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {habits.map(habit => (
            <div
              key={habit.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-leaf-100 px-3 py-2 dark:border-slate-700"
            >
              <div className="flex gap-1">
                {COLOR_PALETTE.map(c => (
                  <button
                    key={c}
                    onClick={() => onUpdate(habit.id, { color: c })}
                    aria-label={`Set color ${c}`}
                    className={`w-4 h-4 rounded-full ${
                      habit.color === c ? 'ring-2 ring-offset-1 ring-leaf-500 dark:ring-offset-slate-800' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {editingId === habit.id ? (
                <input
                  autoFocus
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && commitEdit(habit)}
                  onBlur={() => commitEdit(habit)}
                  className="flex-1 min-w-[8rem] rounded-md border border-leaf-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400 dark:border-slate-600 dark:bg-slate-700 dark:text-leaf-50"
                />
              ) : (
                <button
                  onClick={() => startEdit(habit)}
                  className="flex-1 min-w-[8rem] text-left text-sm text-leaf-800 hover:text-leaf-600 dark:text-leaf-100 dark:hover:text-leaf-300"
                >
                  {habit.name}
                </button>
              )}

              {confirmDeleteId === habit.id ? (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-leaf-500 dark:text-leaf-300">Delete?</span>
                  <button
                    onClick={() => {
                      onDelete(habit.id)
                      setConfirmDeleteId(null)
                    }}
                    className="px-2 py-1 rounded bg-red-500 text-white"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-2 py-1 rounded border border-leaf-300 dark:border-slate-600 dark:text-leaf-200"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(habit.id)}
                  className="text-leaf-400 hover:text-red-500 text-sm dark:text-leaf-500"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          {habits.length === 0 && (
            <p className="text-sm text-leaf-400 dark:text-leaf-500">No habits yet — add one below.</p>
          )}
        </div>

        <div className="border-t border-leaf-100 pt-4 dark:border-slate-700">
          <label className="block text-xs font-semibold text-leaf-600 uppercase tracking-wide mb-1.5 dark:text-leaf-300">
            Add a habit
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1">
              {COLOR_PALETTE.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  aria-label={`Choose color ${c}`}
                  className={`w-5 h-5 rounded-full ${
                    color === c ? 'ring-2 ring-offset-1 ring-leaf-500 dark:ring-offset-slate-800' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. Meditation"
              className="flex-1 min-w-[10rem] rounded-lg border border-leaf-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400 dark:border-slate-600 dark:bg-slate-700 dark:text-leaf-50 dark:placeholder-leaf-500"
            />
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 text-sm rounded-lg bg-leaf-600 text-white hover:bg-leaf-700 transition"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-leaf-100 text-leaf-700 hover:bg-leaf-200 transition dark:bg-slate-700 dark:text-leaf-200 dark:hover:bg-slate-600"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  )
}
