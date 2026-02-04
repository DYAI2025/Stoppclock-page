/**
 * AnalogClockHero Component
 * 
 * Vibrant analog clock with gradient ring, gears, and sparkling hover effects.
 * Style-breaking centerpiece showing real system time.
 */

import React, { useState, useEffect, useRef } from 'react';
import '../styles/analog-clock-hero.css';

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  opacity: number;
  hue: number;
}

export function AnalogClockHero() {
  const [time, setTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleIdRef = useRef(0);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Generate particles on hover
  useEffect(() => {
    if (!isHovered) {
      setParticles([]);
      return;
    }

    const particleInterval = setInterval(() => {
      setParticles((prev) => {
        // Add new particles
        const newParticles: Particle[] = [];
        for (let i = 0; i < 3; i++) {
          const angle = Math.random() * Math.PI * 2;
          newParticles.push({
            id: particleIdRef.current++,
            x: 150, // Center
            y: 150,
            angle,
            speed: 0.5 + Math.random() * 1.5,
            size: 2 + Math.random() * 3,
            opacity: 1,
            hue: Math.random() * 60 + (Math.random() > 0.5 ? 180 : 30), // Cyan or Orange
          });
        }

        // Update existing particles
        const updated = [...prev, ...newParticles]
          .map((p) => ({
            ...p,
            x: p.x + Math.cos(p.angle) * p.speed,
            y: p.y + Math.sin(p.angle) * p.speed,
            opacity: p.opacity - 0.02,
          }))
          .filter((p) => p.opacity > 0);

        return updated.slice(-50); // Keep max 50 particles
      });
    }, 50);

    return () => clearInterval(particleInterval);
  }, [isHovered]);

  // Draw particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 300, 300);

    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, ${p.opacity})`;
      ctx.fill();
    });
  }, [particles]);

  // Calculate hand angles
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
  const hourAngle = ((hours + minutes / 60) / 12) * 360;

  return (
    <div className="analog-clock-hero-container">
      <div
        className={`analog-clock-hero ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Particle Canvas */}
        <canvas
          ref={canvasRef}
          className="particle-canvas"
          width={300}
          height={300}
        />

        {/* Gradient Ring */}
        <svg className="gradient-ring" viewBox="0 0 300 300">
          <defs>
            <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="25%" stopColor="#14B8A6" />
              <stop offset="50%" stopColor="#FCD34D" />
              <stop offset="75%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Outer ring */}
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="url(#clockGradient)"
            strokeWidth="8"
            filter="url(#glow)"
            className="outer-ring"
          />
        </svg>

        {/* Clock Face */}
        <div className="clock-face">
          {/* Gears Background */}
          <div className="gears-container">
            <div className="gear gear-1"></div>
            <div className="gear gear-2"></div>
            <div className="gear gear-3"></div>
          </div>

          {/* Hour Markers */}
          <div className="hour-markers">
            {[12, 3, 6, 9].map((hour) => (
              <div
                key={hour}
                className="hour-marker"
                style={{
                  transform: `rotate(${(hour / 12) * 360}deg) translateY(-110px)`,
                }}
              >
                <span style={{ transform: `rotate(-${(hour / 12) * 360}deg)` }}>
                  {hour}
                </span>
              </div>
            ))}
          </div>

          {/* Tick Marks */}
          <div className="tick-marks">
            {Array.from({ length: 60 }).map((_, i) => {
              const isMajor = i % 5 === 0;
              return (
                <div
                  key={i}
                  className={`tick ${isMajor ? 'major' : 'minor'}`}
                  style={{
                    transform: `rotate(${(i / 60) * 360}deg) translateY(-120px)`,
                  }}
                />
              );
            })}
          </div>

          {/* Clock Hands */}
          <div className="clock-hands">
            {/* Hour Hand */}
            <div
              className="hand hour-hand"
              style={{ transform: `rotate(${hourAngle}deg)` }}
            />

            {/* Minute Hand */}
            <div
              className="hand minute-hand"
              style={{ transform: `rotate(${minuteAngle}deg)` }}
            />

            {/* Second Hand */}
            <div
              className="hand second-hand"
              style={{ transform: `rotate(${secondAngle}deg)` }}
            />

            {/* Center Dot */}
            <div className="center-dot" />
          </div>
        </div>

        {/* Sparkle Elements */}
        {isHovered && (
          <>
            <div className="sparkle sparkle-1"></div>
            <div className="sparkle sparkle-2"></div>
            <div className="sparkle sparkle-3"></div>
            <div className="sparkle sparkle-4"></div>
          </>
        )}
      </div>
    </div>
  );
}
