# Time Manager Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a web-based time management app with Kanban, task list, and Pomodoro timer with customizable durations.

**Architecture:** Next.js 14 App Router with static export; state managed via React Context API; localStorage persistence; drag & drop via @hello-pangea/dnd.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, Context API, @hello-pangea/dnd, Jest + Testing Library, uuid

## Global Constraints

- Next.js 14+ with `output: 'export'` for static hosting
- Persist all data in localStorage (no backend)
- Port 3000 for dev server
- TypeScript strict mode
- UUID v4 for all IDs
- Tailwind CSS for styling (no CSS Modules)
- PT-BR labels throughout the UI

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `src/app/layout.tsx` (minimal scaffold)
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx` (minimal scaffold)
- Create: `jest.config.js`
- Create: `src/__tests__/placeholder.test.ts`

**Interfaces:**
- Consumes: (none)
- Produces: Working Next.js project scaffold with Tailwind, Jest, static export config

- [ ] **Step 1: Initialize package.json**

```bash
cmd /c "cd /d C:\Users\Pichau\git\teste-suprepawer && npm init -y"
```

- [ ] **Step 2: Install dependencies**

```bash
npm install next@14 react@18 react-dom@18 uuid
npm install -D typescript @types/react @types/react-dom @types/uuid tailwindcss postcss autoprefixer jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event @hello-pangea/dnd
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create next.config.js**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
}
module.exports = nextConfig
```

- [ ] **Step 5: Create postcss.config.js**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: Create tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
export default config
```

- [ ] **Step 7: Create globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 8: Create jest.config.js**

```js
const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: './' })
const customJestConfig = {
  setupFilesAfterSetup: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
}
module.exports = createJestConfig(customJestConfig)
```

- [ ] **Step 9: Create jest.setup.ts**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 10: Create minimal src/app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Time Manager',
  description: 'Gestão de tempo com Kanban e Pomodoro',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 11: Create minimal src/app/page.tsx**

```tsx
export default function Home() {
  return <main className="p-4"><h1 className="text-2xl font-bold">Time Manager</h1></main>
}
```

- [ ] **Step 12: Create placeholder test and verify**

```tsx
// src/__tests__/placeholder.test.ts
describe('Placeholder', () => {
  it('passes', () => { expect(true).toBe(true) })
})
```

```bash
npx jest --passWithNoTests
```
Expected: PASS

- [ ] **Step 13: Create directory structure**

```bash
mkdir -p src/app/kanban src/app/tasks src/app/pomodoro src/app/settings src/components src/context src/types src/utils src/__tests__
```

- [ ] **Step 14: Build test**

```bash
npx next build
```
Expected: Build succeeds

- [ ] **Step 15: Commit**

```bash
git add -A && git commit -m "feat: scaffold Next.js project with Tailwind and Jest"
```

---

### Task 2: Types and Utilities

**Files:**
- Create: `src/types/index.ts`
- Create: `src/utils/storage.ts`
- Create: `src/utils/pomodoro.ts`
- Modify: (none)

**Interfaces:**
- Consumes: (none)
- Produces: `Task`, `PomodoroSession`, `TimerSettings` types; `loadFromStorage<T>`, `saveToStorage<T>`, `generateId`; `getTodayDateString`, `getTodayTasks`, `getPomodorosToday`

- [ ] **Step 1: Write src/types/index.ts**

```ts
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
```

- [ ] **Step 2: Write test for types**

```ts
// src/__tests__/types.test.ts
import { DEFAULT_TIMER_SETTINGS } from '@/types'

describe('DEFAULT_TIMER_SETTINGS', () => {
  it('has correct defaults', () => {
    expect(DEFAULT_TIMER_SETTINGS.focusDuration).toBe(25)
    expect(DEFAULT_TIMER_SETTINGS.shortBreakDuration).toBe(5)
    expect(DEFAULT_TIMER_SETTINGS.longBreakDuration).toBe(15)
    expect(DEFAULT_TIMER_SETTINGS.cyclesBeforeLongBreak).toBe(4)
  })
})
```

- [ ] **Step 3: Write src/utils/storage.ts**

```ts
export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* quota exceeded, ignore */ }
}
```

