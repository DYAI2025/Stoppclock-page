// ... imports
import React, { useState, useEffect, useRef, useCallback } from "react";
import { beep } from "../utils";
import { HomeButton } from "../components/HomeButton";
import { ShareButton } from "../components/ShareButton";
import { SavePresetButton } from "../components/SavePresetButton";
import { AppHeader } from "../components/AppHeader";
import { Play, Clock, Info, ChevronRight, Shield, Award, Users } from "lucide-react";
import { trackEvent } from "../utils/stats";
import { getPresetFromUrl } from "../utils/share";
import "../styles/chess-swiss.css";

const LS_KEY = "sc.v1.chessclock";
const DEFAULT_TIME = 5 * 60 * 1000; // 5 minutes

type Persist = {
  version: 1;
  player1Time: number;
  player2Time: number;
  activePlayer: 1 | 2 | null;
  startedAt: number | null;
};

// ... load and save functions remain the same
function load(): Persist {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw new Error("No saved state");
    const p = JSON.parse(raw) as Persist;
    // Check if session was active very recently (< 1 hour), otherwise reset active state
    const isActive = p.activePlayer && p.startedAt && (Date.now() - p.startedAt < 3600000);
    
    return {
      version: 1,
      player1Time: p.player1Time ?? DEFAULT_TIME,
      player2Time: p.player2Time ?? DEFAULT_TIME,
      activePlayer: isActive ? p.activePlayer : null,
      startedAt: isActive ? p.startedAt : null
    };
  } catch {
    return {
      version: 1,
      player1Time: DEFAULT_TIME,
      player2Time: DEFAULT_TIME,
      activePlayer: null,
      startedAt: null
    };
  }
}

function save(p: Persist) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(p));
  } catch {
    // Silently fail
  }
}

