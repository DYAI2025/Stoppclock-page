import React, { useState, useEffect, useCallback, useRef } from "react";
import { HomeButton } from "../components/HomeButton";
import { HISTORICAL_EVENTS, CATEGORY_NAMES, getEventById } from "../config/historical-events";
import type { TimeSinceState, HistoricalEvent, ParticleEffect } from "../types/timer-types";
import "../styles/timesince-swiss.css";
import "../styles/timesince-creative.css";

const LS_KEY = "sc.v1.timesince";

function load(): TimeSinceState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw new Error("No saved state");
    const state = JSON.parse(raw) as TimeSinceState;
    return {
      version: 1,
      selectedEventId: state.selectedEventId ?? null,
      customEventDate: state.customEventDate ?? null,
      customEventName: state.customEventName ?? null,
      running: !!state.running,
    };
  } catch {
    return {
      version: 1,
      selectedEventId: null,
      customEventDate: null,
      customEventName: null,
      running: false,
    };
  }
}

function save(state: TimeSinceState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // Silently fail
  }
}

interface TimeBreakdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isSymbolic?: boolean; // Flag for events with symbolic years
}

function calculateTimeSince(targetDate: Date, symbolicYearsAgo?: number): TimeBreakdown {
  const now = new Date();
  const diff = now.getTime() - targetDate.getTime();

  // For symbolic events (like Big Bang), use the provided years
  // but calculate months/days/hours/minutes/seconds based on current time
  if (symbolicYearsAgo !== undefined) {
    // For symbolic dates, we show the months/days/hours based on current year progress
    // This gives the satisfying precision feel even for cosmic events
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const yearProgress = now.getTime() - startOfYear.getTime();

    const totalSeconds = Math.floor(yearProgress / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const months = Math.floor(totalDays / 30.44);
    const days = Math.floor(totalDays - (months * 30.44));

    return {
      years: symbolicYearsAgo,
      months,
      days,
      hours: totalHours % 24,
      minutes: totalMinutes % 60,
      seconds: totalSeconds % 60,
      isSymbolic: true,
    };
  }

  if (diff < 0) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  // Approximate years and months
  const years = Math.floor(totalDays / 365.25);
  const remainingDaysAfterYears = totalDays - Math.floor(years * 365.25);
  const months = Math.floor(remainingDaysAfterYears / 30.44);
  const days = Math.max(0, Math.floor(remainingDaysAfterYears - (months * 30.44)));

  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  return { years, months, days, hours, minutes, seconds };
}

// Format large year numbers nicely (e.g., "13.8 billion")
function formatYears(years: number): string {
  if (years >= 1_000_000_000) {
    const billions = years / 1_000_000_000;
    return `${billions.toFixed(1)} billion`;
  }
  if (years >= 1_000_000) {
    const millions = years / 1_000_000;
    return `${millions.toFixed(1)} million`;
  }
  return years.toLocaleString();
}

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

// Particle effect component
function ParticleLayer({ effect }: { effect?: ParticleEffect }) {
  if (!effect || effect === 'none') return null;

  return <div className={`timesince-particles-${effect}`} aria-hidden="true" />;
}

// Ambient gradient layer
function AmbientLayer({ gradient, visible }: { gradient?: string; visible: boolean }) {
  return (
    <div
      className={`timesince-ambient-layer ${visible ? 'visible' : ''}`}
      style={{ background: gradient || 'transparent' }}
      aria-hidden="true"
    />
  );
}

export default function TimeSince() {
  const [state, setState] = useState<TimeSinceState>(load);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const [showEventSelector, setShowEventSelector] = useState(!state.selectedEventId);
  const [showFact, setShowFact] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => save(state), 150);
    return () => clearTimeout(t);
  }, [state]);

  // Update every second when running
  useRaf(state.running, () => {
    forceUpdate();
  });

  // Reset fact visibility when event changes
  useEffect(() => {
    setShowFact(false);
    if (state.selectedEventId) {
      const timer = setTimeout(() => setShowFact(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [state.selectedEventId]);

  const currentEvent = state.selectedEventId
    ? getEventById(state.selectedEventId)
    : null;

  const targetDate = currentEvent
    ? currentEvent.date
    : state.customEventDate
      ? new Date(state.customEventDate)
      : null;

  const timeBreakdown = targetDate
    ? calculateTimeSince(targetDate, currentEvent?.symbolicYearsAgo)
    : null;

  // Get visual theme properties
  const visualTheme = currentEvent?.visualTheme;
  const fontStyleClass = visualTheme?.fontStyle ? `font-style-${visualTheme.fontStyle}` : '';

  const selectEvent = useCallback((event: HistoricalEvent) => {
    setState({
      version: 1,
      selectedEventId: event.id,
      customEventDate: null,
      customEventName: null,
      running: true,
    });
    setShowEventSelector(false);
  }, []);

  const reset = useCallback(() => {
    setState({
      version: 1,
      selectedEventId: null,
      customEventDate: null,
      customEventName: null,
      running: false,
    });
    setShowEventSelector(true);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    } else {
      el.requestFullscreen?.().catch(() => { });
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        reset();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "Escape" && state.running) {
        setShowEventSelector(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.running, reset, toggleFullscreen]);

  // Group events by category
  const eventsByCategory = React.useMemo(() => {
    const groups: Record<string, HistoricalEvent[]> = {};
    HISTORICAL_EVENTS.forEach(event => {
      if (!groups[event.category]) {
        groups[event.category] = [];
      }
      groups[event.category].push(event);
    });
    return groups;
  }, []);

  return (
    <div className={`timesince-page ${fontStyleClass}`} ref={wrapRef}>
      {/* Ambient background layer */}
      <AmbientLayer
        gradient={visualTheme?.ambientGradient}
        visible={!showEventSelector && !!currentEvent}
      />

      {/* Particle effects layer */}
      {!showEventSelector && currentEvent && (
        <ParticleLayer effect={visualTheme?.particleEffect} />
      )}

      {/* Content layer */}
      <div className="timesince-content-layer">
        {/* Header */}
        <header className="timesince-header">
          <h1 className="timesince-title">Time Since</h1>
          <HomeButton />
        </header>

        {showEventSelector ? (
          /* Event Selector */
          <div className="timesince-selector">
            <div className="timesince-selector-intro">
              <h2>Choose a Historic Moment</h2>
              <p>Watch time flow from events that shaped our world</p>
            </div>

            <div className="timesince-categories">
              {Object.entries(eventsByCategory).map(([category, events]) => (
                <div key={category} className="timesince-category">
                  <h3 className="timesince-category-title">
                    {CATEGORY_NAMES[category as HistoricalEvent['category']]}
                  </h3>
                  <div className="timesince-events-grid">
                    {events.map(event => (
                      <button
                        key={event.id}
                        className="timesince-event-btn"
                        style={{
                          '--event-color': event.color,
                        } as React.CSSProperties}
                        onClick={() => selectEvent(event)}
                      >
                        {event.visualTheme?.icon && (
                          <span className="timesince-event-icon">{event.visualTheme.icon}</span>
                        )}
                        <span className="timesince-event-name">{event.name}</span>
                        <span className="timesince-event-desc">{event.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Time Display */
          <div className="timesince-display">
            {currentEvent && (
              <div
                className="timesince-event-banner themed"
                style={{
                  '--event-color': currentEvent.color,
                  '--event-glow': visualTheme?.accentGlow || 'rgba(0, 217, 255, 0.3)',
                } as React.CSSProperties}
              >
                <div className="timesince-event-info">
                  {visualTheme?.icon && (
                    <span className="timesince-banner-icon">{visualTheme.icon}</span>
                  )}
                  <h2 className="timesince-event-title">{currentEvent.name}</h2>
                  <p className="timesince-event-description">{currentEvent.description}</p>
                  <p className="timesince-event-date">
                    {currentEvent.isSymbolic
                      ? "≈ Symbolic / approximate date"
                      : currentEvent.date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                  </p>
                </div>
              </div>
            )}

            {timeBreakdown && (
              <div className="timesince-grid">
                <div className={`timesince-unit ${timeBreakdown.isSymbolic ? 'symbolic' : ''}`}>
                  <div className="timesince-number">{formatYears(timeBreakdown.years)}</div>
                  <div className="timesince-label">Years</div>
                </div>
                <div className="timesince-unit">
                  <div className="timesince-number">{timeBreakdown.months}</div>
                  <div className="timesince-label">Months</div>
                </div>
                <div className="timesince-unit">
                  <div className="timesince-number">{timeBreakdown.days}</div>
                  <div className="timesince-label">Days</div>
                </div>
                <div className="timesince-unit">
                  <div className="timesince-number">{String(timeBreakdown.hours).padStart(2, '0')}</div>
                  <div className="timesince-label">Hours</div>
                </div>
                <div className="timesince-unit">
                  <div className="timesince-number">{String(timeBreakdown.minutes).padStart(2, '0')}</div>
                  <div className="timesince-label">Minutes</div>
                </div>
                <div className="timesince-unit highlight">
                  <div className="timesince-number">{String(timeBreakdown.seconds).padStart(2, '0')}</div>
                  <div className="timesince-label">Seconds</div>
                </div>
              </div>
            )}

            {/* Fun Fact */}
            {currentEvent?.timeFact && showFact && (
              <div
                className="timesince-fact"
                style={{ '--event-color': currentEvent.color } as React.CSSProperties}
              >
                {currentEvent.timeFact}
              </div>
            )}

            {/* Controls */}
            <div className="timesince-controls">
              <button
                type="button"
                className="timesince-btn secondary"
                onClick={() => setShowEventSelector(true)}
              >
                Change Event
              </button>
              <button type="button" className="timesince-btn secondary" onClick={reset}>
                Reset
              </button>
              <button
                type="button"
                className="timesince-btn secondary hide-on-mobile"
                onClick={toggleFullscreen}
              >
                Fullscreen
              </button>
            </div>
          </div>
        )}

        {/* Help text */}
        <div className="timesince-help">
          <p>
            <strong>R</strong> Reset • <strong>F</strong> Fullscreen • <strong>ESC</strong> Change Event
          </p>
        </div>
      </div>
    </div>
  );
}