- [ ] **Step 4: Write test for storage**

```ts
// src/__tests__/storage.test.ts
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
```

Run: `npx jest --passWithNoTests`
Expected: PASS

- [ ] **Step 5: Write src/utils/pomodoro.ts**

```ts
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
```

- [ ] **Step 6: Write test for pomodoro utils**

```ts
// src/__tests__/pomodoro.test.ts
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
```

Run: `npx jest --passWithNoTests`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add types and utility functions"
```

---

### Task 3: TaskContext

**Files:**
- Create: `src/context/TaskContext.tsx`

**Interfaces:**
- Consumes: `Task` type, `loadFromStorage`, `saveToStorage`, `v4` (uuid)
- Produces:
  - `TaskContextType`: `{ tasks: Task[], addTask, updateTask, deleteTask, moveTask, getTaskById }`
  - `addTask(data: Omit<Task, 'id' | 'createdAt' | 'completedPomodoros' | 'pomodoroSessions'>): void`
  - `updateTask(id: string, data: Partial<Task>): void`
  - `deleteTask(id: string): void`
  - `moveTask(id: string, status: Task['status']): void`

- [ ] **Step 1: Write src/context/TaskContext.tsx**

```tsx
'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { v4 as uuid } from 'uuid'
import { Task } from '@/types'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'time-manager-tasks'

interface TaskContextType {
  tasks: Task[]
  addTask: (data: Omit<Task, 'id' | 'createdAt' | 'completedPomodoros' | 'pomodoroSessions'>) => void
  updateTask: (id: string, data: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (id: string, status: Task['status']) => void
  getTaskById: (id: string) => Task | undefined
}

const TaskContext = createContext<TaskContextType | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    setTasks(loadFromStorage<Task[]>(STORAGE_KEY, []))
  }, [])

  useEffect(() => {
    saveToStorage(STORAGE_KEY, tasks)
  }, [tasks])

  const addTask = useCallback((data: Omit<Task, 'id' | 'createdAt' | 'completedPomodoros' | 'pomodoroSessions'>) => {
    setTasks(prev => [...prev, {
      ...data,
      id: uuid(),
      createdAt: new Date().toISOString(),
      completedPomodoros: 0,
      pomodoroSessions: [],
    }])
  }, [])

  const updateTask = useCallback((id: string, data: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const moveTask = useCallback((id: string, status: Task['status']) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status, completedAt: status === 'done' ? new Date().toISOString() : t.completedAt } : t
    ))
  }, [])

  const getTaskById = useCallback((id: string) => tasks.find(t => t.id === id), [tasks])

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask, getTaskById }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be used within TaskProvider')
  return ctx
}
```

- [ ] **Step 2: Write test for TaskContext**

```ts
// src/__tests__/TaskContext.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskProvider, useTasks } from '@/context/TaskContext'

function TestComponent() {
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useTasks()
  return (
    <div>
      <span data-testid="count">{tasks.length}</span>
      <ul>{tasks.map(t => <li key={t.id} data-testid={`task-${t.id}`}>{t.title} - {t.status}</li>)}</ul>
      <button onClick={() => addTask({ title: 'Nova', description: '', status: 'todo', estimatedPomodoros: 1 })}>
        Add
      </button>
      <button onClick={() => tasks[0] && updateTask(tasks[0].id, { title: 'Editada' })}>Edit</button>
      <button onClick={() => tasks[0] && deleteTask(tasks[0].id)}>Delete</button>
      <button onClick={() => tasks[0] && moveTask(tasks[0].id, 'done')}>Move</button>
    </div>
  )
}

