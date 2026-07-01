import { getTodayDateString, formatTime } from '@/utils/pomodoro'

describe('pomodoro utils', () => {
  it('getTodayDateString returns YYYY-MM-DD', () => {
    expect(getTodayDateString()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('formatTime formats correctly', () => {
    expect(formatTime(0)).toBe('00:00')
    expect(formatTime(1500)).toBe('25:00')
    expect(formatTime(61)).toBe('01:01')
  })
})
