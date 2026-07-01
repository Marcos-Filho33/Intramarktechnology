'use client'
import { useState } from 'react'
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
