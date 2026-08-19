'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Priority = 'High' | 'Medium' | 'Low';
type Status = 'To Do' | 'Doing' | 'Completed';
type View = 'list' | 'board';

type Task = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  due: string;
  member: string;
  status: Status;
};

type Activity = {
  id: number;
  text: string;
  time: string;
};

const STATUSES: Status[] = ['To Do', 'Doing', 'Completed'];

const MEMBERS: Record<string, string> = {
  D: 'Dexter',
  C: 'Chris',
  S: 'Sarah',
  A: 'Alex',
  Q: 'Quinn',
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
  {
    color: string;
    background: string;
    border: string;
  }
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
  {
    color: string;
    background: string;
  }
> = {
  'To Do': {
    color: '#a78bfa',
    background: 'rgba(167,139,250,.09)',
  },
  Doing: {
    color: '#38bdf8',
    background: 'rgba(56,189,248,.09)',
  },
  Completed: {
    color: '#34d399',
    background: 'rgba(52,211,153,.09)',
  },
};

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

      <ellipse
        cx="48"
        cy="50"
        rx="7"
        ry="8"
        fill="white"
      />

      <ellipse
        cx="72"
        cy="50"
        rx="7"
        ry="8"
        fill="white"
      />

      <ellipse
        cx="50"
        cy="52"
        rx="4"
        ry="5"
        fill="#1e1b4b"
      />

      <ellipse
        cx="74"
        cy="52"
        rx="4"
        ry="5"
        fill="#1e1b4b"
      />

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

      <text x="5" y="30" fontSize="14">
        ⭐
      </text>

      <text x="95" y="20" fontSize="12">
        ✨
      </text>

      <defs>
        <radialGradient
          id="headGrad"
          cx="40%"
          cy="30%"
        >
          <stop
            offset="0%"
            stopColor="#c4b5fd"
          />
          <stop
            offset="100%"
            stopColor="#7c3aed"
          />
        </radialGradient>

        <radialGradient
          id="bodyGrad"
          cx="40%"
          cy="30%"
        >
          <stop
            offset="0%"
            stopColor="#a78bfa"
          />
          <stop
            offset="100%"
            stopColor="#6d28d9"
          />
        </radialGradient>
      </defs>
    </svg>
  );
}

function formatDate(date: string) {
  if (!date) return 'No date';

  const value = new Date(`${date}T00:00:00`);

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return value.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
}

