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
  const [opened, setOpened] = React.useState<number | null>(null);

  React.useEffect(() => {
    (async () => {
      const entries = await Promise.all(Object.entries(fileModules).map(async ([path, loader]) => ({ name: path.split('/').pop() || path, text: await loader() })));
      setFiles(entries);
      const all = entries.map(e => e.text).join('\n');
      setFacts(extractFacts(all));
    })();
  }, []);

  return (
    <div className="page legal-page" style={{ padding: '100px 16px 40px' }}>
      <a href="#/" className="btn-home"><span className="home-icon">⌂</span><span className="home-text">Home</span></a>
      <h1 className="timer-title">Discover Time Facts</h1>

      <section style={{ maxWidth: 1100, margin: '0 auto 32px' }}>
        <h2 style={{ marginBottom: 12 }}>Fun & Mysterious Facts</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {facts.slice(0, 60).map((f, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '14px 16px'
            }}>
              <div style={{ fontSize: 16, lineHeight: 1.5 }}>{f.text}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 6, alignItems: 'center' }}>
                {f.author && <span style={{ color: '#a6f7ff', fontWeight: 700 }}>— {f.author}</span>}
                {f.url && <a href={f.url} target="_blank" rel="noopener" style={{ color: '#00d9ff', fontWeight: 700 }}>Source ↗</a>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ marginBottom: 12 }}>Full Texts (Talks & Essays)</h2>
        <div>
          {files.map((f, i) => (
            <div key={f.name} style={{ marginBottom: 10 }}>
              <button
                onClick={() => setOpened(o => (o === i ? null : i))}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white',
                  borderRadius: 10,
                  padding: '10px 12px',
                  fontWeight: 700
                }}
              >{opened === i ? '▼' : '▶'} {f.name.replace(/_/g, ' ')}</button>
              {opened === i && (
                <div style={{
                  whiteSpace: 'pre-wrap',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                  padding: 12,
                  marginTop: 8,
                  lineHeight: 1.5
                }}>{f.text}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

