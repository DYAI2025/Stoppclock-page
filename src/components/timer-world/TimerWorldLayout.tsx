import React from 'react';
import ReactMarkdown from 'react-markdown';
import { TimerWorldData } from '../../types/timer-worlds-types';
import { RitualCard } from './RitualCard';
import { FactPlaque } from './FactPlaque';
import './TimerWorldLayout.css';

interface TimerWorldLayoutProps {
  data: TimerWorldData;
}

export const TimerWorldLayout: React.FC<TimerWorldLayoutProps> = ({ data }) => {
  return (
    <div className="timer-world-layout">
      {/* Hero Section */}
      <header className="world-hero">
        <h1 className="world-title">{data.name}</h1>
        <p className="world-tagline">{data.tagline}</p>
        <div className="world-character">
          <ReactMarkdown>{data.heroStory}</ReactMarkdown>
        </div>
        <div className="world-cta">
          <a href={`#/${data.slug}`} className="open-timer-button">
            Open {data.name.split(':')[0]} Timers
          </a>
        </div>
      </header>

      {/* Rituals Section */}
      {data.rituals.length > 0 && (
        <section className="world-section">
          <h2 className="section-heading">Rituals</h2>
          <div className="rituals-grid">
            {data.rituals.map((ritual) => (
              <RitualCard 
                key={ritual.id} 
                title={ritual.title} 
                description={ritual.description} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Effects Section */}
      {data.effects.length > 0 && (
        <section className="world-section">
          <h2 className="section-heading">Effects</h2>
          <div className="effects-content">
            {data.effects.map((effect) => (
              <div key={effect.id} className="effect-item">
                <h3 className="effect-title">{effect.title}</h3>
                <div className="effect-description">
                  <ReactMarkdown>{effect.description}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Facts Section */}
      {data.facts.length > 0 && (
        <section className="world-section world-facts">
          <h2 className="section-heading">Time Facts</h2>
          <div className="facts-grid">
            {data.facts.map((fact) => (
              <FactPlaque 
                key={fact.id} 
                title={fact.title} 
                content={fact.content} 
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
