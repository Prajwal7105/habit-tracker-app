export default function TabNav({ tabs, active, onChange }) {
  return (
    <nav className="inline-flex rounded-lg bg-leaf-100 p-1 dark:bg-slate-800">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
            active === tab.id
              ? 'bg-white text-leaf-800 shadow-sm dark:bg-slate-700 dark:text-leaf-50'
              : 'text-leaf-600 hover:text-leaf-800 dark:text-leaf-300 dark:hover:text-leaf-50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
