import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { HomeButton } from '../components/HomeButton';
import { SESSION_PRESETS, PHASE_GUIDANCE, getPresetById } from '../config/couples-presets';
import type {
  CouplesTimerState,
  CoupleProfile,
  SessionPreset,
  SessionPhase,
  PresetId
} from '../types/timer-types';
import '../styles/couples-timer.css';

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

export default function CouplesTimer() {
  const [state, setState] = useState<CouplesTimerState>(loadState);
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
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen?.().catch(() => {});
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
        <HomeButton />
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
                    Nach jedem 10-Minuten-Timebox startet automatisch eine stille Übergabe-Phase.
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
