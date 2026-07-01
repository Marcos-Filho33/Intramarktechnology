import { DEFAULT_TIMER_SETTINGS } from '@/types'

describe('DEFAULT_TIMER_SETTINGS', () => {
  it('has correct defaults', () => {
    expect(DEFAULT_TIMER_SETTINGS.focusDuration).toBe(25)
    expect(DEFAULT_TIMER_SETTINGS.shortBreakDuration).toBe(5)
    expect(DEFAULT_TIMER_SETTINGS.longBreakDuration).toBe(15)
    expect(DEFAULT_TIMER_SETTINGS.cyclesBeforeLongBreak).toBe(4)
  })
})
