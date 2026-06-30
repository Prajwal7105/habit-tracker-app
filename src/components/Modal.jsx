export default function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-leaf-900/40 backdrop-blur-sm dark:bg-black/60" onClick={onClose} />
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full dark:bg-slate-800 ${
          wide ? 'max-w-2xl' : 'max-w-md'
        } max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-leaf-100 dark:border-slate-700">
          <h2 className="text-base font-semibold text-leaf-800 dark:text-leaf-50">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-leaf-400 hover:text-leaf-700 text-lg leading-none dark:text-leaf-500 dark:hover:text-leaf-200"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
