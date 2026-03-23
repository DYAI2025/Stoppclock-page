/**
 * AnalogClockHero Component
 *
 * Custom SVG analog clock using designer-provided assets.
 * All SVGs share viewBox 0 0 1500 1500, layered with CSS.
 *
 * Hands rotate around the center of the SVG canvas (50% 50% = 750,750).
 * Initial offset angles compensate for the hands not being drawn at 12 o'clock.
 *
 * Calibration: add ?ho=N&mo=N to URL to adjust offsets (degrees).
 * Example: /#/?ho=-200&mo=-180
 */

import { useState, useEffect } from 'react';
import '../styles/analog-clock-hero.css';

// Parse calibration offsets from URL hash query params
function getCalibrationOffsets(): { hourOffset: number; minuteOffset: number } {
  const hash = window.location.hash || '';
  const queryPart = hash.split('?')[1] || '';
  const params = new URLSearchParams(queryPart);
  return {
    hourOffset: Number(params.get('ho')) || 0,
    minuteOffset: Number(params.get('mo')) || 0,
  };
}

export function AnalogClockHero() {
  const [time, setTime] = useState(new Date());
  const [offsets, setOffsets] = useState(getCalibrationOffsets);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Re-read calibration on hash change
  useEffect(() => {
    const handler = () => setOffsets(getCalibrationOffsets());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Calculate angles (0° = 12 o'clock, clockwise)
  const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
  const hourAngle = ((hours + minutes / 60) / 12) * 360;

  // Apply calibration offsets
  const finalHourAngle = hourAngle + offsets.hourOffset;
  const finalMinuteAngle = minuteAngle + offsets.minuteOffset;

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

        {/* Hour hand — rotates around center of 1500x1500 canvas */}
        <img
          src="/clock/stundenzeiger.svg"
          alt=""
          className="clock-layer clock-hand"
          style={{ transform: `rotate(${finalHourAngle}deg)` }}
          draggable={false}
        />

        {/* Minute hand — rotates around center of 1500x1500 canvas */}
        <img
          src="/clock/minutenzeiger.svg"
          alt=""
          className="clock-layer clock-hand"
          style={{ transform: `rotate(${finalMinuteAngle}deg)` }}
          draggable={false}
        />
      </div>
    </div>
  );
}
