# Pomodoro Timer with Kanban Board Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Pomodoro Timer page with automatic work/break cycling and a simple Kanban board for task management.

**Architecture:** React component with Canvas-free digital display, phase-based state machine (Work → Short Break → Long Break after 4 cycles), localStorage persistence, Web Audio API for singing bowl notifications, and a simple 3-column Kanban board (To Do, In Progress, Done) below the timer.

**Tech Stack:** React 18, TypeScript, Web Audio API, localStorage, CSS variables for phase-based theming

---

## Phase Colors (Original Stoppclock Design)

- **Work Phase (Focus):** Green (#10B981) - Success green from design tokens
- **Short Break:** White/Light (#FFFFFF) - Neutral with ocean background
- **Long Break:** Cyan (#00D9FF) - Aurora cyan accent

---

## Task 1: Define TypeScript Types

**Files:**
- Modify: `src/types/timer-types.ts` (append to end)

**Step 1: Add Pomodoro state interface**

Add these interfaces at the end of `src/types/timer-types.ts`:

```typescript
export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroTask {
  id: string;
  text: string;
  status: 'todo' | 'inProgress' | 'done';
  createdAt: number;
}

export interface PomodoroState {
  version: 1;
  phase: PomodoroPhase;
  currentSession: number; // 1-4 (which pomodoro in current cycle)
  remainingMs: number;
  running: boolean;
  startedAt: number | null;
  completedPomodoros: number; // Total completed today
  tasks: PomodoroTask[];
}
```

**Step 2: Verify TypeScript compilation**

Run: `npm run build`
Expected: Build succeeds with no type errors

**Step 3: Commit types**

```bash
git add src/types/timer-types.ts
git commit -m "feat(pomodoro): add TypeScript types for Pomodoro state and tasks"
```

---

## Task 2: Create Singing Bowl Audio Utility

**Files:**
- Create: `src/utils/singing-bowl.ts`

**Step 1: Write the singing bowl audio generator**

Create `src/utils/singing-bowl.ts`:

```typescript
/**
 * Generates a gentle singing bowl sound using Web Audio API
 * High frequency (800-1200Hz) for motivating but not stressful sound
 */
export function playSingingBowl(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Create oscillator for fundamental frequency
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Singing bowl tone: 880 Hz (A5 - clear, pleasant)
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    oscillator.type = 'sine';

    // ADSR Envelope: gentle attack, long sustain, natural decay
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1); // Attack: 100ms
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.3); // Sustain: hold at 0.2
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 2.5); // Decay: 2.2s

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Play
    oscillator.start(now);
    oscillator.stop(now + 2.5);

    // Cleanup
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
      audioContext.close();
    };
  } catch (error) {
    // Silently fail if Web Audio API unavailable
    console.warn('Web Audio API not available:', error);
  }
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit audio utility**

```bash
git add src/utils/singing-bowl.ts
git commit -m "feat(pomodoro): add singing bowl audio notification utility"
```

---

## Task 3: Create Kanban Board Component

**Files:**
- Create: `src/components/KanbanBoard.tsx`

**Step 1: Write the Kanban Board component**

Create `src/components/KanbanBoard.tsx`:

```typescript
import React, { useState } from 'react';
import type { PomodoroTask } from '../types/timer-types';

interface KanbanBoardProps {
  tasks: PomodoroTask[];
  onAddTask: (text: string) => void;
  onMoveTask: (taskId: string, newStatus: PomodoroTask['status']) => void;
  onDeleteTask: (taskId: string) => void;
}

export function KanbanBoard({ tasks, onAddTask, onMoveTask, onDeleteTask }: KanbanBoardProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim());
      setNewTaskText('');
      setShowInput(false);
    }
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'inProgress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="kanban-board">
      <div className="kanban-header">
        <h2>Tasks</h2>
      </div>

      <div className="kanban-columns">
        {/* To Do Column */}
        <div className="kanban-column">
          <h3 className="kanban-column-title">To Do</h3>
          <div className="kanban-tasks">
            {todoTasks.map(task => (
              <div key={task.id} className="kanban-task">
                <span className="kanban-task-text">{task.text}</span>
                <div className="kanban-task-actions">
                  <button
                    onClick={() => onMoveTask(task.id, 'inProgress')}
                    className="kanban-btn kanban-btn-start"
                    title="Start"
                  >
                    ▶
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="kanban-btn kanban-btn-delete"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {showInput ? (
              <div className="kanban-add-input">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddTask();
                    if (e.key === 'Escape') { setShowInput(false); setNewTaskText(''); }
                  }}
                  placeholder="Task description..."
                  autoFocus
                />
                <div className="kanban-add-actions">
                  <button onClick={handleAddTask} className="kanban-btn kanban-btn-confirm">Add</button>
                  <button onClick={() => { setShowInput(false); setNewTaskText(''); }} className="kanban-btn kanban-btn-cancel">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowInput(true)} className="kanban-add-btn">
                + Add Task
              </button>
            )}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="kanban-column">
          <h3 className="kanban-column-title">In Progress</h3>
          <div className="kanban-tasks">
            {inProgressTasks.map(task => (
              <div key={task.id} className="kanban-task">
                <span className="kanban-task-text">{task.text}</span>
                <div className="kanban-task-actions">
                  <button
                    onClick={() => onMoveTask(task.id, 'todo')}
                    className="kanban-btn kanban-btn-back"
                    title="Back to To Do"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => onMoveTask(task.id, 'done')}
                    className="kanban-btn kanban-btn-done"
                    title="Complete"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="kanban-btn kanban-btn-delete"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Done Column */}
        <div className="kanban-column">
          <h3 className="kanban-column-title">Done</h3>
          <div className="kanban-tasks">
            {doneTasks.map(task => (
              <div key={task.id} className="kanban-task kanban-task-done">
                <span className="kanban-task-text">{task.text}</span>
                <div className="kanban-task-actions">
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="kanban-btn kanban-btn-delete"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit Kanban component**

```bash
git add src/components/KanbanBoard.tsx
git commit -m "feat(pomodoro): add Kanban board component with 3 columns"
```

---

## Task 4: Create Pomodoro Page Component

**Files:**
- Create: `src/pages/Pomodoro.tsx`

**Step 1: Write the Pomodoro timer component**

Create `src/pages/Pomodoro.tsx`:

```typescript
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAutoFitText } from '../hooks/useAutoFitText';
import { HomeButton } from '../components/HomeButton';
import { KanbanBoard } from '../components/KanbanBoard';
import { playSingingBowl } from '../utils/singing-bowl';
import type { PomodoroState, PomodoroTask, PomodoroPhase } from '../types/timer-types';

const LS_KEY = 'sc.v1.pomodoro';

// Durations in milliseconds
const WORK_DURATION = 25 * 60 * 1000; // 25 minutes
const SHORT_BREAK_DURATION = 5 * 60 * 1000; // 5 minutes
const LONG_BREAK_DURATION = 15 * 60 * 1000; // 15 minutes
const SESSIONS_BEFORE_LONG_BREAK = 4;

function load(): PomodoroState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw new Error('No saved state');
    const p = JSON.parse(raw) as PomodoroState;
    return {
      version: 1,
      phase: p.phase ?? 'work',
      currentSession: p.currentSession ?? 1,
      remainingMs: p.remainingMs ?? WORK_DURATION,
      running: false, // Always start paused
      startedAt: null,
      completedPomodoros: p.completedPomodoros ?? 0,
      tasks: Array.isArray(p.tasks) ? p.tasks : []
    };
  } catch {
    return {
      version: 1,
      phase: 'work',
      currentSession: 1,
      remainingMs: WORK_DURATION,
      running: false,
      startedAt: null,
      completedPomodoros: 0,
      tasks: []
    };
  }
}

function save(p: PomodoroState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(p));
  } catch {
    // Silently fail
  }
}

function useRaf(on: boolean, cb: () => void) {
  const raf = useRef<number | undefined>();
  useEffect(() => {
    if (!on) return;
    let live = true;
    const loop = () => {
      if (!live) return;
      cb();
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      live = false;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [on, cb]);
}

function fmt(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getPhaseLabel(phase: PomodoroPhase): string {
  switch (phase) {
    case 'work': return 'Pomodoro';
    case 'shortBreak': return 'Short Break';
    case 'longBreak': return 'Long Break';
  }
}

function getPhaseMessage(phase: PomodoroPhase): string {
  switch (phase) {
    case 'work': return 'Time to focus! 🍅';
    case 'shortBreak': return 'Time for a break! ☕';
    case 'longBreak': return 'Time for a long break! 🌴';
  }
}

function getPhaseDuration(phase: PomodoroPhase): number {
  switch (phase) {
    case 'work': return WORK_DURATION;
    case 'shortBreak': return SHORT_BREAK_DURATION;
    case 'longBreak': return LONG_BREAK_DURATION;
  }
}

export default function Pomodoro() {
  const [st, setSt] = useState<PomodoroState>(load);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const currentTime = st.running && st.startedAt
    ? Math.max(0, st.remainingMs - (Date.now() - st.startedAt))
    : st.remainingMs;

  const [textRef, autoFontSize] = useAutoFitText(fmt(currentTime), 8, 1.5);

  const sync = useCallback(() => {
    if (!st.running || !st.startedAt) return;

    const elapsed = Date.now() - st.startedAt;
    const remaining = st.remainingMs - elapsed;

    if (remaining <= 0) {
      // Phase completed - move to next phase
      playSingingBowl();

      let nextPhase: PomodoroPhase;
      let nextSession = st.currentSession;
      let completedPomodoros = st.completedPomodoros;

      if (st.phase === 'work') {
        completedPomodoros += 1;
        if (st.currentSession >= SESSIONS_BEFORE_LONG_BREAK) {
          nextPhase = 'longBreak';
          nextSession = 1; // Reset session counter after long break
        } else {
          nextPhase = 'shortBreak';
          nextSession = st.currentSession + 1;
        }
      } else {
        // Break finished, go back to work
        nextPhase = 'work';
      }

      const nextDuration = getPhaseDuration(nextPhase);

      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Stoppclock - Pomodoro', {
          body: getPhaseMessage(nextPhase),
          icon: '/icons/icon-192x192.png'
        });
      }

      setSt(s => ({
        ...s,
        phase: nextPhase,
        currentSession: nextSession,
        remainingMs: nextDuration,
        running: false, // Stop after phase transition
        startedAt: null,
        completedPomodoros
      }));
    } else {
      forceUpdate();
    }
  }, [st.running, st.startedAt, st.remainingMs, st.phase, st.currentSession, st.completedPomodoros]);

  useRaf(st.running, sync);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const start = useCallback(() => {
    setSt(s => ({ ...s, running: true, startedAt: Date.now() }));
  }, []);

  const pause = useCallback(() => {
    if (!st.startedAt) return;
    const elapsed = Date.now() - st.startedAt;
    const remaining = Math.max(0, st.remainingMs - elapsed);
    setSt(s => ({ ...s, running: false, startedAt: null, remainingMs: remaining }));
  }, [st.startedAt, st.remainingMs]);

  const reset = useCallback(() => {
    const duration = getPhaseDuration(st.phase);
    setSt(s => ({ ...s, remainingMs: duration, running: false, startedAt: null }));
  }, [st.phase]);

  const switchPhase = useCallback((newPhase: PomodoroPhase) => {
    const duration = getPhaseDuration(newPhase);
    setSt(s => ({
      ...s,
      phase: newPhase,
      remainingMs: duration,
      running: false,
      startedAt: null
    }));
  }, []);

  const full = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen?.().catch(() => {});
    }
  }, []);

  // Kanban handlers
  const addTask = useCallback((text: string) => {
    const newTask: PomodoroTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      status: 'todo',
      createdAt: Date.now()
    };
    setSt(s => ({ ...s, tasks: [...s.tasks, newTask] }));
  }, []);

  const moveTask = useCallback((taskId: string, newStatus: PomodoroTask['status']) => {
    setSt(s => ({
      ...s,
      tasks: s.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    }));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setSt(s => ({
      ...s,
      tasks: s.tasks.filter(t => t.id !== taskId)
    }));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        st.running ? pause() : start();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        reset();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        full();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [st.running, start, pause, reset, full]);

  return (
    <div className={`pomodoro-page pomodoro-phase-${st.phase}`} ref={wrapRef}>
      {/* Header */}
      <header className="pomodoro-header">
        <h1 className="pomodoro-title">Pomodoro Timer</h1>
        <HomeButton />
      </header>

      {/* Phase Tabs */}
      <div className="pomodoro-tabs">
        <button
          className={`pomodoro-tab ${st.phase === 'work' ? 'active' : ''}`}
          onClick={() => switchPhase('work')}
        >
          Pomodoro
        </button>
        <button
          className={`pomodoro-tab ${st.phase === 'shortBreak' ? 'active' : ''}`}
          onClick={() => switchPhase('shortBreak')}
        >
          Short Break
        </button>
        <button
          className={`pomodoro-tab ${st.phase === 'longBreak' ? 'active' : ''}`}
          onClick={() => switchPhase('longBreak')}
        >
          Long Break
        </button>
      </div>

      {/* Timer Display */}
      <div className="pomodoro-timer-container">
        <div className={`pomodoro-display ${st.running ? 'running' : ''}`}>
          <div ref={textRef} style={{ fontSize: `${autoFontSize}rem` }}>
            {fmt(currentTime)}
          </div>
        </div>

        {/* Controls */}
        <div className="pomodoro-controls">
          {!st.running ? (
            <button type="button" className="pomodoro-btn primary" onClick={start}>
              START
            </button>
          ) : (
            <button type="button" className="pomodoro-btn primary" onClick={pause}>
              PAUSE
            </button>
          )}
          <button type="button" className="pomodoro-btn secondary" onClick={reset}>
            Reset
          </button>
          <button type="button" className="pomodoro-btn secondary" onClick={full}>
            Fullscreen
          </button>
        </div>

        {/* Session Counter & Message */}
        <div className="pomodoro-info">
          {st.phase === 'work' && (
            <div className="pomodoro-session">
              Pomodoro {st.currentSession}/{SESSIONS_BEFORE_LONG_BREAK}
            </div>
          )}
          <div className="pomodoro-message">
            {getPhaseMessage(st.phase)}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        tasks={st.tasks}
        onAddTask={addTask}
        onMoveTask={moveTask}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 3: Commit Pomodoro page**

```bash
git add src/pages/Pomodoro.tsx
git commit -m "feat(pomodoro): add main Pomodoro timer page with phase cycling"
```

---

## Task 5: Create Pomodoro Styles

**Files:**
- Create: `src/styles/pomodoro-swiss.css`

**Step 1: Write the CSS styles**

Create `src/styles/pomodoro-swiss.css`:

```css
/* ============================================
 * POMODORO TIMER - Phase-Based Color Theming
 * Work: Green, Short Break: White, Long Break: Cyan
 * ============================================ */

.pomodoro-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-8) var(--space-4);
  transition: background 0.5s ease;
}

/* Phase-based background colors */
.pomodoro-phase-work {
  background: linear-gradient(135deg,
    #0A1628 0%,
    #0d4d2f 50%,
    #10B981 100%
  );
}

.pomodoro-phase-shortBreak {
  background: linear-gradient(135deg,
    #FFFFFF 0%,
    #F0F4F8 50%,
    #E0E7EF 100%
  );
  color: var(--ocean-deep);
}

.pomodoro-phase-longBreak {
  background: linear-gradient(135deg,
    #0A1628 0%,
    #006B7D 50%,
    #00D9FF 100%
  );
}

/* Header */
.pomodoro-header {
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
}

.pomodoro-title {
  font-size: var(--type-2xl);
  font-weight: var(--font-bold);
  letter-spacing: 0.05em;
}

.pomodoro-phase-shortBreak .pomodoro-title {
  color: var(--ocean-deep);
}

/* Phase Tabs */
.pomodoro-tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-8);
  background: rgba(255, 255, 255, 0.1);
  padding: var(--space-1);
  border-radius: 12px;
}

.pomodoro-tab {
  padding: var(--space-3) var(--space-6);
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--type-base);
  font-weight: var(--font-semibold);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.pomodoro-tab:hover {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
}

.pomodoro-tab.active {
  background: rgba(255, 255, 255, 0.25);
  color: var(--neutral-white);
}

.pomodoro-phase-shortBreak .pomodoro-tab {
  color: rgba(10, 22, 40, 0.6);
}

.pomodoro-phase-shortBreak .pomodoro-tab:hover {
  background: rgba(10, 22, 40, 0.1);
  color: rgba(10, 22, 40, 0.9);
}

.pomodoro-phase-shortBreak .pomodoro-tab.active {
  background: rgba(10, 22, 40, 0.15);
  color: var(--ocean-deep);
}

/* Timer Container */
.pomodoro-timer-container {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  margin-bottom: var(--space-12);
}

/* Timer Display */
.pomodoro-display {
  width: 100%;
  padding: var(--space-12) var(--space-8);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  text-align: center;
  font-family: 'Courier New', monospace;
  font-weight: var(--font-bold);
  color: var(--neutral-white);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.pomodoro-phase-shortBreak .pomodoro-display {
  background: rgba(10, 22, 40, 0.08);
  color: var(--ocean-deep);
}

.pomodoro-display.running {
  box-shadow:
    0 12px 48px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 0 40px rgba(255, 255, 255, 0.1);
}

/* Controls */
.pomodoro-controls {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  justify-content: center;
}

.pomodoro-btn {
  padding: var(--space-4) var(--space-8);
  border: none;
  border-radius: 12px;
  font-size: var(--type-lg);
  font-weight: var(--font-bold);
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pomodoro-btn.primary {
  background: rgba(255, 255, 255, 0.9);
  color: var(--ocean-deep);
  padding: var(--space-5) var(--space-12);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.pomodoro-btn.primary:hover {
  background: var(--neutral-white);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.pomodoro-btn.secondary {
  background: rgba(255, 255, 255, 0.15);
  color: var(--neutral-white);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.pomodoro-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.25);
}

.pomodoro-phase-shortBreak .pomodoro-btn.primary {
  background: var(--ocean-deep);
  color: var(--neutral-white);
}

.pomodoro-phase-shortBreak .pomodoro-btn.secondary {
  background: rgba(10, 22, 40, 0.1);
  color: var(--ocean-deep);
  border: 1px solid rgba(10, 22, 40, 0.3);
}

/* Session Info */
.pomodoro-info {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.pomodoro-session {
  font-size: var(--type-lg);
  font-weight: var(--font-semibold);
  color: rgba(255, 255, 255, 0.9);
}

.pomodoro-message {
  font-size: var(--type-xl);
  font-weight: var(--font-bold);
  color: var(--neutral-white);
}

.pomodoro-phase-shortBreak .pomodoro-session,
.pomodoro-phase-shortBreak .pomodoro-message {
  color: var(--ocean-deep);
}

/* ============================================
 * KANBAN BOARD
 * ============================================ */

.kanban-board {
  width: 100%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: var(--space-6);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.pomodoro-phase-shortBreak .kanban-board {
  background: rgba(10, 22, 40, 0.05);
}

.kanban-header {
  margin-bottom: var(--space-6);
}

.kanban-header h2 {
  font-size: var(--type-xl);
  font-weight: var(--font-bold);
  color: var(--neutral-white);
}

.pomodoro-phase-shortBreak .kanban-header h2 {
  color: var(--ocean-deep);
}

.kanban-columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.kanban-column {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: var(--space-4);
  min-height: 200px;
}

.pomodoro-phase-shortBreak .kanban-column {
  background: rgba(10, 22, 40, 0.08);
}

.kanban-column-title {
  font-size: var(--type-base);
  font-weight: var(--font-semibold);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--space-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pomodoro-phase-shortBreak .kanban-column-title {
  color: var(--ocean-deep);
}

.kanban-tasks {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.kanban-task {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: var(--space-3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
  transition: all 0.2s ease;
}

.kanban-task:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(4px);
}

.pomodoro-phase-shortBreak .kanban-task {
  background: rgba(10, 22, 40, 0.1);
}

.pomodoro-phase-shortBreak .kanban-task:hover {
  background: rgba(10, 22, 40, 0.15);
}

.kanban-task-done {
  opacity: 0.6;
}

.kanban-task-text {
  flex: 1;
  color: var(--neutral-white);
  font-size: var(--type-sm);
  word-wrap: break-word;
}

.pomodoro-phase-shortBreak .kanban-task-text {
  color: var(--ocean-deep);
}

.kanban-task-actions {
  display: flex;
  gap: var(--space-1);
}

.kanban-btn {
  padding: var(--space-1) var(--space-2);
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: var(--neutral-white);
  border-radius: 4px;
  cursor: pointer;
  font-size: var(--type-xs);
  transition: all 0.2s ease;
}

.kanban-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.pomodoro-phase-shortBreak .kanban-btn {
  background: rgba(10, 22, 40, 0.2);
  color: var(--ocean-deep);
}

.kanban-btn-delete {
  background: rgba(239, 68, 68, 0.3);
}

.kanban-btn-delete:hover {
  background: rgba(239, 68, 68, 0.5);
}

.kanban-add-btn {
  width: 100%;
  padding: var(--space-3);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  cursor: pointer;
  font-size: var(--type-sm);
  transition: all 0.2s ease;
}

.kanban-add-btn:hover {
  border-color: rgba(255, 255, 255, 0.5);
  color: var(--neutral-white);
  background: rgba(255, 255, 255, 0.05);
}

.pomodoro-phase-shortBreak .kanban-add-btn {
  border-color: rgba(10, 22, 40, 0.3);
  color: rgba(10, 22, 40, 0.6);
}

.pomodoro-phase-shortBreak .kanban-add-btn:hover {
  border-color: rgba(10, 22, 40, 0.5);
  color: var(--ocean-deep);
  background: rgba(10, 22, 40, 0.05);
}

.kanban-add-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.kanban-add-input input {
  width: 100%;
  padding: var(--space-2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: var(--neutral-white);
  border-radius: 4px;
  font-size: var(--type-sm);
}

.pomodoro-phase-shortBreak .kanban-add-input input {
  border-color: rgba(10, 22, 40, 0.3);
  background: rgba(10, 22, 40, 0.1);
  color: var(--ocean-deep);
}

.kanban-add-actions {
  display: flex;
  gap: var(--space-2);
}

.kanban-btn-confirm {
  background: rgba(16, 185, 129, 0.8);
  color: var(--neutral-white);
}

.kanban-btn-cancel {
  background: rgba(107, 114, 128, 0.5);
}

/* Responsive */
@media (max-width: 900px) {
  .kanban-columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .pomodoro-page {
    padding: var(--space-4) var(--space-3);
  }

  .pomodoro-tabs {
    flex-direction: column;
    width: 100%;
  }

  .pomodoro-tab {
    width: 100%;
  }

  .pomodoro-controls {
    flex-direction: column;
    width: 100%;
  }

  .pomodoro-btn {
    width: 100%;
  }
}
```

**Step 2: Import styles in main CSS file**

Add this import to `src/styles.css` after the other Swiss imports:

```css
@import './styles/pomodoro-swiss.css';
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit styles**

```bash
git add src/styles/pomodoro-swiss.css src/styles.css
git commit -m "feat(pomodoro): add phase-based styling with green/white/cyan themes"
```

---

## Task 6: Add Pomodoro Route and Home Icon

**Files:**
- Modify: `src/main.tsx`

**Step 1: Add Pomodoro import**

At the top of `src/main.tsx`, add this import after the other page imports:

```typescript
import Pomodoro from "./pages/Pomodoro";
```

**Step 2: Add Pomodoro to timer definitions**

In the `Home` component, find the `timers` array (around line 125) and add the Pomodoro timer entry:

```typescript
const timers = [
  { route: "#/stopwatch", label: "Stopwatch", color: "#00D9FF", colorRgb: "0, 217, 255" },
  { route: "#/countdown", label: "Countdown", color: "#7B2CBF", colorRgb: "123, 44, 191" },
  { route: "#/analog", label: "Analog", color: "#C77DFF", colorRgb: "199, 125, 255" },
  { route: "#/pomodoro", label: "Pomodoro", color: "#10B981", colorRgb: "16, 185, 129" },
  { route: "#/cycle", label: "Cycle Timer", color: "#10B981", colorRgb: "16, 185, 129" },
  { route: "#/world", label: "World Clock", color: "#6B9BD1", colorRgb: "107, 155, 209" },
  { route: "#/alarm", label: "Alarm", color: "#EF4444", colorRgb: "239, 68, 68" },
  { route: "#/metronome", label: "Metronome", color: "#F59E0B", colorRgb: "245, 158, 11" },
  { route: "#/chess", label: "Chess Clock", color: "#E0AAFF", colorRgb: "224, 170, 255" },
  { route: "#/digital", label: "Digital Clock", color: "#4A6FA5", colorRgb: "74, 111, 165" },
];
```

**Step 3: Add Pomodoro route**

In the `App` component, find the route conditions (around line 196) and add:

```typescript
{route === "/pomodoro" && <Pomodoro />}
```

**Step 4: Update route validation**

Find the 404 route check (around line 208) and add "/pomodoro" to the array:

```typescript
{!["", "/", "/analog", "/countdown", "/stopwatch", "/pomodoro", "/cycle", "/digital", "/world", "/alarm", "/metronome", "/chess", "/impressum", "/datenschutz"].includes(route) && (
  <div className="page"><h1>Not Found</h1></div>
)}
```

**Step 5: Add Pomodoro icon to TimerIcon component**

In the `TimerIcon` function (around line 225), add a new icon for Pomodoro:

```typescript
"Pomodoro": (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="13" r="9"/>
    <path d="M12 4v9l3.5 3.5"/>
    <path d="M10 2h4"/>
    <path d="M11 2l-1 2"/>
    <path d="M14 2l1 2"/>
  </svg>
),
```

**Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 7: Test in browser**

Run: `npm run dev`
Navigate to: `http://localhost:5173/#/pomodoro`
Expected: Pomodoro timer page loads with green background

**Step 8: Commit routing changes**

```bash
git add src/main.tsx
git commit -m "feat(pomodoro): add route, home icon, and navigation integration"
```

---

## Task 7: Manual Testing Checklist

**Files:**
- None (testing only)

**Step 1: Test Work Phase**

1. Navigate to `http://localhost:5173/#/pomodoro`
2. Verify green gradient background
3. Click "START" button
4. Verify timer counts down from 25:00
5. Verify "Pomodoro 1/4" session counter shows
6. Verify "Time to focus! 🍅" message displays

**Step 2: Test Phase Switching**

1. Click "Short Break" tab
2. Verify background changes to white/light
3. Verify timer resets to 5:00
4. Click "Long Break" tab
5. Verify background changes to cyan gradient
6. Verify timer resets to 15:00

**Step 3: Test Timer Controls**

1. Start timer in Work phase
2. Click "PAUSE" - verify timer stops
3. Click "START" - verify timer resumes
4. Click "Reset" - verify timer returns to 25:00

**Step 4: Test Phase Cycling (Quick)**

1. Manually switch phase tabs to verify all three backgrounds work
2. Verify singing bowl sound plays when phase completes (let timer run to 0)
3. Verify automatic phase transition (work → short break)

**Step 5: Test Kanban Board**

1. Click "+ Add Task" in "To Do" column
2. Type "Test task 1" and press Enter
3. Verify task appears in "To Do" column
4. Click ▶ button on task
5. Verify task moves to "In Progress" column
6. Click ✓ button on task
7. Verify task moves to "Done" column with reduced opacity
8. Click ✕ button on task
9. Verify task is deleted

**Step 6: Test Persistence**

1. Add 2 tasks to Kanban board
2. Start timer for 10 seconds
3. Pause timer
4. Refresh page (F5)
5. Verify tasks are still there
6. Verify timer state is preserved
7. Verify phase is preserved

**Step 7: Test Keyboard Shortcuts**

1. Press Space - verify timer starts/pauses
2. Press R - verify timer resets
3. Press F - verify fullscreen toggles

**Step 8: Test Responsive Design**

1. Resize browser to mobile width (< 640px)
2. Verify Kanban columns stack vertically
3. Verify buttons stack vertically
4. Verify phase tabs stack vertically
5. Verify timer display fits without overflow

**Expected Results:**
- All tests pass without errors
- No console errors
- Smooth phase transitions
- Singing bowl sound plays at phase completion
- Tasks persist across page reloads

---

## Task 8: Update Documentation

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add Pomodoro to routing section**

In `CLAUDE.md`, find the "Routing System" section (around line 17) and add:

```markdown
- `#/pomodoro` → Pomodoro Timer with Kanban board
```

**Step 2: Add Pomodoro to timer types section**

In the "Timer Types & State Schemas" section (around line 60), add:

```markdown
- `PomodoroState` → Pomodoro Timer (includes phase cycling and task list)
```

**Step 3: Commit documentation**

```bash
git add CLAUDE.md
git commit -m "docs: add Pomodoro timer to routing and architecture docs"
```

---

## Task 9: Final Build and Verification

**Files:**
- None (verification only)

**Step 1: Clean build**

Run: `npm run build`
Expected: Build succeeds with no warnings or errors

**Step 2: Preview production build**

Run: `npm run preview`
Navigate to preview URL
Expected: Pomodoro timer works in production build

**Step 3: Check bundle size**

After build, check console output for:
- CSS bundle size (should be < 50KB)
- JS bundle size (should be < 250KB)

**Step 4: Test in production mode**

1. Navigate to `#/pomodoro`
2. Test all features from Task 7 checklist
3. Verify no console errors
4. Verify singing bowl sound plays

**Step 5: Final commit**

If any fixes were needed, commit them:

```bash
git add .
git commit -m "chore(pomodoro): final production build verification"
```

---

## Complete Implementation Checklist

- [ ] Task 1: TypeScript types defined
- [ ] Task 2: Singing bowl audio utility created
- [ ] Task 3: Kanban board component implemented
- [ ] Task 4: Pomodoro page component implemented
- [ ] Task 5: CSS styles with phase-based theming
- [ ] Task 6: Route and home icon integrated
- [ ] Task 7: Manual testing completed successfully
- [ ] Task 8: Documentation updated
- [ ] Task 9: Production build verified

---

## Notes for Engineer

**Color Theory:**
- Green (#10B981): Associated with productivity, growth, focus
- White/Light: Clean break, mental clarity, rest
- Cyan (#00D9FF): Deep relaxation, long break, refreshment

**Audio Design:**
- Singing bowl at 880 Hz (A5) is a pleasant, non-stressful tone
- 2.5-second duration prevents annoyance
- Exponential decay mimics natural singing bowl resonance

**State Management:**
- `remainingMs` tracks actual remaining time
- When `running`, calculate current time from `startedAt` and `remainingMs`
- On phase completion, automatically transition to next phase
- Always pause after automatic transitions (user must manually start next phase)

**Kanban Simplicity:**
- No drag-and-drop (avoids complex library dependencies)
- Simple button actions for moving tasks
- Tasks persist in localStorage with timer state
- Minimal UI - focus on timer, not task management

**Testing Focus:**
- Verify phase cycling logic (4 work → long break)
- Verify localStorage persistence
- Verify singing bowl plays on phase transitions
- Verify browser notifications (if permission granted)

**Future Enhancements (Not in MVP):**
- Statistics/analytics page
- Customizable durations
- Drag-and-drop Kanban
- Pomodoro history/calendar view
- Task estimation (how many pomodoros per task)
