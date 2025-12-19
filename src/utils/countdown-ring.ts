/**
 * Countdown Ring Utilities
 * Color gradients, tick calculations, and text fitting for the countdown ring UI
 */

/**
 * Calculate ring color based on remaining seconds
 * Returns a CSS color value transitioning through UV/IR spectrum
 */
export function uvIrColor(remainingSec: number): string {
  // Critical state (≤2s): pulsing red
  if (remainingSec <= 2) {
    return "var(--semantic-error, #EF4444)";
  }

  // Danger state (≤20s): orange to red gradient
  if (remainingSec <= 20) {
    const progress = remainingSec / 20; // 1.0 at 20s → 0.0 at 0s
    const hue = Math.floor(progress * 30); // 0° (red) → 30° (orange)
    return `hsl(${hue}, 85%, 55%)`;
  }

  // Normal state: cyan to green gradient (120s window)
  const clampedSec = Math.min(remainingSec, 120);
  const progress = clampedSec / 120; // 0.0 at 0s → 1.0 at 120s
  const hue = 180 + progress * 60; // 180° (cyan) → 240° (blue-cyan)
  return `hsl(${hue}, 75%, 55%)`;
}

/**
 * Calculate glow intensity based on remaining seconds
 * Returns CSS box-shadow value
 */
export function uvIrGlow(remainingSec: number): string {
  const color = uvIrColor(remainingSec);

  // Critical state: intense glow
  if (remainingSec <= 2) {
    return `0 0 20px ${color}, 0 0 40px ${color}`;
  }

  // Danger state: moderate glow
  if (remainingSec <= 20) {
    const intensity = 10 + ((20 - remainingSec) / 20) * 10; // 10px → 20px
    return `0 0 ${intensity}px ${color}`;
  }

  // Normal state: subtle glow
  return `0 0 8px ${color}`;
}

/**
 * Calculate number of active ticks to display
 * Ticks represent seconds remaining in the current minute
 */
export function calculateTickDisplay(remainingMs: number): {
  activeTickCount: number;
  remainingSec: number;
  secInMinute: number;
} {
  const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

  // Special case: if exactly 0 seconds, show 0 ticks
  if (remainingSec === 0) {
    return { activeTickCount: 0, remainingSec: 0, secInMinute: 0 };
  }

  // Calculate seconds within current minute (1-60)
  const secInMinute = remainingSec % 60;

  // Special case: multiples of 60 should show full ring (60 ticks)
  const activeTickCount = secInMinute === 0 ? 60 : secInMinute;

  return { activeTickCount, remainingSec, secInMinute };
}

/**
 * Calculate font size to fit time text within ring
 * @param containerWidth Width of the ring container in pixels
 * @param textLength Approximate character count of time string
 * @returns Font size in rem units
 */
export function fitTimeToRing(
  containerWidth: number,
  textLength: number
): number {
  // Ring inner diameter is approximately 70% of container width
  const innerDiameter = containerWidth * 0.7;

  // Estimate character width as 0.6 of font size
  const charWidth = 0.6;
  const targetWidth = innerDiameter * 0.9; // 90% of inner diameter

  const calculatedSize = targetWidth / (textLength * charWidth);

  // Clamp to reasonable bounds (rem units)
  const minSize = 1.5; // 24px
  const maxSize = 8.0; // 128px

  return Math.max(minSize, Math.min(maxSize, calculatedSize / 16));
}

/**
 * Calculate progress circle stroke-dashoffset for smooth animation
 */
export function calculateProgressOffset(
  remainingMs: number,
  totalMs: number,
  circumference: number
): number {
  if (totalMs <= 0) return circumference;

  const progress = Math.max(0, Math.min(1, remainingMs / totalMs));
  return circumference - progress * circumference;
}
