import { useLang } from '../hooks/useLang';

export function TimerQuickInfo() {
  const [lang] = useLang();
  const items: { key: string; name: string; desc: string }[] = [
    { key: 'stopwatch', name: 'Stopwatch', desc: lang === 'en' ? 'Start, stop, and lap times — ideal for measuring tasks.' : 'Start, Stopp, Runden — ideal zum Messen.' },
    { key: 'countdown', name: 'Countdown', desc: lang === 'en' ? 'Counts down a fixed duration — with optional warnings.' : 'Zählt eine feste Dauer mit optionalen Warnungen.' },
    { key: 'analog', name: 'Analog', desc: lang === 'en' ? 'Classic clock face with clear remaining time.' : 'Klassische Uhrendarstellung mit Restzeit.' },
    { key: 'pomodoro', name: 'Pomodoro', desc: lang === 'en' ? 'Focus cycles with breaks — stay productive.' : 'Fokus‑Zyklen mit Pausen.' },
    { key: 'cooking', name: 'Cooking Timer', desc: lang === 'en' ? 'Multiple kitchen timers with presets and names.' : 'Mehrere Küchentimer mit Presets.' },
    { key: 'world', name: 'World Clock', desc: lang === 'en' ? 'Track multiple time zones at once.' : 'Mehrere Zeitzonen im Blick.' },
    { key: 'alarm', name: 'Alarm', desc: lang === 'en' ? 'Alarms with labels and repeat options.' : 'Alarme mit Label und Wiederholung.' },
    { key: 'metronome', name: 'Metronome', desc: lang === 'en' ? 'BPM control with accent on the first beat.' : 'BPM, Betonung auf erstem Schlag.' },
    { key: 'chess', name: 'Chess Clock', desc: lang === 'en' ? 'Dual clocks with player switching.' : 'Zwei Uhren mit Spielerwechsel.' },
  ];

  return (
    <section className="timer-info" aria-labelledby="timer-info-title">
      <h2 id="timer-info-title">{lang === 'en' ? 'About the Timers' : 'Über die Timer'}</h2>
      <div className="timer-info-grid">
        {items.map(i => (
          <div className="timer-info-item" key={i.key}>
            <a
              href={lang === 'en' ? `#/about/${i.key}` : `#/wissen/${i.key}`}
              style={{ textAlign: 'left', background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer', textDecoration: 'none', display: 'block' }}
            >
              <span className="timer-info-name">{i.name}</span>
              <span className="timer-info-desc">{i.desc}</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TimerQuickInfo;
