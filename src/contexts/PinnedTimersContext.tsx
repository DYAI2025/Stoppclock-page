import React, { createContext, useState, useContext } from 'react';

export type PinnedTimer = {
  id: string;
  type: string;
  name: string;
};

type PinnedTimersContextType = {
  pinnedTimers: PinnedTimer[];
  addTimer: (timer: PinnedTimer) => void;
  removeTimer: (id: string) => void;
};

const PinnedTimersContext = createContext<PinnedTimersContextType | undefined>(undefined);

export const PinnedTimersProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [pinnedTimers, setPinnedTimers] = useState<PinnedTimer[]>([]);

  const addTimer = (timer: PinnedTimer) => {
    if (pinnedTimers.length < 3 && !pinnedTimers.some(t => t.id === timer.id)) {
      setPinnedTimers(prev => [...prev, timer]);
    }
  };

  const removeTimer = (id: string) => {
    setPinnedTimers(prev => prev.filter(t => t.id !== id));
  };

  return (
    <PinnedTimersContext.Provider value={{ pinnedTimers, addTimer, removeTimer }}>
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
