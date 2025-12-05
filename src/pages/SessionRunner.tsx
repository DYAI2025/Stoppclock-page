/**
 * Custom Sessions - Session Runner (Focus View)
 * Live timer display for running custom sessions
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { HomeButton } from '../components/HomeButton';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { useStorageSync } from '../hooks/useStorageSync';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import type { CustomSession, SessionRuntimeState, SessionPhase } from '../types/custom-session-types';
import { STORAGE_KEYS, ELEMENT_COLORS, ELEMENT_TYPE_LABELS } from '../types/custom-session-types';
import { formatTime, calculateTotalDuration, calculateElapsedTime } from '../utils/session-helpers';

export default function SessionRunner() {
  // Parse sessionId from URL hash (#/custom-sessions/run/:id)
  const sessionId = window.location.hash.split('/').pop() || '';

  const { getSession } = useSessionStorage();
  const [session, setSession] = useState<CustomSession | null>(null);

  // Runtime state (persisted to survive page reloads)
  const [runtime, setRuntime] = useStorageSync<SessionRuntimeState | null>(
    STORAGE_KEYS.RUNTIME,
    null
  );

  const rafIdRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Load session on mount
  useEffect(() => {
    const loadedSession = getSession(sessionId);
    if (loadedSession) {
      setSession(loadedSession);

      // Initialize runtime state if not already running
      if (!runtime || runtime.sessionId !== sessionId) {
        const totalDurationMs = calculateTotalDuration(loadedSession.elements);
        setRuntime({
          sessionId,
          currentElementIndex: 0,
          remainingMs: loadedSession.elements[0]?.durationMs || 0,
          running: false,
          startedAt: null,
          phase: 'IDLE',
          completedElements: 0,
          totalDurationMs,
          version: 1,
        });
      }
    } else {
      // Session not found - redirect to landing page
      window.location.hash = '#/custom-sessions';
    }
  }, [sessionId, getSession]);

  // ============================================================================
  // Audio Cues
  // ============================================================================

  const playBellTone = useCallback((frequency: number, duration: number = 200) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  }, []);

  const playHighTone = useCallback(() => playBellTone(660, 200), [playBellTone]); // E5
  const playLowTone = useCallback(() => playBellTone(196, 300), [playBellTone]); // G3

  // ============================================================================
  // Timer Engine (RAF-based, drift-resistant)
  // ============================================================================

  const tick = useCallback(() => {
    if (!runtime || !session) return;

    const now = Date.now();
    const elapsed = runtime.startedAt ? now - runtime.startedAt : 0;
    const currentElement = session.elements[runtime.currentElementIndex];

    if (!currentElement) {
      // No more elements - session complete
      setRuntime({
        ...runtime,
        running: false,
        phase: 'COMPLETED',
        startedAt: null,
      });
      playHighTone();
      return;
    }

    const newRemainingMs = Math.max(0, currentElement.durationMs - elapsed);

    if (newRemainingMs === 0) {
      // Current element finished - advance to next
      const nextIndex = runtime.currentElementIndex + 1;

      if (nextIndex >= session.elements.length) {
        // Session complete
        setRuntime({
          ...runtime,
          running: false,
          phase: 'COMPLETED',
          completedElements: session.elements.length,
          currentElementIndex: nextIndex - 1,
          remainingMs: 0,
          startedAt: null,
        });
        playHighTone();
        return;
      }

      // Advance to next element
      playLowTone();
      setRuntime({
        ...runtime,
        currentElementIndex: nextIndex,
        remainingMs: session.elements[nextIndex].durationMs,
        completedElements: nextIndex,
        startedAt: Date.now(),
      });
    } else {
      // Update remaining time
      setRuntime({
        ...runtime,
        remainingMs: newRemainingMs,
      });
    }

    // Continue RAF loop
    rafIdRef.current = requestAnimationFrame(tick);
  }, [runtime, session, setRuntime, playHighTone, playLowTone]);

  // Start/stop RAF loop based on running state
  useEffect(() => {
    if (runtime?.running) {
      rafIdRef.current = requestAnimationFrame(tick);
    } else {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    }

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [runtime?.running, tick]);

  // ============================================================================
  // Control Actions
  // ============================================================================

  const handleStartPause = useCallback(() => {
    if (!runtime) return;

    if (runtime.phase === 'IDLE' || runtime.phase === 'PAUSED') {
      // Start or resume
      setRuntime({
        ...runtime,
        running: true,
        phase: 'RUNNING',
        startedAt: Date.now(),
      });
      playHighTone();
    } else if (runtime.phase === 'RUNNING') {
      // Pause
      setRuntime({
        ...runtime,
        running: false,
        phase: 'PAUSED',
        startedAt: null,
      });
    }
  }, [runtime, setRuntime, playHighTone]);

  const handleNext = useCallback(() => {
    if (!runtime || !session) return;

    const nextIndex = runtime.currentElementIndex + 1;

    if (nextIndex >= session.elements.length) {
      // Already at last element - complete session
      setRuntime({
        ...runtime,
        running: false,
        phase: 'COMPLETED',
        completedElements: session.elements.length,
        remainingMs: 0,
        startedAt: null,
      });
      playHighTone();
    } else {
      // Advance to next element
      playLowTone();
      setRuntime({
        ...runtime,
        currentElementIndex: nextIndex,
        remainingMs: session.elements[nextIndex].durationMs,
        completedElements: nextIndex,
        startedAt: runtime.running ? Date.now() : null,
      });
    }
  }, [runtime, session, setRuntime, playHighTone, playLowTone]);

  const handleReset = useCallback(() => {
    if (!session) return;

    const confirmed = window.confirm('Reset session to beginning?');
    if (confirmed) {
      setRuntime({
        sessionId,
        currentElementIndex: 0,
        remainingMs: session.elements[0]?.durationMs || 0,
        running: false,
        startedAt: null,
        phase: 'IDLE',
        completedElements: 0,
        totalDurationMs: calculateTotalDuration(session.elements),
        version: 1,
      });
    }
  }, [session, sessionId, setRuntime]);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  // ============================================================================
  // Keyboard Shortcuts
  // ============================================================================

  useKeyboardShortcuts({
    onStartPause: handleStartPause,
    onReset: handleReset,
    onFullscreen: handleFullscreen,
  });

  // ============================================================================
  // Render Helpers
  // ============================================================================

  if (!session || !runtime) {
    return (
      <div style={{ minHeight: '100vh', background: '#0b1220', color: '#fff', padding: '2rem' }}>
        <p>Loading session...</p>
      </div>
    );
  }

  const currentElement = session.elements[runtime.currentElementIndex];
  const progress = runtime.totalDurationMs > 0
    ? ((runtime.totalDurationMs - calculateElapsedTime(session.elements, runtime.currentElementIndex, runtime.remainingMs)) / runtime.totalDurationMs) * 100
    : 0;

  // Timer color warnings
  let timerColor = '#FFFFFF'; // White
  if (runtime.remainingMs <= 10000) {
    timerColor = '#DC143C'; // Red (last 10 seconds)
  } else if (runtime.remainingMs <= 60000) {
    timerColor = '#FFD700'; // Yellow (last 60 seconds)
  }

  // ============================================================================
  // Completion Screen
  // ============================================================================

  if (runtime.phase === 'COMPLETED') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0b1220',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#4CAF50' }}>
            ✓ Session Complete
          </h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#A0A0A0' }}>
            {session.name}
          </p>
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              <strong>Total Duration:</strong> {formatTime(runtime.totalDurationMs)}
            </div>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              <strong>Elements Completed:</strong> {runtime.completedElements} / {session.elements.length}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleReset}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                background: '#2196F3',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Run Again
            </button>
            <button
              onClick={() => window.location.hash = '#/custom-sessions'}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                background: 'transparent',
                color: '#00D9FF',
                border: '1px solid #00D9FF',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Back to Sessions
            </button>
            <HomeButton />
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // Main Focus View
  // ============================================================================

  return (
    <div
      role="application"
      aria-label={`Custom Session: ${session.name}`}
      style={{
        minHeight: '100vh',
        background: '#0b1220',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header with Progress & Phase Info */}
      <header
        style={{
          background: '#1a2332',
          padding: '1rem 2rem',
          borderBottom: `4px solid ${currentElement ? ELEMENT_COLORS[currentElement.type] : '#708090'}`,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Session Name & Element Counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{session.name}</h1>
            <span style={{ fontSize: '1rem', color: '#A0A0A0' }}>
              Element {runtime.currentElementIndex + 1} / {session.elements.length}
            </span>
          </div>

          {/* Phase Title (if element has custom name) */}
          {currentElement?.name && (
            <div style={{ marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontSize: '1.125rem',
                  color: ELEMENT_COLORS[currentElement.type],
                  fontWeight: 'bold',
                }}
              >
                {currentElement.name}
              </span>
            </div>
          )}

          {/* Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '8px',
              background: '#708090',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: currentElement ? ELEMENT_COLORS[currentElement.type] : '#4CAF50',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </header>

      {/* Focus Zone */}
      <main
        role="main"
        aria-label="Timer focus area"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        {/* Element Type Label */}
        {currentElement && (
          <div
            style={{
              fontSize: '1.5rem',
              color: ELEMENT_COLORS[currentElement.type],
              marginBottom: '2rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            {ELEMENT_TYPE_LABELS[currentElement.type]}
          </div>
        )}

        {/* Timer Display */}
        <div
          role="timer"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Time remaining: ${formatTime(runtime.remainingMs)}`}
          style={{
            fontSize: 'clamp(4rem, 15vw, 8rem)',
            fontWeight: 'bold',
            color: timerColor,
            marginBottom: '2rem',
            fontFamily: 'monospace',
            transition: 'color 0.3s ease',
          }}
        >
          {formatTime(runtime.remainingMs)}
        </div>

        {/* Focus Text */}
        {currentElement && (
          <p
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 4rem)',
              maxWidth: '900px',
              lineHeight: 1.4,
              color: '#fff',
              margin: '0 auto 1rem auto',
            }}
          >
            {currentElement.focusText}
          </p>
        )}

        {/* Phase Guidance */}
        {currentElement && runtime.phase === 'RUNNING' && (
          <div
            style={{
              maxWidth: '700px',
              margin: '0 auto 2rem auto',
              padding: '0.75rem 1.5rem',
              background: `${ELEMENT_COLORS[currentElement.type]}22`,
              border: `1px solid ${ELEMENT_COLORS[currentElement.type]}`,
              borderRadius: '8px',
              fontSize: '1rem',
              color: '#A0A0A0',
              textAlign: 'center',
            }}
          >
            {currentElement.type === 'SPEAK' && '💡 Focus phase - give this your full attention'}
            {currentElement.type === 'TRANSITION' && '⏸️ Transition - prepare for what comes next'}
            {currentElement.type === 'COOLDOWN' && '🧘 Wind down - reflect and release'}
            {currentElement.type === 'CUSTOM' && '✨ Custom phase'}
          </div>
        )}

        {/* Phase Indicator */}
        {runtime.phase === 'PAUSED' && (
          <div
            style={{
              marginTop: '2rem',
              fontSize: '1.5rem',
              color: '#FFD700',
              textTransform: 'uppercase',
            }}
          >
            ⏸ Paused
          </div>
        )}
      </main>

      {/* Controls */}
      <footer
        role="contentinfo"
        aria-label="Timer controls"
        style={{
          background: '#1a2332',
          padding: '1.5rem 2rem',
          borderTop: '1px solid #708090',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={handleStartPause}
            aria-label={runtime.phase === 'IDLE' ? 'Start session' : runtime.running ? 'Pause timer' : 'Resume timer'}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              background: runtime.running ? '#FF9800' : '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              minWidth: '120px',
            }}
          >
            {runtime.phase === 'IDLE' ? 'Start' : runtime.running ? 'Pause' : 'Resume'}
          </button>

          <button
            onClick={handleNext}
            aria-label="Skip to next element"
            style={{
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              background: '#2196F3',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              minWidth: '120px',
            }}
          >
            Next →
          </button>

          <button
            onClick={handleReset}
            aria-label="Reset session to beginning"
            style={{
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              background: 'transparent',
              color: '#DC143C',
              border: '1px solid #DC143C',
              borderRadius: '8px',
              cursor: 'pointer',
              minWidth: '120px',
            }}
          >
            Reset
          </button>

          <button
            onClick={handleFullscreen}
            aria-label="Toggle fullscreen mode"
            style={{
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              background: 'transparent',
              color: '#00D9FF',
              border: '1px solid #00D9FF',
              borderRadius: '8px',
              cursor: 'pointer',
              minWidth: '120px',
            }}
          >
            Fullscreen
          </button>

          <button
            onClick={() => window.location.hash = '#/custom-sessions'}
            aria-label="Exit session and return to sessions list"
            style={{
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              background: 'transparent',
              color: '#708090',
              border: '1px solid #708090',
              borderRadius: '8px',
              cursor: 'pointer',
              minWidth: '120px',
            }}
          >
            Exit
          </button>
        </div>

        {/* Keyboard Hints */}
        <div
          style={{
            marginTop: '1rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#708090',
          }}
        >
          Keyboard: <kbd>Space</kbd> = Start/Pause • <kbd>R</kbd> = Reset • <kbd>F</kbd> = Fullscreen
        </div>
      </footer>
    </div>
  );
}
