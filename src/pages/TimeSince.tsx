import React, { useState, useEffect, useCallback, useRef } from "react";
import { HomeButton } from "../components/HomeButton";
import { HISTORICAL_EVENTS, CATEGORY_NAMES, getEventById } from "../config/historical-events";
import type { TimeSinceState, HistoricalEvent } from "../types/timer-types";

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
}

function calculateTimeSince(targetDate: Date): TimeBreakdown {
  const now = new Date();
  const diff = now.getTime() - targetDate.getTime();

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

export default function TimeSince() {
  const [state, setState] = useState<TimeSinceState>(load);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const [showEventSelector, setShowEventSelector] = useState(!state.selectedEventId);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => save(state), 150);
    return () => clearTimeout(t);
  }, [state]);

  // Update every second when running
  useRaf(state.running, () => {
    forceUpdate();
  });

  const currentEvent = state.selectedEventId
    ? getEventById(state.selectedEventId)
    : null;

  const targetDate = currentEvent
    ? currentEvent.date
    : state.customEventDate
    ? new Date(state.customEventDate)
    : null;

  const timeBreakdown = targetDate ? calculateTimeSince(targetDate) : null;

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
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen?.().catch(() => {});
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
    <div className="timesince-page" ref={wrapRef}>
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
                        borderColor: event.color,
                      } as React.CSSProperties}
                      onClick={() => selectEvent(event)}
                    >
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
              className="timesince-event-banner"
              style={{
                '--event-color': currentEvent.color,
                borderColor: currentEvent.color,
              } as React.CSSProperties}
            >
              <div className="timesince-event-info">
                <h2 className="timesince-event-title">{currentEvent.name}</h2>
                <p className="timesince-event-description">{currentEvent.description}</p>
                <p className="timesince-event-date">
                  {currentEvent.date.toLocaleDateString('en-US', {
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
              <div className="timesince-unit">
                <div className="timesince-number">{timeBreakdown.years.toLocaleString()}</div>
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
                <div className="timesince-number">{timeBreakdown.hours}</div>
                <div className="timesince-label">Hours</div>
              </div>
              <div className="timesince-unit">
                <div className="timesince-number">{timeBreakdown.minutes}</div>
                <div className="timesince-label">Minutes</div>
              </div>
              <div className="timesince-unit">
                <div className="timesince-number">{timeBreakdown.seconds}</div>
                <div className="timesince-label">Seconds</div>
              </div>
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
  );
}
