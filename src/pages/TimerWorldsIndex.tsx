import React, { useEffect, useState } from 'react';
import { HomeButton } from '../components/HomeButton';
import '../styles/timer-worlds.css'; // We'll need to create this or use existing styles

interface World {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  heroStory: string;
}

interface TimerWorldsData {
  version: number;
  generatedAt: string;
  worlds: Record<string, World>;
}

export default function TimerWorldsIndex() {
  const [data, setData] = useState<TimerWorldsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/timer-worlds.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load worlds:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page p-8 text-center">Loading Worlds...</div>;
  if (!data) return <div className="page p-8 text-center">Failed to load Timer Worlds.</div>;

  const worldsList = Object.values(data.worlds);

  return (
    <div className="timer-worlds-page">
      <header className="timer-worlds-header">
        <HomeButton />
        <h1>Timer Worlds</h1>
        <p className="subtitle">Discover the philosophy behind time.</p>
      </header>

      <div className="worlds-grid">
        {worldsList.map(world => (
          <a key={world.id} href={`#/wissen/${world.slug}`} className="world-card">
            <div className="world-card-content">
              <h2>{world.name}</h2>
              <p>{world.tagline}</p>
              <span className="read-more">Enter World →</span>
            </div>
          </a>
        ))}
      </div>
      
      {/* Fallback/Empty State if needed, but we have data */}
      {worldsList.length === 0 && (
         <div className="empty-state">
            <p>No worlds discovered yet.</p>
         </div>
      )}
    </div>
  );
}
