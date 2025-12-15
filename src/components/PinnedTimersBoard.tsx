import React, { useEffect, useState, useCallback, useRef } from 'react';
import { usePinnedTimers, PinnedTimer } from '../contexts/PinnedTimersContext';
import { beep, flash } from '../utils';

/**
 * Generic timer state structure
 */
type TimerState = {
  version?: number;
  running?: boolean;
  remainingMs?: number;
  elapsedMs?: number;
  startedAt?: number | null;
  endAt?: number | null;
  intervalMs?: number;
  durationMs?: number;
  warnAtMs?: number | null;
  signal?: { sound?: boolean; flash?: boolean };
  [key: string]: any;
};

/**
 * Mini Timer Card - Fully functional pinned timer
 */
const PinnedTimerCard: React.FC<{ timer: PinnedTimer }> = ({ timer }) => {
  const [state, setState] = useState<TimerState | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const { removeTimer } = usePinnedTimers();
  const cardRef = useRef<HTMLDivElement>(null);
  const hasAlarmFired = useRef(false);

  /**
   * Load timer state from localStorage
   */
  const loadState = useCallback(() => {
    try {
      const raw = localStorage.getItem(timer.id);
      if (!raw) {
        setState(null);
        return null;
      }

      const parsed = JSON.parse(raw);

      // Special handling for CookingTimer with subTimerId
      if (timer.type === 'CookingTimer' && timer.subTimerId && parsed.timers) {
        const subTimer = parsed.timers.find((t: any) => t.id === timer.subTimerId);
        if (subTimer) {
          const cookingTimerState: TimerState = {
            version: parsed.version,
            running: subTimer.running,
            remainingMs: subTimer.remainingMs,
            durationMs: subTimer.durationMs,
            endAt: subTimer.endAt,
            signal: { sound: true, flash: true },
            _cookingTimerData: { timers: parsed.timers }
          };
          setState(cookingTimerState);
          return cookingTimerState;
        }
        setState(null);
        return null;
      }

      // Regular timer
      setState(parsed as TimerState);
      return parsed as TimerState;
    } catch (e) {
      console.error(`Failed to load state for ${timer.id}:`, e);
      setState(null);
      return null;
    }
  }, [timer.id, timer.type, timer.subTimerId]);

  /**
   * Save timer state to localStorage
   */
  const saveState = useCallback((newState: TimerState) => {
    try {
      // Special handling for CookingTimer with subTimerId
      if (timer.type === 'CookingTimer' && timer.subTimerId && newState._cookingTimerData) {
        const cookingState = newState._cookingTimerData;
        const updatedTimers = cookingState.timers.map((t: any) => {
          if (t.id === timer.subTimerId) {
            return {
              ...t,
              running: newState.running,
              remainingMs: newState.remainingMs,
              durationMs: newState.durationMs,
              endAt: newState.endAt,
            };
          }
          return t;
        });

        const fullState = {
          version: newState.version,
          timers: updatedTimers
        };
        localStorage.setItem(timer.id, JSON.stringify(fullState));
        setState({ ...newState, _cookingTimerData: { timers: updatedTimers } });
        return;
      }

      // Regular timer
      localStorage.setItem(timer.id, JSON.stringify(newState));
      setState(newState);
    } catch (e) {
      console.error(`Failed to save state for ${timer.id}:`, e);
    }
  }, [timer.id, timer.type, timer.subTimerId]);

  /**
   * Set up real-time updates
   */
  useEffect(() => {
    loadState();

    // Listen for cross-tab changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === timer.id) {
        loadState();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Update current time every 100ms for live display
    const timeInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);

    // Poll for same-tab updates
    const pollInterval = setInterval(loadState, 200);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(timeInterval);
      clearInterval(pollInterval);
    };
  }, [timer.id, loadState]);

  /**
   * Handle alarm when timer reaches zero
   */
  useEffect(() => {
    if (!state) return;

    // Check for countdown/cycle timer completion
    if (state.running && state.endAt) {
      const remaining = state.endAt - currentTime;

      if (remaining <= 0 && !hasAlarmFired.current) {
        hasAlarmFired.current = true;

        // Trigger alarm
        if (state.signal?.sound !== false) {
          beep(400, 880);
        }
        if (state.signal?.flash !== false && cardRef.current) {
          flash(cardRef.current, 400);
        }

        // For cycle timer, auto-restart
        if (timer.type === 'CycleTimer' && state.intervalMs) {
          const newState = {
            ...state,
            remainingMs: state.intervalMs,
            endAt: Date.now() + state.intervalMs,
            running: true
          };
          saveState(newState);
          hasAlarmFired.current = false;
        } else {
          // Stop countdown/analog timers
          const newState = {
            ...state,
            running: false,
            remainingMs: 0,
            endAt: null
          };
          saveState(newState);
        }
      }
    } else {
      hasAlarmFired.current = false;
    }
  }, [state, currentTime, timer.type, saveState]);

  /**
   * Format milliseconds to HH:MM:SS
   */
  const formatTime = (ms: number): string => {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  /**
   * Compute display time with live updates
   */
  const displayTime = (): string => {
    if (!state) return '--:--:--';

    // For running countdown with endAt
    if (state.running && state.endAt) {
      const remaining = Math.max(0, state.endAt - currentTime);
      return formatTime(remaining);
    }

    // For running stopwatch with startedAt
    if (state.running && state.startedAt) {
      const elapsed = currentTime - state.startedAt;
      return formatTime(elapsed);
    }

    // For paused countdown
    if ('remainingMs' in state && state.remainingMs !== undefined) {
      return formatTime(state.remainingMs);
    }

    // For paused stopwatch
    if ('elapsedMs' in state && state.elapsedMs !== undefined) {
      return formatTime(state.elapsedMs);
    }

    return '--:--:--';
  };

  /**
   * Start/Resume timer
   */
  const handleStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!state) return;

    let newState: TimerState;

    // Countdown/Analog/Cycle timers
    if ('remainingMs' in state) {
      const remaining = state.remainingMs || state.durationMs || state.intervalMs || 0;
      newState = {
        ...state,
        running: true,
        endAt: Date.now() + remaining,
        remainingMs: remaining
      };
    }
    // Stopwatch
    else if ('elapsedMs' in state) {
      newState = {
        ...state,
        running: true,
        startedAt: Date.now() - (state.elapsedMs || 0)
      };
    }
    else {
      return;
    }

    saveState(newState);
    hasAlarmFired.current = false;
  }, [state, saveState]);

  /**
   * Pause timer
   */
  const handlePause = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!state) return;

    let newState: TimerState;

    // Countdown/Analog/Cycle timers
    if (state.endAt) {
      const remaining = Math.max(0, state.endAt - Date.now());
      newState = {
        ...state,
        running: false,
        remainingMs: remaining,
        endAt: null
      };
    }
    // Stopwatch
    else if (state.startedAt) {
      const elapsed = Date.now() - state.startedAt;
      newState = {
        ...state,
        running: false,
        elapsedMs: elapsed,
        startedAt: null
      };
    }
    else {
      return;
    }

    saveState(newState);
  }, [state, saveState]);

  /**
   * Reset timer
   */
  const handleReset = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!state) return;

    let newState: TimerState;

    // Countdown/Analog timers
    if ('durationMs' in state && state.durationMs) {
      newState = {
        ...state,
        running: false,
        remainingMs: state.durationMs,
        endAt: null
      };
    }
    // Cycle timer
    else if ('intervalMs' in state && state.intervalMs) {
      newState = {
        ...state,
        running: false,
        remainingMs: state.intervalMs,
        endAt: null
      };
    }
    // Stopwatch
    else if ('elapsedMs' in state) {
      newState = {
        ...state,
        running: false,
        elapsedMs: 0,
        startedAt: null
      };
    }
    else {
      return;
    }

    saveState(newState);
    hasAlarmFired.current = false;
  }, [state, saveState]);

  /**
   * Navigate to timer page
   */
  const handleNavigate = () => {
    const routes: Record<string, string> = {
      'AnalogCountdown': '#/analog',
      'Countdown': '#/countdown',
      'Stopwatch': '#/stopwatch',
      'Pomodoro': '#/pomodoro',
      'CookingTimer': '#/cooking',
      'CouplesTimer': '#/couples',
      'ChessClock': '#/chess',
      'Metronome': '#/metronome',
      'WorldClock': '#/world',
      'Alarm': '#/alarm',
      'CycleTimer': '#/cycle',
    };

    window.location.hash = routes[timer.type] || '#/';
  };

  /**
   * Unpin timer
   */
  const handleUnpin = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeTimer(timer.id);
  };

  const status = state?.running
    ? { icon: '▶', text: 'Running', color: '#10B981' }
    : { icon: '⏸', text: 'Paused', color: '#F59E0B' };

  return (
    <div className="pinned-timer-card" ref={cardRef}>
      <div className="pinned-timer-header">
        <h3 className="pinned-timer-title">{timer.name}</h3>
        <button
          type="button"
          className="pinned-timer-unpin"
          onClick={handleUnpin}
          title="Unpin timer"
          aria-label="Unpin timer"
        >
          ✕
        </button>
      </div>

      <div className="pinned-timer-display" onClick={handleNavigate}>
        {displayTime()}
      </div>

      <div className="pinned-timer-status" style={{ color: status.color }}>
        <span className="status-icon">{status.icon}</span>
        <span className="status-text">{status.text}</span>
      </div>

      {/* Controls */}
      <div className="pinned-timer-controls">
        {!state?.running ? (
          <button
            type="button"
            className="pinned-control-btn start"
            onClick={handleStart}
            title="Start timer"
          >
            ▶ Start
          </button>
        ) : (
          <button
            type="button"
            className="pinned-control-btn pause"
            onClick={handlePause}
            title="Pause timer"
          >
            ⏸ Pause
          </button>
        )}
        <button
          type="button"
          className="pinned-control-btn reset"
          onClick={handleReset}
          title="Reset timer"
        >
          ↻ Reset
        </button>
      </div>

      <div className="pinned-timer-hint">
        Click display to open full timer
      </div>
    </div>
  );
};

/**
 * Pinned Timers Board
 */
export const PinnedTimersBoard: React.FC = () => {
  const { pinnedTimerObjects } = usePinnedTimers();

  if (pinnedTimerObjects.length === 0) {
    return null;
  }

  return (
    <div className="pinned-timers-board">
      <div className="pinned-timers-board-header">
        <h2 className="pinned-timers-board-title">📌 Pinned Timers</h2>
        <span className="pinned-timers-count">
          {pinnedTimerObjects.length} / 3
        </span>
      </div>

      <div
        className={`pinned-timers-grid pinned-timers-grid-${pinnedTimerObjects.length}`}
      >
        {pinnedTimerObjects.map(timer => (
          <PinnedTimerCard key={timer.id} timer={timer} />
        ))}
      </div>
    </div>
  );
};
