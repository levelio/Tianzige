import { useStore } from '@tanstack/react-store'
import { Eye, Pencil } from 'lucide-react'
import { hanziStore, setMode } from '@/stores/hanziStore'

export function ModeSwitcher() {
  const mode = useStore(hanziStore, (s) => s.mode)

  return (
    <div className="flex gap-2 bg-gray-100 rounded-2xl p-1">
      <button
        type="button"
        onClick={() => setMode('watch')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
          mode === 'watch'
            ? 'bg-white text-emerald-600 shadow'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Eye className="w-5 h-5" />
        观看模式
      </button>

      <button
        type="button"
        onClick={() => setMode('practice')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
          mode === 'practice'
            ? 'bg-white text-emerald-600 shadow'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Pencil className="w-5 h-5" />
        书写模式
      </button>
    </div>
  )
}
