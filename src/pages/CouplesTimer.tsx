import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { HomeButton } from '../components/HomeButton';
import { ChevronRight, Clock, Coffee, Heart, Info, Play, Shield, Wind } from 'lucide-react';
import { SESSION_PRESETS, PHASE_GUIDANCE, getPresetById } from '../config/couples-presets';
import type {
  CouplesTimerState,
  CoupleProfile,
  SessionPreset,
  SessionPhase,
  PresetId
} from '../types/timer-types';
import '../styles/couples-swiss.css';

const LS_KEY_STATE = 'sc.v1.couples';
const LS_KEY_PROFILES = 'sc.v1.couples.profiles';

const MIN_TRANSITION_SECONDS = 5;
const MAX_TRANSITION_SECONDS = 5 * 60;
const DEFAULT_TRANSITION_MS = 60 * 1000;

// Load state from localStorage
function loadState(): CouplesTimerState {
  try {
    const raw = localStorage.getItem(LS_KEY_STATE);
    if (!raw) throw new Error('No saved state');
    const state = JSON.parse(raw) as CouplesTimerState;
    let adjustedRemainingMs = state.remainingMs;
    if (state.running && state.startedAt) {
      const elapsed = Date.now() - state.startedAt;
      adjustedRemainingMs = Math.max(0, state.remainingMs - elapsed);
    }
    return {
      ...state,
      transitionDurationMs: state.transitionDurationMs || state.currentPreset?.transitionDurationMs || DEFAULT_TRANSITION_MS,
      remainingMs: adjustedRemainingMs,
      running: false, // Always start paused after reload
      startedAt: null
    };
  } catch {
    return {
      version: 1,
      currentProfile: null,
      currentPreset: null,
      phase: 'SETUP',
      currentSlotIndex: 0,
      transitionDurationMs: DEFAULT_TRANSITION_MS,
      remainingMs: 0,
      running: false,
      startedAt: null,
      completedSessions: 0,
      schedule: null
    };
  }
}

// Load profiles from localStorage
function loadProfiles(): CoupleProfile[] {
  try {
    const raw = localStorage.getItem(LS_KEY_PROFILES);
    if (!raw) return [];
    return JSON.parse(raw) as CoupleProfile[];
  } catch {
    return [];
  }
}

// Save state to localStorage
function saveState(state: CouplesTimerState) {
  try {
    localStorage.setItem(LS_KEY_STATE, JSON.stringify(state));
  } catch {
    // Silently fail
  }
}

// Save profiles to localStorage
function saveProfiles(profiles: CoupleProfile[]) {
  try {
    localStorage.setItem(LS_KEY_PROFILES, JSON.stringify(profiles));
  } catch {
    // Silently fail
  }
}

// Format time as MM:SS
function fmt(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function fmtShort(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (seconds === 0) return `${minutes} min`;
  return `${minutes} min ${seconds}s`;
}

// Reused AudioContext instance for all transition sounds
let sharedAudioContext: AudioContext | null = null;

type BellTone = 'high' | 'low';

type TimelineSegment = {
  key: string;
  label: string;
  duration: number;
  type:
  | 'prep'
  | 'speak-a'
  | 'speak-b'
  | 'transition'
  | 'closing-a'
  | 'closing-b'
  | 'cooldown';
};

// Singing-bowl style bell tone for cues
function playBellTone(tone: BellTone) {
  try {
    if (typeof window === 'undefined') return;

    // Lazily create and cache a single AudioContext
    if (!sharedAudioContext) {
      const AudioContextCtor =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextCtor) {
        // Web Audio API not available
        return;
      }
      sharedAudioContext = new AudioContextCtor();
    }

    const audioContext = sharedAudioContext;
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const baseFrequency = tone === 'high' ? 660 : 196; // bright vs. grounding
    oscillator.frequency.setValueAtTime(baseFrequency, audioContext.currentTime);
    oscillator.type = 'sine';

    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.22, now + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    oscillator.start(now);
    oscillator.stop(now + 1.6);
  } catch {
    // Silently fail if Web Audio API not available or on any runtime error
  }
}

function playPhaseChime(prevPhase: SessionPhase, nextPhase: SessionPhase) {
  if (nextPhase === 'TRANSITION') {
    playBellTone('low');
    return;
  }

  if (prevPhase === 'TRANSITION') {
    playBellTone('high');
    return;
  }

  if (nextPhase === 'A_SPEAKS' || nextPhase === 'B_SPEAKS' || nextPhase === 'A_CLOSING' || nextPhase === 'B_CLOSING') {
    playBellTone('high');
    return;
  }

  if (nextPhase === 'COOLDOWN' || nextPhase === 'COMPLETED') {
    playBellTone('low');
  }
}

