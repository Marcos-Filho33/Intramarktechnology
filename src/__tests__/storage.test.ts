import { loadFromStorage, saveToStorage } from '@/utils/storage'

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('returns fallback when key missing', () => {
    expect(loadFromStorage('missing', [])).toEqual([])
  })

  it('saves and loads', () => {
    saveToStorage('test', { a: 1 })
    expect(loadFromStorage('test', null)).toEqual({ a: 1 })
  })

  it('returns fallback on parse error', () => {
    localStorage.setItem('bad', 'not-json')
    expect(loadFromStorage('bad', 'x')).toBe('x')
  })
})
