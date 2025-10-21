import React, { useState, useEffect, useRef } from "react";
import { beep, flash } from "../utils";
import { HomeButton } from "../components/HomeButton";

const LS_KEY = "sc.v1.alarm";

type AlarmItem = {
  id: string;
  time: string; // HH:MM format
  enabled: boolean;
  label: string;
};

type Persist = {
  version: 1;
  alarms: AlarmItem[];
};

function load(): Persist {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw new Error("No saved state");
    const p = JSON.parse(raw) as Persist;
    return {
      version: 1,
      alarms: Array.isArray(p.alarms) ? p.alarms : []
    };
  } catch {
    return {
      version: 1,
      alarms: []
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

export default function Alarm() {
  const [st, setSt] = useState<Persist>(load);
  const [showAdd, setShowAdd] = useState(false);
  const [newTime, setNewTime] = useState("12:00");
  const [newLabel, setNewLabel] = useState("");
  const [activeAlarm, setActiveAlarm] = useState<AlarmItem | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const checkInterval = useRef<number | null>(null);
  const ringInterval = useRef<number | null>(null);
  const triggeredAlarms = useRef<Set<string>>(new Set());
  const wrapRef = useRef<HTMLDivElement>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  // Ring alarm continuously
  useEffect(() => {
    if (activeAlarm) {
      // Beep and flash immediately
      beep(1000, 880);
      flash(wrapRef.current, 900);

      // Then beep and flash every 2 seconds until dismissed
      ringInterval.current = window.setInterval(() => {
        beep(1000, 880);
        flash(wrapRef.current, 900);
      }, 2000);
    } else {
      if (ringInterval.current) clearInterval(ringInterval.current);
    }

    return () => {
      if (ringInterval.current) clearInterval(ringInterval.current);
    };
  }, [activeAlarm]);

  useEffect(() => {
    // Check alarms every second
    checkInterval.current = window.setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      // Clear triggered alarms from previous minute
      const currentMinute = now.getHours() * 60 + now.getMinutes();
      if (triggeredAlarms.current.size > 0) {
        const firstKey = Array.from(triggeredAlarms.current)[0];
        const [prevTime] = firstKey.split('-');
        const [prevH, prevM] = prevTime.split(':').map(Number);
        const prevMinute = prevH * 60 + prevM;
        if (currentMinute !== prevMinute) {
          triggeredAlarms.current.clear();
        }
      }

      st.alarms.forEach(alarm => {
        const alarmKey = `${alarm.time}-${alarm.id}`;
        if (alarm.enabled && alarm.time === currentTime && !triggeredAlarms.current.has(alarmKey)) {
          triggeredAlarms.current.add(alarmKey);
          setActiveAlarm(alarm);
        }
      });
    }, 1000);

    return () => {
      if (checkInterval.current) clearInterval(checkInterval.current);
    };
  }, [st.alarms]);

  const addAlarm = () => {
    const newAlarm: AlarmItem = {
      id: Date.now().toString(),
      time: newTime,
      enabled: true,
      label: newLabel
    };
    setSt(s => ({ ...s, alarms: [...s.alarms, newAlarm] }));
    setShowAdd(false);
    setNewTime("12:00");
    setNewLabel("");
  };

  const removeAlarm = (id: string) => {
    setSt(s => ({ ...s, alarms: s.alarms.filter(a => a.id !== id) }));
  };

  const toggleAlarm = (id: string) => {
    setSt(s => ({
      ...s,
      alarms: s.alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a)
    }));
  };

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="alarm-wrap" ref={wrapRef}>
      <HomeButton />
      <h1 className="timer-title">Alarm</h1>

      {/* Current Local Time Display */}
      <div className="current-time-display">
        <div className="current-time-label">Current Time</div>
        <div className="current-time-value">{formatCurrentTime()}</div>
      </div>

      {/* Alarm Modal */}
      {activeAlarm && (
        <div className="alarm-modal">
          <div className="alarm-modal-content">
            <h3>🔔 Alarm!</h3>
            <p className="alarm-modal-time">{activeAlarm.time}</p>
            {activeAlarm.label && <p className="alarm-modal-label">{activeAlarm.label}</p>}
            <button
              className="btn primary"
              onClick={() => setActiveAlarm(null)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="alarm-list">
        {st.alarms.map(alarm => (
          <div key={alarm.id} className="alarm-item">
            <input
              type="checkbox"
              checked={alarm.enabled}
              onChange={() => toggleAlarm(alarm.id)}
            />
            <div className="alarm-info">
              <div className="alarm-time">{alarm.time}</div>
              {alarm.label && <div className="alarm-label">{alarm.label}</div>}
            </div>
            <button className="btn btn-remove" onClick={() => removeAlarm(alarm.id)}>×</button>
          </div>
        ))}
      </div>

      {!showAdd && (
        <button className="btn-primary-action" onClick={() => setShowAdd(true)}>
          Add Alarm
        </button>
      )}

      {showAdd && (
        <div className="add-alarm">
          <input
            type="time"
            value={newTime}
            onChange={e => setNewTime(e.target.value)}
          />
          <input
            type="text"
            placeholder="Label (optional)"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
          />
          <button className="btn primary" onClick={addAlarm}>Save</button>
          <button className="btn" onClick={() => setShowAdd(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