// Custom RAF hook
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

export function CoupleTimerPlayer({ onExit, initialPresetId }: { onExit?: () => void; initialPresetId?: PresetId }) {
  const [state, setState] = useState<CouplesTimerState>(() => {
    const loaded = loadState();
    // If an initial preset is provided and we're in SETUP, pre-select it
    if (initialPresetId && loaded.phase === 'SETUP') {
      const preset = getPresetById(initialPresetId);
      if (preset) {
        return {
          ...loaded,
          currentPreset: preset,
          transitionDurationMs: preset.transitionDurationMs
        };
      }
    }
    return loaded;
  });
  const [profiles, setProfiles] = useState<CoupleProfile[]>(loadProfiles);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const transitionSeconds = Math.round(state.transitionDurationMs / 1000);

  // New profile form
  const [newProfileNameA, setNewProfileNameA] = useState('');
  const [newProfileNameB, setNewProfileNameB] = useState('');

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const t = setTimeout(() => saveState(state), 150);
    return () => clearTimeout(t);
  }, [state]);

  // Save profiles whenever they change
  useEffect(() => {
    const t = setTimeout(() => saveProfiles(profiles), 150);
    return () => clearTimeout(t);
  }, [profiles]);

  // Update transition buffer (clamped between 5 seconds and 5 minutes)
  const updateTransitionSeconds = useCallback((seconds: number) => {
    const clamped = Math.min(MAX_TRANSITION_SECONDS, Math.max(MIN_TRANSITION_SECONDS, seconds));
    setState(prev => ({
      ...prev,
      transitionDurationMs: clamped * 1000
    }));
  }, []);

  // State machine: Advance to next phase
  const advancePhase = useCallback(() => {
    setState(prev => {
      if (!prev.currentPreset) return prev;

      const preset = prev.currentPreset;
      const transitionDuration = prev.transitionDurationMs || preset.transitionDurationMs;
      let nextPhase: SessionPhase = prev.phase;
      let nextRemainingMs = 0;
      let nextSlotIndex = prev.currentSlotIndex;

      switch (prev.phase) {
        case 'SETUP':
          nextPhase = 'PREP';
          nextRemainingMs = preset.prepDurationMs;
          break;

        case 'PREP':
          nextPhase = 'A_SPEAKS';
          nextRemainingMs = preset.slotDurationMs;
          nextSlotIndex = 0;
          break;

        case 'A_SPEAKS':
          // Check if we need transition or move to B_SPEAKS
          nextPhase = 'TRANSITION';
          nextRemainingMs = transitionDuration;
          break;

        case 'TRANSITION':
          // Determine next speaker based on slot index
          const totalSlots = preset.slotsPerPerson * 2;
          nextSlotIndex = prev.currentSlotIndex + 1;

          if (nextSlotIndex >= totalSlots) {
            // Move to closing
            nextPhase = 'A_CLOSING';
            nextRemainingMs = preset.closingDurationMs;
          } else {
            // Alternate between A and B
            nextPhase = nextSlotIndex % 2 === 0 ? 'A_SPEAKS' : 'B_SPEAKS';
            nextRemainingMs = preset.slotDurationMs;
          }
          break;

        case 'B_SPEAKS':
          nextPhase = 'TRANSITION';
          nextRemainingMs = transitionDuration;
          break;

        case 'A_CLOSING':
          nextPhase = 'B_CLOSING';
          nextRemainingMs = preset.closingDurationMs;
          break;

        case 'B_CLOSING':
          nextPhase = 'COOLDOWN';
          nextRemainingMs = preset.cooldownDurationMs;
          break;

        case 'COOLDOWN':
          nextPhase = 'COMPLETED';
          nextRemainingMs = 0;
          return {
            ...prev,
            phase: nextPhase,
            remainingMs: nextRemainingMs,
            running: false,
            startedAt: null,
            completedSessions: prev.completedSessions + 1
          };

        case 'COMPLETED':
          // Stay in completed state
          return prev;
      }

      playPhaseChime(prev.phase, nextPhase);

      return {
        ...prev,
        phase: nextPhase,
        remainingMs: nextRemainingMs,
        currentSlotIndex: nextSlotIndex,
        running: true,
        startedAt: Date.now()
      };
    });
  }, []);

  // Timer sync - update remaining time and check for phase completion
  const sync = useCallback(() => {
    const now = Date.now();

    setState(prev => {
      if (!prev.running || !prev.startedAt) {
        forceUpdate();
        return prev;
      }

      const elapsed = now - prev.startedAt;
      const remaining = prev.remainingMs - elapsed;

      if (remaining <= 0) {
        // Phase completed - advance to next phase
        // We'll do this in the next tick
        setTimeout(() => advancePhase(), 0);
        return {
          ...prev,
          remainingMs: 0,
          running: false,
          startedAt: null
        };
      }

      forceUpdate();
      return prev;
    });
  }, [advancePhase]);

  useRaf(state.running, sync);

  const computeSessionDurationMs = useCallback((preset: SessionPreset) => {
    const transitionMs = state.transitionDurationMs || preset.transitionDurationMs;
    return (
      preset.prepDurationMs +
      preset.slotDurationMs * preset.slotsPerPerson * 2 +
      transitionMs * preset.slotsPerPerson * 2 +
      preset.closingDurationMs * 2 +
      preset.cooldownDurationMs
    );
  }, [state.transitionDurationMs]);

  // Create new profile
  const createProfile = useCallback(() => {
    if (!newProfileNameA.trim() || !newProfileNameB.trim()) return;

    const newProfile: CoupleProfile = {
      id: `profile-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      nameA: newProfileNameA.trim(),
      nameB: newProfileNameB.trim(),
      relationshipType: 'couple',
      preferredPresetId: 'einsteiger-60',
      createdAt: Date.now(),
      lastSessionAt: null
    };

    setProfiles(prev => [...prev, newProfile]);
    setNewProfileNameA('');
    setNewProfileNameB('');

    // Auto-select the new profile
    setState(prev => ({
      ...prev,
      currentProfile: newProfile
    }));
  }, [newProfileNameA, newProfileNameB]);

  // Select profile
  const selectProfile = useCallback((profile: CoupleProfile) => {
    setState(prev => ({
      ...prev,
      currentProfile: profile,
      currentPreset: getPresetById(profile.preferredPresetId) || SESSION_PRESETS[0],
      transitionDurationMs: getPresetById(profile.preferredPresetId)?.transitionDurationMs || DEFAULT_TRANSITION_MS
    }));
  }, []);

  // Select preset
  const selectPreset = useCallback((presetId: PresetId) => {
    const preset = getPresetById(presetId);
    if (!preset) return;

    setState(prev => ({
      ...prev,
      currentPreset: preset,
      transitionDurationMs:
        prev.transitionDurationMs === prev.currentPreset?.transitionDurationMs
          ? preset.transitionDurationMs
          : prev.transitionDurationMs
    }));
  }, []);

  // Start session
  const startSession = useCallback(() => {
    if (!state.currentProfile || !state.currentPreset) return;

    playBellTone('high');

    setState(prev => ({
      ...prev,
      phase: 'PREP',
      currentSlotIndex: 0,
      remainingMs: prev.currentPreset!.prepDurationMs,
      running: true,
      startedAt: Date.now()
    }));
  }, [state.currentProfile, state.currentPreset]);

  // Toggle pause/resume
  const togglePause = useCallback(() => {
    setState(prev => {
      if (prev.running) {
        // Pause
        const elapsed = Date.now() - (prev.startedAt || 0);
        const remaining = Math.max(0, prev.remainingMs - elapsed);
        return {
          ...prev,
          running: false,
          startedAt: null,
          remainingMs: remaining
        };
      } else {
        // Resume
        return {
          ...prev,
          running: true,
          startedAt: Date.now()
        };
      }
    });
  }, []);

  // Reset session
  const resetSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'SETUP',
      currentSlotIndex: 0,
      remainingMs: 0,
      running: false,
      startedAt: null
    }));
  }, []);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    } else {
      el.requestFullscreen?.().catch(() => { });
    }
  }, []);

  // Get current remaining time
  const currentTime = state.running && state.startedAt
    ? Math.max(0, state.remainingMs - (Date.now() - state.startedAt))
    : state.remainingMs;

  // Get phase guidance text
  const getGuidanceText = (phase: SessionPhase) => {
    const guidance = PHASE_GUIDANCE[phase] || PHASE_GUIDANCE.SETUP;
    const nameA = state.currentProfile?.nameA || 'Person A';
    const nameB = state.currentProfile?.nameB || 'Person B';

    return {
      title: guidance.title.replace('{nameA}', nameA).replace('{nameB}', nameB),
      text: guidance.text.replace('{nameA}', nameA).replace('{nameB}', nameB)
    };
  };

  const guidance = getGuidanceText(state.phase);

  const timeline = useMemo(() => {
    if (!state.currentPreset) return { segments: [] as TimelineSegment[], totalMs: 0 };

    const preset = state.currentPreset;
    const segments: TimelineSegment[] = [
      {
        key: 'prep',
        label: 'Vorbereitung',
        duration: preset.prepDurationMs,
        type: 'prep'
      }
    ];

    const totalSlots = preset.slotsPerPerson * 2;
    for (let i = 0; i < totalSlots; i += 1) {
      const speaker = i % 2 === 0 ? 'A' : 'B';
      segments.push({
        key: `speak-${i}`,
        label: `${speaker === 'A' ? 'Person A' : 'Person B'} spricht`,
        duration: preset.slotDurationMs,
        type: speaker === 'A' ? 'speak-a' : 'speak-b'
      });
      segments.push({
        key: `transition-${i}`,
        label: 'Transition / Sammeln',
        duration: state.transitionDurationMs,
        type: 'transition'
      });
    }

    segments.push(
      {
        key: 'closing-a',
        label: 'Abschluss A',
        duration: preset.closingDurationMs,
        type: 'closing-a'
      },
      {
        key: 'closing-b',
        label: 'Abschluss B',
        duration: preset.closingDurationMs,
        type: 'closing-b'
      },
      {
        key: 'cooldown',
        label: 'Cooldown (kein Nachgespräch)',
        duration: preset.cooldownDurationMs,
        type: 'cooldown'
      }
    );

    const totalMs = segments.reduce((sum, seg) => sum + seg.duration, 0);
    return { segments, totalMs };
  }, [state.currentPreset, state.transitionDurationMs]);

  return (
    <div className="couples-timer-page" ref={wrapRef}>
      {/* Header */}
      <header className="couples-header">
        <h1 className="couples-title">Couples Timer</h1>
        {onExit ? (
          <button onClick={(e) => { e.preventDefault(); onExit(); }} className="btn-home">
            Back to Story
          </button>
        ) : (
          <HomeButton />
        )}
      </header>

      {/* Setup View */}
      {state.phase === 'SETUP' && (
        <div className="couples-setup">
          <div className="setup-section">
            <h2>Wähle oder erstelle ein Profil</h2>

            {/* Existing profiles */}
            {profiles.length > 0 && (
              <div className="profile-list">
                {profiles.map(profile => (
                  <button
                    key={profile.id}
                    type="button"
                    className={`profile-card ${state.currentProfile?.id === profile.id ? 'selected' : ''}`}
                    onClick={() => selectProfile(profile)}
                  >
                    <div className="profile-names">{profile.nameA} & {profile.nameB}</div>
                    <div className="profile-meta">{profile.relationshipType}</div>
                  </button>
                ))}
              </div>
            )}

            {/* New profile form */}
            <div className="new-profile-form">
              <h3>Neues Profil erstellen</h3>
              <div className="form-row">
                <input
                  type="text"
                  value={newProfileNameA}
                  onChange={(e) => setNewProfileNameA(e.target.value)}
                  placeholder="Name Person A"
                  className="profile-input"
                  maxLength={30}
                />
                <input
                  type="text"
                  value={newProfileNameB}
                  onChange={(e) => setNewProfileNameB(e.target.value)}
                  placeholder="Name Person B"
                  className="profile-input"
                  maxLength={30}
                />
                <button
                  type="button"
                  onClick={createProfile}
                  className="create-profile-btn"
                  disabled={!newProfileNameA.trim() || !newProfileNameB.trim()}
                >
                  Erstellen
                </button>
              </div>
            </div>
          </div>

          {/* Preset selection */}
          {state.currentProfile && (
            <div className="setup-section">
              <h2>Wähle ein Preset</h2>
              <div className="preset-list">
                {SESSION_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`preset-card ${state.currentPreset?.id === preset.id ? 'selected' : ''}`}
                    onClick={() => selectPreset(preset.id)}
                  >
                    <div className="preset-name">{preset.name}</div>
                    <div className="preset-description">{preset.description}</div>
                    <div className="preset-duration">Geplante Dauer: {fmtShort(computeSessionDurationMs(preset))}</div>
                  </button>
                ))}
              </div>

              <div className="transition-settings">
                <div className="transition-copy">
                  <h3>Transitions &amp; Sammelzeit</h3>
                  <p>
                    Nach jeder Sprech-Phase startet automatisch eine stille Übergabe-Phase.
                    Standard sind 60 Sekunden, anpassbar zwischen 5 Sekunden und 5 Minuten, damit
                    niemand spricht, gesammelt wird und Emotionen sich beruhigen können.
                  </p>
                </div>
                <div className="transition-controls">
                  <label className="transition-label" htmlFor="transition-seconds">
                    Länge der Übergabe (stille Phase)
                  </label>
                  <input
                    id="transition-seconds"
                    type="range"
                    min={MIN_TRANSITION_SECONDS}
                    max={MAX_TRANSITION_SECONDS}
                    step={5}
                    value={transitionSeconds}
                    onChange={(e) => updateTransitionSeconds(Number(e.target.value))}
                    className="transition-slider"
                  />
                  <div className="transition-input-row">
                    <input
                      type="number"
                      min={MIN_TRANSITION_SECONDS}
                      max={MAX_TRANSITION_SECONDS}
                      value={transitionSeconds}
                      onChange={(e) => updateTransitionSeconds(Number(e.target.value))}
                      className="transition-number"
                    />
                    <span className="transition-unit">Sekunden</span>
                  </div>
                  <p className="transition-hint">
                    Der tiefe Gong beendet das Timeboxen und startet die Transition. Sie endet
                    automatisch mit dem hellen Gong, danach kann die nächste Person antworten.
                  </p>
                </div>
              </div>

              {timeline.segments.length > 0 && (
                <div className="timeline-preview">
                  <div className="timeline-header">
                    <h3>Ablauf-Vorschau</h3>
                    <span className="timeline-total">Gesamtdauer: {fmtShort(timeline.totalMs)}</span>
                  </div>
                  <p className="timeline-description">
                    Der Ablauf zeigt Sprech- und Sammelphasen sowie Cooldown. Orange Abschnitte sind
                    die stillen Übergaben; sie werden automatisch nach jedem Slot gezählt.
                  </p>
                  <div className="timeline-bar">
                    {timeline.segments.map(segment => (
                      <div
                        key={segment.key}
                        className={`timeline-segment segment-${segment.type}`}
                        style={{ width: timeline.totalMs ? `${(segment.duration / timeline.totalMs) * 100}%` : '0%' }}
                      >
                        <span className="segment-label">{segment.label}</span>
                        <span className="segment-duration">{fmtShort(segment.duration)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="timeline-legend">
                    <span className="legend-item legend-a">A spricht</span>
                    <span className="legend-item legend-b">B spricht</span>
                    <span className="legend-item legend-transition">Transition</span>
                    <span className="legend-item legend-closing">Abschluss</span>
                    <span className="legend-item legend-cooldown">Cooldown</span>
                  </div>
                </div>
              )}

              {/* Start button */}
              {state.currentPreset && (
                <button
                  type="button"
                  onClick={startSession}
                  className="start-session-btn"
                >
                  Session starten
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Active Session View */}
      {state.phase !== 'SETUP' && state.phase !== 'COMPLETED' && (
        <div className="couples-session">
          {/* Phase indicator */}
          <div className={`phase-indicator phase-${state.phase.toLowerCase()}`}>
            <h2 className="phase-title">{guidance.title}</h2>
            <p className="phase-guidance">{guidance.text}</p>
          </div>

          {/* Timer display */}
          <div className="session-timer">
            <div className="timer-display-large">{fmt(currentTime)}</div>
            <div className="timer-label">
              {state.phase === 'TRANSITION' ? 'Stille Übergabe – bitte sammeln' : ''}
              {state.phase === 'COOLDOWN' ? 'Nachgesprächsverbot' : ''}
            </div>
          </div>

          {/* Progress indicator */}
          {state.currentPreset && state.phase !== 'COOLDOWN' && (
            <div className="session-progress">
              <div className="progress-label">
                Slot {state.currentSlotIndex + 1} von {state.currentPreset.slotsPerPerson * 2}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="session-controls">
            <button
              type="button"
              onClick={togglePause}
              className={`control-btn ${state.running ? 'pause' : 'resume'}`}
            >
              {state.running ? 'Pause' : 'Fortsetzen'}
            </button>
            <button
              type="button"
              onClick={resetSession}
              className="control-btn reset"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="control-btn fullscreen"
            >
              Vollbild
            </button>
          </div>
        </div>
      )}

      {/* Completed View */}
      {state.phase === 'COMPLETED' && (
        <div className="couples-completed">
          <div className="completed-message">
            <h2>{guidance.title}</h2>
            <p>{guidance.text}</p>
            <div className="completed-stats">
              <div className="stat">
                <div className="stat-value">{state.completedSessions}</div>
                <div className="stat-label">Abgeschlossene Sessions</div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={resetSession}
            className="new-session-btn"
          >
            Neue Session starten
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// COUPLE WORLD PAGE (Story Layer)
// ============================================
function CoupleWorld({ onStart }: { onStart: (presetId?: PresetId) => void }) {
  return (
    <div className="couples-timer-page">
      {/* App Bar / Nav */}
      <header className="couples-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <Clock size={20} /> Stoppclock
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <HomeButton showLabel={false} />
        </div>
      </header>

      <div className="couples-world">
        {/* HERO */}
        <section className="ct-section ct-hero">
          <div className="ct-container ct-hero-content">
            <span className="ct-hero-eyebrow">Couple timer</span>
            <h1 className="ct-h1">Small frames for<br />the two of you</h1>
            <p className="ct-tagline">Tiny pockets of time to talk, listen, and breathe together.</p>
            <div className="ct-body" style={{ maxWidth: '600px' }}>
              I'm a gentle timekeeper for two people who share a life. When you start me, I hold a small frame for your voices, your silence, and the things that are easy to postpone.
            </div>
            <div className="ct-hero-actions">
              <button onClick={() => onStart()} className="ct-btn-primary">
                <Play size={18} /> Start couple timer
              </button>
              <button onClick={() => onStart()} className="ct-btn-ghost">Open full-screen</button>
            </div>
          </div>
        </section>

        {/* CHARACTER – The Zwiegespräch Philosophy */}
        <section className="ct-section" style={{ background: 'var(--ct-bg-surface)' }}>
          <div className="ct-container-narrow">
            <h2 className="ct-h2">Character – a quiet frame for the two of you</h2>
            <p className="ct-body">
              Most days, life doesn't shout "Now is a good moment to talk." Messages pop up, someone is late, dishes wait, notifications blink. It's easy for important conversations to stay "for later".
            </p>
            <p className="ct-body">
              I'm here for those small, honest moments between you two. I don't take sides. I don't tell you what to say. I simply hold a little frame of time that belongs to you and no one else.
            </p>
            <p className="ct-body">
              When you start me, you're not promising to solve everything. You're just saying: <em>"For this short moment, we're here. Together. On purpose."</em> I count gently in the background, so you can focus on words, looks, and the small signals that say "I'm still with you."
            </p>

            {/* Research insight box */}
            <div className="ct-insight-box">
              <Info size={20} className="ct-insight-icon" />
              <div>
                <strong>Based on Zwiegespräch</strong>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                  This timer is inspired by the "Zwiegespräch" method developed by psychoanalyst Michael Lukas Moeller. The core idea: speak in turns, not in dialogue. When one person speaks, the other only listens – no interruptions, no comments, no corrections.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE METHOD – Key Principles */}
        <section className="ct-section">
          <div className="ct-container">
            <h2 className="ct-h2" style={{ textAlign: 'center' }}>The method – how structured time helps</h2>
            <div className="ct-principles-grid">
              <div className="ct-principle-card">
                <Wind size={28} className="ct-principle-icon" />
                <h3 className="ct-h3">Speak for yourself</h3>
                <p className="ct-body-sm">
                  Use "I" statements only. Talk about your feelings, your experience, your perspective. No analyzing or interpreting your partner's behavior.
                </p>
              </div>
              <div className="ct-principle-card">
                <Heart size={28} className="ct-principle-icon" />
                <h3 className="ct-h3">Listen without reacting</h3>
                <p className="ct-body-sm">
                  When it's not your turn, you only listen. No questions, no comments, no raised eyebrows. Just receive what your partner shares.
                </p>
              </div>
              <div className="ct-principle-card">
                <Shield size={28} className="ct-principle-icon" />
                <h3 className="ct-h3">Let it sit</h3>
                <p className="ct-body-sm">
                  After the session, don't immediately discuss what was said. Let the words settle. This prevents defensive reactions and allows insight to emerge.
                </p>
              </div>
              <div className="ct-principle-card">
                <Coffee size={28} className="ct-principle-icon" />
                <h3 className="ct-h3">Short and regular</h3>
                <p className="ct-body-sm">
                  A few minutes each day often works better than one long conversation per month. Rituals grow through repetition, not through size.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RITUALS */}
        <section className="ct-section" style={{ background: 'var(--ct-bg-surface)' }}>
          <div className="ct-container">
            <h2 className="ct-h2" style={{ textAlign: 'center' }}>Rituals – ways to be together on purpose</h2>
            <div className="ct-rituals-grid">
              {/* Ritual 1: Tiny Check-in */}
              <div className="ct-ritual-card" onClick={() => onStart('tiny-check-in')}>
                <div className="ct-ritual-badge">~7 min</div>
                <h3 className="ct-h3">Tiny check-in</h3>
                <p className="ct-body" style={{ fontSize: '0.95rem' }}>
                  A small daily space to hear each other properly, even when the day was loud.
                </p>
                <ul className="ct-ritual-steps">
                  <li>3 minutes per person to share</li>
                  <li>The other one only listens – no comments</li>
                  <li>When the bell rings, switch roles</li>
                  <li>End with 1 minute together in silence</li>
                </ul>
                <button className="ct-ritual-cta">
                  <Play size={14} /> Start this ritual
                </button>
              </div>

              {/* Ritual 2: Conflict Cooldown */}
              <div className="ct-ritual-card" onClick={() => onStart('conflict-cooldown')}>
                <div className="ct-ritual-badge">~10 min</div>
                <h3 className="ct-h3">Cool-down pause</h3>
                <p className="ct-body" style={{ fontSize: '0.95rem' }}>
                  When things get heated. A structured pause based on relationship research.
                </p>
                <ul className="ct-ritual-steps">
                  <li>2 min breathing: no talking, just calm down</li>
                  <li>4 min each to speak without interruption</li>
                  <li>The listener only listens – no defense</li>
                  <li>Resume talking after both have been heard</li>
                </ul>
                <button className="ct-ritual-cta">
                  <Play size={14} /> Start this ritual
                </button>
              </div>

              {/* Ritual 3: Screen-free Tea */}
              <div className="ct-ritual-card" onClick={() => onStart('screen-free-tea')}>
                <div className="ct-ritual-badge">15 min</div>
                <h3 className="ct-h3">Screen-free tea</h3>
                <p className="ct-body" style={{ fontSize: '0.95rem' }}>
                  A small island without notifications. Share a drink, a snack, or just presence.
                </p>
                <ul className="ct-ritual-steps">
                  <li>Phones away, screens face-down</li>
                  <li>15 minutes of undivided presence</li>
                  <li>Talk, be silent, or share something small</li>
                  <li>When the bell rings: another round, or back to life</li>
                </ul>
                <button className="ct-ritual-cta">
                  <Play size={14} /> Start this ritual
                </button>
              </div>
            </div>

            {/* Classic Format Link */}
            <div className="ct-classic-link">
              <span>Looking for the full 90-minute Zwiegespräch format?</span>
              <button onClick={() => onStart('klassisch-90')} className="ct-btn-text">
                Open classic session <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* EFFECTS – Research-backed benefits */}
        <section className="ct-section" style={{ background: '#FFF5F5' }}>
          <div className="ct-container">
            <h2 className="ct-h2">Effects – what changes when you give time a frame</h2>
            <div className="ct-effects-split">
              <div>
                <h3 className="ct-h3">Practical effects</h3>
                <ul className="ct-effect-list">
                  <li>Conversations get a clear beginning and end, so they feel easier to start.</li>
                  <li>Both of you get space to speak and space to listen – no talking over each other.</li>
                  <li>The timer becomes a neutral third party: it ends the turn, not you.</li>
                  <li>You can try new communication habits in very small doses.</li>
                </ul>
              </div>
              <div>
                <h3 className="ct-h3">Psychological effects</h3>
                <ul className="ct-effect-list">
                  <li>It can feel safer to talk when you know the intense part won't last forever.</li>
                  <li>Short, regular check-ins often feel lighter than one big "we need to talk".</li>
                  <li>You update your mental image of your partner – reducing assumptions.</li>
                  <li>You build a quiet ritual that says: "We matter to each other."</li>
                </ul>
              </div>
            </div>

            {/* Research callout */}
            <div className="ct-research-callout">
              <h3 className="ct-h3">Why no interruptions matter</h3>
              <p className="ct-body">
                Research by relationship scientist John Gottman shows that how couples argue matters more than whether they argue. Four patterns predict relationship breakdown: criticism, defensiveness, stonewalling, and – most destructive of all – contempt.
              </p>
              <p className="ct-body" style={{ marginBottom: 0 }}>
                Structured speaking time interrupts these patterns. When one person speaks and the other only listens, there's no space for the automatic attack-defend cycle. Both partners' realities can coexist without immediate judgment.
              </p>
            </div>

            <div className="ct-experiment-block">
              <h3 className="ct-h3">A small experiment</h3>
              <p className="ct-body" style={{ marginBottom: 0 }}>
                Try this for one week: one tiny check-in each day (just 3–5 minutes). At the end of the week, ask yourselves: Did anything feel different – in how you talk, or how tense your evenings feel?
              </p>
            </div>
          </div>
        </section>

        {/* TIME FACTS */}
        <section className="ct-section">
          <div className="ct-container">
            <h2 className="ct-h2" style={{ textAlign: 'center' }}>Time facts – small truths about shared minutes</h2>
            <div className="ct-facts-grid">
              <div className="ct-fact-plaque">
                <span className="ct-fact-label">Everyday life</span>
                <p className="ct-body" style={{ fontSize: '0.95rem', margin: 0 }}>
                  Many couples say they "don't have time" to talk – but often it's more that time is unframed. A few minutes with a clear start and end can feel very different from "some time later".
                </p>
              </div>
              <div className="ct-fact-plaque">
                <span className="ct-fact-label">The 20-minute rule</span>
                <p className="ct-body" style={{ fontSize: '0.95rem', margin: 0 }}>
                  When emotions run high, it takes about 20 minutes for stress hormones to clear your system. That's why a proper timeout works – your brain needs time to come back online.
                </p>
              </div>
              <div className="ct-fact-plaque">
                <span className="ct-fact-label">Silence counts too</span>
                <p className="ct-body" style={{ fontSize: '0.95rem', margin: 0 }}>
                  Shared silence can also be quality time. A timer that holds the boundary can help both of you stay in that quiet space without rushing back to tasks.
                </p>
              </div>
              <div className="ct-fact-plaque">
                <span className="ct-fact-label">Two truths</span>
                <p className="ct-body" style={{ fontSize: '0.95rem', margin: 0 }}>
                  In every relationship, two subjective realities coexist. Structured conversation helps you accept this: listening doesn't mean agreeing, just acknowledging.
                </p>
              </div>
            </div>
            <div className="ct-footer-note">
              This is not a replacement for professional support. If you feel unsafe in your relationship, please reach out for help.
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="ct-section ct-final-cta">
          <div className="ct-container" style={{ textAlign: 'center' }}>
            <h2 className="ct-h2">Ready to try?</h2>
            <p className="ct-tagline" style={{ marginBottom: '2rem' }}>
              Start with a tiny check-in. Just 7 minutes.
            </p>
            <button onClick={() => onStart('tiny-check-in')} className="ct-btn-primary ct-btn-large">
              <Play size={20} /> Start couple timer
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

// ============================================
// MAIN EXPORT (Wrapper)
// ============================================
export default function CouplesTimer() {
  const [mode, setMode] = useState<'world' | 'player'>('world');
  const [selectedPresetId, setSelectedPresetId] = useState<PresetId | undefined>(undefined);

  // Check for active session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('sc.v1.couples');
      if (raw) {
        const state = JSON.parse(raw);
        // If explicitly running or inside a session phase, auto-open player
        if (state.running || (state.phase && state.phase !== 'SETUP' && state.phase !== 'COMPLETED')) {
          setMode('player');
        }
      }
    } catch { }
  }, []);

  const handleStartFromWorld = (presetId?: PresetId) => {
    setSelectedPresetId(presetId);
    setMode('player');
  };

  if (mode === 'player') {
    return (
      <CoupleTimerPlayer
        onExit={() => {
          setSelectedPresetId(undefined);
          setMode('world');
        }}
        initialPresetId={selectedPresetId}
      />
    );
  }

  return <CoupleWorld onStart={handleStartFromWorld} />;
}
