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
