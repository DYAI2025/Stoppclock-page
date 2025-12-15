import React, { useEffect, useState, useCallback } from 'react';
import { usePinnedTimers, PinnedTimer } from '../contexts/PinnedTimersContext';

/**
 * Generic timer state structure
 * Different timers may have different fields, but we extract common patterns
 */
type TimerState = {
  version?: number;
  running?: boolean;
  remainingMs?: number;  // For countdown timers
  elapsedMs?: number;    // For stopwatch
  startedAt?: number;    // For stopwatch
  endAt?: number;        // For countdown with end time
  intervalMs?: number;   // For cycle timer
  [key: string]: any;    // Allow other timer-specific fields
};

/**
 * Mini Timer Card - Shows live state of a pinned timer
 */
const PinnedTimerCard: React.FC<{ timer: PinnedTimer }> = ({ timer }) => {
  const [state, setState] = useState<TimerState | null>(null);
  const { removeTimer } = usePinnedTimers();

  /**
   * Load timer state from localStorage
   */
  const loadState = useCallback(() => {
    try {
      const raw = localStorage.getItem(timer.id);
      if (!raw) {
        setState(null);
        return;
      }

      const parsed = JSON.parse(raw) as TimerState;
      setState(parsed);
    } catch (e) {
      console.error(`Failed to load state for ${timer.id}:`, e);
      setState(null);
    }
  }, [timer.id]);

  /**
   * Set up real-time updates
   */
  useEffect(() => {
    // Initial load
    loadState();

    // Listen for cross-tab changes (localStorage events)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === timer.id) {
        loadState();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Poll for same-tab updates (localStorage events don't fire in same tab)
    const pollInterval = setInterval(loadState, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, [timer.id, loadState]);

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
   * Compute display time based on timer type and state
   */
  const displayTime = (): string => {
    if (!state) return '--:--:--';

    // For running timers with endAt (countdown timers)
    if (state.running && state.endAt) {
      const remaining = Math.max(0, state.endAt - Date.now());
      return formatTime(remaining);
    }

    // For running stopwatch with startedAt
    if (state.running && state.startedAt) {
      const elapsed = Date.now() - state.startedAt;
      return formatTime(elapsed);
    }

    // For paused countdown timers with remainingMs
    if ('remainingMs' in state && state.remainingMs !== undefined) {
      return formatTime(state.remainingMs);
    }

    // For stopwatch with elapsedMs
    if ('elapsedMs' in state && state.elapsedMs !== undefined) {
      return formatTime(state.elapsedMs);
    }

    // For cycle timer
    if ('intervalMs' in state && state.intervalMs !== undefined) {
      const display = state.remainingMs ?? state.intervalMs;
      return formatTime(display);
    }

    return '--:--:--';
  };

  /**
   * Get timer status text and icon
   */
  const getStatus = (): { icon: string; text: string; color: string } => {
    if (!state) {
      return { icon: '⚠', text: 'No data', color: '#888' };
    }

    if (state.running) {
      return { icon: '▶', text: 'Running', color: '#10B981' };
    }

    return { icon: '⏸', text: 'Paused', color: '#F59E0B' };
  };

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
   * Unpin timer from board
   */
  const handleUnpin = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    removeTimer(timer.id);
  };

  const status = getStatus();

  return (
    <div className="pinned-timer-card" onClick={handleNavigate}>
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

      <div className="pinned-timer-display">
        {displayTime()}
      </div>

      <div className="pinned-timer-status" style={{ color: status.color }}>
        <span className="status-icon">{status.icon}</span>
        <span className="status-text">{status.text}</span>
      </div>

      <div className="pinned-timer-hint">
        Click to open timer
      </div>
    </div>
  );
};

/**
 * Pinned Timers Board - Displays all pinned timers on home page
 */
export const PinnedTimersBoard: React.FC = () => {
  const { pinnedTimers } = usePinnedTimers();

  // Don't render if no timers pinned
  if (pinnedTimers.length === 0) {
    return null;
  }

  return (
    <div className="pinned-timers-board">
      <div className="pinned-timers-board-header">
        <h2 className="pinned-timers-board-title">📌 Pinned Timers</h2>
        <span className="pinned-timers-count">
          {pinnedTimers.length} / 3
        </span>
      </div>

      <div
        className={`pinned-timers-grid pinned-timers-grid-${pinnedTimers.length}`}
      >
        {pinnedTimers.map(timer => (
          <PinnedTimerCard key={timer.id} timer={timer} />
        ))}
      </div>
    </div>
  );
};
