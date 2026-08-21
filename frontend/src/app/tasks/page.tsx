'use client';

import { useEffect, useMemo, useState } from 'react';

type Priority = 'High' | 'Medium' | 'Low';
type Status = 'To Do' | 'Doing' | 'On Hold' | 'Completed';
type View = 'list' | 'board';
type Theme = 'dark' | 'light';
type ColorMode =
  | 'purple'
  | 'blue'
  | 'amber'
  | 'pink'
  | 'rose'
  | 'emerald';

type Task = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  due: string;
  member: string;
  status: Status;
  labels?: string[];
  resources?: string[];
  subtasks?: {
    id: number;
    title: string;
    completed: boolean;
  }[];
  comments?: {
    id: number;
    text: string;
    author: string;
  }[];
};

type Activity = {
  id: number;
  text: string;
  time: string;
};

const STATUSES: Status[] = [
  'To Do',
  'Doing',
  'On Hold',
  'Completed',
];

const MEMBERS: Record<string, string> = {
  D: 'Dexter',
  C: 'Chris',
  S: 'Sarah',
  A: 'Alex',
  Q: 'Quinn',
};

const COLOR_MODES: Record<
  ColorMode,
  { name: string; color: string }
> = {
  purple: { name: 'Purple', color: '#7c3aed' },
  blue: { name: 'Blue', color: '#3b82f6' },
  amber: { name: 'Amber', color: '#f59e0b' },
  pink: { name: 'Pink', color: '#ec4899' },
  rose: { name: 'Rose', color: '#f43f5e' },
  emerald: { name: 'Emerald', color: '#10b981' },
};

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: 'Design Homepage',
    description: 'Create the modern responsive homepage UI.',
    priority: 'High',
    due: '2026-09-12',
    member: 'D',
    status: 'To Do',
  },
  {
    id: 2,
    title: 'Develop Login Feature',
    description: 'Build secure login and authentication flow.',
    priority: 'Low',
    due: '2026-09-15',
    member: 'C',
    status: 'To Do',
  },
  {
    id: 3,
    title: 'Test Payment Gateway',
    description: 'Test payment success, failure and edge cases.',
    priority: 'Medium',
    due: '2026-09-18',
    member: 'S',
    status: 'To Do',
  },
  {
    id: 4,
    title: 'Code Review',
    description: 'Review the latest feature implementation.',
    priority: 'High',
    due: '2026-09-12',
    member: 'D',
    status: 'Doing',
  },
  {
    id: 5,
    title: 'Design Mockups',
    description: 'Finalize all dashboard mockups.',
    priority: 'Medium',
    due: '2026-09-15',
    member: 'A',
    status: 'Doing',
  },
  {
    id: 6,
    title: 'Feature Testing',
    description: 'All major feature tests have passed.',
    priority: 'Low',
    due: '2026-09-10',
    member: 'Q',
    status: 'Completed',
  },
  {
    id: 7,
    title: 'UI Design Updated',
    description: 'Updated the dashboard visual system.',
    priority: 'High',
    due: '2026-09-11',
    member: 'D',
    status: 'Completed',
  },
];

const priorityStyles: Record<
  Priority,
  { color: string; background: string; border: string }
> = {
  High: {
    color: '#f87171',
    background: 'rgba(248,113,113,.11)',
    border: 'rgba(248,113,113,.28)',
  },
  Medium: {
    color: '#fb923c',
    background: 'rgba(251,146,60,.11)',
    border: 'rgba(251,146,60,.28)',
  },
  Low: {
    color: '#94a3b8',
    background: 'rgba(148,163,184,.09)',
    border: 'rgba(148,163,184,.20)',
  },
};

const statusStyles: Record<
  Status,
  { color: string; background: string }
> = {
  'To Do': {
    color: '#a78bfa',
    background: 'rgba(167,139,250,.09)',
  },
  Doing: {
    color: '#38bdf8',
    background: 'rgba(56,189,248,.09)',
  },
  'On Hold': {
    color: '#fbbf24',
    background: 'rgba(251,191,36,.09)',
  },
  Completed: {
    color: '#34d399',
    background: 'rgba(52,211,153,.09)',
  },
};

function formatDate(date: string) {
  if (!date) return 'No date';

  const value = new Date(`${date}T00:00:00`);

  if (Number.isNaN(value.getTime())) return date;

  return value.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
}

function isOverdue(date: string, status: Status) {
  if (!date || status === 'Completed') return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(`${date}T00:00:00`);

  return due < today;
}

