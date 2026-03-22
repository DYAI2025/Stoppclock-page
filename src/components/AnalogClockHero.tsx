/**
 * AnalogClockHero Component
 *
 * Custom SVG analog clock using designer-provided assets:
 * - ziffernblatt.svg (clock face)
 * - stundenzeiger.svg (hour hand)  — initial orientation ~234° in SVG
 * - minutenzeiger.svg (minute hand) — initial orientation ~210° in SVG
 *
 * All SVGs share viewBox 0 0 1500 1500.
 * Pivot points extracted from SVG clipPath/transform data:
 * - Stundenzeiger pivot: (810, 682) → 54% 45.5%
 * - Minutenzeiger pivot: (786, 715) → 52.4% 47.7%
 *
 * Initial rotation offsets compensate for the hands not pointing
 * to 12 o'clock at 0°. These were calibrated by visual comparison
 * with the reference uhr.svg.
 */

import { useState, useEffect } from 'react';
import '../styles/analog-clock-hero.css';

// SVG hands are not drawn at 12 o'clock — compensate with offsets
const HOUR_HAND_OFFSET = -234;   // stundenzeiger initial angle in SVG
const MINUTE_HAND_OFFSET = -210; // minutenzeiger initial angle in SVG

// Pivot points (% of 1500x1500 viewBox) where hands attach
const HOUR_PIVOT = '54% 45.5%';
const MINUTE_PIVOT = '52.4% 47.7%';

export function AnalogClockHero() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const minuteAngle = ((minutes + seconds / 60) / 60) * 360 + MINUTE_HAND_OFFSET;
  const hourAngle = ((hours + minutes / 60) / 12) * 360 + HOUR_HAND_OFFSET;

  return (
    <div className="analog-clock-hero-container">
      <div className="analog-clock-hero">
        {/* Clock face (background) */}
        <img
          src="/clock/ziffernblatt.svg"
          alt="Stoppclock Ziffernblatt"
          className="clock-layer clock-face-img"
          draggable={false}
        />

        {/* Hour hand — pivots at (810, 682) in SVG coordinates */}
        <img
          src="/clock/stundenzeiger.svg"
          alt=""
          className="clock-layer clock-hand"
          style={{
            transform: `rotate(${hourAngle}deg)`,
            transformOrigin: HOUR_PIVOT,
          }}
          draggable={false}
        />

        {/* Minute hand — pivots at (786, 715) in SVG coordinates */}
        <img
          src="/clock/minutenzeiger.svg"
          alt=""
          className="clock-layer clock-hand"
          style={{
            transform: `rotate(${minuteAngle}deg)`,
            transformOrigin: MINUTE_PIVOT,
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
