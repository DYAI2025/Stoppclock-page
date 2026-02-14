/**
 * Custom Sessions - Session Preview
 * Preview session without running actual timer
 */

import React, { useState, useEffect } from 'react';
import { HomeButton } from '../components/HomeButton';
import { useSessionStorage } from '../hooks/useSessionStorage';
import type { CustomSession } from '../types/custom-session-types';
import { ELEMENT_COLORS, ELEMENT_TYPE_LABELS } from '../types/custom-session-types';
import { formatTime, calculateTotalDuration } from '../utils/session-helpers';

export default function SessionPreview() {
  // Parse sessionId from URL hash (#/custom-sessions/preview/:id)
  const sessionId = window.location.hash.split('/').pop() || '';

  const { getSession } = useSessionStorage();
  const [session, setSession] = useState<CustomSession | null>(null);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);

  // Load session on mount
  useEffect(() => {
    const loadedSession = getSession(sessionId);
    if (loadedSession) {
      setSession(loadedSession);
    } else {
      // Session not found - redirect to landing page
      window.location.hash = '#/custom-sessions';
    }
  }, [sessionId, getSession]);

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: '#0b1220', color: '#fff', padding: '2rem' }}>
        <p>Loading session...</p>
      </div>
    );
  }

  const currentElement = session.elements[currentElementIndex];
  const totalDurationMs = calculateTotalDuration(session.elements);

  const handlePrevious = () => {
    if (currentElementIndex > 0) {
      setCurrentElementIndex(currentElementIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentElementIndex < session.elements.length - 1) {
      setCurrentElementIndex(currentElementIndex + 1);
    }
  };

  const handleStartSession = () => {
    window.location.hash = `#/custom-sessions/run/${sessionId}`;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b1220',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header with Preview Badge */}
      <header
        style={{
          background: '#1a2332',
          padding: '1rem 2rem',
          borderBottom: `4px solid ${currentElement ? ELEMENT_COLORS[currentElement.type] : '#708090'}`,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{session.name}</h1>
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  background: '#FFD700',
                  color: '#0b1220',
                  fontSize: '0.875rem',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                }}
              >
                PREVIEW MODE
              </span>
            </div>
            <span style={{ fontSize: '1rem', color: '#A0A0A0' }}>
              Element {currentElementIndex + 1} / {session.elements.length}
            </span>
          </div>

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
                width: `${((currentElementIndex + 1) / session.elements.length) * 100}%`,
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

        {/* Static Timer Display */}
        <div
          style={{
            fontSize: 'clamp(4rem, 15vw, 8rem)',
            fontWeight: 'bold',
            color: '#708090',
            marginBottom: '2rem',
            fontFamily: 'monospace',
          }}
        >
          {currentElement ? formatTime(currentElement.durationMs) : '00:00'}
        </div>

        {/* Focus Text */}
        {currentElement && (
          <p
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 4rem)',
              maxWidth: '900px',
              lineHeight: 1.4,
              color: '#fff',
              margin: '0 auto 2rem auto',
            }}
          >
            {currentElement.focusText}
          </p>
        )}

        {/* Preview Instructions */}
        <div
          style={{
            background: '#1a233244',
            padding: '1rem 2rem',
            borderRadius: '8px',
            border: '1px dashed #708090',
            maxWidth: '600px',
          }}
        >
          <p style={{ margin: 0, color: '#A0A0A0', fontSize: '1rem' }}>
            📝 This is a preview. Use ← → buttons to navigate elements. Click "Start Session" to begin the actual timer.
          </p>
        </div>
      </main>

      {/* Navigation Controls */}
      <footer
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
            onClick={handlePrevious}
            disabled={currentElementIndex === 0}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              background: currentElementIndex === 0 ? '#708090' : '#2196F3',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: currentElementIndex === 0 ? 'not-allowed' : 'pointer',
              minWidth: '140px',
              opacity: currentElementIndex === 0 ? 0.5 : 1,
            }}
          >
            ← Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentElementIndex >= session.elements.length - 1}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              background: currentElementIndex >= session.elements.length - 1 ? '#708090' : '#2196F3',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: currentElementIndex >= session.elements.length - 1 ? 'not-allowed' : 'pointer',
              minWidth: '140px',
              opacity: currentElementIndex >= session.elements.length - 1 ? 0.5 : 1,
            }}
          >
            Next →
          </button>

          <button
            onClick={handleStartSession}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              minWidth: '180px',
            }}
          >
            ▶ Start Full Session
          </button>

          <button
            onClick={() => window.location.hash = '#/custom-sessions'}
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

        {/* Session Summary */}
        <div
          style={{
            marginTop: '1rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#708090',
          }}
        >
          Total Duration: {formatTime(totalDurationMs)} • {session.elements.length} Elements
        </div>
      </footer>
    </div>
  );
}
