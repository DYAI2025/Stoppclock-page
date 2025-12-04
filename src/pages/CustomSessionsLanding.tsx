/**
 * Custom Sessions - Landing Page
 * Shows list of saved sessions and templates
 */

import React from 'react';
import { HomeButton } from '../components/HomeButton';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { formatDuration, listPresets } from '../utils/session-helpers';

export default function CustomSessionsLanding() {
  const { sessions, templates } = useSessionStorage();

  const presets = listPresets();

  const handleNewSession = () => {
    window.location.hash = '#/custom-sessions/builder';
  };

  const handleEditSession = (sessionId: string) => {
    window.location.hash = `#/custom-sessions/builder/${sessionId}`;
  };

  const handleRunSession = (sessionId: string) => {
    window.location.hash = `#/custom-sessions/run/${sessionId}`;
  };

  const handleUsePreset = (presetId: string) => {
    window.location.hash = `#/custom-sessions/builder?preset=${presetId}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b1220', color: '#fff', padding: '2rem' }}>
      <header style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Custom Sessions</h1>
          <HomeButton />
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* New Session Button */}
        <button
          onClick={handleNewSession}
          style={{
            width: '100%',
            padding: '1.5rem',
            fontSize: '1.25rem',
            background: '#00D9FF',
            color: '#0b1220',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '2rem',
            fontWeight: 'bold',
          }}
        >
          + Create New Session
        </button>

        {/* Preset Templates */}
        {presets.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quick Start Templates</h2>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  style={{
                    background: '#1a2332',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    border: '1px solid #708090',
                  }}
                >
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>{preset.name}</h3>
                  <p style={{ margin: '0 0 1rem 0', color: '#A0A0A0', fontSize: '0.875rem' }}>
                    {preset.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#708090', fontSize: '0.875rem' }}>{preset.duration}</span>
                    <button
                      onClick={() => handleUsePreset(preset.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#2196F3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* My Sessions */}
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>My Sessions ({sessions.length})</h2>

          {sessions.length === 0 ? (
            <div
              style={{
                background: '#1a2332',
                padding: '3rem',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px dashed #708090',
              }}
            >
              <p style={{ fontSize: '1.125rem', color: '#A0A0A0', margin: 0 }}>
                No sessions yet. Create your first session!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {sessions.map((session) => (
                <div
                  key={session.id}
                  style={{
                    background: '#1a2332',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    border: '1px solid #708090',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
                      {session.name}
                      {session.isTemplate && (
                        <span
                          style={{
                            marginLeft: '0.5rem',
                            padding: '0.25rem 0.5rem',
                            background: '#2196F3',
                            fontSize: '0.75rem',
                            borderRadius: '4px',
                          }}
                        >
                          Template
                        </span>
                      )}
                    </h3>
                    <div style={{ color: '#708090', fontSize: '0.875rem' }}>
                      {session.elements.length} elements • {formatDuration(
                        session.elements.reduce((sum, el) => sum + el.durationMs, 0)
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEditSession(session.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'transparent',
                        color: '#00D9FF',
                        border: '1px solid #00D9FF',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRunSession(session.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      ▶ Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
