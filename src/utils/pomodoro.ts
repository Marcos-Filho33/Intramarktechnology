import { Task } from '@/types'

export function getTodayDateString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function getTodayTasks(tasks: Task[]): Task[] {
  const today = getTodayDateString()
  return tasks.filter(t =>
    t.createdAt.startsWith(today) || t.dueDate === today
  )
}

export function getPomodorosToday(tasks: Task[]): number {
  const today = getTodayDateString()
  return tasks.reduce((sum, t) =>
    sum + t.pomodoroSessions.filter(s =>
      s.type === 'focus' && s.startTime.startsWith(today)
    ).length, 0
  )
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
