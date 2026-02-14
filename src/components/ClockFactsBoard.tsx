import React from 'react';
import { trackEvent } from '../utils/analytics';
import { useLang } from '../hooks/useLang';

type FactLoaderMap = Record<string, () => Promise<string>>;

type Fact = {
  text: string;
  author?: string;
  url?: string;
};

// Prefer English fun facts if present, fallback to generic files
const enFactModules = (import.meta as any).glob('../../timer_facts/English_Fun_Facts*.txt', { query: '?raw', import: 'default' }) as FactLoaderMap;
const genericFactModules = (import.meta as any).glob('../../timer_facts/*.txt', { query: '?raw', import: 'default' }) as FactLoaderMap;

function extractFacts(text: string): Fact[] {
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const facts: Fact[] = [];

  // 1) Prefer lines that look like quotes with author attribution
  for (const line of lines) {
    // Try to capture quotes like „…“ — Name OR "…" - Name
    const quoteContent =
      line.match(/[„“"]([^"”„]+)["”]/) || // „…“ or “…” or "..."
      line.match(/'([^']+)'/);
    if (quoteContent) {
      const textOnly = quoteContent[1].replace(/\s+/g, ' ').trim();
      if (textOnly.length < 40 || textOnly.length > 260) continue;
      const authorMatch = line.match(/[—-]\s*([\p{L} .,'-]{3,})$/u);
      const author = authorMatch ? authorMatch[1].trim() : undefined;
      const urlMatch = line.match(/https?:\/\/\S+/);
      facts.push({ text: textOnly, author, url: urlMatch?.[0] });
    }
  }

  // 2) Also allow regular sentences (non-quote facts)
  const sentences = lines.flatMap(line => line.split(/(?<=[\.!?])\s+/));
  for (const s of sentences) {
    const clean = s.replace(/\s+/g, ' ').trim();
    if (!clean) continue;
    if (clean.length < 60 || clean.length > 240) continue;
    // Skip if it already exists as a quote fact
    if (facts.some(f => f.text.toLowerCase() === clean.toLowerCase())) continue;
    const urlMatch = clean.match(/https?:\/\/\S+/);
    facts.push({ text: clean, url: urlMatch?.[0] });
  }

  // Deduplicate by text
  const seen = new Set<string>();
  const unique: Fact[] = [];
  for (const f of facts) {
    const key = f.text.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(f);
    }
  }
  return unique;
}

export function ClockFactsBoard() {
  const [lang] = useLang();
  const [facts, setFacts] = React.useState<Fact[]>([]);
  const [index, setIndex] = React.useState(0);
  const intervalRef = React.useRef<number | null>(null);
  const DURATION = 30000;
  const [fullscreen, setFullscreen] = React.useState(false);

  function scheduleRotation() {
    if (!facts.length) return;
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setIndex(i => (i + 1) % facts.length);
    }, DURATION);
  }

  function pauseRotation() {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function resumeRotation() {
    if (!intervalRef.current) {
      scheduleRotation();
    }
  }

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sources = (lang === 'en' && Object.keys(enFactModules).length) ? enFactModules : genericFactModules;
        const modules = await Promise.all(Object.values(sources).map(loader => loader()));
        const allText = modules.join('\n');
        let parsed = extractFacts(allText);
        // Fallback seed if parsing yields no items
        if (!parsed.length) {
          parsed = [
            { text: 'Zeit ist das, was man an der Uhr abliest.', author: 'Albert Einstein' },
            { text: 'Die Zeit vergeht nicht schneller als früher, aber wir laufen eiliger an ihr vorbei.', author: 'George Orwell' },
            { text: 'Wer die Zeit nutzen will, muss sie zuerst sehen.', author: 'Unbekannt' },
          ];
        }
        if (!cancelled && parsed.length) setFacts(parsed);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!facts.length) return;
    scheduleRotation();
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [facts]);

  function nextFact() {
    if (!facts.length) return;
    setIndex(i => (i + 1) % facts.length);
    scheduleRotation();
  }

  function prevFact() {
    if (!facts.length) return;
    setIndex(i => (i - 1 + facts.length) % facts.length);
    scheduleRotation();
  }

  function addUtm(href: string | null | undefined, idx: number): string {
    try {
      const baseHref = href && /^https?:/i.test(href) ? href : `#/`;
      const url = new URL(baseHref, window.location.origin);
      url.searchParams.set('utm_source', 'pillar');
      url.searchParams.set('utm_medium', 'facts');
      url.searchParams.set('utm_campaign', 'time_facts');
      url.searchParams.set('utm_content', String(idx));
      return url.toString();
    } catch {
      return `#/?utm_source=pillar&utm_medium=facts&utm_campaign=time_facts&utm_content=${idx}`;
    }
  }

  function onFactClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    const href = (e.currentTarget as HTMLAnchorElement).href;
    trackEvent({
      eventName: 'facts_click',
      timestamp: Date.now(),
      pageUrl: window.location.href,
      metadata: {
        fact_index: index,
        has_author: Boolean(current.author),
        href
      }
    });
  }

  const current = facts.length ? facts[index] : { text: 'Wissensboard lädt…' };

  return (
    <section className="facts-board" aria-label="Time Facts">
      <div className="facts-heading">" Things that you didnt know about the time ... "</div>
      <div className={"facts-frame" + (fullscreen ? " facts-overlay" : "")} onMouseEnter={pauseRotation} onMouseLeave={resumeRotation}>
        <button
          className="facts-badge"
          onClick={nextFact}
          onMouseEnter={pauseRotation}
          onMouseLeave={resumeRotation}
          onFocus={pauseRotation}
          onBlur={resumeRotation}
        >Click to discover</button>
        <button className="facts-fs-btn" onClick={() => setFullscreen(f => !f)} aria-label="Toggle fullscreen">{fullscreen ? 'Close' : 'Fullscreen'}</button>
        <div className="facts-controls">
          <button className="facts-btn prev" onClick={prevFact} aria-label="Previous fact" onMouseEnter={pauseRotation} onMouseLeave={resumeRotation}>◁ Prev</button>
          <a
            className="facts-screen facts-link"
            href={addUtm(current.url || '#/', index)}
            onClick={onFactClick}
            onMouseEnter={pauseRotation}
            onMouseLeave={resumeRotation}
            onFocus={pauseRotation}
            onBlur={resumeRotation}
            aria-label="Open fact link"
          >
            <span className="facts-prefix">Fact</span>
            <span className="facts-text" aria-live="polite">{current.text}</span>
            {current.author && <span className="facts-author">— {current.author}</span>}
          </a>
          <button className="facts-btn next" onClick={nextFact} aria-label="Next fact" onMouseEnter={pauseRotation} onMouseLeave={resumeRotation}>Next ▷</button>
        </div>
      </div>
    </section>
  );
}

export default ClockFactsBoard;
