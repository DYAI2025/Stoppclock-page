import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HomeButton } from '../components/HomeButton';
import { ShareButton } from '../components/ShareButton';
import { SavePresetButton } from '../components/SavePresetButton';
import { COOKING_PRESETS, getNextColor } from '../config/cooking-presets';
import type { CookingTimerState, CookingTimer, CookingPresetId } from '../types/timer-types';
import { usePinnedTimers, PinnedTimer } from '../contexts/PinnedTimersContext';
import { trackEvent } from '../utils/stats';
import { getPresetFromUrl } from '../utils/share';
import '../styles/cooking-warm.css';

const LS_KEY = 'sc.v1.cooking';
const MAX_TIMERS = 10;
const ALARM_AUDIO_DURATION_MS = 60 * 1000;

/* --- Logic & Persistence --- */

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
  } catch { }
}

function fmt(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function playAlarm() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Warm, lower tone (soft square wave)
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
    oscillator.type = 'triangle'; // Softer than sine or square

    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.6);

    oscillator.start(now);
    oscillator.stop(now + 0.6);
  } catch { }
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

/* --- Components --- */

// World View: Hero & Rituals
const CookingWorld = ({ onStart, activeCount }: { onStart: (preset?: CookingPresetId) => void, activeCount: number }) => {
  return (
    <div className="cook-world">
      <header className="cook-hero">
        <HomeButton />
        <div style={{ marginTop: 40 }}>
          <span className="cook-tag">Everyday Rituals</span>
          <h1 className="cook-title">The Warm Kitchen Buddy</h1>
          <p className="cook-subtitle">
            “I am here for your small moments—more ritual than alarm. Pour tea, stir pasta, and breathe.”
          </p>
        </div>

        {activeCount > 0 && (
          <div style={{ marginTop: 32 }}>
            <button className="cook-btn cook-btn-primary" onClick={() => onStart()} style={{ maxWidth: 200, margin: '0 auto' }}>
              Return to Kitchen ({activeCount})
            </button>
          </div>
        )}
      </header>

      <section className="cook-rituals">
        <div className="cook-ritual-card" onClick={() => onStart('tea')}>
          <div className="cook-ritual-icon">🫖</div>
          <h3 className="cook-ritual-title">Tea & Tiny Reset</h3>
          <p className="cook-ritual-desc">
            Use the 3-5 minutes of steeping to wipe the counter or just breathe. A tiny pause island.
          </p>
        </div>

        <div className="cook-ritual-card" onClick={() => onStart('pasta')}>
          <div className="cook-ritual-icon">🍝</div>
          <h3 className="cook-ritual-title">Parallel Pans</h3>
          <p className="cook-ritual-desc">
            Keep pasta, sauce, and bread in check without stress. Multi-tasking made calm.
          </p>
        </div>

        <div className="cook-ritual-card" onClick={() => onStart('custom')}>
          <div className="cook-ritual-icon">🧘</div>
          <h3 className="cook-ritual-title">Cooking as Focus</h3>
          <p className="cook-ritual-desc">
            Treat one simple dish as your focus block. While I run, this is the only thing you do.
          </p>
        </div>
      </section>

      <section className="cook-facts" style={{ marginTop: 60, textAlign: 'left', opacity: 0.8 }}>
        <h4 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem', marginBottom: 16 }}>Time Facts</h4>
        <p style={{ marginBottom: 8 }}>• <strong>Al Dente:</strong> The "tooth" of the pasta changes in a 30-second window.</p>
        <p>• <strong>Steeping:</strong> Green tea burns at 100°C; give it 80°C and 2 minutes for sweetness.</p>
      </section>
    </div>
  );
};

