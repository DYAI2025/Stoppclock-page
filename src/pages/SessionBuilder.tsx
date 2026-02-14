/**
 * Custom Sessions - Session Builder
 * Create and edit custom sessions
 */

import React, { useState, useEffect } from 'react';
import { HomeButton } from '../components/HomeButton';
import { useSessionStorage } from '../hooks/useSessionStorage';
import type { SessionElement, ElementType, CustomSession, SoundType } from '../types/custom-session-types';
import { ELEMENT_COLORS, ELEMENT_TYPE_LABELS } from '../types/custom-session-types';
import {
  generateUUID,
  formatTime,
  formatDuration,
  validateElement,
  createSession,
  createPresetSession,
  createElementTemplate,
  listElementTemplates,
} from '../utils/session-helpers';
import { getAllSoundTypes, getSoundLabel, playSound } from '../utils/sound-generator';

export default function SessionBuilder() {
  const { getSession, createSession: saveSession, updateSession } = useSessionStorage();

  // Parse URL to get session ID or preset
  const hash = window.location.hash;
  const sessionId = hash.match(/\/builder\/([^?]+)/)?.[1];
  const presetId = new URLSearchParams(hash.split('?')[1] || '').get('preset');

  const [sessionName, setSessionName] = useState('Untitled Session');
  const [elements, setElements] = useState<SessionElement[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state for adding element
  const [formType, setFormType] = useState<ElementType | null>(null);
  const [formMinutes, setFormMinutes] = useState(5);
  const [formSeconds, setFormSeconds] = useState(0);
  const [formText, setFormText] = useState('');
  const [formName, setFormName] = useState(''); // Optional phase name
  const [formSoundType, setFormSoundType] = useState<SoundType>('BELL'); // Default sound
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Load existing session or preset
  useEffect(() => {
    if (sessionId) {
      const session = getSession(sessionId);
      if (session) {
        setSessionName(session.name);
        setElements(session.elements);
      }
    } else if (presetId) {
      const preset = createPresetSession(presetId);
      if (preset) {
        setSessionName(preset.name);
        setElements(preset.elements);
      }
    }
  }, [sessionId, presetId, getSession]);

  const handleAddElement = () => {
    // Validate
    const durationMs = formMinutes * 60 * 1000 + formSeconds * 1000;
    const element: Partial<SessionElement> = {
      type: formType || undefined,
      durationMs,
      focusText: formText,
    };

    const validation = validateElement(element);
    if (!validation.valid) {
      setFormErrors(validation.errors.map(e => e.message));
      return;
    }

    // Add element
    const newElement: SessionElement = {
      id: generateUUID(),
      type: formType!,
      durationMs,
      focusText: formText.trim(),
      ...(formName.trim() && { name: formName.trim() }), // Add name if provided
      soundType: formSoundType, // Add sound type
      createdAt: Date.now(),
    };

    setElements([...elements, newElement]);

    // Reset form
    setFormType(null);
    setFormMinutes(5);
    setFormSeconds(0);
    setFormText('');
    setFormName('');
    setFormSoundType('BELL'); // Reset to default
    setFormErrors([]);
    setShowAddForm(false);
  };

  const handleDeleteElement = (index: number) => {
    setElements(elements.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newElements = [...elements];
    [newElements[index - 1], newElements[index]] = [newElements[index], newElements[index - 1]];
    setElements(newElements);
  };

  const handleMoveDown = (index: number) => {
    if (index === elements.length - 1) return;
    const newElements = [...elements];
    [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
    setElements(newElements);
  };

  const handleSave = () => {
    const session: CustomSession = sessionId
      ? { ...getSession(sessionId)!, name: sessionName, elements, updatedAt: Date.now() }
      : createSession(sessionName, elements);

    if (sessionId) {
      updateSession(sessionId, { name: sessionName, elements });
    } else {
      saveSession(session);
    }

    window.location.hash = '#/custom-sessions';
  };

  const handleStart = () => {
    if (elements.length === 0) {
      alert('Add at least 1 element to start session');
      return;
    }

    // Save first
    const session: CustomSession = sessionId
      ? { ...getSession(sessionId)!, name: sessionName, elements, updatedAt: Date.now() }
      : createSession(sessionName, elements);

    if (sessionId) {
      updateSession(sessionId, { name: sessionName, elements });
      window.location.hash = `#/custom-sessions/run/${sessionId}`;
    } else {
      saveSession(session);
      window.location.hash = `#/custom-sessions/run/${session.id}`;
    }
  };

  const totalDuration = elements.reduce((sum, el) => sum + el.durationMs, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#0b1220', color: '#fff', padding: '2rem' }}>
      <header style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            style={{
              fontSize: '2rem',
              background: 'transparent',
              border: 'none',
              borderBottom: '2px solid #708090',
              color: '#fff',
              outline: 'none',
              padding: '0.25rem 0',
              flex: 1,
              maxWidth: '600px',
            }}
            placeholder="Session name"
          />
          <HomeButton />
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Elements List */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Elements ({elements.length})
          </h2>

          {elements.length === 0 && (
            <div
              style={{
                background: '#1a2332',
                padding: '2rem',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px dashed #708090',
                marginBottom: '1rem',
              }}
            >
              <p style={{ color: '#A0A0A0', margin: 0 }}>No elements yet. Add your first phase!</p>
            </div>
          )}

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
            {elements.map((element, index) => (
              <div
                key={element.id}
                style={{
                  background: '#1a2332',
                  padding: '1rem',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${ELEMENT_COLORS[element.type]}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>{index + 1}.</span>
                    <span style={{ color: ELEMENT_COLORS[element.type] }}>
                      {ELEMENT_TYPE_LABELS[element.type]}
                    </span>
                    <span style={{ color: '#708090' }}>•</span>
                    <span style={{ color: '#708090' }}>{formatTime(element.durationMs)}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#A0A0A0' }}>
                    {element.focusText.length > 100
                      ? element.focusText.substring(0, 100) + '...'
                      : element.focusText}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    style={{
                      padding: '0.5rem',
                      background: 'transparent',
                      color: index === 0 ? '#444' : '#708090',
                      border: '1px solid',
                      borderRadius: '4px',
                      cursor: index === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === elements.length - 1}
                    style={{
                      padding: '0.5rem',
                      background: 'transparent',
                      color: index === elements.length - 1 ? '#444' : '#708090',
                      border: '1px solid',
                      borderRadius: '4px',
                      cursor: index === elements.length - 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleDeleteElement(index)}
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

          {/* Quick Add Templates */}
          {!showAddForm && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#708090', marginBottom: '0.5rem' }}>Quick Add:</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
                {listElementTemplates().map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      const templateData = createElementTemplate(template.id);
                      const newElement: SessionElement = {
                        id: generateUUID(),
                        type: templateData.type || 'SPEAK',
                        durationMs: templateData.durationMs || 5 * 60 * 1000,
                        focusText: templateData.focusText || '',
                        createdAt: Date.now(),
                      };
                      setElements([...elements, newElement]);
                    }}
                    style={{
                      padding: '0.5rem',
                      background: ELEMENT_COLORS[template.type],
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add Element Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                width: '100%',
                padding: '1rem',
                background: '#1a2332',
                color: '#00D9FF',
                border: '2px dashed #00D9FF',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              + Add Custom Element
            </button>
          )}

          {/* Add Element Form */}
          {showAddForm && (
            <div style={{ background: '#1a2332', padding: '1.5rem', borderRadius: '8px', border: '1px solid #708090' }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>Add Element</h3>

              {formErrors.length > 0 && (
                <div
                  style={{
                    background: '#DC143C22',
                    border: '1px solid #DC143C',
                    padding: '1rem',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                  }}
                >
                  {formErrors.map((error, i) => (
                    <div key={i} style={{ color: '#DC143C' }}>⚠️ {error}</div>
                  ))}
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Type:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {(['SPEAK', 'TRANSITION', 'COOLDOWN', 'CUSTOM'] as ElementType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormType(type)}
                      style={{
                        padding: '0.75rem',
                        background: formType === type ? ELEMENT_COLORS[type] : 'transparent',
                        color: formType === type ? '#fff' : ELEMENT_COLORS[type],
                        border: `2px solid ${ELEMENT_COLORS[type]}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      {ELEMENT_TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Duration:</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div>
                    <input
                      type="number"
                      value={formMinutes}
                      onChange={(e) => setFormMinutes(parseInt(e.target.value) || 0)}
                      min={0}
                      max={30}
                      style={{
                        width: '80px',
                        padding: '0.5rem',
                        background: '#0b1220',
                        color: '#fff',
                        border: '1px solid #708090',
                        borderRadius: '4px',
                      }}
                    />
                    <span style={{ marginLeft: '0.5rem' }}>min</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={formSeconds}
                      onChange={(e) => setFormSeconds(parseInt(e.target.value) || 0)}
                      min={0}
                      max={59}
                      step={5}
                      style={{
                        width: '80px',
                        padding: '0.5rem',
                        background: '#0b1220',
                        color: '#fff',
                        border: '1px solid #708090',
                        borderRadius: '4px',
                      }}
                    />
                    <span style={{ marginLeft: '0.5rem' }}>sec</span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Phase Name (optional):
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  maxLength={100}
                  placeholder="e.g., Opening Circle - Round 1 (optional)"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#0b1220',
                    color: '#fff',
                    border: '1px solid #708090',
                    borderRadius: '4px',
                    fontSize: '1rem',
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: '#708090' }}>
                  Displayed in header during session
                </span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Focus Text (1-500 chars):
                </label>
                <textarea
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  maxLength={500}
                  placeholder="Enter instructions that will be shown during this phase..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    background: '#0b1220',
                    color: '#fff',
                    border: '1px solid #708090',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
                <div style={{ fontSize: '0.75rem', color: '#708090', marginTop: '0.25rem' }}>
                  {formText.length}/500 characters
                </div>
              </div>

              {/* Sound Selection */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Completion Sound:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {getAllSoundTypes().map((soundType) => (
                    <button
                      key={soundType}
                      type="button"
                      onClick={() => {
                        setFormSoundType(soundType);
                        playSound(soundType); // Preview sound on click
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        background: formSoundType === soundType ? '#2196F3' : '#1a2332',
                        color: formSoundType === soundType ? '#fff' : '#A0A0A0',
                        border: `1px solid ${formSoundType === soundType ? '#2196F3' : '#708090'}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {getSoundLabel(soundType)}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#708090', marginTop: '0.25rem' }}>
                  Click to preview sound (plays when phase completes)
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormErrors([]);
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    color: '#708090',
                    border: '1px solid #708090',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddElement}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#00D9FF',
                    color: '#0b1220',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  Add Element
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Timeline Preview */}
        {elements.length > 0 && (
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Timeline Preview</h2>
            <div
              style={{
                background: '#1a2332',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #708090',
              }}
            >
              <div style={{ display: 'flex', height: '60px', borderRadius: '4px', overflow: 'hidden' }}>
                {elements.map((element, index) => (
                  <div
                    key={element.id}
                    style={{
                      background: ELEMENT_COLORS[element.type],
                      width: `${(element.durationMs / totalDuration) * 100}%`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      color: '#fff',
                      borderRight: index < elements.length - 1 ? '1px solid #0b1220' : 'none',
                    }}
                    title={`${ELEMENT_TYPE_LABELS[element.type]} (${formatTime(element.durationMs)})`}
                  >
                    {formatTime(element.durationMs)}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem', color: '#708090', fontSize: '0.875rem' }}>
                Total Duration: {formatDuration(totalDuration)} • {elements.length} elements
              </div>
            </div>
          </section>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => (window.location.hash = '#/custom-sessions')}
            style={{
              padding: '1rem 2rem',
              background: 'transparent',
              color: '#708090',
              border: '1px solid #708090',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '1rem 2rem',
              background: '#708090',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Save & Exit
          </button>
          <button
            onClick={handleStart}
            disabled={elements.length === 0}
            style={{
              padding: '1rem 2rem',
              background: elements.length === 0 ? '#444' : '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: elements.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
            }}
          >
            ▶ Start Session
          </button>
        </div>
      </main>
    </div>
  );
}
