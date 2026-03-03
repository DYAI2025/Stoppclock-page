import React, { useState, useEffect, useCallback } from 'react';
import { AppHeader } from '../components/AppHeader';
import { beep } from '../utils';
import { trackEvent } from '../utils/stats';
import { AdUnit } from '../components/AdUnit';
import { getAdUnit } from '../config/ad-units';
import '../styles/interval-timer.css';

type IntervalPhase = 'work' | 'rest' | 'warmup' | 'cooldown' | 'done';

interface IntervalConfig {
  warmup: number;
  work: number;
  rest: number;
  rounds: number;
  cooldown: number;
}

const DEFAULT_CONFIG: IntervalConfig = {
  warmup: 5,
  work: 30,
  rest: 10,
  rounds: 8,
  cooldown: 0
};

export default function IntervalTimer() {
  const [msg, setMsg] = useState<string>("Ready");
  const [active, setActive] = useState(false);
  const [config, setConfig] = useState<IntervalConfig>(DEFAULT_CONFIG);
  
  // Running State
  const [phase, setPhase] = useState<IntervalPhase>('work');
  const [remaining, setRemaining] = useState(DEFAULT_CONFIG.work);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalTime, setTotalTime] = useState(0); // Elapsed

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (active) {
      t = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 0) {
            handlePhaseChange();
            return 0; // Will be reset by handlePhaseChange side-effect? 
            // Actually handlePhaseChange needs to setRemaining too.
            // Better to do logic here.
          }
          return prev - 1;
        });
        setTotalTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(t);
  }, [active, phase, remaining, currentRound, config]);

  const handlePhaseChange = () => {
    // Current phase finished
    if (phase === 'warmup') {
      enterPhase('work');
    } else if (phase === 'work') {
      beep(600, 800); // Rest Beep
      if (currentRound < config.rounds) {
        enterPhase('rest');
      } else {
        // Last round
        if (config.cooldown > 0) enterPhase('cooldown');
        else finish();
      }
    } else if (phase === 'rest') {
      beep(800, 1200); // Work Beep
      setCurrentRound(r => r + 1);
      enterPhase('work');
    } else if (phase === 'cooldown') {
      finish();
    }
  };

  const enterPhase = (p: IntervalPhase) => {
    setPhase(p);
    switch (p) {
      case 'warmup': setRemaining(config.warmup); break;
      case 'work': setRemaining(config.work); break;
      case 'rest': setRemaining(config.rest); break;
      case 'cooldown': setRemaining(config.cooldown); break;
    }
  };

  const finish = () => {
    setActive(false);
    setPhase('done');
    setMsg("Workout Complete");
    beep(300, 600);
    setTimeout(() => beep(300, 800), 200);
    setTimeout(() => beep(500, 1000), 400);
    trackEvent('interval', 'complete', undefined, { rounds: config.rounds });
  };

  const start = () => {
    if (phase === 'done' || (!active && remaining === 0)) {
       // Reset
       setCurrentRound(1);
       if (config.warmup > 0) enterPhase('warmup');
       else enterPhase('work');
    }
    setActive(true);
    trackEvent('interval', 'start');
  };

  const pause = () => setActive(false);

  const reset = () => {
    setActive(false);
    setPhase('work');
    setRemaining(config.work);
    setCurrentRound(1);
    setMsg("Ready");
  };

  // Helper config setters
  const updateConfig = (key: keyof IntervalConfig, val: number) => {
    setConfig(prev => ({ ...prev, [key]: Math.max(0, val) }));
  };

  return (
    <div className="interval-page">
      <AppHeader title="Interval Timer" actions={{ showHome: true, showFullscreen: true, showTheme: true }} />
      
      <div className="interval-main">
        {!active && phase !== 'done' && (
             <div className="interval-ad-container">
                <AdUnit adUnit={getAdUnit('timer-page') ?? getAdUnit('home-top')!} />
             </div>
        )}

        <div className="interval-display">
          <span className={`iv-phase-label ${phase}`}>
             {msg === "Workout Complete" ? "Done" : (phase === 'done' ? "Ready" : phase)}
          </span>
          <div className="iv-time">
            {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
          </div>
          <div className="iv-rounds">
            Round {currentRound} / {config.rounds}
          </div>
        </div>

        {/* Simple Progress Bar (for current Interval) */}
        <div className="iv-progress-container">
           <div 
             className={`iv-progress-bar ${phase}`}
             style={{ 
               width: `${(remaining / (phase === 'work' ? config.work : (phase === 'rest' ? config.rest : config.warmup))) * 100}%`
             }}
           />
        </div>

        <div className="iv-controls">
           {!active ? (
             <button className="iv-btn iv-btn-primary" onClick={start}>Start</button>
           ) : (
             <button className="iv-btn iv-btn-secondary" onClick={pause}>Pause</button>
           )}
           <button className="iv-btn iv-btn-secondary" onClick={reset}>Reset</button>
        </div>

        </div>

        {/* Settings only visible when not running and not done */ }
        {!active && phase !== 'done' && (
            <div className="iv-settings-card">
              <h3>Configuration</h3>
              <div className="iv-settings-grid">
                <div className="iv-setting-item">
                    <label>Work (s)</label>
                    <input type="number" className="iv-input" value={config.work} onChange={e => updateConfig('work', +e.target.value)} aria-label="Work duration in seconds" />
                </div>
                <div className="iv-setting-item">
                    <label>Rest (s)</label>
                    <input type="number" className="iv-input" value={config.rest} onChange={e => updateConfig('rest', +e.target.value)} aria-label="Rest duration in seconds" />
                </div>
                <div className="iv-setting-item">
                    <label>Rounds</label>
                    <input type="number" className="iv-input" value={config.rounds} onChange={e => updateConfig('rounds', +e.target.value)} aria-label="Number of rounds" />
                </div>
                <div className="iv-setting-item">
                    <label>Warmup (s)</label>
                    <input type="number" className="iv-input" value={config.warmup} onChange={e => updateConfig('warmup', +e.target.value)} aria-label="Warmup duration in seconds" />
                </div>
                <div className="iv-setting-item">
                    <label>Cooldown (s)</label>
                    <input type="number" className="iv-input" value={config.cooldown} onChange={e => updateConfig('cooldown', +e.target.value)} aria-label="Cooldown duration in seconds" />
                </div>
              </div>
            </div>
        )}
    </div>
  );
}
