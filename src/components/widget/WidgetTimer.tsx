/**
 * WidgetTimer Component
 * 
 * Interactive countdown timer widget with circular progress ring.
 * Features play/pause controls and live updates.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { WidgetCard } from './WidgetCard';

export interface WidgetTimerProps {
  /** Initial time in seconds */
  initialSeconds?: number;
  /** Timer label */
  label?: string;
  /** Grid column span */
  span?: 1 | 2 | 3;
}

export const WidgetTimer: React.FC<WidgetTimerProps> = ({
  initialSeconds = 300,
  label = 'Countdown',
  span
}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime] = useState(initialSeconds);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialSeconds);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <WidgetCard span={span}>
      <div className="widget-flex widget-flex-col widget-gap-4">
        {/* Header */}
        <div className="widget-flex widget-justify-between widget-items-center">
          <span className="widget-text-tertiary">{label}</span>
        </div>

        {/* Timer Display with Circular Progress */}
        <div className="widget-flex widget-justify-center" style={{ position: 'relative' }}>
          <svg width="140" height="140" style={{ position: 'absolute' }}>
            <circle
              className="widget-progress-ring-bg"
              cx="70"
              cy="70"
              r="54"
              style={{
                fill: 'none',
                stroke: 'var(--widget-bg-canvas-alt)',
                strokeWidth: '8'
              }}
            />
            <circle
              className="widget-progress-ring-fg"
              cx="70"
              cy="70"
              r="54"
              style={{
                fill: 'none',
                stroke: 'var(--widget-accent-primary)',
                strokeWidth: '8',
                strokeLinecap: 'round',
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
                transition: 'stroke-dashoffset 0.3s ease'
              }}
            />
          </svg>
          <div
            className="widget-flex widget-flex-col widget-items-center widget-justify-center"
            style={{ width: '140px', height: '140px' }}
          >
            <span className="widget-text-display" style={{ fontSize: 'var(--widget-text-2xl)' }}>
              {formatTime(timeLeft)}
            </span>
            <span className="widget-text-tertiary" style={{ marginTop: '4px' }}>
              {Math.floor((progress / 100) * 100)}%
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="widget-flex widget-gap-2 widget-justify-center">
          <button
            className="widget-button"
            onClick={handlePlayPause}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px'
            }}
          >
            {isRunning ? (
              <>
                <Pause size={16} />
                Pause
              </>
            ) : (
              <>
                <Play size={16} />
                Start
              </>
            )}
          </button>
          <button
            className="widget-button-secondary"
            onClick={handleReset}
            style={{
              background: 'var(--widget-bg-card)',
              color: 'var(--widget-text-primary)',
              border: 'none',
              borderRadius: 'var(--widget-radius-md)',
              padding: '12px 16px',
              cursor: 'pointer',
              boxShadow: 'var(--widget-shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </WidgetCard>
  );
};
