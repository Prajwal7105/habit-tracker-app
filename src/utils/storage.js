const STORAGE_KEY = 'habit-tracker-data-v1'

export const DEFAULT_HABITS = [
  { id: 'h1', name: 'Reading', color: '#2f724a' },
  { id: 'h2', name: 'Exercise', color: '#0d9488' },
  { id: 'h3', name: 'Vitamins', color: '#2563eb' },
  { id: 'h4', name: 'Journalling', color: '#7c3aed' },
]

function defaultData() {
  return {
    habits: DEFAULT_HABITS,
    logs: {},
    notes: {},
  }
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData()
    const parsed = JSON.parse(raw)
    return {
      habits: Array.isArray(parsed.habits) ? parsed.habits : [],
      logs: parsed.logs && typeof parsed.logs === 'object' ? parsed.logs : {},
      notes: parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {},
    }
  } catch (err) {
    console.error('Failed to load habit data, falling back to defaults', err)
    return defaultData()
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Failed to save habit data', err)
  }
}
