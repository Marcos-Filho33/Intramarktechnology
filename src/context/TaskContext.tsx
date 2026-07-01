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
