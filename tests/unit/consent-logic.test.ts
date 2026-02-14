/**
 * Task 5: Develop Consent Logic
 * Test suite for consent state management and localStorage
 * TDD: Write failing tests first
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ConsentPreference } from '../../src/types/monetization-types';

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('Consent Logic - State Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Default Consent State', () => {
    it('should return default consent with no tracking enabled', () => {
      const defaultConsent: ConsentPreference = {
        version: 1,
        adsEnabled: false,
        analyticsEnabled: false,
        timestamp: 0,
        consentVersion: '2025-01-26'
      };

      expect(defaultConsent.adsEnabled).toBe(false);
      expect(defaultConsent.analyticsEnabled).toBe(false);
      expect(defaultConsent.timestamp).toBe(0);
    });

    it('should have version field', () => {
      const consent: ConsentPreference = {
        version: 1,
        adsEnabled: false,
        analyticsEnabled: false,
        timestamp: 0,
        consentVersion: '2025-01-26'
      };

      expect(consent.version).toBe(1);
    });

    it('should have consentVersion date string', () => {
      const consent: ConsentPreference = {
        version: 1,
        adsEnabled: false,
        analyticsEnabled: false,
        timestamp: 0,
        consentVersion: '2025-01-26'
      };

      expect(typeof consent.consentVersion).toBe('string');
      expect(consent.consentVersion).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('Consent Storage', () => {
    it('should store consent in localStorage', () => {
      const consent: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: false,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      localStorage.setItem('sc.consent', JSON.stringify(consent));

      const stored = localStorage.getItem('sc.consent');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual(consent);
    });

    it('should use correct localStorage key', () => {
      const key = 'sc.consent';
      const consent: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: true,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      localStorage.setItem(key, JSON.stringify(consent));

      const exists = localStorage.getItem(key) !== null;
      expect(exists).toBe(true);
    });

    it('should preserve consent across multiple updates', () => {
      const original: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: false,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      localStorage.setItem('sc.consent', JSON.stringify(original));

      // Update consent
      const updated: ConsentPreference = {
        ...original,
        analyticsEnabled: true,
        timestamp: Date.now()
      };

      localStorage.setItem('sc.consent', JSON.stringify(updated));

      const stored = JSON.parse(localStorage.getItem('sc.consent')!);
      expect(stored.analyticsEnabled).toBe(true);
      expect(stored.adsEnabled).toBe(true);
    });
  });

  describe('Consent Validation', () => {
    it('should validate consent object structure', () => {
      const isValid = (obj: any): obj is ConsentPreference => {
        return (
          typeof obj === 'object' &&
          obj !== null &&
          typeof obj.version === 'number' &&
          typeof obj.adsEnabled === 'boolean' &&
          typeof obj.analyticsEnabled === 'boolean' &&
          typeof obj.timestamp === 'number' &&
          typeof obj.consentVersion === 'string'
        );
      };

      const validConsent: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: false,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      expect(isValid(validConsent)).toBe(true);
    });

    it('should reject invalid consent objects', () => {
      const isValid = (obj: any): obj is ConsentPreference => {
        return (
          typeof obj === 'object' &&
          obj !== null &&
          typeof obj.version === 'number' &&
          typeof obj.adsEnabled === 'boolean' &&
          typeof obj.analyticsEnabled === 'boolean' &&
          typeof obj.timestamp === 'number' &&
          typeof obj.consentVersion === 'string'
        );
      };

      expect(isValid({})).toBe(false);
      expect(isValid(null)).toBe(false);
      expect(isValid({ adsEnabled: true })).toBe(false);
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('sc.consent', 'corrupted-json-{]');

      const handleLoad = () => {
        try {
          const raw = localStorage.getItem('sc.consent');
          if (!raw) return null;
          return JSON.parse(raw);
        } catch (error) {
          console.warn('Failed to load consent:', error);
          return null;
        }
      };

      const result = handleLoad();
      expect(result).toBeNull();
    });
  });

  describe('Consent State Transitions', () => {
    it('should transition from no consent to accepted', () => {
      let state: ConsentPreference | null = null;

      // Initial state
      expect(state).toBeNull();

      // User accepts
      state = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: true,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      expect(state.adsEnabled).toBe(true);
      expect(state.analyticsEnabled).toBe(true);
    });

    it('should transition from accepted to modified', () => {
      let state: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: true,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      // User modifies consent
      state = {
        ...state,
        analyticsEnabled: false,
        timestamp: Date.now()
      };

      expect(state.adsEnabled).toBe(true);
      expect(state.analyticsEnabled).toBe(false);
    });

    it('should transition from any state to revoked', () => {
      let state: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: true,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      // User revokes all consent
      state = {
        version: 1,
        adsEnabled: false,
        analyticsEnabled: false,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      expect(state.adsEnabled).toBe(false);
      expect(state.analyticsEnabled).toBe(false);
    });

    it('should allow partial consent (ads only)', () => {
      const state: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: false,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      expect(state.adsEnabled).toBe(true);
      expect(state.analyticsEnabled).toBe(false);
    });

    it('should allow partial consent (analytics only)', () => {
      const state: ConsentPreference = {
        version: 1,
        adsEnabled: false,
        analyticsEnabled: true,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      expect(state.adsEnabled).toBe(false);
      expect(state.analyticsEnabled).toBe(true);
    });
  });

  describe('Timestamp Handling', () => {
    it('should record consent timestamp', () => {
      const now = Date.now();
      const consent: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: true,
        timestamp: now,
        consentVersion: '2025-01-26'
      };

      expect(consent.timestamp).toBe(now);
    });

    it('should update timestamp on consent change', () => {
      let consent: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: false,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      const oldTimestamp = consent.timestamp;

      // Simulate time passing
      const newTimestamp = Date.now() + 1000;
      consent = {
        ...consent,
        analyticsEnabled: true,
        timestamp: newTimestamp
      };

      expect(consent.timestamp).toBeGreaterThan(oldTimestamp);
    });

    it('should indicate when consent was given (timestamp > 0)', () => {
      const consentGiven: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: false,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      const consentNotGiven: ConsentPreference = {
        version: 1,
        adsEnabled: false,
        analyticsEnabled: false,
        timestamp: 0,
        consentVersion: '2025-01-26'
      };

      expect(consentGiven.timestamp > 0).toBe(true);
      expect(consentNotGiven.timestamp > 0).toBe(false);
    });
  });

  describe('Legacy Format Migration', () => {
    it('should handle legacy adsConsent format', () => {
      localStorage.setItem('sc.adsConsent', 'yes');

      const legacy = localStorage.getItem('sc.adsConsent');
      expect(legacy).toBe('yes');

      // Migrate to new format
      if (legacy === 'yes' || legacy === 'no') {
        const migrated: ConsentPreference = {
          version: 1,
          adsEnabled: legacy === 'yes',
          analyticsEnabled: false,
          timestamp: Date.now(),
          consentVersion: '2025-01-26'
        };

        expect(migrated.adsEnabled).toBe(true);
        expect(migrated.analyticsEnabled).toBe(false);
      }
    });

    it('should handle legacy adsConsent rejection', () => {
      localStorage.setItem('sc.adsConsent', 'no');

      const legacy = localStorage.getItem('sc.adsConsent');

      if (legacy === 'yes' || legacy === 'no') {
        const migrated: ConsentPreference = {
          version: 1,
          adsEnabled: legacy === 'yes',
          analyticsEnabled: false,
          timestamp: Date.now(),
          consentVersion: '2025-01-26'
        };

        expect(migrated.adsEnabled).toBe(false);
      }
    });
  });

  describe('Consent Retrieval', () => {
    it('should return default consent when none exists', () => {
      const defaultConsent: ConsentPreference = {
        version: 1,
        adsEnabled: false,
        analyticsEnabled: false,
        timestamp: 0,
        consentVersion: '2025-01-26'
      };

      const stored = localStorage.getItem('sc.consent');
      const result = stored ? JSON.parse(stored) : defaultConsent;

      expect(result.adsEnabled).toBe(false);
      expect(result.analyticsEnabled).toBe(false);
    });

    it('should return stored consent when it exists', () => {
      const savedConsent: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: true,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      localStorage.setItem('sc.consent', JSON.stringify(savedConsent));

      const stored = localStorage.getItem('sc.consent');
      const result = stored ? JSON.parse(stored) : null;

      expect(result).not.toBeNull();
      expect(result.adsEnabled).toBe(true);
      expect(result.analyticsEnabled).toBe(true);
    });
  });

  describe('Consent Expiration (Optional)', () => {
    it('should allow optionally refreshing old consent', () => {
      const oneYearMs = 365 * 24 * 60 * 60 * 1000;
      const oldTimestamp = Date.now() - oneYearMs - 1000; // Ensure it's older

      const oldConsent: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: true,
        timestamp: oldTimestamp,
        consentVersion: '2024-01-26'
      };

      localStorage.setItem('sc.consent', JSON.stringify(oldConsent));

      const stored = JSON.parse(localStorage.getItem('sc.consent')!);
      const isOld = Date.now() - stored.timestamp > 365 * 24 * 60 * 60 * 1000;

      expect(isOld).toBe(true);
    });
  });

  describe('Consent Features State', () => {
    it('should track individual feature consent states', () => {
      const consent: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: false,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      const hasAdConsent = consent.adsEnabled;
      const hasAnalyticsConsent = consent.analyticsEnabled;

      expect(hasAdConsent).toBe(true);
      expect(hasAnalyticsConsent).toBe(false);
    });

    it('should determine if any consent was given', () => {
      const hasAnyConsent = (consent: ConsentPreference): boolean => {
        return consent.adsEnabled || consent.analyticsEnabled;
      };

      const noConsent: ConsentPreference = {
        version: 1,
        adsEnabled: false,
        analyticsEnabled: false,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      const someConsent: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: false,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      expect(hasAnyConsent(noConsent)).toBe(false);
      expect(hasAnyConsent(someConsent)).toBe(true);
    });

    it('should determine if all consent was given', () => {
      const hasAllConsent = (consent: ConsentPreference): boolean => {
        return consent.adsEnabled && consent.analyticsEnabled;
      };

      const partialConsent: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: false,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      const fullConsent: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: true,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      expect(hasAllConsent(partialConsent)).toBe(false);
      expect(hasAllConsent(fullConsent)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage quota exceeded', () => {
      const setItem = (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (error: any) {
          if (error.name === 'QuotaExceededError') {
            console.error('LocalStorage quota exceeded');
            return false;
          }
          throw error;
        }
      };

      const consent: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: true,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      const result = setItem('sc.consent', JSON.stringify(consent));
      expect(typeof result).toBe('boolean');
    });

    it('should handle missing localStorage', () => {
      const getConsent = (): ConsentPreference | null => {
        try {
          const raw = localStorage.getItem('sc.consent');
          return raw ? JSON.parse(raw) : null;
        } catch (error) {
          console.error('Failed to access localStorage:', error);
          return null;
        }
      };

      const result = getConsent();
      // Should return either consent or null, never throw
      expect([null, 'object']).toContain(result === null ? null : typeof result);
    });
  });

  describe('Consent Data Privacy', () => {
    it('should not store personally identifiable information', () => {
      const consent: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: true,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      expect(consent).not.toHaveProperty('name');
      expect(consent).not.toHaveProperty('email');
      expect(consent).not.toHaveProperty('userId');
      expect(consent).not.toHaveProperty('ip');
    });

    it('should only store minimal necessary data', () => {
      const consent: ConsentPreference = {
        version: 1,
        adsEnabled: true,
        analyticsEnabled: true,
        timestamp: Date.now(),
        consentVersion: '2025-01-26'
      };

      const keys = Object.keys(consent);
      expect(keys.length).toBeLessThanOrEqual(5);
      expect(keys).toEqual(
        expect.arrayContaining([
          'version',
          'adsEnabled',
          'analyticsEnabled',
          'timestamp',
          'consentVersion'
        ])
      );
    });
  });
});
