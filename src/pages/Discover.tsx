import React from 'react';
import { HomeButton } from "../components/HomeButton";

type Fact = { text: string; author?: string; url?: string };

type LoaderMap = Record<string, () => Promise<string>>;
const fileModules = (import.meta as any).glob('../../timer_facts/*.txt', { query: '?raw', import: 'default' }) as LoaderMap;

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

export default function Discover() {
  const [files, setFiles] = React.useState<{ name: string; text: string }[]>([]);
  const [facts, setFacts] = React.useState<Fact[]>([]);

  React.useEffect(() => {
    (async () => {
      const entries = await Promise.all(
        Object.entries(fileModules).map(async ([path, loader]) => ({
          name: path.split('/').pop() || path,
          text: await loader()
        }))
      );
      setFiles(entries);
      const all = entries.map(e => e.text).join('\n');
      setFacts(extractFacts(all));
    })();
  }, []);

  function firstUrl(text: string): string | null {
    const m = text.match(/https?:\/\/\S+/);
    return m ? m[0] : null;
  }

  function addUtm(href: string | null | undefined, idx: number): string {
    try {
      const baseHref = href && /^https?:/i.test(href) ? href : `#/`;
      const url = new URL(baseHref, window.location.origin);
      url.searchParams.set('utm_source', 'pillar');
      url.searchParams.set('utm_medium', 'discover_list');
      url.searchParams.set('utm_campaign', 'time_facts');
      url.searchParams.set('utm_content', String(idx));
      return url.toString();
    } catch {
      return `#/?utm_source=pillar&utm_medium=discover_list&utm_campaign=time_facts&utm_content=${idx}`;
    }
  }

  return (
    <div className="page legal-page" style={{ padding: '100px 16px 40px' }}>
      <a href="#/" className="btn-home"><span className="home-icon">⌂</span><span className="home-text">Home</span></a>
      <h1 className="timer-title">Discover Time Facts</h1>

      <section style={{ maxWidth: 1100, margin: '0 auto 32px' }}>
        <h2 style={{ marginBottom: 12 }}>Fun & Mysterious Facts</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {facts.slice(0, 24).map((f, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '14px 16px'
            }}>
              <div style={{ fontSize: 16, lineHeight: 1.5 }}>{f.text}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 6, alignItems: 'center' }}>
                {f.author && <span style={{ color: '#a6f7ff', fontWeight: 700 }}>— {f.author}</span>}
                {f.url && <a href={addUtm(f.url, i)} target="_blank" rel="noopener" style={{ color: '#00d9ff', fontWeight: 700, textDecoration: 'none' }}>Discover ↗</a>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ marginBottom: 12 }}>Talks & Essays (Excerpts)</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {files.map((f, i) => {
            const excerpt = f.text.replace(/\s+/g, ' ').slice(0, 320).trim();
            const url = firstUrl(f.text);
            return (
              <div key={f.name} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '14px 16px'
              }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  {f.name.replace(/_/g, ' ')}
                </div>
                <div style={{ color: '#dce7ff' }}>{excerpt} …</div>
                <div style={{ marginTop: 8 }}>
                  <a href={addUtm(url, i)} target={url ? '_blank' : undefined} rel={url ? 'noopener' : undefined} style={{ color: '#00d9ff', fontWeight: 800, textDecoration: 'none' }}>
                    Discover more ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
