/**
 * Custom Sessions - Landing Page
 * Shows list of saved sessions and templates
 */

import React, { useRef } from 'react';
import { HomeButton } from '../components/HomeButton';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { formatDuration, listPresets, validateSession } from '../utils/session-helpers';
import type { CustomSession } from '../types/custom-session-types';

export default function CustomSessionsLanding() {
  const { sessions, templates, createSession, deleteSession } = useSessionStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handlePreviewSession = (sessionId: string) => {
    window.location.hash = `#/custom-sessions/preview/${sessionId}`;
  };

  const handlePreviewPreset = (presetId: string) => {
    // Create temporary session from preset for preview
    const { createPresetSession } = require('../utils/session-helpers');
    const preset = createPresetSession(presetId);
    if (preset) {
      // Save temporarily and preview
      createSession(preset);
      window.location.hash = `#/custom-sessions/preview/${preset.id}`;
    }
  };

  // Export/Import handlers
  const handleExportAll = () => {
    const data = {
      version: 1,
      exportedAt: Date.now(),
      sessions: sessions,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stoppclock-sessions-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSession = (session: CustomSession) => {
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Check if it's a bulk export or single session
        if (data.sessions && Array.isArray(data.sessions)) {
          // Bulk import
          let imported = 0;
          let skipped = 0;

          data.sessions.forEach((session: CustomSession) => {
            const validation = validateSession(session);
            if (validation.valid) {
              // Generate new ID to avoid conflicts
              const newSession = { ...session, id: crypto.randomUUID(), updatedAt: Date.now() };
              createSession(newSession);
              imported++;
            } else {
              skipped++;
            }
          });

          alert(`Import complete!\n✓ Imported: ${imported}\n✗ Skipped: ${skipped}`);
        } else {
          // Single session import
          const validation = validateSession(data);
          if (validation.valid) {
            const newSession = { ...data, id: crypto.randomUUID(), updatedAt: Date.now() };
            createSession(newSession);
            alert('Session imported successfully!');
          } else {
            alert('Invalid session file:\n' + validation.errors.map(e => e.message).join('\n'));
          }
        }
      } catch (error) {
        alert('Failed to import: Invalid JSON file');
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  const handleDeleteSession = (sessionId: string, sessionName: string) => {
    const confirmed = window.confirm(`Delete "${sessionName}"?`);
    if (confirmed) {
      deleteSession(sessionId);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b1220', color: '#fff', padding: '2rem' }}>
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <header style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Custom Sessions</h1>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={handleImport}
              style={{
                padding: '0.5rem 1rem',
                background: '#2196F3',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              📥 Import
            </button>
            <button
              onClick={handleExportAll}
              disabled={sessions.length === 0}
              style={{
                padding: '0.5rem 1rem',
                background: sessions.length === 0 ? '#708090' : '#2196F3',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: sessions.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                opacity: sessions.length === 0 ? 0.5 : 1,
              }}
            >
              📤 Export All
            </button>
            <HomeButton />
          </div>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ color: '#708090', fontSize: '0.875rem' }}>{preset.duration}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handlePreviewPreset(preset.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'transparent',
                          color: '#FFD700',
                          border: '1px solid #FFD700',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        👁 Preview
                      </button>
                      <button
                        onClick={() => handleUsePreset(preset.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#2196F3',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        Use Template
                      </button>
                    </div>
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
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                    <button
                      onClick={() => handlePreviewSession(session.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'transparent',
                        color: '#FFD700',
                        border: '1px solid #FFD700',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      👁 Preview
                    </button>
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
                      onClick={() => handleExportSession(session)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'transparent',
                        color: '#2196F3',
                        border: '1px solid #2196F3',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Export
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id, session.name)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'transparent',
                        color: '#DC143C',
                        border: '1px solid #DC143C',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
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
