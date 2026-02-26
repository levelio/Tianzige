import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { presets } from '@/data/presets'
import { setCharacters } from '@/stores/hanziStore'

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
          type="button"
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
              type="button"
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
                {preset.characters.map((char) => (
                  <span
                    key={char}
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