describe('TaskContext', () => {
  it('adds, edits, deletes, and moves tasks', () => {
    render(<TaskProvider><TestComponent /></TaskProvider>)
    expect(screen.getByTestId('count').textContent).toBe('0')
    fireEvent.click(screen.getByText('Add'))
    expect(screen.getByTestId('count').textContent).toBe('1')
    fireEvent.click(screen.getByText('Edit'))
    expect(screen.getByText('Editada - todo')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Move'))
    expect(screen.getByText('Editada - done')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Delete'))
    expect(screen.getByTestId('count').textContent).toBe('0')
  })
})
```

Run: `npx jest --passWithNoTests`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add TaskContext with CRUD operations"
```

---

### Task 4: TimerContext

**Files:**
- Create: `src/context/TimerContext.tsx`

**Interfaces:**
- Consumes: `TimerSettings`, `DEFAULT_TIMER_SETTINGS`, `Task` type, `loadFromStorage`, `saveToStorage`
- Produces:
  - `TimerContextType`: `{ settings, updateSettings, timerState, activeTaskId, setActiveTaskId, startTimer, pauseTimer, resumeTimer, skipTimer, resetTimer, isRunning, timeLeft, currentPhase, cycleCount }`
  - Phases: `'focus' | 'shortBreak' | 'longBreak'`
  - `TimerState`: `'idle' | 'running' | 'paused'`

- [ ] **Step 1: Write src/context/TimerContext.tsx**

```tsx
'use client'
import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'
import { TimerSettings, DEFAULT_TIMER_SETTINGS, Task } from '@/types'
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
```

- [ ] **Step 2: Write test for TimerContext**

```ts
// src/__tests__/TimerContext.test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { TimerProvider, useTimer } from '@/context/TimerContext'

function TestComponent() {
  const { timerState, timeLeft, currentPhase, cycleCount, startTimer, pauseTimer, resumeTimer, skipTimer, resetTimer } = useTimer()
  return (
    <div>
      <span data-testid="state">{timerState}</span>
      <span data-testid="timeLeft">{timeLeft}</span>
      <span data-testid="phase">{currentPhase}</span>
      <span data-testid="cycle">{cycleCount}</span>
      <button onClick={startTimer}>Start</button>
      <button onClick={pauseTimer}>Pause</button>
      <button onClick={resumeTimer}>Resume</button>
      <button onClick={skipTimer}>Skip</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  )
}

describe('TimerContext', () => {
  it('starts, pauses, resumes, skips, and resets', () => {
    render(<TimerProvider><TestComponent /></TimerProvider>)
    expect(screen.getByTestId('state').textContent).toBe('idle')
    expect(screen.getByTestId('phase').textContent).toBe('focus')
    fireEvent.click(screen.getByText('Start'))
    expect(screen.getByTestId('state').textContent).toBe('running')
    expect(Number(screen.getByTestId('timeLeft').textContent)).toBe(1500)
    fireEvent.click(screen.getByText('Pause'))
    expect(screen.getByTestId('state').textContent).toBe('paused')
    fireEvent.click(screen.getByText('Resume'))
    expect(screen.getByTestId('state').textContent).toBe('running')
    fireEvent.click(screen.getByText('Skip'))
    expect(screen.getByTestId('state').textContent).toBe('idle')
  })
})
```

Run: `npx jest --passWithNoTests`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add TimerContext with Pomodoro cycle logic"
```

---

### Task 5: Layout and Navbar

**Files:**
- Create: `src/components/Navbar.tsx`
- Modify: `src/app/globals.css` (add styles)
- Modify: `src/app/layout.tsx` (wrap with providers, add Navbar)

**Interfaces:**
- Consumes: `TaskProvider`, `TimerProvider` from contexts
- Produces: Root layout with Navbar and all providers

- [ ] **Step 1: Write src/components/Navbar.tsx**

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Hoje' },
  { href: '/kanban', label: 'Kanban' },
  { href: '/tasks', label: 'Tarefas' },
  { href: '/pomodoro', label: 'Pomodoro' },
]

export default function Navbar() {
  const pathname = usePathname()
  return (
    <nav className="flex items-center gap-4 bg-gray-900 text-white px-6 py-3">
      <span className="font-bold text-lg mr-4">Time Manager</span>
      {links.map(l => (
        <Link
          key={l.href}
          href={l.href}
          className={`px-3 py-1 rounded transition-colors ${
            pathname === l.href ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          {l.label}
        </Link>
      ))}
      <Link
        href="/settings"
        className={`ml-auto px-3 py-1 rounded transition-colors ${
          pathname === '/settings' ? 'bg-blue-600' : 'hover:bg-gray-700'
        }`}
      >
        Config
      </Link>
    </nav>
  )
}
```

- [ ] **Step 2: Update src/app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { TaskProvider } from '@/context/TaskContext'
import { TimerProvider } from '@/context/TimerContext'

export const metadata: Metadata = {
  title: 'Time Manager',
  description: 'Gestão de tempo com Kanban e Pomodoro',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-100">
        <TaskProvider>
          <TimerProvider>
            <Navbar />
            <main className="p-6 max-w-6xl mx-auto">{children}</main>
          </TimerProvider>
        </TaskProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npx next build
```
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Navbar and root layout with providers"
```

---

### Task 6: Today View

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `useTasks()`, `getTodayTasks`, `getPomodorosToday`, `getTodayDateString`

- [ ] **Step 1: Write src/app/page.tsx**

```tsx
'use client'
import { useTasks } from '@/context/TaskContext'
import { getTodayTasks, getPomodorosToday, getTodayDateString } from '@/utils/pomodoro'

