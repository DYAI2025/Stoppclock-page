import React from 'react';

export function TimerQuickInfo() {
  const items: { name: string; desc: string; href: string }[] = [
    { name: 'Stopwatch', desc: 'Start, stop, and lap times — ideal for measuring tasks.', href: '#/stopwatch' },
    { name: 'Countdown', desc: 'Counts down a fixed duration — with optional warnings.', href: '#/countdown' },
    { name: 'Analog', desc: 'Classic clock face with clear remaining time.', href: '#/analog' },
    { name: 'Pomodoro', desc: 'Focus cycles with breaks — stay productive.', href: '#/pomodoro' },
    { name: 'Cooking Timer', desc: 'Multiple kitchen timers with presets and names.', href: '#/cooking' },
    { name: 'World Clock', desc: 'Track multiple time zones at once.', href: '#/world' },
    { name: 'Alarm', desc: 'Alarms with labels and repeat options.', href: '#/alarm' },
    { name: 'Metronome', desc: 'BPM control with accent on the first beat.', href: '#/metronome' },
    { name: 'Chess Clock', desc: 'Dual clocks with player switching.', href: '#/chess' },
    { name: 'Digital Clock', desc: 'Readable real-time display (12/24h).', href: '#/digital' },
  ];

  return (
    <section className="timer-info" aria-labelledby="timer-info-title">
      <h2 id="timer-info-title">About the Timers</h2>
      <div className="timer-info-grid">
        {items.map(i => (
          <a className="timer-info-item" key={i.name} href={i.href}>
            <span className="timer-info-name">{i.name}</span>
            <span className="timer-info-desc">{i.desc}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default TimerQuickInfo;
