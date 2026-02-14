/**
 * Time Lab - Landing Page
 * Hub for "Since Then" and "Until Then" time markers
 * Theme: Ocean Depths (dark, cosmic)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { HomeButton } from '../components/HomeButton';
import { HISTORICAL_EVENTS, CATEGORY_NAMES } from '../config/historical-events';
import { UNTIL_EVENTS, UNTIL_CATEGORY_NAMES } from '../config/until-events';
import { getTimeSince, getTimeUntil, getSeasonProgress, formatTimeBreakdown } from '../utils/time-calculations';
import type { TimeBreakdown } from '../types/meta-time-types';
import type { HistoricalEvent } from '../types/timer-types';
import '../styles/timelab.css';

type TabType = 'since' | 'until' | 'seasons';

// Time display component
function TimeDisplay({ breakdown, type }: { breakdown: TimeBreakdown; type: 'since' | 'until' }) {
    return (
        <div className="timelab-time-grid">
            {breakdown.years > 0 && (
                <div className="timelab-time-unit">
                    <span className="timelab-time-value">{breakdown.years.toLocaleString()}</span>
                    <span className="timelab-time-label">Years</span>
                </div>
            )}
            {(breakdown.years > 0 || breakdown.months > 0) && (
                <div className="timelab-time-unit">
                    <span className="timelab-time-value">{breakdown.months}</span>
                    <span className="timelab-time-label">Months</span>
                </div>
            )}
            <div className="timelab-time-unit">
                <span className="timelab-time-value">{breakdown.days}</span>
                <span className="timelab-time-label">Days</span>
            </div>
            <div className="timelab-time-unit">
                <span className="timelab-time-value">{String(breakdown.hours).padStart(2, '0')}</span>
                <span className="timelab-time-label">Hours</span>
            </div>
            <div className="timelab-time-unit">
                <span className="timelab-time-value">{String(breakdown.minutes).padStart(2, '0')}</span>
                <span className="timelab-time-label">Min</span>
            </div>
            <div className="timelab-time-unit highlight">
                <span className="timelab-time-value">{String(breakdown.seconds).padStart(2, '0')}</span>
                <span className="timelab-time-label">Sec</span>
            </div>
        </div>
    );
}

// Event card component
function EventCard({
    event,
    type,
    onClick,
    isSelected
}: {
    event: HistoricalEvent | typeof UNTIL_EVENTS[0];
    type: 'since' | 'until';
    onClick: () => void;
    isSelected: boolean;
}) {
    const [breakdown, setBreakdown] = useState<TimeBreakdown>(() =>
        type === 'since' ? getTimeSince(event.date) : getTimeUntil(event.date)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setBreakdown(type === 'since' ? getTimeSince(event.date) : getTimeUntil(event.date));
        }, 1000);
        return () => clearInterval(interval);
    }, [event.date, type]);

    const isSymbolic = 'isSymbolic' in event && event.isSymbolic;

    return (
        <button
            className={`timelab-event-card ${isSelected ? 'selected' : ''}`}
            style={{ '--event-color': event.color } as React.CSSProperties}
            onClick={onClick}
        >
            <div className="timelab-event-header">
                {'emoji' in event && event.emoji && (
                    <span className="timelab-event-emoji">{event.emoji}</span>
                )}
                <div className="timelab-event-info">
                    <h3 className="timelab-event-name">{event.name}</h3>
                    <p className="timelab-event-desc">{event.description}</p>
                </div>
            </div>
            <div className="timelab-event-time">
                <span className="timelab-compact-time">
                    {formatTimeBreakdown(breakdown, true)}
                </span>
                <span className="timelab-time-suffix">
                    {type === 'since' ? 'ago' : 'left'}
                </span>
            </div>
            {isSymbolic && (
                <span className="timelab-symbolic-badge">≈ Symbolic</span>
            )}
        </button>
    );
}

// Season progress component  
function SeasonCard() {
    const [season, setSeason] = useState(() => getSeasonProgress());

    useEffect(() => {
        const interval = setInterval(() => {
            setSeason(getSeasonProgress());
        }, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="timelab-season-card">
            <div className="timelab-season-header">
                <span className="timelab-season-emoji">{season.emoji}</span>
                <div>
                    <h3 className="timelab-season-name">
                        {season.current.charAt(0).toUpperCase() + season.current.slice(1)}
                    </h3>
                    <p className="timelab-season-sub">Current Season</p>
                </div>
            </div>
            <div className="timelab-season-progress">
                <div className="timelab-progress-bar">
                    <div
                        className="timelab-progress-fill"
                        style={{ width: `${season.progressPercent}%` }}
                    />
                </div>
                <div className="timelab-progress-stats">
                    <span>{season.daysElapsed} days in</span>
                    <span>{season.progressPercent}%</span>
                    <span>{season.daysRemaining} days left</span>
                </div>
            </div>
        </div>
    );
}

export default function TimeLab() {
    const [activeTab, setActiveTab] = useState<TabType>('since');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

    // Force re-render every second for live updates
    useEffect(() => {
        const interval = setInterval(() => forceUpdate(), 1000);
        return () => clearInterval(interval);
    }, []);

    const selectedEvent = React.useMemo(() => {
        if (!selectedEventId) return null;
        if (activeTab === 'since') {
            return HISTORICAL_EVENTS.find(e => e.id === selectedEventId);
        }
        return UNTIL_EVENTS.find(e => e.id === selectedEventId);
    }, [selectedEventId, activeTab]);

    const currentBreakdown = selectedEvent
        ? (activeTab === 'since'
            ? getTimeSince(selectedEvent.date)
            : getTimeUntil(selectedEvent.date))
        : null;

    // Group events by category
    const sinceByCategory = React.useMemo(() => {
        const groups: Record<string, HistoricalEvent[]> = {};
        HISTORICAL_EVENTS.forEach(event => {
            if (!groups[event.category]) groups[event.category] = [];
            groups[event.category].push(event);
        });
        return groups;
    }, []);

    const untilByCategory = React.useMemo(() => {
        const groups: Record<string, typeof UNTIL_EVENTS> = {};
        UNTIL_EVENTS.forEach(event => {
            if (!groups[event.category]) groups[event.category] = [];
            groups[event.category].push(event);
        });
        return groups;
    }, []);

    return (
        <div className="timelab-page">
            {/* Hero */}
            <header className="timelab-hero">
                <HomeButton />
                <div className="timelab-hero-content">
                    <span className="timelab-tag">🧪 Time Lab</span>
                    <h1 className="timelab-title">Odd & Quiet Ways to Look at Time</h1>
                    <p className="timelab-subtitle">
                        Explore the endless river of moments—past, present, and future.
                    </p>
                </div>
            </header>

            {/* Tab Navigation */}
            <nav className="timelab-tabs">
                <button
                    className={`timelab-tab ${activeTab === 'since' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('since'); setSelectedEventId(null); }}
                >
                    ⏪ Since Then
                </button>
                <button
                    className={`timelab-tab ${activeTab === 'until' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('until'); setSelectedEventId(null); }}
                >
                    ⏩ Until Then
                </button>
                <button
                    className={`timelab-tab ${activeTab === 'seasons' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('seasons'); setSelectedEventId(null); }}
                >
                    🌍 Seasons
                </button>
            </nav>

            {/* Selected Event Display */}
            {selectedEvent && currentBreakdown && (
                <div className="timelab-featured" style={{ '--event-color': selectedEvent.color } as React.CSSProperties}>
                    <div className="timelab-featured-header">
                        <h2>{selectedEvent.name}</h2>
                        <p>{selectedEvent.description}</p>
                        <button
                            className="timelab-close-btn"
                            onClick={() => setSelectedEventId(null)}
                        >
                            ✕ Close
                        </button>
                    </div>
                    <TimeDisplay breakdown={currentBreakdown} type={activeTab === 'since' ? 'since' : 'until'} />
                    <p className="timelab-featured-date">
                        {activeTab === 'since' ? 'Since' : 'Until'}{' '}
                        {selectedEvent.date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            )}

            {/* Content */}
            <main className="timelab-content">
                {activeTab === 'since' && (
                    <div className="timelab-events-section">
                        {Object.entries(sinceByCategory).map(([category, events]) => (
                            <div key={category} className="timelab-category">
                                <h3 className="timelab-category-title">
                                    {CATEGORY_NAMES[category as HistoricalEvent['category']]}
                                </h3>
                                <div className="timelab-events-grid">
                                    {events.map(event => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            type="since"
                                            onClick={() => setSelectedEventId(event.id)}
                                            isSelected={selectedEventId === event.id}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'until' && (
                    <div className="timelab-events-section">
                        {Object.entries(untilByCategory).map(([category, events]) => (
                            <div key={category} className="timelab-category">
                                <h3 className="timelab-category-title">
                                    {UNTIL_CATEGORY_NAMES[category] || category}
                                </h3>
                                <div className="timelab-events-grid">
                                    {events.map(event => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            type="until"
                                            onClick={() => setSelectedEventId(event.id)}
                                            isSelected={selectedEventId === event.id}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'seasons' && (
                    <div className="timelab-seasons-section">
                        <SeasonCard />
                        <div className="timelab-seasons-info">
                            <h3>About Seasons</h3>
                            <p>
                                Seasons are determined by Earth's axial tilt and its orbit around the Sun.
                                The dates shown are approximate and based on the Northern Hemisphere.
                            </p>
                            <p>
                                <strong>Next transitions:</strong> The progress bar shows how far we are
                                through the current season.
                            </p>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="timelab-footer">
                <p>
                    <strong>Tip:</strong> Click any event to see the full time breakdown.
                </p>
            </footer>
        </div>
    );
}
