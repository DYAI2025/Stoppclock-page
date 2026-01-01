/**
 * Custom Sessions - Storage Hook
 * CRUD operations for sessions using localStorage + cross-tab sync
 */

import { useCallback } from 'react';
import { useStorageSync } from './useStorageSync';
import type { CustomSession } from '../types/custom-session-types';
import { STORAGE_KEYS } from '../types/custom-session-types';
import { validateSession } from '../utils/session-helpers';

export function useSessionStorage() {
  const [sessions, setSessions] = useStorageSync<Record<string, CustomSession>>(
    STORAGE_KEYS.SESSIONS,
    {}
  );

  // Create new session
  const createSession = useCallback((session: CustomSession): { success: boolean; error?: string } => {
    const validation = validateSession(session);
    if (!validation.valid) {
      return { success: false, error: validation.errors[0]?.message || 'Validation failed' };
    }

    setSessions(prev => ({
      ...prev,
      [session.id]: session,
    }));

    return { success: true };
  }, [setSessions]);

  // Update existing session
  const updateSession = useCallback((sessionId: string, updates: Partial<CustomSession>): { success: boolean; error?: string } => {
    const existing = sessions[sessionId];
    if (!existing) {
      return { success: false, error: 'Session not found' };
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
    };

    const validation = validateSession(updated);
    if (!validation.valid) {
      return { success: false, error: validation.errors[0]?.message || 'Validation failed' };
    }

    setSessions(prev => ({
      ...prev,
      [sessionId]: updated,
    }));

    return { success: true };
  }, [sessions, setSessions]);

  // Delete session
  const deleteSession = useCallback((sessionId: string): { success: boolean } => {
    setSessions(prev => {
      const { [sessionId]: removed, ...rest } = prev;
      return rest;
    });

    return { success: true };
  }, [setSessions]);

  // Get single session
  const getSession = useCallback((sessionId: string): CustomSession | null => {
    return sessions[sessionId] || null;
  }, [sessions]);

  // Get all sessions as array
  const getAllSessions = useCallback((): CustomSession[] => {
    return Object.values(sessions).sort((a, b) => b.updatedAt - a.updatedAt);
  }, [sessions]);

  // Get templates only
  const getTemplates = useCallback((): CustomSession[] => {
    return Object.values(sessions)
      .filter(s => s.isTemplate)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [sessions]);

  return {
    sessions: getAllSessions(),
    templates: getTemplates(),
    createSession,
    updateSession,
    deleteSession,
    getSession,
  };
}
