import React, { useState, useEffect } from 'react';
import type { TimerPreset } from '../types/preset-types';
import { getAllPresets, deletePreset, updatePreset, incrementUsage } from '../utils/presets';
import { PresetCard } from './PresetCard';
import { PresetSaveModal } from './PresetSaveModal';

export const PresetsSection: React.FC = () => {
  const [presets, setPresets] = useState<TimerPreset[]>([]);
  const [editingPreset, setEditingPreset] = useState<TimerPreset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load presets on mount and when localStorage changes
  useEffect(() => {
    loadPresetsData();

    // Listen for storage events (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sc.v1.presets') {
        loadPresetsData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadPresetsData = () => {
    const loaded = getAllPresets();
    setPresets(loaded);
  };

  const handleStart = (preset: TimerPreset) => {
    try {
      // Map timer type to localStorage key
      const storageKeys: Record<string, string> = {
        pomodoro: 'sc.v1.pomodoro',
        countdown: 'sc.v1.countdown',
        stopwatch: 'sc.v1.stopwatch',
        cooking: 'sc.v1.cooking',
        chess: 'sc.v1.chessclock',
        metronome: 'sc.v1.metronome',
        cycle: 'sc.v1.cycle',
        analog: 'sc.v1.analog'
      };

      const storageKey = storageKeys[preset.type];
      if (!storageKey) {
        console.error('Unknown timer type:', preset.type);
        return;
      }

      // Load current state or create new one
      let timerState: any = { version: 1 };
      try {
        const existing = localStorage.getItem(storageKey);
        if (existing) {
          timerState = JSON.parse(existing);
        }
      } catch {
        timerState = { version: 1 };
      }

      // Merge preset config into timer state
      timerState = {
        ...timerState,
        ...preset.config,
        version: 1
      };

      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(timerState));

      // Increment usage count
      incrementUsage(preset.id);
      loadPresetsData();

      // Navigate to timer page
      const routes: Record<string, string> = {
        pomodoro: '#/pomodoro',
        countdown: '#/countdown',
        stopwatch: '#/stopwatch',
        cooking: '#/cooking',
        chess: '#/chess',
        metronome: '#/metronome',
        cycle: '#/cycle',
        analog: '#/analog'
      };

      window.location.hash = routes[preset.type] || '#/';
    } catch (error) {
      console.error('Failed to start preset:', error);
      alert('Fehler beim Starten des Presets');
    }
  };

  const handleEdit = (preset: TimerPreset) => {
    setEditingPreset(preset);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    try {
      deletePreset(id);
      loadPresetsData();
    } catch (error) {
      console.error('Failed to delete preset:', error);
      alert('Fehler beim Löschen des Presets');
    }
  };

  const handleSaveEdit = (updatedPreset: TimerPreset) => {
    try {
      updatePreset(updatedPreset.id, {
        name: updatedPreset.name,
        icon: updatedPreset.icon,
        config: updatedPreset.config
      });
      loadPresetsData();
      setIsModalOpen(false);
      setEditingPreset(null);
    } catch (error) {
      console.error('Failed to update preset:', error);
      alert(error instanceof Error ? error.message : 'Fehler beim Aktualisieren');
    }
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
    setEditingPreset(null);
  };

  // Don't render section if no presets
  if (presets.length === 0) {
    return null;
  }

  return (
    <>
      <section className="presets-section">
        <div className="presets-header">
          <h2>Meine Presets</h2>
          <p className="presets-subtitle">
            {presets.length} {presets.length === 1 ? 'Preset' : 'Presets'} gespeichert
          </p>
        </div>

        <div className="presets-grid">
          {presets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              onStart={handleStart}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>

      {editingPreset && (
        <PresetSaveModal
          isOpen={isModalOpen}
          mode="edit"
          timerType={editingPreset.type}
          currentConfig={editingPreset.config}
          existingPreset={editingPreset}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </>
  );
};
