import React from 'react';
import { HomeButton } from '../components/HomeButton';

type Fact = { text: string; author?: string; url?: string };
type LoaderMap = Record<string, () => Promise<string>>;

// Load English facts if available, otherwise generic
const enModules = (import.meta as any).glob('../../timer_facts/English_Fun_Facts*.txt', { query: '?raw', import: 'default' }) as LoaderMap;
const genericModules = (import.meta as any).glob('../../timer_facts/*.txt', { query: '?raw', import: 'default' }) as LoaderMap;

function extractFacts(text: string): Fact[] {
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const facts: Fact[] = [];
  for (const line of lines) {
    const quote = line.match(/[„“"]([^"”„]+)["”]/) || line.match(/'([^']+)'/);
    if (quote) {
      const t = quote[1].replace(/\s+/g, ' ').trim();
      if (t.length >= 40 && t.length <= 260) {
        const authorMatch = line.match(/[—-]\s*([\p{L} .,'-]{3,})$/u);
        const author = authorMatch ? authorMatch[1].trim() : undefined;
        const urlMatch = line.match(/https?:\/\/\S+/);
        facts.push({ text: t, author, url: urlMatch?.[0] });
      }
    }
  }
  const sentences = lines.flatMap(l => l.split(/(?<=[\.!?])\s+/));
  for (const s of sentences) {
    const t = s.replace(/\s+/g, ' ').trim();
    if (t && t.length >= 60 && t.length <= 240 && !facts.some(f => f.text.toLowerCase() === t.toLowerCase())) {
      const urlMatch = t.match(/https?:\/\/\S+/);
      facts.push({ text: t, url: urlMatch?.[0] });
    }
  }
  const seen = new Set<string>();
  return facts.filter(f => { const k = f.text.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
}

function useRouteInfo() {
  const hash = (location.hash || '#/').replace(/^#/, '');
  const isEn = hash.startsWith('/about/');
  const isDe = hash.startsWith('/wissen/');
  const slug = hash.split('/')[2] || '';
  return { lang: isDe ? 'de' : 'en', slug } as const;
}

const TITLES: Record<string, { en: string; de: string }> = {
  countdown: { en: 'About Countdown', de: 'Über Countdown' },
  stopwatch: { en: 'About Stopwatch', de: 'Über Stoppuhr' },
  analog: { en: 'About Analog Clock', de: 'Über Analoguhr' },
  cooking: { en: 'About Cooking Timer', de: 'Über Küchentimer' },
  chess: { en: 'About Chess Clock', de: 'Über Schachuhr' },
  metronome: { en: 'About Metronome', de: 'Über Metronom' },
  world: { en: 'About World Clock', de: 'Über Weltuhr' },
  alarm: { en: 'About Alarm', de: 'Über Alarm' },
  pomodoro: { en: 'About Pomodoro', de: 'Über Pomodoro' },
};

export default function TimerAbout() {
  const { lang, slug } = useRouteInfo();
  const [facts, setFacts] = React.useState<Fact[]>([]);
  const [i, setI] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      const source = Object.keys(enModules).length && lang === 'en' ? enModules : genericModules;
      const modules = await Promise.all(Object.values(source).map(l => l()));
      let parsed = extractFacts(modules.join('\n'));
      if (!parsed.length) parsed = [{ text: lang === 'en' ? 'No facts available yet.' : 'Noch keine Fakten verfügbar.' }];
      setFacts(parsed);
    })();
  }, [lang]);

  React.useEffect(() => {
    if (!facts.length) return;
    const id = window.setInterval(() => setI(x => (x + 1) % facts.length), 30000);
    return () => window.clearInterval(id);
  }, [facts]);

  const t = TITLES[slug] || { en: 'About Timer', de: 'Über Timer' };
  const title = lang === 'en' ? t.en : t.de;
  const fact = facts[i];

  return (
    <div className="page" style={{ padding: '96px 16px 48px' }}>
      <HomeButton />
      <h1 className="timer-title">{title}</h1>
      <section style={{ maxWidth: 1100, margin: '0 auto 16px', color: 'var(--neutral-white)' }}>
        <p style={{ lineHeight: 1.7 }}>
          {lang === 'en'
            ? 'History, uses, and insights about this timer. Short and practical, with rotating fun facts.'
            : 'Geschichte, Anwendungen und Wissenswertes zu diesem Timer. Kurz und praxisnah, mit rotierenden Fun Facts.'}
        </p>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto 16px' }}>
        <div className="facts-frame">
          <div className="facts-screen" style={{ cursor: 'default' }}>
            <span className="facts-prefix">Fact</span>
            <span className="facts-text" aria-live="polite">{fact?.text}</span>
            {fact?.author && <span className="facts-author">— {fact.author}</span>}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ margin: '12px 0', fontSize: '1.25rem' }}>{lang === 'en' ? 'Use cases' : 'Anwendungsbereiche'}</h2>
        <ul style={{ lineHeight: 1.8 }}>
          {lang === 'en' ? (
            <>
              <li>Classroom and exams</li>
              <li>Talks, workshops, and daily routines</li>
              <li>Focus sessions and practice timing</li>
            </>
          ) : (
            <>
              <li>Unterricht und Prüfungen</li>
              <li>Vorträge, Workshops und Routinen</li>
              <li>Fokus‑Sessions und Übungszeiten</li>
            </>
          )}
        </ul>
      </section>
    </div>
  );
}