function relativeDue(date: string, status: Status) {
  if (status === 'Completed') return 'Completed';
  if (!date) return 'No deadline';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(`${date}T00:00:00`);

  const days = Math.ceil(
    (due.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';

  return `${days}d left`;
}

function Avatar({
  member,
  small = false,
}: {
  member: string;
  small?: boolean;
}) {
  return (
    <div
      title={MEMBERS[member] || member}
      className="avatar"
      style={{
        width: small ? 28 : 36,
        height: small ? 28 : 36,
        fontSize: small ? 10 : 12,
      }}
    >
      {member}
    </div>
  );
}

function Mascot({ talking }: { talking: boolean }) {
  return (
    <svg
      width="120"
      height="140"
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="60"
        cy="100"
        rx="32"
        ry="28"
        fill="url(#bodyGrad)"
      />
      <path
        d="M28 95 Q10 80 15 65"
        stroke="#a78bfa"
        strokeWidth="8"
        strokeLinecap="round"
        style={{
          transformOrigin: '28px 95px',
          animation: talking
            ? 'wave .5s ease-in-out infinite alternate'
            : 'none',
        }}
      />
      <path
        d="M92 95 Q110 80 105 65"
        stroke="#a78bfa"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M48 125 Q44 138 40 140"
        stroke="#7c3aed"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M72 125 Q76 138 80 140"
        stroke="#7c3aed"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle
        cx="60"
        cy="55"
        r="36"
        fill="url(#headGrad)"
      />
      <ellipse cx="48" cy="50" rx="7" ry="8" fill="white" />
      <ellipse cx="72" cy="50" rx="7" ry="8" fill="white" />
      <ellipse cx="50" cy="52" rx="4" ry="5" fill="#1e1b4b" />
      <ellipse cx="74" cy="52" rx="4" ry="5" fill="#1e1b4b" />
      {talking ? (
        <ellipse
          cx="60"
          cy="65"
          rx="9"
          ry="6"
          fill="#1e1b4b"
        />
      ) : (
        <path
          d="M50 65 Q60 73 70 65"
          stroke="#1e1b4b"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
      <ellipse
        cx="38"
        cy="62"
        rx="7"
        ry="5"
        fill="#f9a8d4"
        opacity=".6"
      />
      <ellipse
        cx="82"
        cy="62"
        rx="7"
        ry="5"
        fill="#f9a8d4"
        opacity=".6"
      />
      <text x="5" y="30" fontSize="14">⭐</text>
      <text x="95" y="20" fontSize="12">✨</text>
      <defs>
        <radialGradient id="headGrad" cx="40%" cy="30%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
        <radialGradient id="bodyGrad" cx="40%" cy="30%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [view, setView] = useState<View>('list');
  const [theme, setTheme] = useState<Theme>('dark');
  const [colorMode, setColorMode] =
    useState<ColorMode>('purple');

  const [collapsed, setCollapsed] =
    useState<Record<Status, boolean>>({
      'To Do': false,
      Doing: false,
      'On Hold': false,
      Completed: false,
    });

  const [welcome, setWelcome] = useState(true);
  const [text, setText] = useState('');
  const [talking, setTalking] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] =
    useState<Task | null>(null);
  const [deleteTask, setDeleteTask] =
    useState<Task | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] =
    useState<'All' | Priority>('All');
  const [statusFilter, setStatusFilter] =
    useState<'All' | Status>('All');

  const [draggedTask, setDraggedTask] =
    useState<number | null>(null);

  const [activities, setActivities] =
    useState<Activity[]>([
      {
        id: 1,
        text: 'Workspace created',
        time: 'Just now',
      },
      {
        id: 2,
        text: 'Feature Testing completed',
        time: 'Today',
      },
      {
        id: 3,
        text: 'Design Homepage added',
        time: 'Today',
      },
    ]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium' as Priority,
    due: '',
    member: 'D',
    status: 'To Do' as Status,
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      theme
    );
    document.documentElement.setAttribute(
      'data-color',
      colorMode
    );
  }, [theme, colorMode]);

  useEffect(() => {
    try {
      const savedTasks =
        window.localStorage.getItem('pyramid-tasks');
      const savedActivities =
        window.localStorage.getItem(
          'pyramid-activities'
        );
      const savedTheme =
        window.localStorage.getItem('pyramid-theme');
      const savedColor =
        window.localStorage.getItem('pyramid-color');

      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed)) setTasks(parsed);
      }

      if (savedActivities) {
        const parsed = JSON.parse(savedActivities);
        if (Array.isArray(parsed)) setActivities(parsed);
      }

      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
      }

      if (
        savedColor &&
        savedColor in COLOR_MODES
      ) {
        setColorMode(savedColor as ColorMode);
      }
    } catch {
      // Keep defaults.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'pyramid-tasks',
        JSON.stringify(tasks)
      );
    } catch {}
  }, [tasks]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'pyramid-activities',
        JSON.stringify(activities)
      );
    } catch {}
  }, [activities]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'pyramid-theme',
        theme
      );
      window.localStorage.setItem(
        'pyramid-color',
        colorMode
      );
    } catch {}
  }, [theme, colorMode]);

  useEffect(() => {
    let index = 0;
    const message =
      'Welcome back, Dexter! 🎉 Your tasks are ready!';

    setTalking(true);

    const interval = window.setInterval(() => {
      setText(message.slice(0, index));
      index += 1;

      if (index > message.length) {
        window.clearInterval(interval);
        setTalking(false);

        window.setTimeout(() => {
          setWelcome(false);
        }, 900);
      }
    }, 38);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModalOpen(false);
        setDeleteTask(null);
        setSettingsOpen(false);
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();
        document
          .getElementById('task-search')
          ?.focus();
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'n'
      ) {
        event.preventDefault();
        openAddModal();
      }
    };

    window.addEventListener('keydown', handleKey);

    return () =>
      window.removeEventListener(
        'keydown',
        handleKey
      );
  });

  const addActivity = (message: string) => {
    setActivities((previous) =>
      [
        {
          id: Date.now(),
          text: message,
          time: 'Just now',
        },
        ...previous,
      ].slice(0, 8)
    );
  };

  const total = tasks.length;
  const completed = tasks.filter(
    (task) => task.status === 'Completed'
  ).length;
  const inProgress = tasks.filter(
    (task) => task.status === 'Doing'
  ).length;
  const onHold = tasks.filter(
    (task) => task.status === 'On Hold'
  ).length;
  const highPriority = tasks.filter(
    (task) => task.priority === 'High'
  ).length;

  const progress =
    total > 0
      ? Math.round((completed / total) * 100)
      : 0;

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.description
          .toLowerCase()
          .includes(query) ||
        task.member.toLowerCase().includes(query) ||
        (MEMBERS[task.member] || '')
          .toLowerCase()
          .includes(query);

      const matchesPriority =
        priorityFilter === 'All' ||
        task.priority === priorityFilter;

      const matchesStatus =
        statusFilter === 'All' ||
        task.status === statusFilter;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus
      );
    });
  }, [
    tasks,
    search,
    priorityFilter,
    statusFilter,
  ]);

  const upcoming = [...tasks]
    .filter(
      (task) =>
        task.status !== 'Completed' &&
        task.due
    )
    .sort(
      (a, b) =>
        new Date(a.due).getTime() -
        new Date(b.due).getTime()
    )
    .slice(0, 4);

  const openAddModal = (
    status: Status = 'To Do'
  ) => {
    setEditingTask(null);

    setForm({
      title: '',
      description: '',
      priority: 'Medium',
      due: '',
      member: 'D',
      status,
    });

    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);

    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      due: task.due,
      member: task.member,
      status: task.status,
    });

    setModalOpen(true);
  };

  const saveTask = () => {
    if (!form.title.trim()) return;

    if (editingTask) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                title: form.title.trim(),
                description:
                  form.description.trim() ||
                  'No description added.',
                priority: form.priority,
                due: form.due,
                member: form.member,
                status: form.status,
              }
            : task
        )
      );

      addActivity(
        `Edited "${form.title.trim()}"`
      );
    } else {
      const newTask: Task = {
        id: Date.now(),
        title: form.title.trim(),
        description:
          form.description.trim() ||
          'No description added.',
        priority: form.priority,
        due: form.due,
        member: form.member,
        status: form.status,
      };

      setTasks((previous) => [
        newTask,
        ...previous,
      ]);

      addActivity(
        `Created "${newTask.title}"`
      );
    }

    setModalOpen(false);
    setEditingTask(null);
  };

  const confirmDelete = () => {
    if (!deleteTask) return;

    setTasks((previous) =>
      previous.filter(
        (task) => task.id !== deleteTask.id
      )
    );

    addActivity(
      `Deleted "${deleteTask.title}"`
    );

    setDeleteTask(null);
  };

  const toggleComplete = (task: Task) => {
    const newStatus: Status =
      task.status === 'Completed'
        ? 'To Do'
        : 'Completed';

    setTasks((previous) =>
      previous.map((item) =>
        item.id === task.id
          ? { ...item, status: newStatus }
          : item
      )
    );

    addActivity(
      newStatus === 'Completed'
        ? `Completed "${task.title}"`
        : `Reopened "${task.title}"`
    );
  };

  const moveTask = (
    taskId: number,
    newStatus: Status
  ) => {
    const task = tasks.find(
      (item) => item.id === taskId
    );

    if (
      !task ||
      task.status === newStatus
    ) {
      return;
    }

    setTasks((previous) =>
      previous.map((item) =>
        item.id === taskId
          ? { ...item, status: newStatus }
          : item
      )
    );

    addActivity(
      `"${task.title}" moved to ${newStatus}`
    );
  };

  const toggleSection = (section: Status) => {
    setCollapsed((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  };

  const tasksForStatus = (status: Status) =>
    filteredTasks.filter(
      (task) => task.status === status
    );

  const clearFilters = () => {
    setSearch('');
    setPriorityFilter('All');
    setStatusFilter('All');
  };

  const resetAllData = () => {
    setTasks(INITIAL_TASKS);
    setActivities([
      {
        id: Date.now(),
        text: 'Workspace reset to default',
        time: 'Just now',
      },
    ]);
    setSearch('');
    setPriorityFilter('All');
    setStatusFilter('All');
    setTheme('dark');
    setColorMode('purple');
  };

  return (
    <div className="app-shell">
      <style>{`
        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          background: var(--bg);
        }

        body {
          color: var(--text);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button, input, textarea, select {
          font: inherit;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        :root {
          --bg: #07071a;
          --text: #ffffff;
          --muted: #94a3b8;
          --card: rgba(255,255,255,.05);
          --border: rgba(255,255,255,.08);
          --accent: #7c3aed;
        }

        [data-theme='light'] {
          --bg: #f8fafc;
          --text: #0f172a;
          --muted: #64748b;
          --card: rgba(15,23,42,.05);
          --border: rgba(15,23,42,.12);
        }

        [data-color='purple'] { --accent: #7c3aed; }
        [data-color='blue'] { --accent: #3b82f6; }
        [data-color='amber'] { --accent: #f59e0b; }
        [data-color='pink'] { --accent: #ec4899; }
        [data-color='rose'] { --accent: #f43f5e; }
        [data-color='emerald'] { --accent: #10b981; }

        .app-shell {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          background: var(--bg);
          color: var(--text);
        }

        .background-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .45;
          background-image:
            radial-gradient(
              rgba(255,255,255,.035) 1px,
              transparent 1px
            );
          background-size: 28px 28px;
        }

        .avatar {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 50%;
          color: white;
          font-weight: 800;
          background:
            linear-gradient(
              135deg,
              var(--accent),
              #2563eb
            );
          box-shadow:
            0 0 18px color-mix(
              in srgb,
              var(--accent) 35%,
              transparent
            );
        }

        .glass {
          background: var(--card);
          border: 1px solid var(--border);
          backdrop-filter: blur(18px);
        }

        .clickable {
          transition:
            transform .15s ease,
            opacity .15s ease,
            border-color .15s ease;
        }

        .clickable:hover {
          transform: translateY(-1px);
          opacity: .95;
        }

        .progress-track {
          height: 7px;
          border-radius: 10px;
          overflow: hidden;
          background: rgba(148,163,184,.16);
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background:
            linear-gradient(
              90deg,
              var(--accent),
              #2563eb
            );
        }

        .scroll-area::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .scroll-area::-webkit-scrollbar-thumb {
          background: rgba(148,163,184,.25);
          border-radius: 10px;
        }

        @keyframes wave {
          from { transform: rotate(-7deg); }
          to { transform: rotate(7deg); }
        }

        @media (max-width: 800px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }

          .board-grid {
            grid-template-columns:
              repeat(4, minmax(240px, 1fr)) !important;
          }

          .header-actions {
            width: 100%;
          }
        }

        @media (max-width: 560px) {
          .page-wrap {
            padding: 16px !important;
          }

          .two-col {
            grid-template-columns: 1fr !important;
          }

          .header-actions {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="background-grid" />

      <div
        className="page-wrap"
        style={{
          width: '100%',
          minHeight: '100vh',
          padding: '28px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: '1250px',
            margin: '0 auto',
          }}
        >
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '22px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 850,
                  marginBottom: '6px',
                }}
              >
                Pyramid Task Manager
              </div>

              <div
                style={{
                  color: 'var(--muted)',
                  fontSize: '14px',
                }}
              >
                Manage your tasks efficiently
              </div>
            </div>

            <div
              className="header-actions"
              style={{
                display: 'flex',
                gap: '9px',
                alignItems: 'center',
              }}
            >
              <div
                className="glass"
                style={{
                  display: 'flex',
                  gap: '4px',
                  padding: '4px',
                  borderRadius: '11px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setView('list')}
                  style={{
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 11px',
                    background:
                      view === 'list'
                        ? 'var(--accent)'
                        : 'transparent',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 800,
                    fontSize: '12px',
                  }}
                >
                  ☰ List
                </button>

                <button
                  type="button"
                  onClick={() => setView('board')}
                  style={{
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 11px',
                    background:
                      view === 'board'
                        ? 'var(--accent)'
                        : 'transparent',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 800,
                    fontSize: '12px',
                  }}
                >
                  ▦ Board
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  setTheme((previous) =>
                    previous === 'dark'
                      ? 'light'
                      : 'dark'
                  )
                }
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '11px',
                  padding: '10px 13px',
                  background: 'var(--card)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontWeight: 750,
                }}
              >
                {theme === 'dark'
                  ? '☀️ Light'
                  : '🌙 Dark'}
              </button>

              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '11px',
                  padding: '10px 13px',
                  background: 'var(--card)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontWeight: 750,
                }}
              >
                ⚙️ Settings
              </button>

              <button
                type="button"
                onClick={() => openAddModal()}
                style={{
                  border: 'none',
                  borderRadius: '11px',
                  padding: '11px 17px',
                  background:
                    `linear-gradient(135deg, ${COLOR_MODES[colorMode].color}, #2563eb)`,
                  color: 'white',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                + Add Task
              </button>
            </div>
          </header>

          <div
            className="dashboard-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1fr',
              gap: '16px',
              marginBottom: '18px',
            }}
          >
            <div
              className="glass"
              style={{
                padding: '18px',
                borderRadius: '18px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'var(--muted)',
                      marginBottom: '4px',
                    }}
                  >
                    Workspace progress
                  </div>
                  <div
                    style={{
                      fontSize: '27px',
                      fontWeight: 850,
                    }}
                  >
                    {progress}%
                  </div>
                </div>

                <div
                  style={{
                    textAlign: 'right',
                    fontSize: '12px',
                    color: 'var(--muted)',
                  }}
                >
                  {completed} of {total} completed
                </div>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div
              className="glass"
              style={{
                padding: '18px',
                borderRadius: '18px',
                display: 'grid',
                gridTemplateColumns:
                  'repeat(4,1fr)',
                gap: '8px',
              }}
            >
              {[
                ['Total', total],
                ['Doing', inProgress],
                ['On Hold', onHold],
                ['High', highPriority],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    minWidth: 0,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '21px',
                      fontWeight: 850,
                    }}
                  >
                    {value}
                  </div>
                  <div
                    style={{
                      color: 'var(--muted)',
                      fontSize: '11px',
                      marginTop: '3px',
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="glass"
            style={{
              padding: '12px',
              borderRadius: '15px',
              marginBottom: '18px',
              display: 'flex',
              gap: '9px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <input
              id="task-search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="🔎 Search tasks... (Ctrl + K)"
              style={{
                flex: '1 1 240px',
                minWidth: '200px',
                padding: '11px 13px',
                borderRadius: '10px',
                border:
                  '1px solid var(--border)',
                background: 'var(--card)',
                color: 'var(--text)',
                outline: 'none',
              }}
            />

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value as
                    | 'All'
                    | Priority
                )
              }
              style={{
                padding: '11px 12px',
                borderRadius: '10px',
                border:
                  '1px solid var(--border)',
                background:
                  theme === 'dark'
                    ? '#11112b'
                    : '#ffffff',
                color: 'var(--text)',
              }}
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | 'All'
                    | Status
                )
              }
              style={{
                padding: '11px 12px',
                borderRadius: '10px',
                border:
                  '1px solid var(--border)',
                background:
                  theme === 'dark'
                    ? '#11112b'
                    : '#ffffff',
                color: 'var(--text)',
              }}
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={clearFilters}
              style={{
                padding: '11px 13px',
                borderRadius: '10px',
                border:
                  '1px solid var(--border)',
                background: 'var(--card)',
                color: 'var(--text)',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Clear
            </button>
          </div>

          {view === 'list' ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              {STATUSES.map((status) => {
                const statusTasks =
                  tasksForStatus(status);
                const s = statusStyles[status];

                return (
                  <section key={status}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '18px',
                          fontWeight: 800,
                        }}
                      >
                        <span
                          style={{
                            width: 9,
                            height: 9,
                            borderRadius: '50%',
                            background: s.color,
                            boxShadow:
                              `0 0 12px ${s.color}`,
                          }}
                        />
                        {status}
                        <span
                          style={{
                            color:
                              'var(--muted)',
                            fontSize: '12px',
                          }}
                        >
                          ({statusTasks.length})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          toggleSection(status)
                        }
                        style={{
                          border: 'none',
                          background:
                            'transparent',
                          color:
                            'var(--muted)',
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        {collapsed[status]
                          ? 'Show'
                          : 'Hide'}
                      </button>
                    </div>

                    {!collapsed[status] &&
                      statusTasks.map((task) => {
                        const p =
                          priorityStyles[
                            task.priority
                          ];
                        const overdue =
                          isOverdue(
                            task.due,
                            task.status
                          );

                        return (
                          <div
                            key={task.id}
                            className="glass"
                            style={{
                              padding: '17px',
                              marginBottom: '9px',
                              borderRadius: '15px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent:
                                  'space-between',
                                gap: '15px',
                                flexWrap: 'wrap',
                              }}
                            >
                              <div
                                style={{
                                  minWidth: 0,
                                  flex: 1,
                                }}
                              >
                                <div
                                  style={{
                                    fontSize:
                                      '17px',
                                    fontWeight: 800,
                                    marginBottom:
                                      '6px',
                                  }}
                                >
                                  {task.title}
                                </div>

                                <div
                                  style={{
                                    color:
                                      'var(--muted)',
                                    fontSize:
                                      '13px',
                                    marginBottom:
                                      '11px',
                                    lineHeight:
                                      1.5,
                                  }}
                                   >
                                  {task.description}
                                </div>

                                <div
                                  style={{
                                    display:
                                      'flex',
                                    gap: '8px',
                                    alignItems:
                                      'center',
                                    flexWrap:
                                      'wrap',
                                  }}
                                >
                                  <span
                                    style={{
                                      padding:
                                        '5px 9px',
                                      borderRadius:
                                        '8px',
                                      color:
                                        p.color,
                                      background:
                                        p.background,
                                      border:
                                        `1px solid ${p.border}`,
                                      fontSize:
                                        '11px',
                                      fontWeight: 800,
                                    }}
                                  >
                                    {task.priority}
                                  </span>

                                  <span
                                    style={{
                                      color:
                                        overdue
                                          ? '#f87171'
                                          : 'var(--muted)',
                                      fontSize:
                                        '12px',
                                      fontWeight:
                                        overdue
                                          ? 750
                                          : 500,
                                    }}
                                  >
                                    📅{' '}
                                    {formatDate(
                                      task.due
                                    )}{' '}
                                    •{' '}
                                    {relativeDue(
                                      task.due,
                                      task.status
                                    )}
                                  </span>

                                  <Avatar
                                    member={
                                      task.member
                                    }
                                    small
                                  />
                                </div>
                              </div>

                              <div
                                style={{
                                  display:
                                    'flex',
                                  gap: '7px',
                                  alignItems:
                                    'center',
                                  flexWrap:
                                    'wrap',
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleComplete(
                                      task
                                    )
                                  }
                                  style={{
                                    padding:
                                      '8px 11px',
                                    borderRadius:
                                      '8px',
                                    border: 'none',
                                    background:
                                      '#123b31',
                                    color:
                                      '#34d399',
                                    cursor:
                                      'pointer',
                                    fontWeight:
                                      750,
                                  }}
                                >
                                  {task.status ===
                                  'Completed'
                                    ? 'Reopen'
                                    : '✓ Complete'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditModal(
                                      task
                                    )
                                  }
                                  style={{
                                    padding:
                                      '8px 11px',
                                    borderRadius:
                                      '8px',
                                    border: 'none',
                                    background:
                                      '#1e1b4b',
                                    color:
                                      '#c4b5fd',
                                    cursor:
                                      'pointer',
                                    fontWeight:
                                      750,
                                  }}
                                >
                            
                                  Edit
                                </button>

                                                             <button
  type="button"
  onClick={() => setSelectedTask(task)}
  style={{
    padding: '8px 11px',
    borderRadius: '9px',
    border: '1px solid var(--border)',
    background: 'var(--card)',
    color: 'var(--text)',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '12px',
  }}
>
  👁️ View
</button>


<button
  type="button"
  onClick={() => setDeleteTask(task)}
  style={{
    padding: '8px 11px',
    borderRadius: '8px',
    border: 'none',
    background: '#3b1515',
    color: '#f87171',
    cursor: 'pointer',
    fontWeight: 750,
  }}
>
  Delete
</button>
                                  

                              </div>
                            </div>
                          </div>
                        );
                      })}

                    {!collapsed[status] &&
                      statusTasks.length === 0 && (
                        <div
                          style={{
                            padding: '25px',
                            textAlign: 'center',
                            color:
                              'var(--muted)',
                            border:
                              '1px dashed var(--border)',
                            borderRadius: '12px',
                          }}
                        >
                          No tasks here.
                        </div>
                      )}
                  </section>
                );
              })}
            </div>
          ) : (
            <div
              className="scroll-area"
              style={{
                overflowX: 'auto',
                paddingBottom: '10px',
              }}
            >
              <div
                className="board-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(4, minmax(240px, 1fr))',
                  gap: '14px',
                  alignItems: 'start',
                  minWidth: '990px',
                }}
              >
                {STATUSES.map((status) => {
                  const statusTasks =
                    tasksForStatus(status);
                  const s =
                    statusStyles[status];

                  return (
                    <div
                      key={status}
                      onDragOver={(e) =>
                        e.preventDefault()
                      }
                      onDrop={(e) => {
                        e.preventDefault();

                        if (
                          draggedTask !== null
                        ) {
                          moveTask(
                            draggedTask,
                            status
                          );
                          setDraggedTask(null);
                        }
                      }}
                      style={{
                        minHeight: '500px',
                        borderRadius: '18px',
                        padding: '14px',
                        background:
                          'var(--card)',
                        border:
                          '1px solid var(--border)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          alignItems: 'center',
                          marginBottom: '13px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 850,
                          }}
                        >
                          <span
                            style={{
                              width: 9,
                              height: 9,
                              borderRadius:
                                '50%',
                              background:
                                s.color,
                              boxShadow:
                                `0 0 12px ${s.color}`,
                            }}
                          />
                          {status}
                        </div>

                        <span
                          style={{
                            minWidth: '25px',
                            height: '25px',
                            padding: '0 7px',
                            display: 'grid',
                            placeItems:
                              'center',
                            borderRadius: '8px',
                            background:
                              s.background,
                            color: s.color,
                            fontSize: '11px',
                            fontWeight: 850,
                          }}
                        >
                          {statusTasks.length}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openAddModal(status)
                        }
                        style={{
                          width: '100%',
                          padding: '10px',
                          marginBottom: '12px',
                          borderRadius: '10px',
                          border:
                            '1px dashed var(--border)',
                          background:
                            'transparent',
                          color:
                            'var(--muted)',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 750,
                        }}
                      >
                        + Add Task
                      </button>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection:
                            'column',
                          gap: '10px',
                        }}
                      >
                        {statusTasks.map(
                          (task) => {
                            const p =
                              priorityStyles[
                                task.priority
                              ];

                            return (
                              <div
                                key={task.id}
                                draggable
                                onDragStart={() =>
                                  setDraggedTask(
                                    task.id
                                  )
                                }
                                onDragEnd={() =>
                                  setDraggedTask(
                                    null
                                  )
                                }
                                style={{
                                  padding: '14px',
                                  borderRadius:
                                    '14px',
                                  background:
                                    'linear-gradient(145deg, rgba(255,255,255,.065), rgba(255,255,255,.025))',
                                  border:
                                    draggedTask ===
                                    task.id
                                      ? '1px solid var(--accent)'
                                      : '1px solid var(--border)',
                                  cursor: 'grab',
                                  boxShadow:
                                    '0 8px 25px rgba(0,0,0,.12)',
                                }}
                              >
                                <div
                                  style={{
                                    display:
                                      'flex',
                                    justifyContent:
                                      'space-between',
                                    gap: '8px',
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize:
                                        '14px',
                                      fontWeight:
                                        850,
                                      lineHeight:
                                        1.4,
                                    }}
                                  >
                                    {task.title}
                                  </div>
                                  <Avatar
                                    member={
                                      task.member
                                    }
                                    small
                                  />
                                </div>

                                <div
                                  style={{
                                    marginTop:
                                      '8px',
                                    color:
                                      'var(--muted)',
                                    fontSize:
                                      '12px',
                                    lineHeight:
                                      1.5,
                                  }}
                                >
                                  {task.description}
                                </div>

                                <div
                                  style={{
                                    display:
                                      'flex',
                                    justifyContent:
                                      'space-between',
                                    alignItems:
                                      'center',
                                    gap: '7px',
                                    marginTop:
                                      '11px',
                                    flexWrap:
                                      'wrap',
                                  }}
                                >
                                  <span
                                    style={{
                                      padding:
                                        '4px 7px',
                                      borderRadius:
                                        '7px',
                                      color:
                                        p.color,
                                      background:
                                        p.background,
                                      border:
                                        `1px solid ${p.border}`,
                                      fontSize:
                                        '10px',
                                      fontWeight:
                                        800,
                                    }}
                                  >
                                    {task.priority}
                                  </span>

                                  <span
                                    style={{
                                      color:
                                        isOverdue(
                                          task.due,
                                          task.status
                                        )
                                          ? '#f87171'
                                          : 'var(--muted)',
                                      fontSize:
                                        '10px',
                                    }}
                                  >
                                    {formatDate(
                                      task.due
                                    )}
                                  </span>
                                </div>

                                <div
                                  style={{
                                    display:
                                      'flex',
                                    gap: '6px',
                                    marginTop:
                                      '10px',
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleComplete(
                                        task
                                      )
                                    }
                                    style={{
                                      flex: 1,
                                      padding:
                                        '7px',
                                      borderRadius:
                                        '8px',
                                      border: 'none',
                                      background:
                                        '#123b31',
                                      color:
                                        '#34d399',
                                      cursor:
                                        'pointer',
                                      fontSize:
                                        '11px',
                                      fontWeight:
                                        750,
                                    }}
                                  >
                                    {task.status ===
                                    'Completed'
                                      ? 'Reopen'
                                      : '✓'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openEditModal(
                                        task
                                      )
                                    }
                                    style={{
                                      flex: 1,
                                      padding:
                                        '7px',
                                      borderRadius:
                                        '8px',
                                      border: 'none',
                                      background:
                                        '#1e1b4b',
                                      color:
                                        '#c4b5fd',
                                      cursor:
                                        'pointer',
                                      fontSize:
                                        '11px',
                                      fontWeight:
                                        750,
                                    }}
                                  >
                                    Edit
                                  </button>

                                 
                                </div>
                              </div>
                            );
                          }
                        )}

                        {statusTasks.length ===
                          0 && (
                          <div
                            style={{
                              padding: '22px 10px',
                              textAlign: 'center',
                              color:
                                'var(--muted)',
                              fontSize: '12px',
                              border:
                                '1px dashed var(--border)',
                              borderRadius: '11px',
                            }}
                          >
                            Drop tasks here
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div
            className="dashboard-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginTop: '18px',
            }}
          >
            <section
              className="glass"
              style={{
                borderRadius: '18px',
                padding: '18px',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 850,
                  marginBottom: '13px',
                }}
              >
                📅 Upcoming Tasks
              </div>

              {upcoming.length === 0 ? (
                <div
                  style={{
                    color: 'var(--muted)',
                    fontSize: '13px',
                  }}
                >
                  No upcoming tasks.
                </div>
              ) : (
                upcoming.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      gap: '10px',
                      padding: '10px 0',
                      borderBottom:
                        '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 750,
                        }}
                      >
                        {task.title}
                      </div>
                      <div
                        style={{
                          color:
                            isOverdue(
                              task.due,
                              task.status
                            )
                              ? '#f87171'
                              : 'var(--muted)',
                          fontSize: '11px',
                          marginTop: '3px',
                        }}
                      >
                        {formatDate(task.due)} •{' '}
                        {relativeDue(
                          task.due,
                          task.status
                        )}
                      </div>
                    </div>

                    <Avatar
                      member={task.member}
                      small
                    />
                  </div>
                ))
              )}
            </section>

            <section
              className="glass"
              style={{
                borderRadius: '18px',
                padding: '18px',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 850,
                  marginBottom: '13px',
                }}
              >
                🕘 Recent Activity
              </div>

              {activities.map((activity) => (
                <div
                  key={activity.id}
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    gap: '10px',
                    padding: '9px 0',
                    borderBottom:
                      '1px solid var(--border)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                    }}
                  >
                    {activity.text}
                  </div>

                  <div
                    style={{
                      color:
                        'var(--muted)',
                      fontSize: '10px',
                      whiteSpace:
                        'nowrap',
                    }}
                  >
                    {activity.time}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'fixed',
          right: '25px',
          bottom: '20px',
          zIndex: 900,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        {welcome && (
          <div
            style={{
              marginBottom: '8px',
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(17,17,43,.95)',
              border:
                '1px solid rgba(167,139,250,.3)',
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
              maxWidth: '260px',
              textAlign: 'center',
              boxShadow:
                '0 10px 30px rgba(0,0,0,.3)',
            }}
          >
            🔊 {text}
          </div>
        )}
        <Mascot talking={talking} />
      </div>

      {modalOpen && (
        <div
          onClick={() => {
            setModalOpen(false);
            setEditingTask(null);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(0,0,0,.72)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '25px',
              borderRadius: '20px',
              background:
                'linear-gradient(145deg,#11112b,#0b0b20)',
              border:
                '1px solid rgba(167,139,250,.25)',
              boxShadow:
                '0 25px 80px rgba(0,0,0,.55)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems: 'center',
                marginBottom: '22px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                  }}
                >
                  {editingTask
                    ? '✏️ Edit Task'
                    : '➕ Add Task'}
                </div>
                <div
                  style={{
                    marginTop: '5px',
                    color: '#64748b',
                    fontSize: '13px',
                  }}
                >
                  {editingTask
                    ? 'Update your task details'
                    : 'Create a new task'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setEditingTask(null);
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  border: 'none',
                  borderRadius: '10px',
                  background:
                    'rgba(255,255,255,.07)',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                ✕
              </button>
            </div>

            <label
              style={{
                display: 'block',
                marginBottom: '7px',
                color: '#cbd5e1',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              📝 Task Title
            </label>

            <input
              autoFocus
              value={form.title}
              onChange={(e) =>
                setForm((previous) => ({
                  ...previous,
                  title: e.target.value,
                }))
              }
              placeholder="Enter task title..."
              style={{
                width: '100%',
                padding: '12px 14px',
                marginBottom: '17px',
                borderRadius: '10px',
                border:
                  '1px solid rgba(255,255,255,.1)',
                background:
                  'rgba(255,255,255,.05)',
                color: 'white',
                outline: 'none',
              }}
            />

            <label
              style={{
                display: 'block',
                marginBottom: '7px',
                color: '#cbd5e1',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              📄 Description
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((previous) => ({
                  ...previous,
                  description: e.target.value,
                }))
              }
              placeholder="Describe your task..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px 14px',
                marginBottom: '17px',
                borderRadius: '10px',
                border:
                  '1px solid rgba(255,255,255,.1)',
                background:
                  'rgba(255,255,255,.05)',
                color: 'white',
                outline: 'none',
                resize: 'vertical',
              }}
            />

            <div
              className="two-col"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(2,minmax(0,1fr))',
                gap: '12px',
                marginBottom: '17px',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '7px',
                    color: '#cbd5e1',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  🔥 Priority
                </label>

                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      priority:
                        e.target.value as Priority,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border:
                      '1px solid rgba(255,255,255,.1)',
                    background: '#11112b',
                    color: 'white',
                  }}
                >
                  <option value="High">High</option>
                  <option value="Medium">
                    Medium
                  </option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '7px',
                    color: '#cbd5e1',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  📅 Due Date
                </label>

                <input
                  type="date"
                  value={form.due}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      due: e.target.value,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '10px',
                    border:
                      '1px solid rgba(255,255,255,.1)',
                    background: '#11112b',
                    color: 'white',
                  }}
                />
              </div>
            </div>

            <div
              className="two-col"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(2,minmax(0,1fr))',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '7px',
                    color: '#cbd5e1',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  👤 Member
                </label>

                <select
                  value={form.member}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      member: e.target.value,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border:
                      '1px solid rgba(255,255,255,.1)',
                    background: '#11112b',
                    color: 'white',
                  }}
                >
                  {Object.entries(MEMBERS).map(
                    ([key, name]) => (
                      <option
                        key={key}
                        value={key}
                      >
                        {key} - {name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '7px',
                    color: '#cbd5e1',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  📌 Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      status:
                        e.target.value as Status,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border:
                      '1px solid rgba(255,255,255,.1)',
                    background: '#11112b',
                    color: 'white',
                  }}
                >
                  {STATUSES.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setEditingTask(null);
                }}
                style={{
                  padding: '11px 18px',
                  borderRadius: '10px',
                  border:
                    '1px solid rgba(255,255,255,.1)',
                  background:
                    'rgba(255,255,255,.05)',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                ❌ Cancel
              </button>

              <button
                type="button"
                onClick={saveTask}
                disabled={!form.title.trim()}
                style={{
                  padding: '11px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background:
                    'linear-gradient(135deg,#7c3aed,#2563eb)',
                  color: 'white',
                  cursor: form.title.trim()
                    ? 'pointer'
                    : 'not-allowed',
                  opacity: form.title.trim()
                    ? 1
                    : 0.5,
                  fontWeight: 800,
                }}
              >
                💾{' '}
                {editingTask
                  ? 'Save Changes'
                  : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}
{selectedTask && (
  <div
    onClick={() => setSelectedTask(null)}
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'rgba(0,0,0,.72)',
      backdropFilter: 'blur(10px)',
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        maxWidth: '500px',
        padding: '25px',
        borderRadius: '20px',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: '0 25px 80px rgba(0,0,0,.55)',
      }}
    >
      <h2
        style={{
          margin: '0 0 18px',
          color: 'var(--text)',
        }}
      >
        👁️ Task Details
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          color: 'var(--text)',
        }}
      >
        <div>
          <strong>Task:</strong> {selectedTask.title}
        </div>

        <div>
          <strong>Description:</strong>{' '}
          {selectedTask.description || 'No description'}
        </div>

        <div>
          <strong>Priority:</strong> {selectedTask.priority}
        </div>

        <div>
          <strong>Status:</strong> {selectedTask.status}
        </div>

        <div>
          <strong>Member:</strong> {selectedTask.member}
        </div>

        <div>
          <strong>Due Date:</strong> {formatDate(selectedTask.due)}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setSelectedTask(null)}
        style={{
          width: '100%',
          marginTop: '22px',
          padding: '11px',
          borderRadius: '10px',
          border: 'none',
          background: '#1e1b4b',
          color: '#c4b5fd',
          cursor: 'pointer',
          fontWeight: 800,
        }}
      >
        Close
      </button>
    </div>
  </div>
)}
      {deleteTask && (
        <div
          onClick={() => setDeleteTask(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(0,0,0,.72)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '430px',
              padding: '25px',
              borderRadius: '20px',
              background:
                'linear-gradient(145deg,#11112b,#0b0b20)',
              border:
                '1px solid rgba(248,113,113,.22)',
              boxShadow:
                '0 25px 80px rgba(0,0,0,.55)',
            }}
          >
            <div
              style={{
                width: '55px',
                height: '55px',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '16px',
                background:
                  'rgba(248,113,113,.12)',
                fontSize: '27px',
                marginBottom: '15px',
              }}
            >
              🗑️
            </div>

            <div
              style={{
                fontSize: '21px',
                fontWeight: 800,
                marginBottom: '8px',
              }}
            >
              Delete Task?
            </div>

            <div
              style={{
                color: '#94a3b8',
                fontSize: '14px',
                lineHeight: 1.6,
                marginBottom: '22px',
              }}
            >
              Are you sure you want to delete{' '}
              <strong style={{ color: 'white' }}>
                "{deleteTask.title}"
              </strong>
              ? This action cannot be undone.
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setDeleteTask(null)
                }
                style={{
                  padding: '11px 18px',
                  borderRadius: '10px',
                  border:
                    '1px solid rgba(255,255,255,.1)',
                  background:
                    'rgba(255,255,255,.05)',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                ❌ Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                style={{
                  padding: '11px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#dc2626',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 800,
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {settingsOpen && (
        <div
          onClick={() => setSettingsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(0,0,0,.72)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '24px',
              borderRadius: '20px',
              background:
                'linear-gradient(145deg,#11112b,#0b0b20)',
              border:
                '1px solid rgba(167,139,250,.25)',
              boxShadow:
                '0 25px 80px rgba(0,0,0,.55)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: 850,
                  }}
                >
                  ⚙️ Settings & Profile
                </div>
                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: '13px',
                    marginTop: '4px',
                  }}
                >
                  Customize your workspace
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSettingsOpen(false)
                }
                style={{
                  width: '35px',
                  height: '35px',
                  border: 'none',
                  borderRadius: '9px',
                  background:
                    'rgba(255,255,255,.07)',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '17px',
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                padding: '15px',
                borderRadius: '14px',
                background:
                  'rgba(255,255,255,.05)',
                border:
                  '1px solid rgba(255,255,255,.08)',
                marginBottom: '15px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Avatar member="D" />
                <div>
                  <div
                    style={{
                      fontWeight: 850,
                    }}
                  >
                    Dexter
                  </div>
                  <div
                    style={{
                      color: '#94a3b8',
                      fontSize: '12px',
                    }}
                  >
                    Workspace member
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginBottom: '18px',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#cbd5e1',
                  marginBottom: '9px',
                }}
              >
                🎨 Accent Color
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '9px',
                  flexWrap: 'wrap',
                }}
              >
                {(
                  Object.entries(
                    COLOR_MODES
                  ) as [
                    ColorMode,
                    { name: string; color: string }
                  ][]
                ).map(([key, mode]) => (
                  <button
                    key={key}
                    type="button"
                    title={mode.name}
                    onClick={() =>
                      setColorMode(key)
                    }
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border:
                        colorMode === key
                          ? '3px solid white'
                          : '2px solid transparent',
                      background:
                        mode.color,
                      cursor: 'pointer',
                      boxShadow:
                        colorMode === key
                          ? `0 0 0 2px ${mode.color}`
                          : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '10px',
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setTheme('light')
                }
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '10px',
                  border:
                    '1px solid rgba(255,255,255,.1)',
                  background:
                    theme === 'light'
                      ? 'var(--accent)'
                      : 'rgba(255,255,255,.05)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 750,
                }}
              >
                ☀️ Light
              </button>

              <button
                type="button"
                onClick={() =>
                  setTheme('dark')
                }
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '10px',
                  border:
                    '1px solid rgba(255,255,255,.1)',
                  background:
                    theme === 'dark'
                      ? 'var(--accent)'
                      : 'rgba(255,255,255,.05)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 750,
                }}
              >
                🌙 Dark
              </button>
            </div>

            <button
              type="button"
              onClick={resetAllData}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                border:
                  '1px solid rgba(248,113,113,.25)',
                background:
                  'rgba(220,38,38,.10)',
                color: '#f87171',
                cursor: 'pointer',
                fontWeight: 750,
              }}
            >
              ♻️ Reset Demo Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}