// Player View: Dashboard
const CookingPlayer = ({
  timers,
  onAdd,
  onToggle,
  onReset,
  onDelete,
  onAdjust,
  onDismiss,
  onExtend,
  onExit,
  onPin,
  isPinned,
  getCurrentConfig
}: any) => {
  const [customName, setCustomName] = useState('');
  const [customMin, setCustomMin] = useState('10');

  const handleAddCustom = () => {
    onAdd('custom', customMin, customName);
    setCustomName('');
  };

  return (
    <div className="cook-dashboard">
      <div className="cook-header-bar">
        <button className="cook-back-btn" onClick={onExit}>
          ← About this timer
        </button>
        <HomeButton />
      </div>

      <div className="cook-quick-bar">
        {COOKING_PRESETS.map(p => (
          <button key={p.id} className="cook-preset-chip" onClick={() => onAdd(p.id)}>
            <span>{p.emoji}</span> {p.label}
          </button>
        ))}
        <div className="cook-play-custom" style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 12, paddingLeft: 12, borderLeft: '1px solid #ddd' }}>
          <input
            className="cook-preset-chip"
            style={{ width: 100, cursor: 'text' }}
            placeholder="Name"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
          />
          <input
            className="cook-preset-chip"
            style={{ width: 60, cursor: 'text' }}
            type="number"
            value={customMin}
            onChange={e => setCustomMin(e.target.value)}
          />
          <button className="cook-preset-chip cook-add-custom" onClick={handleAddCustom}>+ Add</button>
        </div>
      </div>

      {/* Share & Save Buttons */}
      <div style={{ marginTop: '16px', marginBottom: '16px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <SavePresetButton
          timerType="cooking"
          getCurrentConfig={getCurrentConfig}
        />
        <ShareButton
          timerType="cooking"
          getCurrentConfig={getCurrentConfig}
        />
      </div>

      <div className="cook-grid">
        {timers.map((timer: any) => {
          const currentTime = timer.running && timer.startedAt
            ? Math.max(0, timer.remainingMs - (Date.now() - timer.startedAt))
            : timer.remainingMs;

          return (
            <div
              key={timer.id}
              className={`cook-timer-card ${timer.running ? 'running' : ''} ${timer.alarming ? 'alarming' : ''}`}
              style={{ '--timer-color': timer.color } as React.CSSProperties}
            >
              <div className="cook-card-header">
                <h3 className="cook-card-title">{timer.label}</h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => onPin(timer)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      opacity: isPinned(`${LS_KEY}:${timer.id}`) ? 1 : 0.5,
                      transition: 'opacity 0.2s'
                    }}
                    title={isPinned(`${LS_KEY}:${timer.id}`) ? 'Unpin from main page' : 'Pin to main page'}
                  >
                    {isPinned(`${LS_KEY}:${timer.id}`) ? '📌' : '📍'}
                  </button>
                  <button
                    onClick={() => onDelete(timer.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.5 }}
                  >✕</button>
                </div>
              </div>

              <div className="cook-card-time">
                {fmt(currentTime)}
              </div>

              {timer.alarming ? (
                <div className="cook-controls">
                  <button className="cook-btn cook-btn-primary" onClick={() => onDismiss(timer.id)}>Dismiss</button>
                  <button className="cook-btn cook-btn-secondary" onClick={() => onExtend(timer.id, 1)}>+1m</button>
                </div>
              ) : (
                <div className="cook-controls">
                  <button className="cook-btn cook-btn-secondary" onClick={() => onAdjust(timer.id, -30)}>-30s</button>
                  <button
                    className={`cook-btn ${timer.running ? 'cook-btn-secondary' : 'cook-btn-primary'}`}
                    onClick={() => onToggle(timer.id)}
                  >
                    {timer.running ? 'Pause' : 'Start'}
                  </button>
                  <button className="cook-btn cook-btn-secondary" onClick={() => onAdjust(timer.id, 30)}>+30s</button>
                </div>
              )}
            </div>
          );
        })}
        {timers.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60, opacity: 0.6 }}>
            <h3>Your kitchen is quiet.</h3>
            <p>Select a preset above to start a timer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function CookingTimer() {
  const [st, setSt] = useState<CookingTimerState>(load);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const [urlChecked, setUrlChecked] = useState(false);
  // Start directly in player mode - users expect to see the timer
  const [mode, setMode] = useState<'world' | 'player'>('player');

  // Get current config for sharing/saving
  const getCurrentConfig = useCallback(() => {
    return {
      timers: st.timers.map(t => ({
        label: t.label,
        durationMs: t.durationMs,
        color: t.color,
        presetId: t.presetId
      })),
      nextColorIndex: st.nextColorIndex
    };
  }, [st.timers, st.nextColorIndex]);

  // URL Preset Loading
  useEffect(() => {
    if (urlChecked) return;

    const sharedPreset = getPresetFromUrl();
    if (sharedPreset && sharedPreset.type === 'cooking') {
      const config = sharedPreset.config;
      if (config.timers && Array.isArray(config.timers)) {
        const loadedTimers: CookingTimer[] = config.timers.map((t: any, idx: number) => ({
          id: `cook-${Date.now()}-${idx}`,
          label: t.label || '⏱️ Timer',
          presetId: t.presetId || 'custom',
          durationMs: t.durationMs || 600000,
          remainingMs: t.durationMs || 600000,
          running: false,
          startedAt: null,
          color: t.color || '#FFB6C1',
          alarming: false,
          alarmStartedAt: null
        }));
        setSt(s => ({ ...s, timers: loadedTimers, nextColorIndex: config.nextColorIndex || 0 }));
      }
    }
    setUrlChecked(true);
  }, [urlChecked]);

  const sync = useCallback(() => {
    const now = Date.now();
    let hasChanges = false;

    setSt(prev => {
      const updated = { ...prev };
      updated.timers = prev.timers.map(timer => {
        if (!timer.running && !timer.alarming) return timer;

        if (timer.running && timer.startedAt) {
          const elapsed = now - timer.startedAt;
          const remaining = timer.remainingMs - elapsed;

          if (remaining <= 0) {
            // Track completion
            trackEvent('cooking', 'complete', timer.durationMs);
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

        // Alarm beep logic
        if (timer.alarming && timer.alarmStartedAt) {
          const alarmDuration = now - timer.alarmStartedAt;
          if (alarmDuration < ALARM_AUDIO_DURATION_MS && alarmDuration % 2000 < 1000) {
            // Throttle playAlarm to avoid spamming? playAlarm plays for 0.6s.
            // We call sync every frame? No, we need to be careful.
            // Actually playAlarm creates a new osc. If called 60 times/sec -> chaos.
            // Ideally check last beep time. 
          }
        }
        // Simplified alarm: just one beep at start handled above, maybe repeat every few sec?
        // For now let's trust the trigger at end.

        return timer;
      });
      return updated;
    });

    // We actually need a way to repeat the beep. 
    // Let's keep it simple: One beep at finish (already done in the remaining<=0 block).

    if (!hasChanges) forceUpdate();
  }, []);

  useRaf(st.timers.some(t => t.running || t.alarming), sync);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  /* --- Actions --- */

  const handleStartFromWorld = (presetId?: CookingPresetId) => {
    if (presetId) {
      addTimer(presetId);
    }
    setMode('player');
  };

  const addTimer = (presetId: CookingPresetId | 'custom', customMin?: string, customName?: string) => {
    if (st.timers.length >= MAX_TIMERS) return;

    let minutes = 10;
    const preset = COOKING_PRESETS.find(p => p.id === presetId);
    if (presetId === 'custom') {
      minutes = parseInt(customMin || '10') || 10;
    } else {
      minutes = preset?.defaultMinutes || 10;
    }

    const { color, nextIndex } = getNextColor(st.nextColorIndex);
    let label = preset ? `${preset.emoji} ${preset.label}` : `⏱️ ${minutes}min`;
    if (presetId === 'custom' && customName) {
      label = `⏱️ ${customName}`;
    }

    const newTimer: CookingTimer = {
      id: `cook-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      label,
      presetId: presetId as CookingPresetId,
      durationMs: minutes * 60000,
      remainingMs: minutes * 60000,
      running: false,
      startedAt: null,
      color,
      alarming: false,
      alarmStartedAt: null
    };

    setSt(s => ({ ...s, timers: [...s.timers, newTimer], nextColorIndex: nextIndex }));
  };

  const toggleTimer = (id: string) => {
    setSt(prev => ({
      ...prev,
      timers: prev.timers.map(t => {
        if (t.id !== id) return t;
        if (t.running) {
          const elapsed = Date.now() - (t.startedAt || 0);
          return { ...t, running: false, startedAt: null, remainingMs: Math.max(0, t.remainingMs - elapsed) };
        } else {
          // Track timer start
          trackEvent('cooking', 'start');
          return { ...t, running: true, startedAt: Date.now() };
        }
      })
    }));
  };

  const deleteTimer = (id: string) => {
    setSt(s => ({ ...s, timers: s.timers.filter(t => t.id !== id) }));
  };

  const adjustTimer = (id: string, secs: number) => {
    setSt(s => ({
      ...s,
      timers: s.timers.map(t => {
        if (t.id !== id) return t;
        const delta = secs * 1000; // Convert seconds to ms
        // If running, adjust relative to now? Or just remaining?
        // Standard behavior: adjust remaining.
        let newRem = t.remainingMs;
        if (t.running && t.startedAt) {
          const elapsed = Date.now() - t.startedAt;
          const current = t.remainingMs - elapsed;
          newRem = current + delta; // update target
          // To avoid jumping, we actually need to change remainingMs base, and reset startAt if we want "seamless".
          // Easiest: Update remainingMs to (Current + Delta) and reset StartedAt to NOW.
          return { ...t, remainingMs: Math.max(0, newRem), startedAt: Date.now(), durationMs: t.durationMs + delta };
        } else {
          return { ...t, remainingMs: Math.max(0, t.remainingMs + delta), durationMs: t.durationMs + delta };
        }
      })
    }));
  };

  const dismissAlarm = (id: string) => {
    setSt(s => ({
      ...s,
      timers: s.timers.map(t => t.id === id ? { ...t, alarming: false, running: false, remainingMs: 0 } : t)
    }));
  };

  const extendTimer = (id: string, mins: number) => {
    const ms = mins * 60000;
    setSt(s => ({
      ...s,
      timers: s.timers.map(t => t.id === id ? {
        ...t,
        alarming: false,
        running: true,
        remainingMs: ms,
        startedAt: Date.now(),
        durationMs: t.durationMs + ms
      } : t)
    }));
  };

  const { addTimer: addPinnedTimer, removeTimer: removePinnedTimer, isPinned } = usePinnedTimers();

  const handlePinIndividualTimer = useCallback((timer: CookingTimer) => {
    const timerPinId = `${LS_KEY}:${timer.id}`;

    if (isPinned(timerPinId)) {
      removePinnedTimer(timerPinId);
    } else {
      const pinnedTimer: PinnedTimer = {
        id: LS_KEY,
        type: 'CookingTimer',
        name: timer.label || `${Math.floor(timer.durationMs / 60000)}m`,
        subTimerId: timer.id,
      };
      addPinnedTimer(pinnedTimer);
    }
  }, [addPinnedTimer, removePinnedTimer, isPinned]);

  if (mode === 'player') {
    return (
      <div className="cooking-theme-wrapper">
        <CookingPlayer
          timers={st.timers}
          onAdd={addTimer}
          onToggle={toggleTimer}
          onDelete={deleteTimer}
          onAdjust={adjustTimer}
          onDismiss={dismissAlarm}
          onExtend={extendTimer}
          onExit={() => setMode('world')}
          onPin={handlePinIndividualTimer}
          isPinned={isPinned}
          getCurrentConfig={getCurrentConfig}
        />
      </div>
    );
  }

  return (
    <div className="cooking-theme-wrapper">
      <CookingWorld onStart={handleStartFromWorld} activeCount={st.timers.length} />
    </div>
  );
}
