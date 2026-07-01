import { render, screen, fireEvent } from '@testing-library/react'
import { TaskProvider, useTasks } from '@/context/TaskContext'

jest.mock('uuid', () => ({ v4: () => 'fixed-uuid' }))

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
