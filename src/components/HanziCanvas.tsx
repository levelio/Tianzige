import { useEffect, useRef, useState } from 'react'
import HanziWriter from 'hanzi-writer'
import { useStore } from '@tanstack/react-store'
import { hanziStore } from '#/stores/hanziStore'

interface HanziCanvasProps {
  character: string
  onComplete?: () => void
  onStrokeChange?: (isCorrect: boolean) => void
}

const SVG_URL = 'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/'

export function HanziCanvas({ character, onComplete, onStrokeChange }: HanziCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const writerRef = useRef<HanziWriter | null>(null)
  const [isReady, setIsReady] = useState(false)
  const mode = useStore(hanziStore, (s) => s.mode)

  useEffect(() => {
    if (!containerRef.current) return

    // 清除之前的 writer
    if (writerRef.current) {
      writerRef.current = null
    }

    setIsReady(false)

    // 创建新的 HanziWriter 实例
    const writer = HanziWriter.create(containerRef.current, character, {
      charDataLoader: (char, onComplete) => {
        fetch(`${SVG_URL}${char}.json`)
          .then((res) => res.json())
          .then(onComplete)
      },
      width: 300,
      height: 300,
      padding: 20,
      showOutline: true,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 200,
      strokeColor: '#58CC02',
      radicalColor: '#FF9600',
      outlineColor: '#DDDDDD',
      drawingWidth: 20,
      showCharacter: false,
    })

    writerRef.current = writer

    // 等待加载完成
    writer.ready(() => {
      setIsReady(true)
      // 如果是观看模式，自动播放动画
      if (mode === 'watch') {
        writer.animateCharacter()
      }
    })

    return () => {
      writerRef.current = null
    }
  }, [character, mode])

  useEffect(() => {
    if (!writerRef.current || !isReady) return

    const writer = writerRef.current

    // 根据模式设置不同的行为
    if (mode === 'watch') {
      writer.quiz()
    } else {
      // 书写模式
      writer.quiz({
        onMistake: () => {
          onStrokeChange?.(false)
        },
        onCorrectStroke: () => {
          onStrokeChange?.(true)
        },
        onComplete: () => {
          onComplete?.()
        },
      })
    }
  }, [mode, isReady, onComplete, onStrokeChange])

  return (
    <div className="flex items-center justify-center">
      <div
        ref={containerRef}
        className="bg-white rounded-3xl shadow-lg"
        style={{ width: 300, height: 300 }}
      />
    </div>
  )
}
