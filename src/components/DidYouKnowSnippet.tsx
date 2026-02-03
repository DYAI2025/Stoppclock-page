import React, { useEffect, useState } from 'react';
import { TimerWorldsIndex, FactPlaque } from '../types/timer-worlds-types';
import { Lightbulb, ArrowRight } from 'lucide-react';
import '../styles/fact-widget.css';

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

    <div className={`did-you-know-snippet ${className}`}>
      <div className="dyk-header">
        <Lightbulb size={24} />
        <h3 className="dyk-title">Did You Know?</h3>
      </div>
      
      <div>
        <h4 className="dyk-card-title">{fact.title}</h4>
        <p className="dyk-text">
          {fact.content.split('\n')[0]} {/* Show first line/paragraph only */}
        </p>
      </div>

      <a 
        href={`#/wissen/${timerSlug}`} 
        className="dyk-link read-more-link"
      >
        Read full story in {worldName} <ArrowRight size={16} />
      </a>
    </div>
  );
}