function fmt(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// --- WORLD PAGE COMPONENTS ---

const ChessHero = ({ onStart, onFullscreen }: { onStart: () => void, onFullscreen: () => void }) => (
  <section className="ch-section ch-hero">
    <div className="ch-container">
      <div className="ch-hero-content">
        <span className="ch-hero-eyebrow">The Time Referee</span>
        <h1 className="ch-h1">Chess Timer</h1>
        <p className="ch-tagline">
          When time becomes part of the game.
          <br />I keep the match moving by giving both players the same shared resource.
        </p>
        <div className="ch-hero-actions">
          <button className="ch-btn-primary" onClick={onStart}>
            <Play size={20} className="ch-btn-start-icon" />
            Open Chess Timer
          </button>
          <button className="ch-btn-ghost" onClick={onFullscreen}>
            Full-screen Mode
          </button>
        </div>
      </div>
    </div>
  </section>
);

const ChessCharacter = () => (
  <section className="ch-section">
    <div className="ch-container-narrow">
      <h2 className="ch-h2">Character – A time referee for thinking games</h2>
      <p className="ch-body">
        I’m a quiet referee for games where thinking is part of the challenge. I don’t judge your moves, but I make sure you don’t take forever to make them.
      </p>
      <p className="ch-body">
        History defines me as two clocks united by a single lever. When you press yours, you start mine. This creates a relentless fairness: every second I give you is a second I take from myself.
      </p>
      <p className="ch-body">
        I am not just for Grandmasters. I am for anyone who wants to turn a conversation or a game into a fair exchange of attention.
      </p>
    </div>
  </section>
);

const ChessRituals = () => (
  <section className="ch-section ch-section-alt">
    <div className="ch-container">
      <h2 className="ch-h2 centered">Rituals – Ways to play with time</h2>
      <p className="ch-body centered-limited">
        Three simple ways to let the clock shape your game and your conversations.
      </p>
      <div className="ch-rituals-grid">
        <div className="ch-ritual-card">
          <div className="ch-fact-label">For Fun</div>
          <h3 className="ch-h3">Friendly Rapid Game</h3>
          <p className="ch-body small-text">Perfect for quick decisions and high energy.</p>
          <ol className="ch-ritual-steps">
            <li>Set 5 or 10 minutes per side.</li>
            <li>No increments (sudden death).</li>
            <li>Tap the clock immediately after your move.</li>
            <li>Lose on time = Lose the game.</li>
          </ol>
        </div>
        <div className="ch-ritual-card">
          <div className="ch-fact-label">For Training</div>
          <h3 className="ch-h3">Tournament Practice</h3>
          <p className="ch-body small-text">Simulates real competition pressure.</p>
          <ol className="ch-ritual-steps">
            <li>Set 90 minutes (or 30 for rapid).</li>
            <li>Use the standard 'touch-move' rule.</li>
            <li>Write down your moves while the clock runs.</li>
            <li>Focus on managing your time budget.</li>
          </ol>
        </div>
        <div className="ch-ritual-card">
          <div className="ch-fact-label">For Life</div>
          <h3 className="ch-h3">Fair Debate</h3>
          <p className="ch-body small-text">Ensures equal speaking time in arguments.</p>
          <ol className="ch-ritual-steps">
            <li>Give each person 5 minutes total.</li>
            <li>Tap when you yield the floor.</li>
            <li>You can interrupt, but your clock runs.</li>
            <li>When time is up, you must listen only.</li>
          </ol>
        </div>
      </div>
    </div>
  </section>
);

const ChessEffects = () => (
  <section className="ch-section">
    <div className="ch-container">
      <h2 className="ch-h2">Effects – When seconds become strategy</h2>
      <div className="ch-effects-split">
        <div>
          <h3 className="ch-h3">Practical Effects</h3>
          <ul className="ch-effect-list">
            <li>Prevents "Analysis Paralysis" by forcing a decision.</li>
            <li>Ensures the game finishes within a predictable timeframe.</li>
            <li>Adds a new resource management layer to the game.</li>
          </ul>
        </div>
        <div>
          <h3 className="ch-h3">Psychological Effects</h3>
          <ul className="ch-effect-list">
            <li>Increases adrenaline as the flag (end time) approaches.</li>
            <li>Teaches decisiveness under uncertainty.</li>
            <li>Creates a rhythm of "Think, Move, Tap" that becomes meditative.</li>
          </ul>
        </div>
      </div>

      <div className="ch-experiment-block">
        <h3 className="ch-h3">A Small Experiment</h3>
        <p className="ch-body no-margin">
          Try playing the first 10 moves of a game <i>instantly</i> (within 5 seconds). See how it changes your intuition vs. calculation balance. Speed often forces you to play more honest, natural moves.
        </p>
      </div>
    </div>
  </section>
);

const ChessFacts = () => (
  <section className="ch-section ch-section-alt">
    <div className="ch-container">
      <h2 className="ch-h2">Time Facts – Notes from the clock</h2>
      <div className="ch-facts-grid">
        <div className="ch-fact-plaque">
          <span className="ch-fact-label">History</span>
          <h3 className="ch-h3">Born in 1883</h3>
          <p className="ch-body small-text no-margin">
            The first mechanical chess clock was invented by Thomas Bright Wilson used at the London 1883 tournament. Before that, games could last for 14 hours or more!
          </p>
        </div>
        <div className="ch-fact-plaque">
          <span className="ch-fact-label">Culture</span>
          <h3 className="ch-h3">The "Flag"</h3>
          <p className="ch-body small-text no-margin">
            Old analog clocks had a small red flag that would fall when the minute hand passed 12. "Her flag fell" is still used today to mean running out of time.
          </p>
        </div>
        <div className="ch-fact-plaque">
          <span className="ch-fact-label">Science</span>
          <h3 className="ch-h3">Time Pressure</h3>
          <p className="ch-body small-text no-margin">
            Under time pressure (Zeitnot), the brain switches from slow, calculated System 2 thinking to fast, intuitive System 1 thinking.
          </p>
        </div>
      </div>
       <div className="ch-footer-note">
          <p>You can use this timer for classic chess, casual games, or any back-and-forth where both sides should have the same time.</p>
          <a href="#/" className="ch-back-link">← Back to all timers</a>
        </div>
    </div>
  </section>
);

// --- PLAYER COMPONENT (Original Logic) ---

function ChessTimerPlayer({ onExit }: { onExit: () => void }) {
  const [st, setSt] = useState<Persist>(load);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const [showSettings, setShowSettings] = useState(false);
  // const [rotateOpponent, setRotateOpponent] = useState(false); // Removed rotation

  const [tempMinutes, setTempMinutes] = useState('');
  const [urlChecked, setUrlChecked] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const rafRef = useRef<number | undefined>();

  // Get current config for sharing/saving
  const getCurrentConfig = useCallback(() => {
    return {
      player1Time: st.player1Time,
      player2Time: st.player2Time,
      initialTime: Math.floor(st.player1Time / 60000) // minutes
    };
  }, [st.player1Time, st.player2Time]);

  // URL Preset Loading
  useEffect(() => {
    if (urlChecked) return;

    const sharedPreset = getPresetFromUrl();
    if (sharedPreset && sharedPreset.type === 'chess') {
      const config = sharedPreset.config;
      // Fixed: safely access initialTime
      const initialTime = config.initialTime;
      const time = config.player1Time || (initialTime ? initialTime * 60000 : undefined) || DEFAULT_TIME;
      setSt({
        version: 1,
        player1Time: time,
        player2Time: time,
        activePlayer: null,
        startedAt: null
      });
    }
    setUrlChecked(true);
  }, [urlChecked]);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  useEffect(() => {
    if (showSettings) {
      // Initialize with current P1 time in minutes
      setTempMinutes(String(Math.floor(st.player1Time / 60000) || 5));
    }
  }, [showSettings]);

  useEffect(() => {
    if (st.activePlayer && st.startedAt) {
      const loop = () => {
        const now = Date.now();
        const elapsed = now - st.startedAt!;

        // Check if time has run out
        if (st.activePlayer === 1) {
          const newTime = Math.max(0, st.player1Time - elapsed);
          if (newTime === 0) {
            // Track game completion
            if (gameStartTime) {
              const gameDuration = now - gameStartTime;
              trackEvent('chess', 'complete', gameDuration);
            }
            beep(1000, 660);
            setSt(s => ({ ...s, activePlayer: null, startedAt: null, player1Time: 0 }));
            setGameStartTime(null);
            return;
          }
        } else if (st.activePlayer === 2) {
          const newTime = Math.max(0, st.player2Time - elapsed);
          if (newTime === 0) {
            // Track game completion
            if (gameStartTime) {
              const gameDuration = now - gameStartTime;
              trackEvent('chess', 'complete', gameDuration);
            }
            beep(1000, 660);
            setSt(s => ({ ...s, activePlayer: null, startedAt: null, player2Time: 0 }));
            setGameStartTime(null);
            return;
          }
        }

        // Force re-render to update display
        forceUpdate();
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [st.activePlayer, st.startedAt, st.player1Time, st.player2Time]);

  const switchToPlayer = (clickedPlayer: 1 | 2) => {
    const now = Date.now();

    if (!st.activePlayer) {
      // First click: start the clicked player's timer
      // Track game start
      trackEvent('chess', 'start');
      setGameStartTime(now);
      setSt(s => ({ ...s, activePlayer: clickedPlayer, startedAt: now }));
      return;
    }

    // If clicking the currently active player, switch to the opponent
    if (st.activePlayer === clickedPlayer) {
      const elapsed = now - (st.startedAt ?? now);
      const opponent = clickedPlayer === 1 ? 2 : 1;

      setSt(s => ({
        ...s,
        player1Time: s.activePlayer === 1 ? Math.max(0, s.player1Time - elapsed) : s.player1Time,
        player2Time: s.activePlayer === 2 ? Math.max(0, s.player2Time - elapsed) : s.player2Time,
        activePlayer: opponent,
        startedAt: now
      }));
    }
    // If clicking the inactive player, do nothing (prevent accidental switches)
  };

  const reset = () => {
    setSt({
      version: 1,
      player1Time: DEFAULT_TIME,
      player2Time: DEFAULT_TIME,
      activePlayer: null,
      startedAt: null
    });
    setGameStartTime(null);
  };

  const applyTimeSettings = () => {
    let mins = parseInt(tempMinutes);
    if (isNaN(mins) || mins < 1) mins = 1;
    if (mins > 1440) mins = 1440; // Max 24 hours

    const newTime = mins * 60 * 1000;
    setSt({
      version: 1,
      player1Time: newTime,
      player2Time: newTime,
      activePlayer: null,
      startedAt: null
    });
    setShowSettings(false);
  };

  const currentP1Time = st.activePlayer === 1 && st.startedAt
    ? Math.max(0, st.player1Time - (Date.now() - st.startedAt))
    : st.player1Time;

  const currentP2Time = st.activePlayer === 2 && st.startedAt
    ? Math.max(0, st.player2Time - (Date.now() - st.startedAt))
    : st.player2Time;

  return (
    <div className="chess-wrap">
      <AppHeader
        title="Chess Clock"
        breadcrumbs={[
          { label: 'Home', href: '#/' },
          { label: 'Chess Clock' }
        ]}
        actions={{
          showShare: true,
          onShare: () => {
            // Trigger share modal through ShareButton component
            const shareBtn = document.querySelector('.chess-share-button-wrapper .btn-share') as HTMLButtonElement;
            if (shareBtn) shareBtn.click();
          },
          showFullscreen: true,
          showTheme: true,
          showSettings: true,
          showHome: true
        }}
        variant="timer"
      />

      {/* Time Settings Modal */}
      {showSettings && (
        <div className="chess-settings-modal">
          <div className="chess-settings-content">
            <h3>Set Time</h3>
            <div className="time-input-group">
              <label htmlFor="chess-minutes">Minutes per player:</label>
              <input
                id="chess-minutes"
                type="number"
                min="1"
                max="1440"
                value={tempMinutes}
                onChange={(e) => setTempMinutes(e.target.value)}
              />
            </div>
            <div className="chess-settings-buttons">
              <button type="button" className="btn primary" onClick={applyTimeSettings}>
                Apply
              </button>
              <button type="button" className="btn" onClick={() => setShowSettings(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`player player-1 ${st.activePlayer === 1 ? 'active' : ''}`}
        onClick={() => switchToPlayer(1)}
        style={{ transform: undefined }}
      >
        <div className="chess-piece">♔</div>
        <div className="player-label">Player 1</div>
        <div className="player-time">{fmt(currentP1Time)}</div>
      </div>

      <div className="chess-controls">
        <button type="button" className="btn" onClick={reset}>Reset</button>
        <button type="button" className="btn" onClick={() => setShowSettings(true)}>Time</button>
        <SavePresetButton
          timerType="chess"
          getCurrentConfig={getCurrentConfig}
          className="btn"
        />
        <ShareButton
          timerType="chess"
          getCurrentConfig={getCurrentConfig}
          className="btn"
        />
      </div>

      {/* Share & Save Buttons - Hidden but accessible for header integration */}
      {/* <div className="chess-share-buttons" style={{ display: 'none' }}>
        <div className="chess-share-button-wrapper">
          <SavePresetButton
            timerType="chess"
            getCurrentConfig={getCurrentConfig}
          />
        </div>
        <div className="chess-share-button-wrapper">
          <ShareButton
            timerType="chess"
            getCurrentConfig={getCurrentConfig}
          />
        </div>
      </div> */}

      <div
        className={`player player-2 ${st.activePlayer === 2 ? 'active' : ''}`}
        onClick={() => switchToPlayer(2)}
      >
        <div className="chess-piece chess-piece-black">♚</div>
        <div className="player-label">Player 2</div>
        <div className="player-time">{fmt(currentP2Time)}</div>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function ChessClock() {
  // Start directly in player mode - users expect to see the timer
  const [mode, setMode] = useState<'world' | 'player'>('player');

  if (mode === 'player') {
    return <ChessTimerPlayer onExit={() => setMode('world')} />;
  }

  return (
    <div className="chess-world-page">
      <header className="couples-header">
         <HomeButton />
         <span className="ch-world-header-accent">
           World 05
         </span>
      </header>
      
      <main className="chess-world">
        <ChessHero onStart={() => setMode('player')} onFullscreen={() => setMode('player')} />
        <ChessCharacter />
        <ChessRituals />
        <ChessEffects />
        <ChessFacts />
      </main>
    </div>
  );
}
