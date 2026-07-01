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
