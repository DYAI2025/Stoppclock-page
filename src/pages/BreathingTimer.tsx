import React, { useState, useEffect, useRef } from 'react';
import { AppHeader } from '../components/AppHeader';
import { trackEvent } from '../utils/stats';
import '../styles/breathing-timer.css';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'hold2'; // hold (after in), hold2 (after out)

interface Pattern {
  name: string;
  phases: {
    inhale: number;
    hold: number;
    exhale: number;
    hold2: number; // Empty hold
  };
  label: string;
}

const PATTERNS: Pattern[] = [
  { name: 'Coherence', phases: { inhale: 5, hold: 0, exhale: 5, hold2: 0 }, label: 'Coherence (Balance)' },
  { name: 'Box Breathing', phases: { inhale: 4, hold: 4, exhale: 4, hold2: 4 }, label: 'Box Breathing (Focus)' },
  { name: '4-7-8', phases: { inhale: 4, hold: 7, exhale: 8, hold2: 0 }, label: '4-7-8 (Relax)' },
];

export default function BreathingTimer() {
  const [active, setActive] = useState(false);
  const [patternIdx, setPatternIdx] = useState(0);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [timeLeft, setTimeLeft] = useState(PATTERNS[0].phases.inhale);
  
  // Visual Scaling State (0 to 1)
  // We can drive this via CSS transitions rather than JS frames for smoothness in this case
  // But we need to know "target state".
  // Inhale -> Scale Up
  // Exhale -> Scale Down
  
  const pattern = PATTERNS[patternIdx];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (active) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            // Next Phase
            const next = nextPhase(phase, pattern);
            setPhase(next.phase);
            return next.duration;
          }
          return prev - 0.1; // 100ms ticks
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [active, phase, patternIdx]);

  // Reset when pattern changes
  useEffect(() => {
    setActive(false);
    setPhase('inhale');
    setTimeLeft(pattern.phases.inhale);
  }, [patternIdx]);

  function nextPhase(current: BreathPhase, pat: Pattern): { phase: BreathPhase, duration: number } {
    switch (current) {
      case 'inhale': 
        return pat.phases.hold > 0 
          ? { phase: 'hold', duration: pat.phases.hold } 
          : { phase: 'exhale', duration: pat.phases.exhale };
      case 'hold':
        return { phase: 'exhale', duration: pat.phases.exhale };
      case 'exhale':
        return pat.phases.hold2 > 0
          ? { phase: 'hold2', duration: pat.phases.hold2 }
          : { phase: 'inhale', duration: pat.phases.inhale };
      case 'hold2':
        return { phase: 'inhale', duration: pat.phases.inhale };
    }
  }

  // Derived visuals
  const getScale = () => {
    // We want CSS to handle smooth transition, so we just set classes
    if (!active) return 0.5; // Resting state
    // Actually, CSS animation might be better. 
    // Let's stick to inline style transition for simplicity with JS state? 
    // No, JS controls timing perfectly.
    // Let's rely on CSS transition duration matching the phase duration.
    return 1; 
  };
  
  const getInstruction = () => {
    if (!active) return "Press Start to begin";
    switch (phase) {
      case 'inhale': return "Breathe In";
      case 'hold': return "Hold";
      case 'exhale': return "Breathe Out";
      case 'hold2': return "Hold";
    }
  };

  const currentDuration = (() => {
    switch (phase) {
      case 'inhale': return pattern.phases.inhale;
      case 'hold': return pattern.phases.hold;
      case 'exhale': return pattern.phases.exhale;
      case 'hold2': return pattern.phases.hold2;
    }
  })();

  // Calculating scale for CSS
  // Inhale: 0.3 -> 1.0
  // Hold: Stay
  // Exhale: 1.0 -> 0.3
  // Hold2: Stay
  
  // Ideally, valid CSS:
  // transition: transform ${duration}s linear
  // transform: scale(1) or scale(0.3)
  
  const [targetScale, setTargetScale] = useState(0.3);
  const [transitionDuration, setTransitionDuration] = useState(0);

  useEffect(() => {
    if (!active) {
      setTargetScale(0.3);
      setTransitionDuration(0.5);
      return;
    }

    setTransitionDuration(currentDuration);

    if (phase === 'inhale') setTargetScale(1.0);
    else if (phase === 'exhale') setTargetScale(0.3);
    // Holds keep previous scale (React doesn't re-render if value is same? No, state persists)
    
  }, [phase, active, currentDuration]);
  
  return (
    <div className="breathing-page">
      <AppHeader
        title="Breathing"
        actions={{ showHome: true, showFullscreen: true, showTheme: true }}
      />
      
      <div className="breathing-container">
        <div 
          className="breath-circle"
          style={{
            transform: `scale(${targetScale})`,
            transition: `transform ${transitionDuration}s linear`,
            // Pulse effect can be added
          }}
        >
           <span className="breath-label">{active ? getInstruction() : "Ready"}</span>
        </div>
      </div>

      <div className="breath-instruction">
        {pattern.label}
      </div>

      <div className="breath-controls">
        <button 
          className="breath-btn primary"
          onClick={() => {
             setActive(!active);
             if (!active) trackEvent('breathing_timer', 'start', pattern.name);
          }}
        >
          {active ? 'Pause' : 'Start'}
        </button>
      </div>

      <div className="breath-techniques">
        {PATTERNS.map((p, i) => (
          <button
            key={p.name}
            className={`technique-chip ${i === patternIdx ? 'active' : ''}`}
            onClick={() => setPatternIdx(i)}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
