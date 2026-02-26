# 天天识字 - 汉字书写动画应用实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建一个面向 3-5 岁学前儿童的汉字书写学习应用，支持笔画动画演示、描红练习和互动反馈。

**Architecture:** 单页面应用，使用 TanStack Router 管理路由，TanStack Store 管理状态，HanziWriter 处理汉字笔画渲染和交互。

**Tech Stack:** React 19, TanStack Router, TanStack Store, Tailwind CSS 4, HanziWriter, canvas-confetti

---

## Task 1: 安装项目依赖

**Files:**
- Modify: `package.json` (添加依赖)

**Step 1: 安装 HanziWriter**

```bash
pnpm add hanzi-writer
```

**Step 2: 安装庆祝动画库**

```bash
pnpm add canvas-confetti
```

**Step 3: 提交**

```bash
git add package.json pnpm-lock.yaml
git commit -m "deps: add hanzi-writer and canvas-confetti"
```

---

## Task 2: 创建状态管理 Store

**Files:**
- Create: `src/stores/hanziStore.ts`

**Step 1: 创建 Store 定义**

```typescript
import { mutation, store } from '@tanstack/store'

interface HanziState {
  // 当前汉字列表
  characters: string[]
  // 当前索引
  currentIndex: number
  // 当前模式：'watch' | 'practice'
  mode: 'watch' | 'practice'
  // 是否加载中
  isLoading: boolean
}

export const hanziStore = store<HanziState>({
  characters: [],
  currentIndex: 0,
  mode: 'watch',
  isLoading: false,
})

export const setCharacters = mutation(hanziStore, 'setCharacters', (draft, chars: string[]) => {
  draft.characters = chars
  draft.currentIndex = 0
})

export const nextCharacter = mutation(hanziStore, 'nextCharacter', (draft) => {
  if (draft.currentIndex < draft.characters.length - 1) {
    draft.currentIndex += 1
  }
})

export const previousCharacter = mutation(hanziStore, 'previousCharacter', (draft) => {
  if (draft.currentIndex > 0) {
    draft.currentIndex -= 1
  }
})

export const setMode = mutation(hanziStore, 'setMode', (draft, mode: 'watch' | 'practice') => {
  draft.mode = mode
})

export const setLoading = mutation(hanziStore, 'setLoading', (draft, loading: boolean) => {
  draft.isLoading = loading
})
```

**Step 2: 提交**

```bash
git add src/stores/hanziStore.ts
git commit -m "feat: add hanzi state store with mutations"
```

---

## Task 3: 创建预设汉字集数据

**Files:**
- Create: `src/data/presets.ts`

**Step 1: 定义预设数据**

```typescript
export interface HanziPreset {
  id: string
  name: string
  icon: string
  characters: string[]
}

export const presets: HanziPreset[] = [
  {
    id: 'basic',
    name: '基础字',
    icon: '🔤',
    characters: ['一', '二', '三', '人', '大', '小', '上', '下'],
  },
  {
    id: 'nature',
    name: '大自然',
    icon: '🌳',
    characters: ['山', '水', '火', '日', '月', '云', '雨', '雪'],
  },
  {
    id: 'animals',
    name: '小动物',
    icon: '🐱',
    characters: ['马', '牛', '羊', '鸟', '鱼', '虫', '犬'],
  },
]

export const getPresetById = (id: string): HanziPreset | undefined => {
  return presets.find((p) => p.id === id)
}
```

**Step 2: 提交**

```bash
git add src/data/presets.ts
git commit -m "feat: add hanzi preset collections data"
```

---

## Task 4: 创建 HanziWriter 封装组件

**Files:**
- Create: `src/components/HanziCanvas.tsx`

**Step 1: 创建组件**

```typescript
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
```

**Step 2: 提交**

```bash
git add src/components/HanziCanvas.tsx
git commit -m "feat: add HanziWriter canvas component"
```

---

## Task 5: 创建导航按钮组件

**Files:**
- Create: `src/components/NavigationButtons.tsx`

**Step 1: 创建组件**

```typescript
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
        {currentIndex + 1} / {characters.length}
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
```

**Step 2: 提交**

```bash
git add src/components/NavigationButtons.tsx
git commit -m "feat: add navigation buttons component"
```

---

## Task 6: 创建控制按钮组件

**Files:**
- Create: `src/components/ControlButtons.tsx`

**Step 1: 创建组件**

```typescript
import { Play, RotateCcw } from 'lucide-react'
import { useStore } from '@tanstack/react-store'
import { hanziStore } from '#/stores/hanziStore'

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
```

**Step 2: 提交**

```bash
git add src/components/ControlButtons.tsx
git commit -m "feat: add control buttons component"
```

---

