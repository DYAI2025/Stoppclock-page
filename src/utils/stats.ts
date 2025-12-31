/**
 * Stats tracking utilities for timer usage analytics
 * Stores events and daily aggregations in localStorage
 */

import type { TimerType } from '../types/preset-types';
import type { TimerEvent, DailyStats, StatsState, StatsOverview } from '../types/stats-types';

const STATS_STORAGE_KEY = 'sc.v1.stats';
const MAX_EVENTS = 1000; // Keep last 1000 events
const MAX_DAILY_STATS = 90; // Keep 90 days of daily stats

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get today's date string
 */
function getTodayString(): string {
  return formatDate(new Date());
}

/**
 * Load stats from localStorage
 */
export function loadStats(): StatsState {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) throw new Error('No stats');

    const state: StatsState = JSON.parse(raw);

    // Validate version
    if (state.version !== 1) throw new Error('Invalid version');

    return state;
  } catch {
    // Initialize fresh stats
    return {
      version: 1,
      events: [],
      dailyStats: {},
      totalStats: {
        allTimeSessions: 0,
        allTimeMs: 0,
        currentStreak: 0,
        longestStreak: 0,
        firstUsedDate: getTodayString()
      }
    };
  }
}

/**
 * Save stats to localStorage
 */
export function saveStats(state: StatsState): void {
  try {
    // Trim events if needed
    if (state.events.length > MAX_EVENTS) {
      state.events = state.events.slice(-MAX_EVENTS);
    }

    // Trim old daily stats (keep last 90 days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - MAX_DAILY_STATS);
    const cutoffString = formatDate(cutoffDate);

    const trimmedDaily: Record<string, DailyStats> = {};
    Object.entries(state.dailyStats).forEach(([date, stats]) => {
      if (date >= cutoffString) {
        trimmedDaily[date] = stats;
      }
    });
    state.dailyStats = trimmedDaily;

    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save stats:', error);
  }
}

/**
 * Track a timer event
 */
export function trackEvent(
  type: TimerType,
  action: 'start' | 'complete' | 'pause' | 'reset',
  durationMs?: number,
  metadata?: Record<string, any>
): void {
  try {
    const state = loadStats();

    const event: TimerEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      action,
      timestamp: Date.now(),
      durationMs,
      metadata
    };

    state.events.push(event);

    // Update daily stats
    const today = getTodayString();
    if (!state.dailyStats[today]) {
      state.dailyStats[today] = {
        date: today,
        totalSessions: 0,
        totalTimeMs: 0,
        completedSessions: 0,
        timerBreakdown: {} as any,
        mostUsedTimer: null
      };
    }

    const dailyStats = state.dailyStats[today];

    // Initialize timer breakdown if needed
    if (!dailyStats.timerBreakdown[type]) {
      dailyStats.timerBreakdown[type] = { sessions: 0, timeMs: 0 };
    }

    // Update counts based on action
    if (action === 'start') {
      dailyStats.totalSessions++;
      dailyStats.timerBreakdown[type].sessions++;
      state.totalStats.allTimeSessions++;
    } else if (action === 'complete' && durationMs) {
      dailyStats.completedSessions++;
      dailyStats.totalTimeMs += durationMs;
      dailyStats.timerBreakdown[type].timeMs += durationMs;
      state.totalStats.allTimeMs += durationMs;
    }

    // Calculate most used timer for the day
    let maxSessions = 0;
    let mostUsed: TimerType | null = null;
    Object.entries(dailyStats.timerBreakdown).forEach(([timer, data]) => {
      if (data.sessions > maxSessions) {
        maxSessions = data.sessions;
        mostUsed = timer as TimerType;
      }
    });
    dailyStats.mostUsedTimer = mostUsed;

    // Update streak
    updateStreak(state);

    saveStats(state);
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

/**
 * Update current and longest streak
 */
function updateStreak(state: StatsState): void {
  const dates = Object.keys(state.dailyStats).sort();
  if (dates.length === 0) {
    state.totalStats.currentStreak = 0;
    return;
  }

  const today = getTodayString();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate current streak (working backwards from today)
  const todayDate = new Date(today);
  let checkDate = new Date(todayDate);

  while (true) {
    const checkString = formatDate(checkDate);
    if (state.dailyStats[checkString] && state.dailyStats[checkString].totalSessions > 0) {
      currentStreak++;
    } else {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Calculate longest streak
  const sortedDates = dates.filter(d => state.dailyStats[d].totalSessions > 0).sort();
  if (sortedDates.length > 0) {
    tempStreak = 1;
    longestStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
  }

  state.totalStats.currentStreak = currentStreak;
  state.totalStats.longestStreak = Math.max(longestStreak, state.totalStats.longestStreak);
}

/**
 * Get stats overview for display
 */
export function getStatsOverview(): StatsOverview {
  const state = loadStats();
  const today = getTodayString();
  const todayStats = state.dailyStats[today] || {
    date: today,
    totalSessions: 0,
    totalTimeMs: 0,
    completedSessions: 0,
    timerBreakdown: {},
    mostUsedTimer: null
  };

  // Calculate this week stats
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoString = formatDate(weekAgo);

  let weekSessions = 0;
  let weekTimeMs = 0;

  Object.entries(state.dailyStats).forEach(([date, stats]) => {
    if (date >= weekAgoString) {
      weekSessions += stats.totalSessions;
      weekTimeMs += stats.totalTimeMs;
    }
  });

  // Find favorite timer (all time)
  const timerCounts: Record<string, number> = {};
  state.events.forEach(event => {
    if (event.action === 'start') {
      timerCounts[event.type] = (timerCounts[event.type] || 0) + 1;
    }
  });

  let favoriteTimer: { type: TimerType; sessions: number } | null = null;
  let maxCount = 0;
  Object.entries(timerCounts).forEach(([type, count]) => {
    if (count > maxCount) {
      maxCount = count;
      favoriteTimer = { type: type as TimerType, sessions: count };
    }
  });

  // Calculate days active
  const daysActive = Object.keys(state.dailyStats).filter(
    date => state.dailyStats[date].totalSessions > 0
  ).length;

  return {
    today: {
      sessions: todayStats.totalSessions,
      timeMs: todayStats.totalTimeMs,
      completedSessions: todayStats.completedSessions
    },
    thisWeek: {
      sessions: weekSessions,
      timeMs: weekTimeMs
    },
    streak: {
      current: state.totalStats.currentStreak,
      longest: state.totalStats.longestStreak
    },
    allTime: {
      sessions: state.totalStats.allTimeSessions,
      timeMs: state.totalStats.allTimeMs,
      daysActive
    },
    favoriteTimer
  };
}

/**
 * Format time duration for display
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Reset all stats (dangerous - requires confirmation)
 */
export function resetStats(): void {
  const freshStats: StatsState = {
    version: 1,
    events: [],
    dailyStats: {},
    totalStats: {
      allTimeSessions: 0,
      allTimeMs: 0,
      currentStreak: 0,
      longestStreak: 0,
      firstUsedDate: getTodayString()
    }
  };
  saveStats(freshStats);
}
