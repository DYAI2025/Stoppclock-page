import React, { createContext, useState, useContext, useEffect } from 'react';

export type PinnedTimer = {
  id: string;
  type: string;
  name: string;
};

type PinnedTimersContextType = {
  pinnedTimers: PinnedTimer[];
  addTimer: (timer: PinnedTimer) => void;
  removeTimer: (id: string) => void;
  isPinned: (id: string) => boolean;
};

const PinnedTimersContext = createContext<PinnedTimersContextType | undefined>(undefined);

const STORAGE_KEY = 'sc.v1.pinnedTimers';
const MAX_PINS = 3;

/**
 * Load pinned timers from localStorage with defensive parsing
 */
function loadPinnedTimers(): PinnedTimer[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    // Validate structure
    if (!Array.isArray(parsed)) return [];
    
    // Validate each item has required fields
    const valid = parsed.filter(
      (item): item is PinnedTimer => 
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.type === 'string' &&
        typeof item.name === 'string'
    );
    
    // Enforce max pins limit
    return valid.slice(0, MAX_PINS);
  } catch (error) {
    // On any error, reset to empty array
    console.warn('Failed to load pinned timers, resetting:', error);
    return [];
  }
}

/**
 * Save pinned timers to localStorage
 */
function savePinnedTimers(timers: PinnedTimer[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
  } catch (error) {
    console.error('Failed to save pinned timers:', error);
  }
}

export const PinnedTimersProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [pinnedTimers, setPinnedTimers] = useState<PinnedTimer[]>(() => loadPinnedTimers());

  // Persist to localStorage whenever pinnedTimers changes
  useEffect(() => {
    savePinnedTimers(pinnedTimers);
  }, [pinnedTimers]);

  const addTimer = (timer: PinnedTimer) => {
    setPinnedTimers(prev => {
      // Check if already pinned
      if (prev.some(t => t.id === timer.id)) {
        return prev;
      }
      
      // Check max pins limit
      if (prev.length >= MAX_PINS) {
        console.warn(`Maximum ${MAX_PINS} pins reached. Cannot add more.`);
        return prev;
      }
      
      return [...prev, timer];
    });
  };

  const removeTimer = (id: string) => {
    setPinnedTimers(prev => prev.filter(t => t.id !== id));
  };

  const isPinned = (id: string): boolean => {
    return pinnedTimers.some(t => t.id === id);
  };

  return (
    <PinnedTimersContext.Provider value={{ pinnedTimers, addTimer, removeTimer, isPinned }}>
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
