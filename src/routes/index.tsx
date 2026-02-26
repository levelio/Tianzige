import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { hanziStore } from '#/stores/hanziStore'
import { HanziCanvas } from '#/components/HanziCanvas'
import type { HanziCanvasHandle } from '#/components/HanziCanvas'
import { NavigationButtons } from '#/components/NavigationButtons'
import { ControlButtons } from '#/components/ControlButtons'
import { ModeSwitcher } from '#/components/ModeSwitcher'
import { Celebration } from '#/components/Celebration'
import { Mascot } from '#/components/Mascot'
import { useState, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const navigate = useNavigate()
  const characters = useStore(hanziStore, (s) => s.characters)
  const currentIndex = useStore(hanziStore, (s) => s.currentIndex)
  const [celebrationTrigger, setCelebrationTrigger] = useState(false)
  const hanziCanvasRef = useRef<HanziCanvasHandle>(null)

  const currentCharacter = characters[currentIndex] || ''

  const handleComplete = () => {
    setCelebrationTrigger(true)
    setTimeout(() => setCelebrationTrigger(false), 3000)
  }

  const handlePlay = () => {
    hanziCanvasRef.current?.animateCharacter()
  }

  const handleReplay = () => {
    hanziCanvasRef.current?.replay()
  }

  const handleSelectPreset = () => {
    navigate({ to: '/presets' })
  }

  const handleCustom = () => {
    navigate({ to: '/custom' })
  }

  // 如果没有汉字，显示欢迎页
  if (!currentCharacter) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Mascot size="lg" mood="happy" />
          <h1 className="text-4xl font-black text-gray-800 mt-4 mb-2">
            天天识字 🎯
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            快乐学习汉字书写
          </p>

          <div className="space-y-4">
            <button
              onClick={handleSelectPreset}
              className="w-full px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg transition-colors shadow-lg"
            >
              📚 选择汉字集
            </button>

            <button
              onClick={handleCustom}
              className="w-full px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-lg transition-colors shadow-lg"
            >
              ✏️ 自定义汉字
            </button>
          </div>

          <div className="mt-8 p-6 bg-white rounded-3xl shadow-lg">
            <p className="text-gray-600 text-sm">
              专为 3-5 岁儿童设计
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 flex flex-col">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Mascot size="sm" />
          <h1 className="text-xl font-bold text-gray-800">天天识字</h1>
        </div>
        <button
          onClick={() => hanziStore.setState((s) => ({ ...s, characters: [], currentIndex: -1 }))}
          className="text-gray-500 hover:text-gray-700"
        >
          返回首页
        </button>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        {/* 导航按钮 */}
        <NavigationButtons />

        {/* 汉字画布 */}
        <HanziCanvas
          ref={hanziCanvasRef}
          character={currentCharacter}
          onComplete={handleComplete}
        />

        {/* 模式切换 */}
        <ModeSwitcher />

        {/* 控制按钮 */}
        <ControlButtons onPlay={handlePlay} onReplay={handleReplay} />
      </main>

      {/* 庆祝动画 */}
      <Celebration trigger={celebrationTrigger} type="stars" />

      {/* 底部导航 */}
      <nav className="flex justify-center gap-4 p-4 bg-white/80 backdrop-blur-sm">
        <button
          onClick={handleSelectPreset}
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-800"
        >
          <span className="text-2xl">📚</span>
          <span className="text-xs">汉字集</span>
        </button>
        <button
          onClick={handleCustom}
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-800"
        >
          <span className="text-2xl">✏️</span>
          <span className="text-xs">自定义</span>
        </button>
      </nav>
    </div>
  )
}
