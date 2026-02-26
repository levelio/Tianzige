import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { setCharacters } from '@/stores/hanziStore'

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
          type="button"
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
            type="button"
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
