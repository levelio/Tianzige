import { Play, RotateCcw } from 'lucide-react'
import { useStore } from '@tanstack/react-store'
import { hanziStore } from '@/stores/hanziStore'

interface ControlButtonsProps {
  onPlay?: () => void
  onReplay?: () => void
}

export function ControlButtons({ onPlay, onReplay }: ControlButtonsProps) {
  const mode = useStore(hanziStore, (s) => s.mode)

  return (
    <div className="flex gap-4">
      {mode === 'watch' && (
        <button
          onClick={onPlay}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors shadow-lg"
        >
          <Play className="w-5 h-5" />
          播放动画
        </button>
      )}

      <button
        onClick={onReplay}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors shadow-lg"
      >
        <RotateCcw className="w-5 h-5" />
        重播
      </button>
    </div>
  )
}
