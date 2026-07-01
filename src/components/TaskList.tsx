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
