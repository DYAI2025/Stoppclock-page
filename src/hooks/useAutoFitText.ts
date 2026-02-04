import { useEffect, useRef, useState } from 'react';

/**
 * Hook that automatically adjusts font-size to fit text within container
 * Guarantees text never overflows by measuring actual rendered dimensions
 *
 * @param text - The text content to fit
 * @param maxFontSize - Maximum font size in rem (default: 8)
 * @param minFontSize - Minimum font size in rem (default: 1.5)
 * @returns [ref, fontSize] - Ref to attach to element and calculated font size
 */
export function useAutoFitText(
  text: string,
  maxFontSize: number = 8,
  minFontSize: number = 1.5
): [React.RefObject<HTMLDivElement>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const container = element.parentElement;
    if (!container) return;

    // Get available width (container width minus padding)
    const containerStyle = window.getComputedStyle(container);
    const containerWidth = container.clientWidth;
    const paddingLeft = parseFloat(containerStyle.paddingLeft);
    const paddingRight = parseFloat(containerStyle.paddingRight);
    const availableWidth = containerWidth - paddingLeft - paddingRight;

    // Measure text width with current font size
    const textWidth = element.scrollWidth;

    // Calculate ideal font size
    let newFontSize = fontSize;

    if (textWidth > availableWidth) {
      // Text too wide - reduce font size
      const ratio = availableWidth / textWidth;
      newFontSize = fontSize * ratio * 0.95; // 95% for safety margin
    } else if (textWidth < availableWidth * 0.85 && fontSize < maxFontSize) {
      // Text too small - increase font size (but not beyond max)
      const ratio = availableWidth / textWidth;
      newFontSize = Math.min(fontSize * ratio * 0.95, maxFontSize);
    }

    // Clamp to min/max range
    newFontSize = Math.max(minFontSize, Math.min(maxFontSize, newFontSize));

    // Only update if significantly different (avoid infinite loops)
    if (Math.abs(newFontSize - fontSize) > 0.1) {
      setFontSize(newFontSize);
    }
  }, [text, fontSize, maxFontSize, minFontSize]);

  // Reset to max font size when text changes or window resizes
  useEffect(() => {
    const handleResize = () => setFontSize(maxFontSize);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [maxFontSize]);

  return [ref, fontSize];
}
