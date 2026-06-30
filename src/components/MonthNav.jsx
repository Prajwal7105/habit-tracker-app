export default function MonthNav({ label, onPrev, onNext, onToday }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        aria-label="Previous month"
        className="w-8 h-8 grid place-items-center rounded-md border border-leaf-300 text-leaf-700 hover:bg-leaf-100 transition dark:border-slate-600 dark:text-leaf-200 dark:hover:bg-slate-700"
      >
        ‹
      </button>
      <span className="min-w-[10rem] text-center text-sm font-medium text-leaf-800 dark:text-leaf-100">{label}</span>
      <button
        onClick={onNext}
        aria-label="Next month"
        className="w-8 h-8 grid place-items-center rounded-md border border-leaf-300 text-leaf-700 hover:bg-leaf-100 transition dark:border-slate-600 dark:text-leaf-200 dark:hover:bg-slate-700"
      >
        ›
      </button>
      <button
        onClick={onToday}
        className="ml-1 px-2.5 py-1.5 text-xs rounded-md border border-leaf-300 text-leaf-700 hover:bg-leaf-100 transition dark:border-slate-600 dark:text-leaf-200 dark:hover:bg-slate-700"
      >
        Today
      </button>
    </div>
  )
}
