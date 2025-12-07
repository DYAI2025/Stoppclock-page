import React, { useState, useEffect } from 'react';
import { Plus, Play, Edit, Trash2, Download, Upload, Copy } from 'lucide-react';
import { HomeButton } from '../components/HomeButton';
import type { CustomSession, SessionPreset } from '../types/custom-session-types';

const LS_KEY = 'sc.v1.custom-sessions';
const LS_PRESETS_KEY = 'sc.v1.custom-session-presets';

// Default presets
const DEFAULT_PRESETS: SessionPreset[] = [
  {
    id: 'preset-pomodoro',
    name: 'Pomodoro Focus',
    description: '4 work sessions with breaks',
    category: 'Focus',
    elements: [
      { type: 'work', durationMs: 25 * 60 * 1000, focusText: 'Focus Work', phaseName: 'Work 1', sound: 'beep' },
      { type: 'break', durationMs: 5 * 60 * 1000, focusText: 'Short Break', phaseName: 'Break 1', sound: 'chime' },
      { type: 'work', durationMs: 25 * 60 * 1000, focusText: 'Focus Work', phaseName: 'Work 2', sound: 'beep' },
      { type: 'break', durationMs: 5 * 60 * 1000, focusText: 'Short Break', phaseName: 'Break 2', sound: 'chime' },
      { type: 'work', durationMs: 25 * 60 * 1000, focusText: 'Focus Work', phaseName: 'Work 3', sound: 'beep' },
      { type: 'break', durationMs: 5 * 60 * 1000, focusText: 'Short Break', phaseName: 'Break 3', sound: 'chime' },
      { type: 'work', durationMs: 25 * 60 * 1000, focusText: 'Focus Work', phaseName: 'Work 4', sound: 'beep' },
      { type: 'break', durationMs: 15 * 60 * 1000, focusText: 'Long Break', phaseName: 'Long Break', sound: 'bell' },
    ]
  },
  {
    id: 'preset-study',
    name: 'Study Session',
    description: '2 long study blocks with breaks',
    category: 'Learning',
    elements: [
      { type: 'work', durationMs: 45 * 60 * 1000, focusText: 'Study Block', phaseName: 'Study 1', sound: 'beep' },
      { type: 'break', durationMs: 10 * 60 * 1000, focusText: 'Break', phaseName: 'Break 1', sound: 'chime' },
      { type: 'work', durationMs: 45 * 60 * 1000, focusText: 'Study Block', phaseName: 'Study 2', sound: 'beep' },
      { type: 'break', durationMs: 15 * 60 * 1000, focusText: 'Long Break', phaseName: 'Long Break', sound: 'bell' },
    ]
  },
  {
    id: 'preset-workout',
    name: 'Workout Timer',
    description: 'HIIT workout intervals',
    category: 'Fitness',
    elements: [
      { type: 'custom', durationMs: 5 * 60 * 1000, focusText: 'Warm Up', phaseName: 'Warm Up', sound: 'chime' },
      { type: 'work', durationMs: 30 * 1000, focusText: 'High Intensity', phaseName: 'Work 1', sound: 'beep' },
      { type: 'break', durationMs: 15 * 1000, focusText: 'Rest', phaseName: 'Rest 1', sound: 'chime' },
      { type: 'work', durationMs: 30 * 1000, focusText: 'High Intensity', phaseName: 'Work 2', sound: 'beep' },
      { type: 'break', durationMs: 15 * 1000, focusText: 'Rest', phaseName: 'Rest 2', sound: 'chime' },
      { type: 'work', durationMs: 30 * 1000, focusText: 'High Intensity', phaseName: 'Work 3', sound: 'beep' },
      { type: 'break', durationMs: 15 * 1000, focusText: 'Rest', phaseName: 'Rest 3', sound: 'chime' },
      { type: 'custom', durationMs: 3 * 60 * 1000, focusText: 'Cool Down', phaseName: 'Cool Down', sound: 'bell' },
    ]
  }
];

