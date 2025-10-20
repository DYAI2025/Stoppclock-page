import { useEffect } from 'react';

export interface KeyboardShortcutHandlers {
  onSpace?: () => void;      // Toggle start/pause
  onReset?: () => void;      // Reset timer (R key)
  onFullscreen?: () => void; // Toggle fullscreen (F key)
  onLap?: () => void;        // Record lap time (L key) - Stopwatch specific
}

/**
 * Custom hook for standardized keyboard shortcuts across all timers
 * Implements FR-050 to FR-054: Consistent keyboard controls
 *
 * Standard shortcuts:
 * - Space: Start/Pause toggle
 * - R: Reset
 * - F: Fullscreen
 * - L: Lap (Stopwatch only)
 *
 * Automatically disables shortcuts when typing in input fields
 */
export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      // Don't trigger shortcuts if user is typing in an input field
      const target = event.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key) {
        case ' ':
          if (handlers.onSpace) {
            event.preventDefault();
            handlers.onSpace();
          }
          break;

        case 'r':
        case 'R':
          if (handlers.onReset) {
            event.preventDefault();
            handlers.onReset();
          }
          break;

        case 'f':
        case 'F':
          if (handlers.onFullscreen) {
            event.preventDefault();
            handlers.onFullscreen();
          }
          break;

        case 'l':
        case 'L':
          if (handlers.onLap) {
            event.preventDefault();
            handlers.onLap();
          }
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers, enabled]);
}
