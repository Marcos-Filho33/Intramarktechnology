'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Hoje' },
  { href: '/kanban', label: 'Kanban' },
  { href: '/tasks', label: 'Tarefas' },
  { href: '/pomodoro', label: 'Pomodoro' },
]

export default function Navbar() {
  const pathname = usePathname()
  return (
    <nav className="flex items-center gap-4 bg-gray-900 text-white px-6 py-3">
      <span className="font-bold text-lg mr-4">Time Manager</span>
      {links.map(l => (
        <Link
          key={l.href}
          href={l.href}
          className={`px-3 py-1 rounded transition-colors ${
            pathname === l.href ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          {l.label}
        </Link>
      ))}
      <Link
        href="/settings"
        className={`ml-auto px-3 py-1 rounded transition-colors ${
          pathname === '/settings' ? 'bg-blue-600' : 'hover:bg-gray-700'
        }`}
      >
        Config
      </Link>
    </nav>
  )
}
