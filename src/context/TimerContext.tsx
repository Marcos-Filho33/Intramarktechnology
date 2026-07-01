'use client'
import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'
import { TimerSettings, DEFAULT_TIMER_SETTINGS } from '@/types'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

const SETTINGS_KEY = 'time-manager-settings'
type Phase = 'focus' | 'shortBreak' | 'longBreak'
type TimerState = 'idle' | 'running' | 'paused'

interface TimerContextType {
  settings: TimerSettings
  updateSettings: (s: Partial<TimerSettings>) => void
  timerState: TimerState
  activeTaskId: string | null
  setActiveTaskId: (id: string | null) => void
  startTimer: () => void
  pauseTimer: () => void
  resumeTimer: () => void
  skipTimer: () => void
  resetTimer: () => void
  timeLeft: number
  currentPhase: Phase
  cycleCount: number
}

const TimerContext = createContext<TimerContextType | null>(null)

export function TimerProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_TIMER_SETTINGS)
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [currentPhase, setCurrentPhase] = useState<Phase>('focus')
  const [cycleCount, setCycleCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setSettings(loadFromStorage(SETTINGS_KEY, DEFAULT_TIMER_SETTINGS))
  }, [])

  useEffect(() => {
    saveToStorage(SETTINGS_KEY, settings)
  }, [settings])

  const clearTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  const getDuration = useCallback((phase: Phase) => {
    switch (phase) {
      case 'focus': return settings.focusDuration * 60
      case 'shortBreak': return settings.shortBreakDuration * 60
      case 'longBreak': return settings.longBreakDuration * 60
    }
  }, [settings])

  const startTimer = useCallback(() => {
    clearTimer()
    const dur = getDuration(currentPhase)
    setTimeLeft(dur)
    setTimerState('running')
  }, [currentPhase, getDuration])

  const pauseTimer = useCallback(() => {
    clearTimer()
    setTimerState('paused')
  }, [clearTimer])

  const resumeTimer = useCallback(() => {
    setTimerState('running')
  }, [])

  const skipTimer = useCallback(() => {
    clearTimer()
    setTimeLeft(0)
    setTimerState('idle')
  }, [clearTimer])

  const resetTimer = useCallback(() => {
    clearTimer()
    setTimeLeft(getDuration(currentPhase))
    setTimerState('idle')
  }, [clearTimer, currentPhase, getDuration])

  const updateSettings = useCallback((s: Partial<TimerSettings>) => {
    setSettings(prev => ({ ...prev, ...s }))
  }, [])

  useEffect(() => {
    if (timerState !== 'running') {
      clearTimer()
      return
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearTimer()
          setTimerState('idle')
          if (currentPhase === 'focus') {
            const nextCycle = cycleCount + 1
            setCycleCount(nextCycle)
            setCurrentPhase(
              nextCycle >= settings.cyclesBeforeLongBreak ? 'longBreak' : 'shortBreak'
            )
          } else {
            setCurrentPhase('focus')
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return clearTimer
  }, [timerState, currentPhase, cycleCount, settings.cyclesBeforeLongBreak, clearTimer])

  return (
    <TimerContext.Provider value={{
      settings, updateSettings, timerState, activeTaskId, setActiveTaskId,
      startTimer, pauseTimer, resumeTimer, skipTimer, resetTimer,
      timeLeft, currentPhase, cycleCount,
    }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimer must be used within TimerProvider')
  return ctx
}
