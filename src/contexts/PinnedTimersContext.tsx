import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

export type PinnedTimer = {
  id: string;
  type: string;
  name: string;
};

type PinnedTimersContextType = {
  /** Simple string array of pinned timer IDs (for new landing page) */
  pinnedTimers: string[];
  /** Full timer objects (legacy support) */
  pinnedTimerObjects: PinnedTimer[];
  /** Add timer with full object (legacy) */
  addTimer: (timer: PinnedTimer) => void;
  /** Add timer by ID only (new landing page) */
  addPinnedTimer: (id: string) => void;
  /** Remove timer (legacy) */
  removeTimer: (id: string) => void;
  /** Remove timer by ID (alias) */
  removePinnedTimer: (id: string) => void;
  /** Check if timer is pinned */
  isPinned: (id: string) => boolean;
};

const PinnedTimersContext = createContext<PinnedTimersContextType | undefined>(undefined);

const STORAGE_KEY = 'sc.v1.pinnedTimers';
const STORAGE_KEY_V2 = 'sc.v2.pinnedTimerIds';
const MAX_PINS = 3; // Updated per spec: max 3 visible for larger size

/**
 * Load pinned timer IDs from localStorage
 */
function loadPinnedTimerIds(): string[] {
  try {
    // Try new v2 format first (simple string array)
    const storedV2 = localStorage.getItem(STORAGE_KEY_V2);
    if (storedV2) {
      const parsed = JSON.parse(storedV2);
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        return parsed.slice(0, MAX_PINS);
      }
    }

    // Fall back to v1 format (object array)
    const storedV1 = localStorage.getItem(STORAGE_KEY);
    if (storedV1) {
      const parsed = JSON.parse(storedV1);
      if (Array.isArray(parsed)) {
        const ids = parsed
          .filter((item): item is PinnedTimer =>
            typeof item === 'object' && typeof item.id === 'string'
          )
          .map(item => item.id);
        return ids.slice(0, MAX_PINS);
      }
    }

    return [];
  } catch (error) {
    console.warn('Failed to load pinned timers, resetting:', error);
    return [];
  }
}

/**
 * Load full timer objects from localStorage (legacy support)
 */
function loadPinnedTimerObjects(): PinnedTimer[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    const valid = parsed.filter(
      (item): item is PinnedTimer =>
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.type === 'string' &&
        typeof item.name === 'string'
    );

    return valid.slice(0, MAX_PINS);
  } catch (error) {
    return [];
  }
}

/**
 * Save pinned timer IDs to localStorage
 */
function savePinnedTimerIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(ids));
  } catch (error) {
    console.error('Failed to save pinned timers:', error);
  }
}

/**
 * Save pinned timer objects to localStorage (legacy support)
 */
function savePinnedTimerObjects(timers: PinnedTimer[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
  } catch (error) {
    console.error('Failed to save pinned timers:', error);
  }
}

export const PinnedTimersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pinnedTimerIds, setPinnedTimerIds] = useState<string[]>(() => loadPinnedTimerIds());
  const [pinnedTimerObjects, setPinnedTimerObjects] = useState<PinnedTimer[]>(() => loadPinnedTimerObjects());

  // Persist to localStorage whenever pinned timers change
  useEffect(() => {
    savePinnedTimerIds(pinnedTimerIds);
  }, [pinnedTimerIds]);

  useEffect(() => {
    savePinnedTimerObjects(pinnedTimerObjects);
  }, [pinnedTimerObjects]);

  // Add timer by ID only (new API)
  const addPinnedTimer = (id: string) => {
    setPinnedTimerIds(prev => {
      if (prev.includes(id)) return prev;
      if (prev.length >= MAX_PINS) {
        console.warn(`Maximum ${MAX_PINS} pins reached. Cannot add more.`);
        return prev;
      }
      return [...prev, id];
    });
  };

  // Add timer with full object (legacy API)
  const addTimer = (timer: PinnedTimer) => {
    addPinnedTimer(timer.id);
    setPinnedTimerObjects(prev => {
      if (prev.some(t => t.id === timer.id)) return prev;
      if (prev.length >= MAX_PINS) return prev;
      return [...prev, timer];
    });
  };

  // Remove timer by ID
  const removeTimer = (id: string) => {
    setPinnedTimerIds(prev => prev.filter(timerId => timerId !== id));
    setPinnedTimerObjects(prev => prev.filter(t => t.id !== id));
  };

  // Check if timer is pinned
  const isPinned = (id: string): boolean => {
    return pinnedTimerIds.includes(id);
  };

  const value: PinnedTimersContextType = {
    pinnedTimers: pinnedTimerIds,
    pinnedTimerObjects,
    addTimer,
    addPinnedTimer,
    removeTimer,
    removePinnedTimer: removeTimer,
    isPinned,
  };

  return (
    <PinnedTimersContext.Provider value={value}>
      {children}
    </PinnedTimersContext.Provider>
  );
};

export const usePinnedTimers = () => {
  const context = useContext(PinnedTimersContext);
  if (!context) {
    throw new Error('usePinnedTimers must be used within a PinnedTimersProvider');
  }
  return context;
};
