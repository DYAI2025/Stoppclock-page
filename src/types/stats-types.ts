/**
 * Stats types for tracking timer usage and daily statistics
 */

import type { TimerType } from './preset-types';

export interface TimerEvent {
  id: string; // UUID
  type: TimerType;
  action: 'start' | 'complete' | 'pause' | 'reset';
  timestamp: number; // Unix timestamp
  durationMs?: number; // For 'complete' events
  metadata?: Record<string, any>; // Additional context
}

export interface DailyStats {
  date: string; // YYYY-MM-DD format
  totalSessions: number;
  totalTimeMs: number;
  completedSessions: number;
  timerBreakdown: Record<TimerType, {
    sessions: number;
    timeMs: number;
  }>;
  mostUsedTimer: TimerType | null;
}

export interface StatsState {
  version: 1;
  events: TimerEvent[]; // Last 1000 events
  dailyStats: Record<string, DailyStats>; // Last 90 days
  totalStats: {
    allTimeSessions: number;
    allTimeMs: number;
    currentStreak: number; // Days
    longestStreak: number; // Days
    firstUsedDate: string; // YYYY-MM-DD
  };
}

export interface StatsOverview {
  today: {
    sessions: number;
    timeMs: number;
    completedSessions: number;
  };
  thisWeek: {
    sessions: number;
    timeMs: number;
  };
  streak: {
    current: number;
    longest: number;
  };
  allTime: {
    sessions: number;
    timeMs: number;
    daysActive: number;
  };
  favoriteTimer: {
    type: TimerType;
    sessions: number;
  } | null;
}