## Task 7: 创建模式切换组件

**Files:**
- Create: `src/components/ModeSwitcher.tsx`

**Step 1: 创建组件**

```typescript
import { Eye, Pencil } from 'lucide-react'
import { useStore } from '@tanstack/react-store'
import { hanziStore, setMode } from '#/stores/hanziStore'

export function ModeSwitcher() {
  const mode = useStore(hanziStore, (s) => s.mode)

  return (
    <div className="flex gap-2 bg-gray-100 rounded-2xl p-1">
      <button
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
```

**Step 2: 提交**

```bash
git add src/components/ModeSwitcher.tsx
git commit -m "feat: add mode switcher component"
```

---

## Task 8: 创建庆祝动画组件

**Files:**
- Create: `src/components/Celebration.tsx`

**Step 1: 创建组件**

```typescript
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface CelebrationProps {
  trigger: boolean
  type?: 'stars' | 'confetti' | 'fireworks'
  onComplete?: () => void
}

export function Celebration({ trigger, type = 'confetti', onComplete }: CelebrationProps) {
  useEffect(() => {
    if (!trigger) return

    const duration = 3000
    const end = Date.now() + duration

    const animate = () => {
      const now = Date.now()
      const remaining = Math.max(0, end - now)
      const progress = 1 - remaining / duration

      if (type === 'stars') {
        // 星星效果
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#58CC02', '#FFB800', '#FF9600'],
          shapes: ['star'],
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#58CC02', '#FFB800', '#FF9600'],
          shapes: ['star'],
        })
      } else if (type === 'fireworks') {
        // 烟花效果
        confetti({
          particleCount: 50,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#58CC02', '#FFB800', '#FF9600', '#FF6B6B'],
          gravity: 0.5,
          scalar: 1.2,
        })
      } else {
        // 彩带效果
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#58CC02', '#FFB800', '#FF9600'],
        })
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#58CC02', '#FFB800', '#FF9600'],
        })
      }

      if (remaining > 0) {
        requestAnimationFrame(animate)
      } else {
        onComplete?.()
      }
    }

    animate()
  }, [trigger, type, onComplete])

  return null
}
```

**Step 2: 提交**

```bash
git add src/components/Celebration.tsx
git commit -m "feat: add celebration animation component"
```

---

## Task 9: 创建吉祥物组件

**Files:**
- Create: `src/components/Mascot.tsx`

**Step 1: 创建组件**

```typescript
interface MascotProps {
  size?: 'sm' | 'md' | 'lg'
  mood?: 'happy' | 'excited' | 'encouraging'
}

export function Mascot({ size = 'md', mood = 'happy' }: MascotProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  const moods = {
    happy: '😊',
    excited: '🤩',
    encouraging: '💪',
  }

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center`}>
      <span className="text-4xl filter drop-shadow-lg">{moods[mood]}</span>
    </div>
  )
}
```

**Step 2: 提交**

```bash
git add src/components/Mascot.tsx
git commit -m "feat: add mascot component"
```

---

## Task 10: 创建自定义汉字输入页面

**Files:**
- Create: `src/routes/custom.tsx`

**Step 1: 创建页面**

```typescript
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { setCharacters } from '#/stores/hanziStore'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/custom')({
  component: CustomPage,
})

