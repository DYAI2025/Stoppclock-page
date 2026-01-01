/**
 * CountdownRing Component
 * 60-tick SVG ring visualization with danger/critical states
 */

import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  uvIrColor,
  uvIrGlow,
  calculateTickDisplay,
  calculateProgressOffset,
  fitTimeToRing,
} from "../utils/countdown-ring";

interface CountdownRingProps {
  totalMs: number;
  remainingMs: number;
  running: boolean;
  dangerThreshold?: number;
  criticalThreshold?: number;
  showProgressRing?: boolean;
  timeFormatter: (ms: number) => string;
}

export const CountdownRing: React.FC<CountdownRingProps> = ({
  totalMs,
  remainingMs,
  running,
  dangerThreshold = 20000, // 20 seconds
  criticalThreshold = 2000, // 2 seconds
  showProgressRing = true,
  timeFormatter,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(4);

  // Calculate tick display
  const { activeTickCount, remainingSec } = useMemo(
    () => calculateTickDisplay(remainingMs),
    [remainingMs]
  );

  // Determine state
  const isDanger =
    remainingMs <= dangerThreshold && remainingMs > criticalThreshold;
  const isCritical = remainingMs <= criticalThreshold && remainingMs > 0;
  const isExpired = remainingMs === 0;

  // Calculate ring color and glow
  const ringColor = useMemo(() => uvIrColor(remainingSec), [remainingSec]);
  const ringGlow = useMemo(() => uvIrGlow(remainingSec), [remainingSec]);

  // Progress ring calculations
  const radius = 42; // Slightly smaller than viewBox to allow for stroke width
  const circumference = 2 * Math.PI * radius;
  const progressOffset = useMemo(
    () => calculateProgressOffset(remainingMs, totalMs, circumference),
    [remainingMs, totalMs, circumference]
  );

  // Generate 60 ticks once on mount
  const ticks = useMemo(() => {
    const tickElements = [];
    const tickCount = 60;
    const tickRadius = 45;
    const tickLength = 3;
    const tickStartRadius = tickRadius - tickLength;

    for (let i = 0; i < tickCount; i++) {
      const angle = (i * 360) / tickCount - 90; // Start at top (-90°)
      const angleRad = (angle * Math.PI) / 180;

      const x1 = 50 + tickStartRadius * Math.cos(angleRad);
      const y1 = 50 + tickStartRadius * Math.sin(angleRad);
      const x2 = 50 + tickRadius * Math.cos(angleRad);
      const y2 = 50 + tickRadius * Math.sin(angleRad);

      // Tick is active if it's within the activeTickCount
      // Ticks count down clockwise from top
      const isActive = i < activeTickCount;

      tickElements.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className={`countdown-tick ${isActive ? "active" : ""}`}
          stroke={isActive ? ringColor : "var(--ocean-deep, #0A1628)"}
          strokeWidth="1"
          strokeLinecap="round"
        />
      );
    }

    return tickElements;
  }, [activeTickCount, ringColor]);

  // Auto-fit text to ring
  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const updateFontSize = () => {
      const containerWidth = containerRef.current?.offsetWidth || 300;
      const timeText = timeFormatter(remainingMs);
      const newSize = fitTimeToRing(containerWidth, timeText.length);
      setFontSize(newSize);
    };

    updateFontSize();

    // Update on resize
    const resizeObserver = new ResizeObserver(updateFontSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [remainingMs, timeFormatter]);

  // Build state classes
  const stateClasses = [
    "countdown-ring-container",
    running && "running",
    isDanger && "danger",
    isCritical && "critical",
    isExpired && "expired",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className={stateClasses}
      style={
        {
          "--ring": ringColor,
          "--glow": ringGlow,
        } as React.CSSProperties
      }
    >
      <svg className="countdown-ring-svg" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--ocean-light, #E6F2FA)"
          strokeWidth="0.5"
          opacity="0.3"
        />

        {/* Progress ring (smooth animation) */}
        {showProgressRing && (
          <circle
            className="countdown-progress-ring"
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            transform="rotate(-90 50 50)"
          />
        )}

        {/* 60 ticks */}
        <g className="countdown-ticks">{ticks}</g>
      </svg>

      {/* Time display */}
      <div
        ref={textRef}
        className="countdown-ring-time"
        style={{ fontSize: `${fontSize}rem` }}
      >
        {timeFormatter(remainingMs)}
      </div>
    </div>
  );
};
