import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAutoFitText } from '../hooks/useAutoFitText';
import { HomeButton } from '../components/HomeButton';
import { KanbanBoard } from '../components/KanbanBoard';
import { playSingingBowl } from '../utils/singing-bowl';
import type { PomodoroState, PomodoroTask, PomodoroPhase } from '../types/timer-types';
import { PomodoroGuide } from '../components/PomodoroGuide';

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

    // Calculate actual remaining time if timer was running
    let actualRemainingMs = p.remainingMs ?? WORK_DURATION;
    let shouldContinueRunning = false;

    if (p.running && p.startedAt) {
      const elapsedSinceStart = Date.now() - p.startedAt;
      actualRemainingMs = Math.max(0, p.remainingMs - elapsedSinceStart);

      // Only continue running if there's time left
      if (actualRemainingMs > 0) {
        shouldContinueRunning = true;
      }
    }

    return {
      version: 1,
      phase: p.phase ?? 'work',
      currentSession: p.currentSession ?? 1,
      remainingMs: actualRemainingMs,
      running: shouldContinueRunning,
      startedAt: shouldContinueRunning ? Date.now() : null,
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
    case 'work': return 'Work Session';
    case 'shortBreak': return 'Short Pause';
    case 'longBreak': return 'Extended Pause';
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const currentTime = st.running && st.startedAt
    ? Math.max(0, st.remainingMs - (Date.now() - st.startedAt))
    : st.remainingMs;

  const [textRef, autoFontSize] = useAutoFitText(fmt(currentTime), 8, 1.5);

  const sync = useCallback(() => {
    setSt(currentSt => {
      if (!currentSt.running || !currentSt.startedAt) {
        forceUpdate();
        return currentSt;
      }

      const elapsed = Date.now() - currentSt.startedAt;
      const remaining = currentSt.remainingMs - elapsed;

      if (remaining <= 0) {
        // Phase completed - move to next phase
        playSingingBowl();

        let nextPhase: PomodoroPhase;
        let nextSession = currentSt.currentSession;
        let completedPomodoros = currentSt.completedPomodoros;

        if (currentSt.phase === 'work') {
          completedPomodoros += 1;
          if (currentSt.currentSession >= SESSIONS_BEFORE_LONG_BREAK) {
            nextPhase = 'longBreak';
            // Keep session at 4, will reset after long break completes
          } else {
            nextPhase = 'shortBreak';
            // Keep session as is, will increment after short break completes
          }
        } else if (currentSt.phase === 'shortBreak') {
          nextPhase = 'work';
          nextSession = currentSt.currentSession + 1; // Increment for next work session
        } else {
          // longBreak
          nextPhase = 'work';
          nextSession = 1; // Reset to session 1 after long break
        }

        const nextDuration = getPhaseDuration(nextPhase);

        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Stoppclock - Pomodoro', {
            body: getPhaseMessage(nextPhase),
            icon: '/icons/icon-192x192.png'
          });
        }

        return {
          ...currentSt,
          phase: nextPhase,
          currentSession: nextSession,
          remainingMs: nextDuration,
          running: false, // Stop after phase transition
          startedAt: null,
          completedPomodoros
        };
      } else {
        forceUpdate();
        return currentSt;
      }
    });
  }, []);

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

  const handlePomodoroPreset = useCallback((workMinutes: number, breakMinutes: number, label: string) => {
    const workMs = workMinutes * 60 * 1000;
    setSt(s => ({
      ...s,
      remainingMs: workMs,
      running: false,
      startedAt: null,
      phase: 'work'
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Kanban handlers
  const addTask = useCallback((text: string) => {
    const newTask: PomodoroTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
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
          type="button"
          className={`pomodoro-tab ${st.phase === 'work' ? 'active' : ''}`}
          onClick={() => switchPhase('work')}
        >
          Pomodoro
        </button>
        <button
          type="button"
          className={`pomodoro-tab ${st.phase === 'shortBreak' ? 'active' : ''}`}
          onClick={() => switchPhase('shortBreak')}
        >
          Short Break
        </button>
        <button
          type="button"
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
          <button type="button" className="pomodoro-btn secondary hide-on-mobile" onClick={full}>
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

      {/* Guide - hidden when running or fullscreen */}
      {!st.running && !isFullscreen && (
        <PomodoroGuide onPresetSelect={handlePomodoroPreset} />
      )}
    </div>
  );
}
