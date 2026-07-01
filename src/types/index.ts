export interface PomodoroSession {
  id: string
  taskId: string
  startTime: string
  endTime: string
  type: 'focus' | 'shortBreak' | 'longBreak'
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'doing' | 'done'
  createdAt: string
  dueDate?: string
  completedAt?: string
  estimatedPomodoros: number
  completedPomodoros: number
  pomodoroSessions: PomodoroSession[]
}

export interface TimerSettings {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  cyclesBeforeLongBreak: number
}

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cyclesBeforeLongBreak: 4,
}
