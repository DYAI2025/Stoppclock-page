import React, { useEffect, useState } from 'react';
import { TimerWorldsIndex, FactPlaque } from '../types/timer-worlds-types';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface DidYouKnowSnippetProps {
  timerSlug: string;
  className?: string;
}

export function DidYouKnowSnippet({ timerSlug, className = '' }: DidYouKnowSnippetProps) {
  const [fact, setFact] = useState<FactPlaque | null>(null);
  const [worldName, setWorldName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/timer-worlds.json')
      .then(res => res.json())
      .then((data: TimerWorldsIndex) => {
        const world = data.worlds[timerSlug];
        if (world && world.facts && world.facts.length > 0) {
          // Pick a random fact
          const randomFact = world.facts[Math.floor(Math.random() * world.facts.length)];
          setFact(randomFact);
          setWorldName(world.name);
        }
      })
      .catch(err => console.error('Failed to load fact:', err))
      .finally(() => setLoading(false));
  }, [timerSlug]);

  if (loading || !fact) return null;

  return (
    <div className={`did-you-know-snippet ${className}`} style={{
      margin: '40px auto',
      maxWidth: '600px',
      background: 'var(--neutral-100)',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid var(--neutral-200)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary-600)' }}>
        <Lightbulb size={24} />
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Did You Know?</h3>
      </div>
      
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--neutral-900)' }}>{fact.title}</h4>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--neutral-600)', lineHeight: 1.5 }}>
          {fact.content.split('\n')[0]} {/* Show first line/paragraph only */}
        </p>
      </div>

      <a 
        href={`#/wissen/${timerSlug}`} 
        className="read-more-link"
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--primary-600)',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}
      >
        Read full story in {worldName} <ArrowRight size={16} />
      </a>
    </div>
  );
}