function loadSessions(): CustomSession[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveSessions(sessions: CustomSession[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(sessions));
  } catch {
    // Silently fail
  }
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default function CustomSessionsLanding() {
  const [sessions, setSessions] = useState<CustomSession[]>([]);
  const [presets] = useState<SessionPreset[]>(DEFAULT_PRESETS);

  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Delete this session?')) {
      const updated = sessions.filter(s => s.id !== id);
      setSessions(updated);
      saveSessions(updated);
    }
  };

  const handleDuplicate = (session: CustomSession) => {
    const newSession: CustomSession = {
      ...session,
      id: `session-${Date.now()}`,
      name: `${session.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const updated = [...sessions, newSession];
    setSessions(updated);
    saveSessions(updated);
  };

  const handleExport = (session: CustomSession) => {
    const dataStr = JSON.stringify(session, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.name.replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string) as CustomSession;
        imported.id = `session-${Date.now()}`;
        imported.updatedAt = Date.now();
        const updated = [...sessions, imported];
        setSessions(updated);
        saveSessions(updated);
        alert('Session imported successfully!');
      } catch {
        alert('Failed to import session. Invalid file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleUsePreset = (preset: SessionPreset) => {
    window.location.hash = `#/custom-sessions/builder?preset=${preset.id}`;
  };

  const totalDuration = (elements: { durationMs: number }[]) => {
    return elements.reduce((sum, el) => sum + el.durationMs, 0);
  };

  return (
    <div className="custom-sessions-page">
      <header className="cs-header">
        <h1 className="cs-title">Custom Session Timer</h1>
        <HomeButton />
      </header>

      <div className="cs-container">
        {/* Actions */}
        <div className="cs-actions">
          <a href="#/custom-sessions/builder" className="cs-btn cs-btn-primary">
            <Plus size={20} />
            <span>New Session</span>
          </a>
          <label className="cs-btn cs-btn-secondary">
            <Upload size={20} />
            <span>Import</span>
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Saved Sessions */}
        <section className="cs-section">
          <h2 className="cs-section-title">Your Sessions ({sessions.length})</h2>
          {sessions.length === 0 ? (
            <div className="cs-empty">
              <p>No saved sessions yet. Create your first custom timer!</p>
            </div>
          ) : (
            <div className="cs-grid">
              {sessions.map(session => (
                <div key={session.id} className="cs-card">
                  <div className="cs-card-header">
                    <h3 className="cs-card-title">{session.name}</h3>
                    <span className="cs-card-count">{session.elements.length} phases</span>
                  </div>
                  <div className="cs-card-info">
                    <span className="cs-card-duration">{formatDuration(totalDuration(session.elements))}</span>
                  </div>
                  <div className="cs-card-actions">
                    <a href={`#/custom-sessions/run/${session.id}`} className="cs-card-btn cs-card-btn-primary">
                      <Play size={16} />
                      <span>Start</span>
                    </a>
                    <a href={`#/custom-sessions/builder?id=${session.id}`} className="cs-card-btn">
                      <Edit size={16} />
                    </a>
                    <button onClick={() => handleDuplicate(session)} className="cs-card-btn">
                      <Copy size={16} />
                    </button>
                    <button onClick={() => handleExport(session)} className="cs-card-btn">
                      <Download size={16} />
                    </button>
                    <button onClick={() => handleDelete(session.id)} className="cs-card-btn cs-card-btn-danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Presets */}
        <section className="cs-section">
          <h2 className="cs-section-title">Templates</h2>
          <div className="cs-grid">
            {presets.map(preset => (
              <div key={preset.id} className="cs-card cs-card-preset">
                <div className="cs-card-header">
                  <h3 className="cs-card-title">{preset.name}</h3>
                  <span className="cs-card-category">{preset.category}</span>
                </div>
                <p className="cs-card-description">{preset.description}</p>
                <div className="cs-card-info">
                  <span className="cs-card-count">{preset.elements.length} phases</span>
                  <span className="cs-card-duration">{formatDuration(totalDuration(preset.elements))}</span>
                </div>
                <button onClick={() => handleUsePreset(preset)} className="cs-card-btn cs-card-btn-primary">
                  <Plus size={16} />
                  <span>Use Template</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}