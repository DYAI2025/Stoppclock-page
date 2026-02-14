import React, { useState, useEffect } from 'react';
import { getRandomFact } from '../utils/facts';
import type { TimerFact } from '../types/facts-types';
import '../styles/fact-widget.css';

export function RandomFactWidget() {
  const [fact, setFact] = useState<TimerFact | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadRandomFact();
  }, []);

  const loadRandomFact = async () => {
    setLoading(true);
    const randomFact = await getRandomFact();
    setFact(randomFact);
    setLoading(false);
  };

  const handleNewFact = () => {
    setExpanded(false);
    loadRandomFact();
  };

  if (loading || !fact) {
    return null; // Don't show anything while loading
  }

  const preview = fact.content.substring(0, 120) + '...';

  return (
    <div className="random-fact-widget">
      <div className="fact-widget-header">
        <span className="fact-widget-icon">💡</span>
        <span className="fact-widget-label">Wussten Sie schon?</span>
        <button
          className="fact-widget-refresh"
          onClick={handleNewFact}
          title="Neuer Fakt"
          aria-label="Load new fact"
        >
          ↻
        </button>
      </div>

      <div className="fact-widget-content">
        <h4 className="fact-widget-title">{fact.title}</h4>
        <p className="fact-widget-text">
          {expanded ? fact.content : preview}
        </p>

        {fact.content.length > 120 && (
          <button
            className="fact-widget-toggle"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Weniger' : 'Mehr lesen'}
          </button>
        )}

        <a href="#/facts" className="fact-widget-link">
          Alle {104} Facts entdecken →
        </a>
      </div>
    </div>
  );
}
