import React, { useState, useEffect } from 'react';
import { WorldClockEntry } from '../../domain/world-clock/types';
import { getLocalTimeParts, getDayPeriod, getOffsetDescription } from '../../domain/world-clock/time';
import '../../styles/world-clock.css';

interface WorldClockRowProps {
    entry: WorldClockEntry;
    referenceTime?: Date; // For "Meeting Check" mode
    referenceLocationId?: string; // To calc offset relative to this city
    onDelete?: (id: string) => void;
}

export function WorldClockRow({ entry, referenceTime, referenceLocationId, onDelete }: WorldClockRowProps) {
    // We need to update time every minute
    // For now, let's just force update every second in specific hook or parent.
    // Or simple internal interval. 
    // Given we might have many rows, better to have one central ticker in parsing if possible, 
    // but individual interval is easier for MVP.
    const [now, setNow] = useState(referenceTime || new Date());

    useEffect(() => {
        if (referenceTime) {
            setNow(referenceTime);
            return;
        }
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, [referenceTime]);

    const { hours, minutes, dayOfWeek } = getLocalTimeParts(entry.timezone, now);
    const period = getDayPeriod(hours);
    const offset = getOffsetDescription(entry.timezone, referenceLocationId ? /* we need timezone string of ref loc */ undefined : undefined);
    // Note: offset logic in 'time.ts' needs helper to resolve ID to timezone string if we pass ID.
    // For MVP, if referenceLocationId is passed, we might assume the parent passes the TZ string or we just use simple UTC offset if not provided.
    // Let's stick to 'offset from local' for simplicity unless 'Reference Mode' is strictly required now.

    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    return (
        <div className={`wc-row period-${period}`}>
            <div className="wc-city">
                {entry.label || entry.city}
                <span className="wc-city-sub">{entry.timezone.split('/')[1]?.replace('_', ' ') || entry.city}</span>
            </div>

            <div className="wc-time-group">
                <span className="wc-weekday">{dayOfWeek}</span>
                <span className="wc-time">{timeStr}</span>
            </div>

            <div className="wc-status">
                <span className="wc-period-label">{period.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
            </div>

            <div className="wc-offset">
                {offset}
            </div>

            {onDelete && (
                <button className="wc-delete-btn" onClick={() => onDelete(entry.id)} aria-label="Remove city">
                    ×
                </button>
            )}
        </div>
    );
}
