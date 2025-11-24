import { useEffect } from 'react';

type TimerType = 'Countdown' | 'Stopwatch' | 'Pomodoro';
type TimerState = 'idle' | 'running' | 'paused' | 'finished';

interface UseActiveTimerTitleOptions {
  timerType: TimerType;
  state: TimerState;
  timeDisplay?: string; // e.g., "05:30" or "12:45"
}

/**
 * Updates document.title to show active timer state
 * 
 * Format: "⏱️ 05:30 - Countdown | Stoppclock" (when running)
 *         "Stoppclock" (when idle)
 * 
 * @example
 * useActiveTimerTitle({
 *   timerType: 'Countdown',
 *   state: isRunning ? 'running' : 'idle',
 *   timeDisplay: formatTime(timeLeft)
 * });
 */
export function useActiveTimerTitle({ 
  timerType, 
  state, 
  timeDisplay 
}: UseActiveTimerTitleOptions) {
  useEffect(() => {
    const defaultTitle = 'Stoppclock';
    
    if (state === 'running' && timeDisplay) {
      // Active timer: show emoji, time, and timer type
      const emoji = timerType === 'Pomodoro' ? '🍅' : '⏱️';
      document.title = `${emoji} ${timeDisplay} - ${timerType} | ${defaultTitle}`;
    } else if (state === 'paused' && timeDisplay) {
      // Paused: show pause emoji
      document.title = `⏸️ ${timeDisplay} - ${timerType} | ${defaultTitle}`;
    } else if (state === 'finished') {
      // Finished: show checkmark
      document.title = `✓ ${timerType} Complete | ${defaultTitle}`;
    } else {
      // Idle or no time: reset to default
      document.title = defaultTitle;
    }

    // Cleanup: reset title when component unmounts
    return () => {
      document.title = defaultTitle;
    };
  }, [timerType, state, timeDisplay]);
}