import React from 'react';
import { useLang } from '../hooks/useLang';

type Fact = { text: string; author?: string };
type LoaderMap = Record<string, () => Promise<string>>;
const enModules = (import.meta as any).glob('../../timer_facts/English_Fun_Facts*.txt', { query: '?raw', import: 'default' }) as LoaderMap;
const genericModules = (import.meta as any).glob('../../timer_facts/*.txt', { query: '?raw', import: 'default' }) as LoaderMap;

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
      const src = (lang === 'en' && Object.keys(enModules).length) ? enModules : genericModules;
      const modules = await Promise.all(Object.values(src).map(l => l()));
      let parsed = extractFacts(modules.join('\n'));
      if (!parsed.length) parsed = [{ text: lang === 'en' ? 'No facts available yet.' : 'Noch keine Fakten verfügbar.' }];
      setFacts(parsed);
    })();
  }, [lang]);

  React.useEffect(() => {
    if (!open || !facts.length) return;
    const id = window.setInterval(() => setIdx(i => (i + 1) % facts.length), 30000);
    return () => window.clearInterval(id);
  }, [open, facts]);

  return (
    <section className="timer-info" aria-labelledby="timer-info-title">
      <h2 id="timer-info-title">{lang === 'en' ? 'About the Timers' : 'Über die Timer'}</h2>
      <div className="timer-info-grid">
        {items.map(i => (
          <div className="timer-info-item" key={i.key}>
            <button
              onClick={() => setOpen(o => o === i.key ? null : i.key)}
              aria-expanded={open === i.key}
              aria-controls={`panel-${i.key}`}
              style={{ textAlign: 'left', background: 'transparent', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}
            >
              <span className="timer-info-name">{i.name}</span>
              <span className="timer-info-desc">{i.desc}</span>
            </button>
            {open === i.key && (
              <div id={`panel-${i.key}`} style={{ marginTop: 8 }}>
                <div className="facts-frame" style={{ padding: 10 }}>
                  <div className="facts-screen" style={{ minHeight: 120 }}>
                    <span className="facts-prefix">Fact</span>
                    <span className="facts-text" aria-live="polite">{facts[idx]?.text}</span>
                    {facts[idx]?.author && <span className="facts-author">— {facts[idx]?.author}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default TimerQuickInfo;
