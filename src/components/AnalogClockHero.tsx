/**
 * AnalogClockHero Component
 *
 * Custom SVG analog clock using designer-provided assets:
 * - ziffernblatt.svg (clock face)
 * - stundenzeiger.svg (hour hand)
 * - minutenzeiger.svg (minute hand)
 *
 * All SVGs share viewBox 0 0 1500 1500, layered with CSS.
 * Hands rotate around the center (750, 750) to show real local time.
 */

import { useState, useEffect } from 'react';
import '../styles/analog-clock-hero.css';

export function AnalogClockHero() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
  const hourAngle = ((hours + minutes / 60) / 12) * 360;

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

        {/* Hour hand */}
        <img
          src="/clock/stundenzeiger.svg"
          alt=""
          className="clock-layer clock-hand-hour"
          style={{ transform: `rotate(${hourAngle}deg)` }}
          draggable={false}
        />

        {/* Minute hand */}
        <img
          src="/clock/minutenzeiger.svg"
          alt=""
          className="clock-layer clock-hand-minute"
          style={{ transform: `rotate(${minuteAngle}deg)` }}
          draggable={false}
        />
      </div>
    </div>
  );
}
