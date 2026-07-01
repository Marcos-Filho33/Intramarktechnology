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
