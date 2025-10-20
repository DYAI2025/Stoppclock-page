// Custom branding utilities
// Handles logo upload, base64 encoding, and quota tracking

import type { CustomBranding } from '../types/monetization-types';

const LS_KEY = 'sc.branding';
const MAX_LOGO_SIZE = 500 * 1024; // 500KB original
const MAX_LOGO_SIZE_BASE64 = 665 * 1024; // ~665KB after base64 encoding
const MAX_TEXT_LENGTH = 100;

/**
 * Get default branding state (disabled)
 */
export function getDefaultBranding(): CustomBranding {
  return {
    version: 1,
    enabled: false,
    customText: null,
    logoImage: null,
    logoImageSize: null,
    timerTypes: [], // Empty = show on all timers
    position: 'top',
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

/**
 * Load branding from localStorage
 */
export function loadBranding(): CustomBranding {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return getDefaultBranding();

    const stored = JSON.parse(raw);

    // Validate structure
    if (typeof stored !== 'object' || stored === null) {
      return getDefaultBranding();
    }

    return migrateBranding(stored);
  } catch (error) {
    console.warn('[Branding] Failed to load branding:', error);
    return getDefaultBranding();
  }
}

/**
 * Save branding to localStorage
 */
export function saveBranding(branding: CustomBranding): void {
  try {
    const toSave: CustomBranding = {
      ...branding,
      updatedAt: Date.now()
    };
    localStorage.setItem(LS_KEY, JSON.stringify(toSave));
  } catch (error) {
    // Check if quota exceeded
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please reduce logo size or clear other data.');
    }
    throw new Error(`Failed to save branding: ${error}`);
  }
}

/**
 * Convert File to base64 data URL
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Invalid file type. Only images are allowed.'));
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      reject(new Error('Invalid file type. Only PNG and JPEG are supported.'));
      return;
    }

    // Validate file size
    if (file.size > MAX_LOGO_SIZE) {
      reject(new Error(`File too large. Maximum size is ${MAX_LOGO_SIZE / 1024}KB.`));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;

      // Check base64 size
      if (result.length > MAX_LOGO_SIZE_BASE64) {
        reject(new Error('Encoded image too large. Please use a smaller image.'));
        return;
      }

      resolve(result);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Upload and save logo
 */
export async function uploadLogo(file: File): Promise<CustomBranding> {
  const base64 = await fileToBase64(file);

  const current = loadBranding();
  const updated: CustomBranding = {
    ...current,
    logoImage: base64,
    logoImageSize: base64.length,
    updatedAt: Date.now()
  };

  saveBranding(updated);
  return updated;
}

/**
 * Update custom text
 */
export function updateCustomText(text: string | null): CustomBranding {
  if (text && text.length > MAX_TEXT_LENGTH) {
    throw new Error(`Custom text too long. Maximum length is ${MAX_TEXT_LENGTH} characters.`);
  }

  const current = loadBranding();
  const updated: CustomBranding = {
    ...current,
    customText: text ? text.trim() : null,
    updatedAt: Date.now()
  };

  saveBranding(updated);
  return updated;
}

/**
 * Clear logo
 */
export function clearLogo(): CustomBranding {
  const current = loadBranding();
  const updated: CustomBranding = {
    ...current,
    logoImage: null,
    logoImageSize: null,
    updatedAt: Date.now()
  };

  saveBranding(updated);
  return updated;
}

/**
 * Clear all branding
 */
export function clearBranding(): CustomBranding {
  const branding = getDefaultBranding();
  saveBranding(branding);
  return branding;
}

/**
 * Toggle branding enabled/disabled
 */
export function toggleBranding(enabled?: boolean): CustomBranding {
  const current = loadBranding();
  const updated: CustomBranding = {
    ...current,
    enabled: enabled !== undefined ? enabled : !current.enabled,
    updatedAt: Date.now()
  };

  saveBranding(updated);
  return updated;
}

/**
 * Set which timer types show branding
 * Empty array = show on all timers
 */
export function setTimerTypes(types: string[]): CustomBranding {
  const current = loadBranding();
  const updated: CustomBranding = {
    ...current,
    timerTypes: types,
    updatedAt: Date.now()
  };

  saveBranding(updated);
  return updated;
}

/**
 * Set branding position
 */
export function setBrandingPosition(position: 'top' | 'bottom' | 'corner'): CustomBranding {
  const current = loadBranding();
  const updated: CustomBranding = {
    ...current,
    position,
    updatedAt: Date.now()
  };

  saveBranding(updated);
  return updated;
}

/**
 * Estimate localStorage usage
 */
export function estimateStorageUsage(): number {
  let total = 0;
  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const value = localStorage.getItem(key);
        if (value) {
          // UTF-16 = 2 bytes per character
          total += (key.length + value.length) * 2;
        }
      }
    }
  } catch (error) {
    console.warn('[Branding] Failed to estimate storage usage:', error);
  }
  return total;
}

/**
 * Get storage quota used percentage (rough estimate)
 * localStorage limit varies by browser (5-10MB typically)
 */
export function getStorageQuotaPercent(): number {
  const used = estimateStorageUsage();
  const estimatedLimit = 5 * 1024 * 1024; // Conservative 5MB estimate
  return Math.round((used / estimatedLimit) * 100);
}

/**
 * Check if branding should show on given timer type
 */
export function shouldShowBranding(branding: CustomBranding, timerType: string): boolean {
  if (!branding.enabled) return false;
  if (!branding.customText && !branding.logoImage) return false;

  // Empty timerTypes array = show on all timers
  if (branding.timerTypes.length === 0) return true;

  // Check if current timer type is in the list
  return branding.timerTypes.includes(timerType);
}

/**
 * Migrate branding from older versions
 */
function migrateBranding(stored: any): CustomBranding {
  // Current version - validate and return
  if (stored.version === 1) {
    return {
      version: 1,
      enabled: Boolean(stored.enabled),
      customText: stored.customText || null,
      logoImage: stored.logoImage || null,
      logoImageSize: Number(stored.logoImageSize) || null,
      timerTypes: Array.isArray(stored.timerTypes) ? stored.timerTypes : [],
      position: ['top', 'bottom', 'corner'].includes(stored.position) ? stored.position : 'top',
      createdAt: Number(stored.createdAt) || Date.now(),
      updatedAt: Number(stored.updatedAt) || Date.now()
    };
  }

  // Unknown version - return default
  return getDefaultBranding();
}
