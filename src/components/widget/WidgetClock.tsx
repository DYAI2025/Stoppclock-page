/**
 * WidgetClock Component
 * 
 * Analog clock widget with live time display.
 * Features smooth second hand animation and clean design.
 */

import React, { useState, useEffect, useRef } from 'react';
import { WidgetCard } from './WidgetCard';

export interface WidgetClockProps {
  /** Clock label */
  label?: string;
  /** Time zone (optional, defaults to local) */
  timezone?: string;
  /** Grid column span */
  span?: 1 | 2 | 3;
}

export const WidgetClock: React.FC<WidgetClockProps> = ({
  label = 'Current Time',
  timezone,
  span
}) => {
  const [time, setTime] = useState(new Date());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get time
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    // Background circle
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Hour markers
    ctx.strokeStyle = '#1C1C1E';
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6 - Math.PI / 2;
      const len = i % 3 === 0 ? radius * 0.15 : radius * 0.08;
      ctx.beginPath();
      ctx.moveTo(
        cx + Math.cos(angle) * (radius - len),
        cy + Math.sin(angle) * (radius - len)
      );
      ctx.lineTo(
        cx + Math.cos(angle) * (radius - 5),
        cy + Math.sin(angle) * (radius - 5)
      );
      ctx.lineWidth = i % 3 === 0 ? 3 : 2;
      ctx.stroke();
    }

    // Hour hand
    const hourAngle = ((hours + minutes / 60) * Math.PI) / 6 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(
      cx + Math.cos(hourAngle) * radius * 0.5,
      cy + Math.sin(hourAngle) * radius * 0.5
    );
    ctx.strokeStyle = '#1C1C1E';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Minute hand
    const minuteAngle = ((minutes + seconds / 60) * Math.PI) / 30 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(
      cx + Math.cos(minuteAngle) * radius * 0.7,
      cy + Math.sin(minuteAngle) * radius * 0.7
    );
    ctx.strokeStyle = '#1C1C1E';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Second hand (accent color)
    const secondAngle = (seconds * Math.PI) / 30 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(
      cx + Math.cos(secondAngle) * radius * 0.8,
      cy + Math.sin(secondAngle) * radius * 0.8
    );
    ctx.strokeStyle = 'var(--widget-accent-primary)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#1C1C1E';
    ctx.fill();
  }, [time]);

  const formatDigitalTime = (): string => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  return (
    <WidgetCard span={span}>
      <div className="widget-flex widget-flex-col widget-gap-4 widget-items-center">
        <span className="widget-text-tertiary">{label}</span>
        <canvas
          ref={canvasRef}
          width={160}
          height={160}
          style={{ display: 'block' }}
        />
        <div className="widget-text-primary" style={{ fontSize: 'var(--widget-text-xl)' }}>
          {formatDigitalTime()}
        </div>
      </div>
    </WidgetCard>
  );
};
