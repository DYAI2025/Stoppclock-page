import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for cross-tab state synchronization via localStorage and StorageEvent
 * Implements SC-015 requirement: <500ms cross-tab sync
 */
export function useStorageSync<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (err) {
      console.error(`Failed to load ${key} from localStorage:`, err);
      return initialValue;
    }
  });

  // Update local state AND localStorage
  const updateValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const valueToStore = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(prev)
        : newValue;

      try {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.error(`Failed to save ${key} to localStorage:`, err);
      }

      return valueToStore;
    });
  }, [key]);

  // Listen for changes from other tabs
  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === key && event.newValue) {
        try {
          const newValue = JSON.parse(event.newValue) as T;
          setValue(newValue);
        } catch (err) {
          console.error(`Failed to parse storage event for ${key}:`, err);
        }
      }
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [value, updateValue] as const;
}