function CustomPage() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')

  const handleSubmit = () => {
    // 过滤出有效汉字
    const chars = input
      .split('')
      .filter((char) => /[\u4e00-\u9fa5]/.test(char))

    if (chars.length > 0) {
      setCharacters(chars)
      navigate({ to: '/' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          返回
        </button>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            自定义汉字
          </h1>

          <p className="text-gray-600 mb-4">
            输入你想学习的汉字，每个字都会生成练习卡片
          </p>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例如：我爱学习汉字"
            className="w-full h-40 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:outline-none resize-none text-lg"
          />

          {input && (
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
              <p className="text-sm text-gray-500 mb-2">识别到 {input.length} 个字符：</p>
              <div className="flex flex-wrap gap-2">
                {input.split('').map((char, i) => (
                  <span
                    key={i}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-xl font-semibold ${
                      /[\u4e00-\u9fa5]/.test(char)
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!input || !/[\u4e00-\u9fa5]/.test(input)}
            className="w-full mt-6 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold transition-colors shadow-lg"
          >
            开始学习
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: 提交**

```bash
git add src/routes/custom.tsx
git commit -m "feat: add custom characters input page"
```

---

## Task 11: 创建汉字集选择页面

**Files:**
- Create: `src/routes/presets.tsx`

**Step 1: 创建页面**

```typescript
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { presets } from '#/data/presets'
import { setCharacters } from '#/stores/hanziStore'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/presets')({
  component: PresetsPage,
})

function PresetsPage() {
  const navigate = useNavigate()

  const handleSelectPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId)
    if (preset) {
      setCharacters(preset.characters)
      navigate({ to: '/' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          返回
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">选择汉字集</h1>

        <div className="space-y-4">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className="w-full bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{preset.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {preset.name}
                  </h3>
                  <p className="text-gray-500">
                    {preset.characters.length} 个汉字
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {preset.characters.map((char, i) => (
                  <span
                    key={i}
                    className="w-10 h-10 flex items-center justify-center bg-emerald-50 rounded-xl text-lg font-semibold text-emerald-700"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: 提交**

```bash
git add src/routes/presets.tsx
git commit -m "feat: add presets selection page"
```

---

## Task 12: 重构主页面

**Files:**
- Modify: `src/routes/index.tsx`

**Step 1: 替换主页面内容**

```typescript
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { hanziStore } from '#/stores/hanziStore'
import { presets } from '#/data/presets'
import { HanziCanvas } from '#/components/HanziCanvas'
import { NavigationButtons } from '#/components/NavigationButtons'
import { ControlButtons } from '#/components/ControlButtons'
import { ModeSwitcher } from '#/components/ModeSwitcher'
import { Celebration } from '#/components/Celebration'
import { Mascot } from '#/components/Mascot'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const navigate = useNavigate()
  const characters = useStore(hanziStore, (s) => s.characters)
  const currentIndex = useStore(hanziStore, (s) => s.currentIndex)
  const [celebrationTrigger, setCelebrationTrigger] = useState(false)

  const currentCharacter = characters[currentIndex] || ''

  const handleComplete = () => {
    setCelebrationTrigger(true)
    setTimeout(() => setCelebrationTrigger(false), 3000)
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
          onClick={() => hanziStore.setState((s) => ({ ...s, characters: [], currentIndex: 0 }))}
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
          character={currentCharacter}
          onComplete={handleComplete}
        />

        {/* 模式切换 */}
        <ModeSwitcher />

        {/* 控制按钮 */}
        <ControlButtons />
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
```

**Step 2: 提交**

```bash
git add src/routes/index.tsx
git commit -m "feat: implement main hanzi learning page"
```

---

## Task 13: 更新样式以支持圆润风格

**Files:**
- Modify: `src/styles.css`

**Step 1: 添加全局样式**

```css
@import "tailwindcss";

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 防止移动端双击缩放 */
* {
  touch-action: manipulation;
}

/* 自定义动画 */
@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce-subtle {
  animation: bounce-subtle 0.5s ease-in-out;
}

/* 按钮点击反馈 */
button:active {
  transform: scale(0.95);
}
```

**Step 2: 提交**

```bash
git add src/styles.css
git commit -m "style: add rounded duolingo-style global styles"
```

---

## Task 14: 更新根布局

**Files:**
- Modify: `src/routes/__root.tsx`

**Step 1: 添加 StoreProvider 和响应式 meta 标签**

查看现有内容并确保包含：
- TanStackStoreProvider（如果需要）
- viewport meta 标签用于移动端

**Step 2: 提交**

```bash
git add src/routes/__root.tsx
git commit -m "chore: update root layout for mobile responsiveness"
```

---

## Task 15: 测试应用

**Step 1: 启动开发服务器**

```bash
cd /Users/zhiqiang/Projects/agent/tian-zi/.worktrees/hanzi-app
pnpm dev
```

**Step 2: 手动测试清单**

- [ ] 打开应用，看到欢迎页
- [ ] 点击"选择汉字集"，进入预设页面
- [ ] 选择一个预设，返回主页显示汉字
- [ ] 点击"自定义汉字"，输入汉字并提交
- [ ] 左右切换按钮正常工作
- [ ] 观看模式下笔画动画播放
- [ ] 切换到书写模式
- [ ] 书写模式下可以描红
- [ ] 完成书写后显示庆祝动画
- [ ] 移动端响应式布局正常

**Step 3: 如果有问题，修复并重新测试**

---

## Task 16: 最终构建验证

**Step 1: 运行构建**

```bash
pnpm build
```

**Step 2: 预览构建结果**

```bash
pnpm preview
```

**Step 3: 提交最终版本**

```bash
git add .
git commit -m "feat: complete hanzi writing app implementation"
```

---

## 完成标准

- [x] 所有组件实现完成
- [x] 预设汉字集可正常选择
- [x] 自定义汉字输入正常工作
- [x] 左右切换正常
- [x] 观看/书写模式切换正常
- [x] 笔画动画正常播放
- [x] 描红练习功能正常
- [x] 庆祝动画显示正常
- [x] 响应式布局在移动端正常
- [x] 构建成功无错误
