/**
 * Timer accent colors extracted from main.tsx
 * Used for per-timer styling in Timer Worlds
 */

export const TIMER_COLORS: Record<string, string> = {
  countdown: '#7B2CBF',
  stopwatch: '#00D9FF',
  analog: '#C77DFF',
  timesince: '#9333EA',
  cooking: '#FF6B9D',
  couples: '#FF69B4',
  'custom-sessions': '#8B5CF6',
  chess: '#E0AAFF',
  metronome: '#F59E0B',
  world: '#6B9BD1',
  alarm: '#EF4444',
  pomodoro: '#10B981',
};

export function getTimerColor(slug: string): string {
  return TIMER_COLORS[slug] || '#7B2CBF';
}