'use client'
import { useTimer } from '@/context/TimerContext'

export default function TimerSettings() {
  const { settings, updateSettings } = useTimer()

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duração do Foco (min)</label>
          <input
            type="number" min={1} max={180}
            className="w-full border rounded px-3 py-2"
            value={settings.focusDuration}
            onChange={e => updateSettings({ focusDuration: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pausa Curta (min)</label>
          <input
            type="number" min={1} max={60}
            className="w-full border rounded px-3 py-2"
            value={settings.shortBreakDuration}
            onChange={e => updateSettings({ shortBreakDuration: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pausa Longa (min)</label>
          <input
            type="number" min={1} max={120}
            className="w-full border rounded px-3 py-2"
            value={settings.longBreakDuration}
            onChange={e => updateSettings({ longBreakDuration: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ciclos antes da pausa longa</label>
          <input
            type="number" min={1} max={20}
            className="w-full border rounded px-3 py-2"
            value={settings.cyclesBeforeLongBreak}
            onChange={e => updateSettings({ cyclesBeforeLongBreak: Number(e.target.value) })}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">As configurações são salvas automaticamente.</p>
      </div>
    </div>
  )
}
