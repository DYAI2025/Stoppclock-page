import React from 'react';
import { useLang } from '../hooks/useLang';

type Fact = { text: string; author?: string };
type LoaderMap = Record<string, () => Promise<string>>;
const enModules = (import.meta as any).glob('../../timer_facts/English_*.txt', { query: '?raw', import: 'default' }) as LoaderMap;
const deModules = (import.meta as any).glob('../../timer_facts/German_*.txt', { query: '?raw', import: 'default' }) as LoaderMap;

function extractFacts(text: string): Fact[] {
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const facts: Fact[] = [];
  for (const line of lines) {
    const q = line.match(/[„“"]([^"”„]+)["”]/) || line.match(/'([^']+)'/);
    if (q) {
      const t = q[1].replace(/\s+/g, ' ').trim();
      if (t.length >= 40 && t.length <= 260) {
        const am = line.match(/[—-]\s*([\p{L} .,'-]{3,})$/u);
        facts.push({ text: t, author: am ? am[1].trim() : undefined });
      }
    }
  }
  const sentences = lines.flatMap(l => l.split(/(?<=[\.!?])\s+/));
  for (const s of sentences) {
    const t = s.replace(/\s+/g, ' ').trim();
    if (t && t.length >= 60 && t.length <= 240 && !facts.some(f => f.text.toLowerCase() === t.toLowerCase())) facts.push({ text: t });
  }
  const seen = new Set<string>();
  return facts.filter(f => { const k = f.text.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
}

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

  const [facts, setFacts] = React.useState<Fact[]>([]);
  const [open, setOpen] = React.useState<string | null>(null);
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      const src = lang === 'en' ? enModules : deModules;
      const modules = await Promise.all(Object.values(src).map(l => l()));
      let parsed = extractFacts(modules.join('\n'));
      if (!parsed.length) parsed = [{ text: lang === 'en' ? 'No facts available yet.' : 'Noch keine Fakten verfügbar.' }];
      setFacts(parsed);
    })();
  }, [lang]);

  return (
    <section className="timer-info" aria-labelledby="timer-info-title">
      {/* Display ALL facts continuously at the top - English only */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '24px', color: 'var(--neutral-white)' }}>
          Fun Facts & Quotes About Time
        </h2>
        <div className="facts-display-all" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          maxHeight: '500px', 
          overflowY: 'auto',
          padding: '8px'
        }}>
          {facts.map((fact, index) => (
            <div key={index} className="facts-frame" style={{ padding: '16px' }}>
              <div className="facts-screen" style={{ minHeight: 'auto' }}>
                <span className="facts-prefix" style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                  #{index + 1}
                </span>
                <span className="facts-text" style={{ 
                  fontSize: '0.95rem', 
                  lineHeight: '1.6',
                  display: 'block',
                  marginTop: '8px'
                }}>
                  {fact.text}
                </span>
                {fact.author && (
                  <span className="facts-author" style={{ 
                    fontSize: '0.85rem',
                    marginTop: '8px',
                    display: 'block',
                    fontStyle: 'italic',
                    opacity: 0.8
                  }}>
                    — {fact.author}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

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
