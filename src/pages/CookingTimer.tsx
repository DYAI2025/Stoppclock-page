import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HomeButton } from '../components/HomeButton';
import { COOKING_PRESETS, getNextColor } from '../config/cooking-presets';
import type { CookingTimerState, CookingTimer, CookingPresetId } from '../types/timer-types';
import '../styles/cooking-swiss.css';

const LS_KEY = 'sc.v1.cooking';
const MAX_TIMERS = 10;
const ALARM_AUDIO_DURATION_MS = 60 * 1000; // 60 seconds audio, then visual only

function load(): CookingTimerState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw new Error('No saved state');
    const state = JSON.parse(raw) as CookingTimerState;
    return {
      version: 1,
      timers: Array.isArray(state.timers) ? state.timers.map(t => ({
        ...t,
        running: false, // Always start paused after reload
        startedAt: null
      })) : [],
      nextColorIndex: state.nextColorIndex ?? 0
    };
  } catch {
    return {
      version: 1,
      timers: [],
      nextColorIndex: 0
    };
  }
}

function save(state: CookingTimerState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // Silently fail
  }
}

function fmt(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Audio alarm generator (800 Hz beep)
function playAlarm() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';

    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.5);

    oscillator.start(now);
    oscillator.stop(now + 0.5);
  } catch {
    // Silently fail if Web Audio API not available
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

export default function CookingTimer() {
  const [st, setSt] = useState<CookingTimerState>(load);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const [customMinutes, setCustomMinutes] = useState<string>('10');
  const [customName, setCustomName] = useState<string>('');
  const wrapRef = useRef<HTMLDivElement>(null);

  // Sort timers by remaining time (soonest first)
  const sortedTimers = [...st.timers].sort((a, b) => {
    const aTime = a.running && a.startedAt ? Math.max(0, a.remainingMs - (Date.now() - a.startedAt)) : a.remainingMs;
    const bTime = b.running && b.startedAt ? Math.max(0, b.remainingMs - (Date.now() - b.startedAt)) : b.remainingMs;

    // Alarming timers always on top
    if (a.alarming && !b.alarming) return -1;
    if (!a.alarming && b.alarming) return 1;

    // Then sort by remaining time
    return aTime - bTime;
  });

  const sync = useCallback(() => {
    const now = Date.now();
    let hasChanges = false;

    setSt(prev => {
      const updated = { ...prev };

      updated.timers = prev.timers.map(timer => {
        if (!timer.running && !timer.alarming) return timer;

        // Check if timer is running and needs to trigger alarm
        if (timer.running && timer.startedAt) {
          const elapsed = now - timer.startedAt;
          const remaining = timer.remainingMs - elapsed;

          if (remaining <= 0) {
            // Timer completed - start alarm
            playAlarm();
            hasChanges = true;
            return {
              ...timer,
              remainingMs: 0,
              running: false,
              startedAt: null,
              alarming: true,
              alarmStartedAt: now
            };
          }
        }

        // Check if alarm should stop audio (after 60s)
        if (timer.alarming && timer.alarmStartedAt) {
          const alarmDuration = now - timer.alarmStartedAt;
          if (alarmDuration < ALARM_AUDIO_DURATION_MS && alarmDuration % 2000 < 1000) {
            // Play beep every 2 seconds during first 60 seconds
            playAlarm();
          }
        }

        return timer;
      });

      return updated;
    });

    if (!hasChanges) {
      forceUpdate();
    }
  }, []);

  useRaf(st.timers.some(t => t.running || t.alarming), sync);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  // Add new timer
  const addTimer = useCallback((presetId: CookingPresetId) => {
    if (st.timers.length >= MAX_TIMERS) return;

    const preset = COOKING_PRESETS.find(p => p.id === presetId);
    const minutes = presetId === 'custom' ? Number.parseInt(customMinutes) || 10 : preset?.defaultMinutes || 10;
    const durationMs = minutes * 60 * 1000;

    const { color, nextIndex } = getNextColor(st.nextColorIndex);

    // Use custom name if provided, otherwise use preset label or default
    let label: string;
    if (presetId === 'custom') {
      const trimmedName = customName.trim();
      label = trimmedName ? `⏱️ ${trimmedName}` : `⏱️ ${minutes}min`;
    } else {
      label = preset ? `${preset.emoji} ${preset.label}` : `⏱️ ${minutes}min`;
    }

    const newTimer: CookingTimer = {
      id: `cooking-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      label,
      presetId,
      durationMs,
      remainingMs: durationMs,
      running: false,
      startedAt: null,
      color,
      alarming: false,
      alarmStartedAt: null
    };

    setSt(s => ({
      ...s,
      timers: [...s.timers, newTimer],
      nextColorIndex: nextIndex
    }));

    // Reset custom name after adding
    if (presetId === 'custom') {
      setCustomName('');
    }
  }, [st.timers.length, st.nextColorIndex, customMinutes, customName]);

  // Start/pause individual timer
  const toggleTimer = useCallback((timerId: string) => {
    setSt(prev => ({
      ...prev,
      timers: prev.timers.map(timer => {
        if (timer.id !== timerId) return timer;

        if (timer.running) {
          // Pause
          const elapsed = Date.now() - (timer.startedAt || 0);
          const remaining = Math.max(0, timer.remainingMs - elapsed);
          return {
            ...timer,
            running: false,
            startedAt: null,
            remainingMs: remaining
          };
        } else {
          // Start
          return {
            ...timer,
            running: true,
            startedAt: Date.now()
          };
        }
      })
    }));
  }, []);

  // Dismiss alarm
  const dismissAlarm = useCallback((timerId: string) => {
    setSt(prev => ({
      ...prev,
      timers: prev.timers.filter(t => t.id !== timerId)
    }));
  }, []);

  // Extend timer (while alarming)
  const extendTimer = useCallback((timerId: string, minutes: number) => {
    setSt(prev => ({
      ...prev,
      timers: prev.timers.map(timer => {
        if (timer.id !== timerId) return timer;

        const extensionMs = minutes * 60 * 1000;
        return {
          ...timer,
          remainingMs: extensionMs,
          durationMs: timer.durationMs + extensionMs,
          alarming: false,
          alarmStartedAt: null,
          running: true,
          startedAt: Date.now()
        };
      })
    }));
  }, []);

  // Delete timer
  const deleteTimer = useCallback((timerId: string) => {
    setSt(prev => ({
      ...prev,
      timers: prev.timers.filter(t => t.id !== timerId)
    }));
  }, []);

  // Adjust timer by minutes (add or subtract)
  const adjustTimer = useCallback((timerId: string, minutes: number) => {
    setSt(prev => ({
      ...prev,
      timers: prev.timers.map(timer => {
        if (timer.id !== timerId) return timer;

        const adjustmentMs = minutes * 60 * 1000;
        const currentRemaining = timer.running && timer.startedAt
          ? Math.max(0, timer.remainingMs - (Date.now() - timer.startedAt))
          : timer.remainingMs;

        const newRemaining = Math.max(0, currentRemaining + adjustmentMs);

        if (timer.running) {
          // If running, update remainingMs and reset startedAt to now
          return {
            ...timer,
            remainingMs: newRemaining,
            startedAt: Date.now(),
            durationMs: timer.durationMs + adjustmentMs
          };
        } else {
          // If paused, just update remainingMs
          return {
            ...timer,
            remainingMs: newRemaining,
            durationMs: timer.durationMs + adjustmentMs
          };
        }
      })
    }));
  }, []);

  // Reset timer
  const resetTimer = useCallback((timerId: string) => {
    setSt(prev => ({
      ...prev,
      timers: prev.timers.map(timer => {
        if (timer.id !== timerId) return timer;
        return {
          ...timer,
          remainingMs: timer.durationMs,
          running: false,
          startedAt: null,
          alarming: false,
          alarmStartedAt: null
        };
      })
    }));
  }, []);

  // Fullscreen
  const full = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen?.().catch(() => {});
    }
  }, []);

  return (
    <div className="cooking-timer-page" ref={wrapRef}>
      {/* Header */}
      <header className="cooking-header">
        <h1 className="cooking-title">Cooking Timer</h1>
        <HomeButton />
      </header>

      {/* Preset Buttons */}
      {st.timers.length < MAX_TIMERS && (
        <div className="cooking-presets">
          {COOKING_PRESETS.map(preset => (
            <button
              key={preset.id}
              type="button"
              className="preset-btn"
              onClick={() => addTimer(preset.id)}
            >
              <span className="preset-emoji">{preset.emoji}</span>
              <span className="preset-label">{preset.label}</span>
              <span className="preset-time">{preset.defaultMinutes}min</span>
            </button>
          ))}

          {/* Custom Timer */}
          <div className="preset-custom">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="custom-input custom-name-input"
              placeholder="Timer Name"
              maxLength={20}
            />
            <input
              type="number"
              min="1"
              max="180"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              className="custom-input custom-minutes-input"
              placeholder="Min"
            />
            <button
              type="button"
              className="preset-btn custom-add-btn"
              onClick={() => addTimer('custom')}
            >
              <span className="preset-emoji">⏱️</span>
              <span className="preset-label">Add</span>
            </button>
          </div>
        </div>
      )}

      {/* Timer Cards */}
      <div className="cooking-timers">
        {sortedTimers.length === 0 ? (
          <div className="cooking-empty">
            <p>No active timers</p>
            <p className="cooking-hint">Select a preset above to start cooking</p>
          </div>
        ) : (
          sortedTimers.map(timer => {
            const currentTime = timer.running && timer.startedAt
              ? Math.max(0, timer.remainingMs - (Date.now() - timer.startedAt))
              : timer.remainingMs;

            const progress = timer.durationMs > 0
              ? (currentTime / timer.durationMs) * 100
              : 0;

            return (
              <div
                key={timer.id}
                className={`cooking-card ${timer.alarming ? 'alarming' : ''}`}
                style={{ '--timer-color': timer.color } as React.CSSProperties}
              >
                {/* Card Header */}
                <div className="card-header">
                  <h3 className="card-label">{timer.label}</h3>
                  <button
                    type="button"
                    className="card-delete"
                    onClick={() => deleteTimer(timer.id)}
                    title="Delete timer"
                  >
                    ✕
                  </button>
                </div>

                {/* Timer Display with +/- buttons */}
                <div className="card-display-container">
                  <button
                    type="button"
                    className="time-adjust-btn minus"
                    onClick={() => adjustTimer(timer.id, -1)}
                    disabled={timer.alarming}
                    title="Subtract 1 minute"
                  >
                    −
                  </button>
                  <div className="card-display">
                    {fmt(currentTime)}
                  </div>
                  <button
                    type="button"
                    className="time-adjust-btn plus"
                    onClick={() => adjustTimer(timer.id, 1)}
                    disabled={timer.alarming}
                    title="Add 1 minute"
                  >
                    +
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="card-progress-track">
                  <div
                    className="card-progress-bar"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Controls */}
                {timer.alarming ? (
                  <div className="card-alarm-controls">
                    <button
                      type="button"
                      className="card-btn dismiss"
                      onClick={() => dismissAlarm(timer.id)}
                    >
                      Dismiss
                    </button>
                    <button
                      type="button"
                      className="card-btn extend"
                      onClick={() => extendTimer(timer.id, 1)}
                    >
                      +1 min
                    </button>
                    <button
                      type="button"
                      className="card-btn extend"
                      onClick={() => extendTimer(timer.id, 2)}
                    >
                      +2 min
                    </button>
                    <button
                      type="button"
                      className="card-btn extend"
                      onClick={() => extendTimer(timer.id, 5)}
                    >
                      +5 min
                    </button>
                  </div>
                ) : (
                  <div className="card-controls">
                    <button
                      type="button"
                      className={`card-btn ${timer.running ? 'pause' : 'start'}`}
                      onClick={() => toggleTimer(timer.id)}
                    >
                      {timer.running ? 'Pause' : 'Start'}
                    </button>
                    <button
                      type="button"
                      className="card-btn reset"
                      onClick={() => resetTimer(timer.id)}
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Controls */}
      <div className="cooking-footer">
        <button type="button" className="footer-btn" onClick={full}>
          Fullscreen
        </button>
        <span className="timer-count">
          {st.timers.length}/{MAX_TIMERS} timers
        </span>
      </div>
    </div>
  );
}
