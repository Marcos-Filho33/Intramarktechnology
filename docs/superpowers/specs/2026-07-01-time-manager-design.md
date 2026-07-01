# Time Manager — Software de Gestão de Tempo

## Visão Geral

Aplicação web para gestão de tempo com Kanban, lista de tarefas e timer
Pomodoro integrado. Desenvolvida com Next.js (App Router, export estático)
e persistência em localStorage.

## Stack

- Next.js 14+ (App Router, export estático)
- TypeScript
- Context API para estado global
- @hello-pangea/dnd para drag & drop no Kanban
- CSS Modules ou Tailwind CSS
- Jest + Testing Library

## Modelo de Dados

```ts
interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'doing' | 'done'
  createdAt: Date
  dueDate?: string       // "YYYY-MM-DD"
  completedAt?: Date
  estimatedPomodoros: number
  completedPomodoros: number
  pomodoroSessions: PomodoroSession[]
}

interface PomodoroSession {
  id: string
  taskId: string
  startTime: Date
  endTime: Date
  type: 'focus' | 'shortBreak' | 'longBreak'
}

interface TimerSettings {
  focusDuration: number       // minutos, padrão 25
  shortBreakDuration: number  // minutos, padrão 5
  longBreakDuration: number   // minutos, padrão 15
  cyclesBeforeLongBreak: number  // padrão 4
}
```

## Views (Abas)

### 1. Hoje (`/`)
Dashboard com tarefas do dia (criadas hoje ou com data atual),
resumo de pomodoros concluídos hoje, e progresso.

### 2. Kanban (`/kanban`)
Três colunas: A Fazer (todo), Fazendo (doing), Concluído (done).
Drag & drop entre colunas. Cada card exibe título, estimativa de
pomodoros e botão "Iniciar Pomodoro".

### 3. Tarefas (`/tasks`)
Tabela/lista completa com:
- CRUD (criar, editar, excluir)
- Filtros por status e data
- Modal de detalhes com histórico de sessões

### 4. Pomodoro (`/pomodoro`)
Timer com:
- Seletor de tarefa ativa
- Display do temporizador (grande)
- Botões: Iniciar, Pausar, Pular, Reiniciar
- Indicador de ciclo atual (ex: "Ciclo 3/4")
- Progresso: sessões de foco concluídas na tarefa atual

### 5. Configurações (engrenagem no navbar)
Formulário para customizar:
- Duração do foco (minutos)
- Pausa curta (minutos)
- Pausa longa (minutos)
- Ciclos antes da pausa longa

## Fluxo do Pomodoro

1. Usuário seleciona tarefa no seletor da view Pomodoro
2. Clica "Iniciar" → timer regressivo de `focusDuration`
3. Ao fim → notificação sonora/visual, registra `PomodoroSession`
   na task, incrementa `completedPomodoros`
4. Se ciclo < cyclesBeforeLongBreak → pausa curta (`shortBreakDuration`)
5. Se ciclo >= cyclesBeforeLongBreak → pausa longa (`longBreakDuration`)
6. Após pausa → volta ao passo 2 para novo ciclo de foco

## Armazenamento e Estado

- **Context API** (`TaskContext` + `TimerContext`) gerencia estado global
- **localStorage** persiste tasks, sessions e timerSettings
- Ao carregar: `useEffect` lê do localStorage
- A cada mutação: salva automaticamente no localStorage

## Estrutura de Diretórios

```
src/
├── app/
│   ├── layout.tsx          # Layout com navbar
│   ├── page.tsx            # View Hoje
│   ├── kanban/page.tsx
│   ├── tasks/page.tsx
│   ├── pomodoro/page.tsx
│   └── settings/page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── KanbanColumn.tsx
│   ├── KanbanCard.tsx
│   ├── TaskList.tsx
│   ├── TaskModal.tsx
│   ├── PomodoroTimer.tsx
│   └── TimerSettings.tsx
├── context/
│   ├── TaskContext.tsx
│   └── TimerContext.tsx
├── types/
│   └── index.ts
├── utils/
│   ├── storage.ts
│   └── pomodoro.ts
└── __tests__/
```

## Testes

- Jest + Testing Library
- Testar: CRUD de tarefas, ciclo pomodoro, drag & drop, persistência
