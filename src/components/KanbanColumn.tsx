'use client'
import { Droppable } from '@hello-pangea/dnd'
import { Task } from '@/types'
import KanbanCard from './KanbanCard'

interface Props {
  title: string
  status: Task['status']
  tasks: Task[]
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
