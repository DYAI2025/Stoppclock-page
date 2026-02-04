/**
 * WidgetStat Component
 * 
 * Data visualization widget for statistics, metrics, and progress.
 * Supports various display modes: number, percentage, bar chart, etc.
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { WidgetCard } from './WidgetCard';

export interface WidgetStatProps {
  /** Stat label */
  label: string;
  /** Main value to display */
  value: string | number;
  /** Secondary value (optional) */
  subtitle?: string;
  /** Trend indicator: up, down, or neutral */
  trend?: 'up' | 'down' | 'neutral';
  /** Trend percentage */
  trendValue?: string;
  /** Progress percentage (0-100) */
  progress?: number;
  /** Icon element */
  icon?: React.ReactNode;
  /** Grid column span */
  span?: 1 | 2 | 3;
}

export const WidgetStat: React.FC<WidgetStatProps> = ({
  label,
  value,
  subtitle,
  trend,
  trendValue,
  progress,
  icon,
  span
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} />;
      case 'down':
        return <TrendingDown size={16} />;
      case 'neutral':
        return <Minus size={16} />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'var(--widget-accent-primary)';
      case 'down':
        return 'var(--widget-accent-warm)';
      default:
        return 'var(--widget-text-tertiary)';
    }
  };

  return (
    <WidgetCard span={span}>
      <div className="widget-flex widget-flex-col widget-gap-4">
        {/* Header */}
        <div className="widget-flex widget-justify-between widget-items-center">
          <span className="widget-text-tertiary">{label}</span>
          {icon && (
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--widget-radius-sm)',
                background: 'var(--widget-accent-primary-light)',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--widget-accent-primary)'
              }}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Main Value */}
        <div className="widget-text-primary" style={{ fontSize: 'var(--widget-text-2xl)' }}>
          {value}
        </div>

        {/* Subtitle or Trend */}
        <div className="widget-flex widget-items-center widget-gap-2">
          {subtitle && (
            <span className="widget-text-secondary" style={{ fontSize: 'var(--widget-text-sm)' }}>
              {subtitle}
            </span>
          )}
          {trend && trendValue && (
            <div
              className="widget-flex widget-items-center widget-gap-1"
              style={{
                color: getTrendColor(),
                fontSize: 'var(--widget-text-sm)',
                fontWeight: 'var(--widget-font-medium)'
              }}
            >
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {typeof progress === 'number' && (
          <div className="widget-progress-bar">
            <div
              className="widget-progress-bar-fill"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </div>
    </WidgetCard>
  );
};
