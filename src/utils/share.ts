import type { TimerType, PresetConfig } from '../types/preset-types';

/**
 * Share utilities for encoding/decoding timer presets into shareable URLs
 * Supports QR code generation and URL parameter handling
 */

export interface ShareablePreset {
  type: TimerType;
  name: string;
  config: PresetConfig;
}

/**
 * Encode a preset into a URL-safe base64 string
 */
export function encodePresetToUrl(preset: ShareablePreset): string {
  try {
    const json = JSON.stringify({
      v: 1, // version
      t: preset.type,
      n: preset.name,
      c: preset.config
    });

    // Convert to base64 and make URL-safe
    const base64 = btoa(json);
    const urlSafe = base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    return urlSafe;
  } catch (error) {
    console.error('Failed to encode preset:', error);
    throw new Error('Fehler beim Erstellen des Share-Links');
  }
}

/**
 * Decode a URL-safe base64 string back to a preset
 */
export function decodePresetFromUrl(encoded: string): ShareablePreset {
  try {
    // Restore base64 format
    let base64 = encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }

    const json = atob(base64);
    const data = JSON.parse(json);

    // Validate version
    if (data.v !== 1) {
      throw new Error('Unsupported preset version');
    }

    return {
      type: data.t,
      name: data.n,
      config: data.c
    };
  } catch (error) {
    console.error('Failed to decode preset:', error);
    throw new Error('Ungültiger Share-Link');
  }
}

/**
 * Generate a full shareable URL for a preset
 */
export function generateShareUrl(preset: ShareablePreset): string {
  const encoded = encodePresetToUrl(preset);
  const baseUrl = window.location.origin + window.location.pathname;

  // Route to the appropriate timer with preset data
  const routes: Record<TimerType, string> = {
    pomodoro: '#/pomodoro',
    countdown: '#/countdown',
    stopwatch: '#/stopwatch',
    cooking: '#/cooking',
    chess: '#/chess',
    metronome: '#/metronome',
    cycle: '#/cycle',
    analog: '#/analog'
  };

  const route = routes[preset.type] || '#/';
  return `${baseUrl}${route}?preset=${encoded}`;
}

/**
 * Extract preset from URL parameters
 */
export function getPresetFromUrl(): ShareablePreset | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const presetParam = params.get('preset');

    if (!presetParam) {
      return null;
    }

    return decodePresetFromUrl(presetParam);
  } catch (error) {
    console.error('Failed to load preset from URL:', error);
    return null;
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw new Error('Kopieren fehlgeschlagen');
  }
}

/**
 * Shorten URL for display (keeps it readable)
 */
export function shortenUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) {
    return url;
  }

  const start = url.substring(0, maxLength - 10);
  const end = url.substring(url.length - 7);
  return `${start}...${end}`;
}
