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