function isOverdue(date: string, status: Status) {
  if (!date || status === 'Completed') {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(`${date}T00:00:00`);

  return due < today;
}

function relativeDue(date: string, status: Status) {
  if (status === 'Completed') {
    return 'Completed';
  }

  if (!date) {
    return 'No deadline';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(`${date}T00:00:00`);

  const days = Math.ceil(
    (due.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (days < 0) {
    return `${Math.abs(days)}d overdue`;
  }

  if (days === 0) {
    return 'Due today';
  }

  if (days === 1) {
    return 'Due tomorrow';
  }

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
        width: small ? 27 : 34,
        height: small ? 27 : 34,
        fontSize: small ? 10 : 12,
      }}
    >
      {member}
    </div>
  );
}

export default function TasksPage() {
  const router = useRouter();

  const [tasks, setTasks] =
    useState<Task[]>(INITIAL_TASKS);

  const [view, setView] =
    useState<View>('list');

  const [collapsed, setCollapsed] =
    useState<Record<Status, boolean>>({
      'To Do': false,
      Doing: false,
      Completed: false,
    });

  const [welcome, setWelcome] =
    useState(true);

  const [text, setText] =
    useState('');

  const [talking, setTalking] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [deleteTask, setDeleteTask] =
    useState<Task | null>(null);

  const [search, setSearch] =
    useState('');

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
    try {
      const savedTasks =
        window.localStorage.getItem(
          'pyramid-tasks'
        );

      const savedActivities =
        window.localStorage.getItem(
          'pyramid-activities'
        );

      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);

        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      }

      if (savedActivities) {
        const parsed =
          JSON.parse(savedActivities);

        if (Array.isArray(parsed)) {
          setActivities(parsed);
        }
      }
    } catch {
      // Keep default data.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'pyramid-tasks',
        JSON.stringify(tasks)
      );
    } catch {
      // Ignore storage errors.
    }
  }, [tasks]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'pyramid-activities',
        JSON.stringify(activities)
      );
    } catch {
      // Ignore storage errors.
    }
  }, [activities]);

  useEffect(() => {
    let index = 0;

    const message =
      'Welcome back, Dexter! 🎉 Your tasks are ready!';

    setTalking(true);

    const interval =
      window.setInterval(() => {
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

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModalOpen(false);
        setDeleteTask(null);
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();

        const input =
          document.getElementById(
            'task-search'
          ) as HTMLInputElement | null;

        input?.focus();
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'n'
      ) {
        event.preventDefault();

        openAddModal();
      }
    };

    window.addEventListener(
      'keydown',
      handleKey
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKey
      );
    };
  }, []);

  const addActivity = (message: string) => {
    setActivities((previous) => [
      {
        id: Date.now(),
        text: message,
        time: 'Just now',
      },
      ...previous,
    ].slice(0, 8));
  };

  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.status === 'Completed'
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === 'Doing'
  ).length;

  const highPriority = tasks.filter(
    (task) => task.priority === 'High'
  ).length;

  const progress =
    total > 0
      ? Math.round(
          (completed / total) * 100
        )
      : 0;

  const filteredTasks = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title
          .toLowerCase()
          .includes(query) ||
        task.description
          .toLowerCase()
          .includes(query) ||
        task.member
          .toLowerCase()
          .includes(query) ||
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
    if (!form.title.trim()) {
      return;
    }

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
    if (!deleteTask) {
      return;
    }

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
          ? {
              ...item,
              status: newStatus,
            }
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
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );

    addActivity(
      `"${task.title}" moved to ${newStatus}`
    );
  };

  const toggleSection = (
    section: Status
  ) => {
    setCollapsed((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  };

  const tasksForStatus = (
    status: Status
  ) =>
    filteredTasks.filter(
      (task) => task.status === status
    );

  const clearFilters = () => {
    setSearch('');
    setPriorityFilter('All');
    setStatusFilter('All');
  };

  return (
    <div className="app-shell">
      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #07071a;
        }

        body {
          color: #fff;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        button:focus-visible,
        input:focus-visible,
        textarea:focus-visible,
        select:focus-visible {
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
        }

        .app-shell {
          min-height: 100vh;
          display: flex;
          position: relative;
          overflow-x: hidden;
          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(124,58,237,.14),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 90%,
              rgba(56,189,248,.10),
              transparent 30%
            ),
            #07071a;
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

        .sidebar {
          width: 235px;
          min-height: 100vh;
          flex-shrink: 0;
          padding: 22px 14px;
          border-right: 1px solid rgba(255,255,255,.06);
          background: rgba(7,7,26,.78);
          backdrop-filter: blur(24px);
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 8px;
          margin-bottom: 22px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: linear-gradient(
            135deg,
            #7c3aed,
            #2563eb
          );
          box-shadow:
            0 0 25px rgba(124,58,237,.45);
          font-size: 20px;
        }

        .logo-title {
          font-weight: 850;
          font-size: 16px;
          background: linear-gradient(
            135deg,
            #fff,
            #a78bfa
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .logo-sub {
          font-size: 10px;
          color: #64748b;
          margin-top: 2px;
        }

        .progress-box {
          padding: 14px;
          border: 1px solid rgba(124,58,237,.2);
          border-radius: 15px;
          background:
            linear-gradient(
              135deg,
              rgba(124,58,237,.12),
              rgba(56,189,248,.05)
            );
          margin-bottom: 20px;
        }

        .progress-top {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 9px;
        }

        .progress-value {
          color: #c4b5fd;
          font-weight: 850;
        }

        .progress-track {
          height: 5px;
          border-radius: 5px;
          overflow: hidden;
          background: rgba(255,255,255,.06);
        }
          `}</style>

<div className="background-grid" />

<div
  style={{
    width: '100%',
    minHeight: '100vh',
    padding: '30px',
    position: 'relative',
    zIndex: 1,
  }}
>
  <div
    style={{
      maxWidth: '1200px',
      margin: '0 auto',
    }}
  >
    {/* Header */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '30px',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <div
          style={{
            fontSize: '32px',
            fontWeight: 800,
            marginBottom: '6px',
          }}
        >
          Pyramid Task Manager
        </div>

        <div
          style={{
            color: '#94a3b8',
            fontSize: '14px',
          }}
        >
          Manage your tasks efficiently
        </div>
      </div>

      <button
        onClick={() => openAddModal()}
        style={{
          border: 'none',
          borderRadius: '12px',
          padding: '12px 20px',
          background:
            'linear-gradient(135deg,#7c3aed,#2563eb)',
          color: 'white',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        + Add Task
      </button>
    </div>

    {/* Welcome */}
    {welcome && (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          padding: '20px',
          marginBottom: '25px',
          borderRadius: '18px',
          background: 'rgba(124,58,237,.12)',
          border:
            '1px solid rgba(124,58,237,.25)',
        }}
      >
        <Mascot talking={talking} />

        <div
          style={{
            fontSize: '18px',
            fontWeight: 600,
          }}
        >
          {text}
        </div>
      </div>
    )}

    {/* Statistics */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit,minmax(180px,1fr))',
        gap: '15px',
        marginBottom: '25px',
      }}
    >
      <div
        style={{
          padding: '20px',
          borderRadius: '16px',
          background: 'rgba(255,255,255,.05)',
          border:
            '1px solid rgba(255,255,255,.08)',
        }}
      >
        <div style={{ color: '#94a3b8' }}>
          Total Tasks
        </div>

        <div
          style={{
            fontSize: '30px',
            fontWeight: 800,
            marginTop: '8px',
          }}
        >
          {total}
        </div>
      </div>

      <div
        style={{
          padding: '20px',
          borderRadius: '16px',
          background: 'rgba(255,255,255,.05)',
          border:
            '1px solid rgba(255,255,255,.08)',
        }}
      >
        <div style={{ color: '#94a3b8' }}>
          In Progress
        </div>

        <div
          style={{
            fontSize: '30px',
            fontWeight: 800,
            marginTop: '8px',
            color: '#38bdf8',
          }}
        >
          {inProgress}
        </div>
      </div>

      <div
        style={{
          padding: '20px',
          borderRadius: '16px',
          background: 'rgba(255,255,255,.05)',
          border:
            '1px solid rgba(255,255,255,.08)',
        }}
      >
        <div style={{ color: '#94a3b8' }}>
          Completed
        </div>

        <div
          style={{
            fontSize: '30px',
            fontWeight: 800,
            marginTop: '8px',
            color: '#34d399',
          }}
        >
          {completed}
        </div>
      </div>

      <div
        style={{
          padding: '20px',
          borderRadius: '16px',
          background: 'rgba(255,255,255,.05)',
          border:
            '1px solid rgba(255,255,255,.08)',
        }}
      >
        <div style={{ color: '#94a3b8' }}>
          High Priority
        </div>

        <div
          style={{
            fontSize: '30px',
            fontWeight: 800,
            marginTop: '8px',
            color: '#f87171',
          }}
        >
          {highPriority}
        </div>
      </div>
    </div>

    {/* Progress */}
    <div
      style={{
        padding: '20px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,.05)',
        border:
          '1px solid rgba(255,255,255,.08)',
        marginBottom: '25px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <span>Overall Progress</span>

        <span style={{ color: '#a78bfa' }}>
          {progress}%
        </span>
      </div>

      <div
        style={{
          height: '8px',
          borderRadius: '10px',
          background: 'rgba(255,255,255,.08)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background:
              'linear-gradient(90deg,#7c3aed,#38bdf8)',
            borderRadius: '10px',
          }}
        />
      </div>
    </div>

    {/* Search + Filters */}
    <div
      style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '25px',
        flexWrap: 'wrap',
      }}
    >
      <input
        id="task-search"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search tasks..."
        style={{
          flex: 1,
          minWidth: '220px',
          padding: '12px 15px',
          borderRadius: '10px',
          border:
            '1px solid rgba(255,255,255,.1)',
          background: 'rgba(255,255,255,.05)',
          color: 'white',
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
          padding: '12px',
          borderRadius: '10px',
          background: '#11112b',
          color: 'white',
          border:
            '1px solid rgba(255,255,255,.1)',
        }}
      >
        <option value="All">
          All Priority
        </option>
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
          padding: '12px',
          borderRadius: '10px',
          background: '#11112b',
          color: 'white',
          border:
            '1px solid rgba(255,255,255,.1)',
        }}
      >
        <option value="All">
          All Status
        </option>
        <option value="To Do">
          To Do
        </option>
        <option value="Doing">
          Doing
        </option>
        <option value="Completed">
          Completed
        </option>
      </select>

      <button
        onClick={clearFilters}
        style={{
          padding: '12px 16px',
          borderRadius: '10px',
          border:
            '1px solid rgba(255,255,255,.1)',
          background:
            'rgba(255,255,255,.05)',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        Clear
      </button>
    </div>

    {/* Tasks */}
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {STATUSES.map((status) => {
        const statusTasks =
          tasksForStatus(status);

        return (
          <div key={status}>
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 750,
                }}
              >
                {status}{' '}
                <span
                  style={{
                    color: '#64748b',
                    fontSize: '13px',
                  }}
                >
                  ({statusTasks.length})
                </span>
              </div>

              <button
                onClick={() =>
                  toggleSection(status)
                }
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#94a3b8',
                  cursor: 'pointer',
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

                return (
                  <div
                    key={task.id}
                    style={{
                      padding: '18px',
                      marginBottom: '10px',
                      borderRadius: '15px',
                      background:
                        'rgba(255,255,255,.045)',
                      border:
                        '1px solid rgba(255,255,255,.08)',
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
                      <div>
                        <div
                          style={{
                            fontSize: '17px',
                            fontWeight: 700,
                            marginBottom: '7px',
                          }}
                        >
                          {task.title}
                        </div>

                        <div
                          style={{
                            color: '#94a3b8',
                            fontSize: '13px',
                            marginBottom: '12px',
                          }}
                        >
                          {task.description}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems:
                              'center',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span
                            style={{
                              padding:
                                '5px 9px',
                              borderRadius:
                                '8px',
                              color: p.color,
                              background:
                                p.background,
                              border: `1px solid ${p.border}`,
                              fontSize:
                                '11px',
                              fontWeight: 700,
                            }}
                          >
                            {task.priority}
                          </span>

                          <span
                            style={{
                              color: '#94a3b8',
                              fontSize: '12px',
                            }}
                          >
                            Due:{' '}
                            {formatDate(
                              task.due
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
                          display: 'flex',
                          gap: '7px',
                          alignItems:
                            'center',
                        }}
                      >
                        <button
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
                          }}
                        >
                          {task.status ===
                          'Completed'
                            ? 'Reopen'
                            : '✓'}
                        </button>

                        <button
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
                          }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            setDeleteTask(
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
                              '#3b1515',
                            color:
                              '#f87171',
                            cursor:
                              'pointer',
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
                    color: '#64748b',
                    border:
                      '1px dashed rgba(255,255,255,.1)',
                    borderRadius: '12px',
                  }}
                >
                  No tasks here.
                </div>
              )}
          </div>
        );
      })}
    </div>
  </div>
</div>

          {/* Add / Edit Task Modal */}
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
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
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

            {/* Title */}
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
                background: 'rgba(255,255,255,.05)',
                color: 'white',
                outline: 'none',
              }}
            />

            {/* Description */}
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
                background: 'rgba(255,255,255,.05)',
                color: 'white',
                outline: 'none',
                resize: 'vertical',
              }}
            />

            {/* Priority + Due Date */}
            <div
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
                  <option value="High">
                    High
                  </option>
                  <option value="Medium">
                    Medium
                  </option>
                  <option value="Low">
                    Low
                  </option>
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

            {/* Member + Status */}
            <div
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
                  <option value="To Do">
                    To Do
                  </option>
                  <option value="Doing">
                    Doing
                  </option>
                  <option value="Completed">
                    Completed
                  </option>
                </select>
              </div>
            </div>

            {/* Modal Buttons */}
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
                💾 {editingTask
                  ? 'Save Changes'
                  : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
              <strong
                style={{ color: 'white' }}
              >
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
                onClick={() => setDeleteTask(null)}
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

      </div>
  );
}