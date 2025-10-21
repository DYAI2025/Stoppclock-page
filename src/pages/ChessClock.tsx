import React, { useState, useEffect, useRef } from "react";
import { beep } from "../utils";
import { HomeButton } from "../components/HomeButton";

const LS_KEY = "sc.v1.chessclock";
const DEFAULT_TIME = 5 * 60 * 1000; // 5 minutes

type Persist = {
  version: 1;
  player1Time: number;
  player2Time: number;
  activePlayer: 1 | 2 | null;
  startedAt: number | null;
};

function load(): Persist {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw new Error("No saved state");
    const p = JSON.parse(raw) as Persist;
    return {
      version: 1,
      player1Time: p.player1Time ?? DEFAULT_TIME,
      player2Time: p.player2Time ?? DEFAULT_TIME,
      activePlayer: p.activePlayer ?? null,
      startedAt: p.startedAt ?? null
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

export default function ChessClock() {
  const [st, setSt] = useState<Persist>(load);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const [showSettings, setShowSettings] = useState(false);
  const [tempMinutes, setTempMinutes] = useState(5);
  const rafRef = useRef<number | undefined>();

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  useEffect(() => {
    if (st.activePlayer && st.startedAt) {
      const loop = () => {
        const now = Date.now();
        const elapsed = now - st.startedAt!;

        // Check if time has run out
        if (st.activePlayer === 1) {
          const newTime = Math.max(0, st.player1Time - elapsed);
          if (newTime === 0) {
            beep(1000, 660);
            setSt(s => ({ ...s, activePlayer: null, startedAt: null, player1Time: 0 }));
            return;
          }
        } else if (st.activePlayer === 2) {
          const newTime = Math.max(0, st.player2Time - elapsed);
          if (newTime === 0) {
            beep(1000, 660);
            setSt(s => ({ ...s, activePlayer: null, startedAt: null, player2Time: 0 }));
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
  };

  const applyTimeSettings = () => {
    const newTime = tempMinutes * 60 * 1000;
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
      <HomeButton />

      {/* Time Settings Modal */}
      {showSettings && (
        <div className="chess-settings-modal">
          <div className="chess-settings-content">
            <h3>Zeit einstellen</h3>
            <div className="time-input-group">
              <label htmlFor="chess-minutes">Minuten pro Spieler:</label>
              <input
                id="chess-minutes"
                type="number"
                min="1"
                max="180"
                value={tempMinutes}
                onChange={(e) => setTempMinutes(Math.max(1, Math.min(180, parseInt(e.target.value) || 1)))}
              />
            </div>
            <div className="chess-settings-buttons">
              <button type="button" className="btn primary" onClick={applyTimeSettings}>
                Anwenden
              </button>
              <button type="button" className="btn" onClick={() => setShowSettings(false)}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`player player-1 ${st.activePlayer === 1 ? 'active' : ''}`}
        onClick={() => switchToPlayer(1)}
      >
        <div className="chess-piece">♔</div>
        <div className="player-label">Player 1</div>
        <div className="player-time">{fmt(currentP1Time)}</div>
      </div>

      <div className="chess-controls">
        <button type="button" className="btn" onClick={reset}>Reset</button>
        <button type="button" className="btn" onClick={() => setShowSettings(true)}>Zeit</button>
      </div>

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
