import { useStore } from '@tanstack/react-store'
import { hanziStore } from '#/stores/hanziStore'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NavigationButtonsProps {
  onPrevious?: () => void
  onNext?: () => void
}

export function NavigationButtons({ onPrevious, onNext }: NavigationButtonsProps) {
  const currentIndex = useStore(hanziStore, (s) => s.currentIndex)
  const characters = useStore(hanziStore, (s) => s.characters)
  const mode = useStore(hanziStore, (s) => s.mode)

  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < characters.length - 1

  const handlePrevious = () => {
    if (hasPrevious) {
      onPrevious?.()
      hanziStore.setState((s) => ({ ...s, currentIndex: s.currentIndex - 1 }))
    }
  }

  const handleNext = () => {
    if (hasNext) {
      onNext?.()
      hanziStore.setState((s) => ({ ...s, currentIndex: s.currentIndex + 1 }))
    }
  }

  return (
    <div className="flex items-center justify-between w-full max-w-md px-4">
      <button
        onClick={handlePrevious}
        disabled={!hasPrevious}
        className="p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg"
        aria-label="上一个汉字"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>

      <div className="text-lg font-semibold text-gray-700">
        {currentIndex + 1} / {characters.length || 0}
      </div>

      <button
        onClick={handleNext}
        disabled={!hasNext}
        className="p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg"
        aria-label="下一个汉字"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>
    </div>
  )
}