export default function Home() {
  const { tasks, moveTask } = useTasks()
  const todayTasks = getTodayTasks(tasks)
  const pomodorosHoje = getPomodorosToday(tasks)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Hoje — {getTodayDateString()}</h1>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Tarefas Hoje</p>
          <p className="text-3xl font-bold">{todayTasks.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Pomodoros Hoje</p>
          <p className="text-3xl font-bold">{pomodorosHoje}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Tarefas Concluídas</p>
          <p className="text-3xl font-bold">{todayTasks.filter(t => t.status === 'done').length}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold p-4 border-b">Tarefas de Hoje</h2>
        {todayTasks.length === 0 ? (
          <p className="p-4 text-gray-500">Nenhuma tarefa para hoje.</p>
        ) : (
          <ul>
            {todayTasks.map(t => (
              <li key={t.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                <span className={t.status === 'done' ? 'line-through text-gray-400' : ''}>
                  {t.title}
                </span>
                <div className="flex gap-2">
                  {t.status !== 'todo' && (
                    <button onClick={() => moveTask(t.id, 'todo')} className="text-sm px-2 py-1 bg-gray-200 rounded">A Fazer</button>
                  )}
                  {t.status !== 'doing' && (
                    <button onClick={() => moveTask(t.id, 'doing')} className="text-sm px-2 py-1 bg-yellow-200 rounded">Fazendo</button>
                  )}
                  {t.status !== 'done' && (
                    <button onClick={() => moveTask(t.id, 'done')} className="text-sm px-2 py-1 bg-green-200 rounded">Concluir</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build test**

```bash
npx next build
```
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add Today dashboard view"
```

---

### Task 7: Kanban View

**Files:**
- Create: `src/components/KanbanColumn.tsx`
- Create: `src/components/KanbanCard.tsx`
- Create: `src/app/kanban/page.tsx`

**Interfaces:**
- Consumes: `useTasks()`, `@hello-pangea/dnd`
- Produces: Kanban board with drag & drop

- [ ] **Step 1: Write src/components/KanbanCard.tsx**

```tsx
'use client'
import { Draggable } from '@hello-pangea/dnd'
import { Task } from '@/types'

interface Props {
  task: Task
  index: number
}

export default function KanbanCard({ task, index }: Props) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded shadow p-3 mb-2 border border-gray-200"
        >
          <p className="font-medium">{task.title}</p>
          <p className="text-xs text-gray-500 mt-1">
            {task.completedPomodoros}/{task.estimatedPomodoros} pomodoros
          </p>
        </div>
      )}
    </Draggable>
  )
}
```

- [ ] **Step 2: Write src/components/KanbanColumn.tsx**

```tsx
'use client'
import { Droppable } from '@hello-pangea/dnd'
import { Task } from '@/types'
import KanbanCard from './KanbanCard'

interface Props {
  title: string
  status: Task['status']
  tasks: Task[]
}

const statusLabels: Record<Task['status'], string> = {
  todo: 'A Fazer',
  doing: 'Fazendo',
  done: 'Concluído',
}

export default function KanbanColumn({ title, status, tasks }: Props) {
  return (
    <div className="bg-gray-200 rounded-lg p-3 w-72 flex-shrink-0">
      <h3 className="font-bold text-sm uppercase text-gray-600 mb-3">{title} ({tasks.length})</h3>
      <Droppable droppableId={status}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[200px]">
            {tasks.map((t, i) => <KanbanCard key={t.id} task={t} index={i} />)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
```

- [ ] **Step 3: Write src/app/kanban/page.tsx**

```tsx
'use client'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useTasks } from '@/context/TaskContext'
import KanbanColumn from '@/components/KanbanColumn'

export default function KanbanPage() {
  const { tasks, moveTask } = useTasks()

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const status = result.destination.droppableId as 'todo' | 'doing' | 'done'
    moveTask(result.draggableId, status)
  }

  const columns: Array<'todo' | 'doing' | 'done'> = ['todo', 'doing', 'done']
  const labels = { todo: 'A Fazer', doing: 'Fazendo', done: 'Concluído' }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Kanban</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map(col => (
            <KanbanColumn
              key={col}
              title={labels[col]}
              status={col}
              tasks={tasks.filter(t => t.status === col)}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
```

- [ ] **Step 4: Build test**

```bash
npx next build
```
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Kanban view with drag and drop"
```

---

### Task 8: Task List View

**Files:**
- Create: `src/components/TaskModal.tsx`
- Create: `src/components/TaskList.tsx`
- Create: `src/app/tasks/page.tsx`

**Interfaces:**
- Consumes: `useTasks()`

- [ ] **Step 1: Write src/components/TaskModal.tsx**

```tsx
'use client'
import { useState, useEffect } from 'react'
import { Task } from '@/types'

interface Props {
  task?: Task | null
  onSave: (data: { title: string; description: string; status: Task['status']; estimatedPomodoros: number; dueDate?: string }) => void
  onClose: () => void
}

export default function TaskModal({ task, onSave, onClose }: Props) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status, setStatus] = useState<Task['status']>(task?.status ?? 'todo')
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(task?.estimatedPomodoros ?? 1)
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), description, status, estimatedPomodoros, dueDate: dueDate || undefined })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-4">{task ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input className="border rounded px-3 py-2" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea className="border rounded px-3 py-2" placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          <select className="border rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value as Task['status'])}>
            <option value="todo">A Fazer</option>
            <option value="doing">Fazendo</option>
            <option value="done">Concluído</option>
          </select>
          <input className="border rounded px-3 py-2" type="number" min={1} placeholder="Pomodoros estimados" value={estimatedPomodoros} onChange={e => setEstimatedPomodoros(Number(e.target.value))} />
          <input className="border rounded px-3 py-2" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          <div className="flex gap-2 justify-end mt-2">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write src/components/TaskList.tsx**

```tsx
'use client'
import { useState } from 'react'
import { Task, PomodoroSession } from '@/types'
import { useTasks } from '@/context/TaskContext'
import TaskModal from './TaskModal'

export default function TaskList() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks()
  const [filter, setFilter] = useState<Task['status'] | 'all'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [expandedTask, setExpandedTask] = useState<string | null>(null)

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  const handleSave = (data: { title: string; description: string; status: Task['status']; estimatedPomodoros: number; dueDate?: string }) => {
    if (editingTask) {
      updateTask(editingTask.id, data)
    } else {
      addTask(data)
    }
    setModalOpen(false)
    setEditingTask(null)
  }

  const totalSessions = (sessions: PomodoroSession[]) =>
    sessions.filter(s => s.type === 'focus').length

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <select className="border rounded px-3 py-1" value={filter} onChange={e => setFilter(e.target.value as Task['status'] | 'all')}>
          <option value="all">Todas</option>
          <option value="todo">A Fazer</option>
          <option value="doing">Fazendo</option>
          <option value="done">Concluído</option>
        </select>
        <button className="px-4 py-1 bg-blue-600 text-white rounded ml-auto" onClick={() => { setEditingTask(null); setModalOpen(true) }}>
          + Nova Tarefa
        </button>
      </div>

      {modalOpen && <TaskModal task={editingTask} onSave={handleSave} onClose={() => { setModalOpen(false); setEditingTask(null) }} />}

      <div className="bg-white rounded-lg shadow">
        {filtered.map(t => (
          <div key={t.id} className="border-b last:border-b-0">
            <div className="flex items-center justify-between p-3">
              <div className="flex-1">
                <span className={t.status === 'done' ? 'line-through text-gray-400' : 'font-medium'}>{t.title}</span>
                <span className="ml-2 text-xs text-gray-500">
                  {t.completedPomodoros}/{t.estimatedPomodoros} pomodoros
                  {t.dueDate && ` · Vence: ${t.dueDate}`}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="text-sm px-2 py-1 bg-gray-200 rounded" onClick={() => { setEditingTask(t); setModalOpen(true) }}>Editar</button>
                <button className="text-sm px-2 py-1 bg-red-200 rounded" onClick={() => deleteTask(t.id)}>Excluir</button>
                <button className="text-sm px-2 py-1 bg-gray-100 rounded" onClick={() => setExpandedTask(expandedTask === t.id ? null : t.id)}>
                  {expandedTask === t.id ? '▲' : '▼'}
                </button>
              </div>
            </div>
            {expandedTask === t.id && (
              <div className="px-3 pb-3 text-sm text-gray-600">
                <p>{t.description || 'Sem descrição'}</p>
                <p className="mt-1 font-semibold">Sessões ({totalSessions(t.pomodoroSessions)})</p>
                {t.pomodoroSessions.filter(s => s.type === 'focus').map(s => (
                  <p key={s.id} className="text-xs">
                    {new Date(s.startTime).toLocaleString('pt-BR')} — {Math.round((new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 60000)}min
                  </p>
                ))}
                {t.pomodoroSessions.filter(s => s.type === 'focus').length === 0 && <p className="text-xs text-gray-400">Nenhuma sessão concluída.</p>}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="p-4 text-gray-500">Nenhuma tarefa encontrada.</p>}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Write src/app/tasks/page.tsx**

```tsx
import TaskList from '@/components/TaskList'

export default function TasksPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tarefas</h1>
      <TaskList />
    </div>
  )
}
```

- [ ] **Step 4: Build test**

```bash
npx next build
```
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Task List view with CRUD modals and filters"
```

---

### Task 9: Pomodoro View

**Files:**
- Create: `src/components/PomodoroTimer.tsx`
- Create: `src/app/pomodoro/page.tsx`

**Interfaces:**
- Consumes: `useTimer()`, `useTasks()`
- Produces: Pomodoro timer with task selector

- [ ] **Step 1: Write src/components/PomodoroTimer.tsx**

```tsx
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

  const activeTask = tasks.find(t => t.id === activeTaskId)

  const handleComplete = useCallback(() => {
    if (!activeTaskId) return
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
        Ciclo {cycleDisplay}/{currentPhase === 'longBreak' ? totalCycles : totalCycles}
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
```

- [ ] **Step 2: Write src/app/pomodoro/page.tsx**

```tsx
import PomodoroTimer from '@/components/PomodoroTimer'

export default function PomodoroPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Pomodoro</h1>
      <PomodoroTimer />
    </div>
  )
}
```

- [ ] **Step 3: Build test**

```bash
npx next build
```
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Pomodoro timer view"
```

---

### Task 10: Settings View

**Files:**
- Create: `src/components/TimerSettings.tsx`
- Create: `src/app/settings/page.tsx`

**Interfaces:**
- Consumes: `useTimer()`

- [ ] **Step 1: Write src/components/TimerSettings.tsx**

```tsx
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
```

- [ ] **Step 2: Write src/app/settings/page.tsx**

```tsx
import TimerSettings from '@/components/TimerSettings'

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Configurações</h1>
      <TimerSettings />
    </div>
  )
}
```

- [ ] **Step 3: Build test**

```bash
npx next build
```
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Settings view with customizable timer"
```

---

### Final Verification

```bash
npx jest --passWithNoTests && npx next build
```
Expected: All tests pass, build succeeds.

```bash
npx next dev
```
Start dev server and manually verify:
- All 5 views render correctly
- Adding/editing/deleting tasks works
- Drag & drop on Kanban works
- Pomodoro timer counts down and transitions phases
- Settings persist across page reloads
