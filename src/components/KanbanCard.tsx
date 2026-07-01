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
