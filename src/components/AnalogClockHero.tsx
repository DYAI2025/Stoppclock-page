/**
 * AnalogClockHero Component
 *
 * Custom analog clock: SVG Ziffernblatt + PNG hands.
 *
 * The hands point up (12 o'clock) at 0° and rotate clockwise.
 * CSS positions each hand so its "nail" (at 93% down) sits
 * at the clock center. transform-origin: 50% 93% ensures
 * rotation pivots around the nail.
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
        {/* Clock face */}
        <img
          src="/clock/ziffernblatt.svg"
          alt="Stoppclock Ziffernblatt"
          className="clock-layer clock-face-img"
          draggable={false}
        />

        {/* Hour hand */}
        <img
          src="/clock/stundenzeiger.png"
          alt=""
          className="clock-layer clock-hand"
          style={{ transform: `rotate(${hourAngle}deg)` }}
          draggable={false}
        />

        {/* Minute hand */}
        <img
          src="/clock/minutenzeiger.png"
          alt=""
          className="clock-layer clock-hand clock-hand-minute"
          style={{ transform: `rotate(${minuteAngle}deg)` }}
          draggable={false}
        />
      </div>
    </div>
  );
}
