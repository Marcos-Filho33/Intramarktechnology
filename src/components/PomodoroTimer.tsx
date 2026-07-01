'use client'
import { useEffect, useCallback, useRef } from 'react'
import { useTimer } from '@/context/TimerContext'
import { useTasks } from '@/context/TaskContext'
import { v4 as uuid } from 'uuid'
import { formatTime } from '@/utils/pomodoro'

const phaseLabels = {
  focus: 'Foco',
  shortBreak: 'Pausa Curta',
  longBreak: 'Pausa Longa',
}

export default function PomodoroTimer() {
  const { tasks, updateTask } = useTasks()
  const {
    timerState, activeTaskId, setActiveTaskId,
    startTimer, pauseTimer, resumeTimer, skipTimer, resetTimer,
    timeLeft, currentPhase, cycleCount, settings,
  } = useTimer()
  const prevPhaseRef = useRef(currentPhase)

  useEffect(() => { prevPhaseRef.current = currentPhase }, [currentPhase])

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const activeTask = tasks.find(t => t.id === activeTaskId)

  const handleComplete = useCallback(() => {
    if (!activeTaskId) return
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro concluído!', { body: 'Hora de fazer uma pausa.' })
    }
    updateTask(activeTaskId, {
      completedPomodoros: (activeTask?.completedPomodoros ?? 0) + 1,
      pomodoroSessions: [
        ...(activeTask?.pomodoroSessions ?? []),
        {
          id: uuid(),
          taskId: activeTaskId,
          startTime: new Date(Date.now() - settings.focusDuration * 60000).toISOString(),
          endTime: new Date().toISOString(),
          type: 'focus',
        },
      ],
    })
  }, [activeTaskId, activeTask, updateTask, settings.focusDuration])

  useEffect(() => {
    if (timerState === 'idle' && timeLeft === 0 && prevPhaseRef.current === 'focus') {
      handleComplete()
    }
  }, [timerState, timeLeft, handleComplete])

  const totalCycles = settings.cyclesBeforeLongBreak
  const cycleDisplay = currentPhase === 'focus' ? cycleCount + 1 : cycleCount

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-xs">
        <label className="block text-sm text-gray-500 mb-1">Tarefa Ativa</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={activeTaskId ?? ''}
          onChange={e => setActiveTaskId(e.target.value || null)}
        >
          <option value="">Selecione uma tarefa</option>
          {tasks.filter(t => t.status !== 'done').map(t => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-full w-64 h-64 flex flex-col items-center justify-center shadow-lg">
        <p className="text-sm text-gray-500 uppercase">{phaseLabels[currentPhase]}</p>
        <p className="text-5xl font-bold mt-2">{formatTime(timeLeft)}</p>
        {activeTask && currentPhase === 'focus' && (
          <p className="text-sm text-gray-500 mt-2">{activeTask.title}</p>
        )}
      </div>

      <p className="text-sm text-gray-500">
        Ciclo {cycleDisplay}/{totalCycles}
      </p>

      <div className="flex gap-3">
        {timerState === 'idle' && (
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700" onClick={startTimer}>
            Iniciar
          </button>
        )}
        {timerState === 'running' && (
          <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700" onClick={pauseTimer}>
            Pausar
          </button>
        )}
        {timerState === 'paused' && (
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700" onClick={resumeTimer}>
            Continuar
          </button>
        )}
        {(timerState === 'running' || timerState === 'paused') && (
          <>
            <button className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={skipTimer}>Pular</button>
            <button className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={resetTimer}>Reiniciar</button>
          </>
        )}
      </div>

      {activeTask && (
        <p className="text-sm text-gray-500">
          Progresso: {activeTask.completedPomodoros} / {activeTask.estimatedPomodoros} pomodoros
        </p>
      )}
    </div>
  )
}
