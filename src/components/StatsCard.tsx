import React, { useState, useEffect } from 'react';
import { getStatsOverview, formatDuration } from '../utils/stats';
import type { StatsOverview } from '../types/stats-types';

export const StatsCard: React.FC = () => {
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadStatsData();

    // Listen for storage events (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sc.v1.stats') {
        loadStatsData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadStatsData = () => {
    const overview = getStatsOverview();
    setStats(overview);
  };

  if (!stats) return null;

  // Don't show card if no usage yet
  if (stats.allTime.sessions === 0) return null;

  const getTimerLabel = (type: string): string => {
    const labels: Record<string, string> = {
      pomodoro: 'Pomodoro',
      countdown: 'Countdown',
      stopwatch: 'Stopwatch',
      cooking: 'Cooking',
      chess: 'Chess',
      metronome: 'Metronome',
      cycle: 'Cycle',
      analog: 'Analog'
    };
    return labels[type] || type;
  };

  return (
    <div className="stats-card">
      <div className="stats-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="stats-card-title">
          <h3>📊 Deine Statistiken</h3>
          <button
            type="button"
            className="stats-toggle"
            aria-label={expanded ? 'Einklappen' : 'Ausklappen'}
          >
            {expanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {expanded ? (
        <div className="stats-card-body">
          {/* Today Stats */}
          <div className="stats-section">
            <h4>Heute</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{stats.today.sessions}</span>
                <span className="stat-label">Sessions</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{formatDuration(stats.today.timeMs)}</span>
                <span className="stat-label">Fokuszeit</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.today.completedSessions}</span>
                <span className="stat-label">Abgeschlossen</span>
              </div>
            </div>
          </div>

          {/* Week Stats */}
          <div className="stats-section">
            <h4>Diese Woche</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{stats.thisWeek.sessions}</span>
                <span className="stat-label">Sessions</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{formatDuration(stats.thisWeek.timeMs)}</span>
                <span className="stat-label">Gesamtzeit</span>
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="stats-section">
            <h4>🔥 Streak</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value streak-current">{stats.streak.current}</span>
                <span className="stat-label">Aktuell (Tage)</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.streak.longest}</span>
                <span className="stat-label">Rekord (Tage)</span>
              </div>
            </div>
          </div>

          {/* All Time */}
          <div className="stats-section">
            <h4>Insgesamt</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{stats.allTime.sessions}</span>
                <span className="stat-label">Sessions</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{formatDuration(stats.allTime.timeMs)}</span>
                <span className="stat-label">Gesamtzeit</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.allTime.daysActive}</span>
                <span className="stat-label">Aktive Tage</span>
              </div>
            </div>
          </div>

          {/* Favorite Timer */}
          {stats.favoriteTimer && (
            <div className="stats-section">
              <h4>⭐ Lieblings-Timer</h4>
              <div className="favorite-timer">
                <span className="favorite-timer-name">
                  {getTimerLabel(stats.favoriteTimer.type)}
                </span>
                <span className="favorite-timer-count">
                  {stats.favoriteTimer.sessions} Sessions
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="stats-card-summary">
          <div className="stats-summary-item">
            <span className="summary-value">{stats.today.sessions}</span>
            <span className="summary-label">Heute</span>
          </div>
          <div className="stats-summary-item">
            <span className="summary-value">
              {stats.streak.current > 0 ? `🔥 ${stats.streak.current}` : '—'}
            </span>
            <span className="summary-label">Streak</span>
          </div>
          <div className="stats-summary-item">
            <span className="summary-value">{stats.allTime.sessions}</span>
            <span className="summary-label">Total</span>
          </div>
        </div>
      )}
    </div>
  );
};
