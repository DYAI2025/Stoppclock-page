import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { TimerWorldData } from '../../types/timer-worlds-types';
import { RitualCard } from './RitualCard';
import { FactPlaque } from './FactPlaque';
import { Breadcrumb } from './Breadcrumb';
import { TableOfContents } from './TableOfContents';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getTimerColor } from '../../utils/timer-colors';
import './TimerWorldLayout.css';

interface TimerWorldLayoutProps {
  data: TimerWorldData;
}

export const TimerWorldLayout: React.FC<TimerWorldLayoutProps> = ({ data }) => {
  const accentColor = data.accentColor || getTimerColor(data.slug);
  
  // Apply scroll reveal animations
  useScrollReveal('.scroll-reveal');
  
  useEffect(() => {
    // Set CSS custom property for accent color
    document.documentElement.style.setProperty('--world-accent-color', accentColor);
    
    return () => {
      document.documentElement.style.removeProperty('--world-accent-color');
    };
  }, [accentColor]);

  return (
    <div className="timer-world-layout">
      {/* Breadcrumb Navigation */}
      <Breadcrumb timerName={data.name.split(':')[0]} />

      {/* Hero Section */}
      <header className="world-hero" style={{ '--hero-accent': accentColor } as React.CSSProperties}>
        <h1 className="world-title">{data.name}</h1>
        <p className="world-tagline">{data.tagline}</p>
        <div className="world-character">
          <ReactMarkdown>{data.heroStory}</ReactMarkdown>
        </div>
        <div className="world-cta">
          <a href={`#/${data.slug}`} className="open-timer-button">
            Open {data.name.split(':')[0]} Timer
          </a>
        </div>
      </header>

      {/* Table of Contents */}
      <TableOfContents
        hasRituals={data.rituals.length > 0}
        hasEffects={data.effects.length > 0}
        hasFacts={data.facts.length > 0}
      />

      {/* Rituals Section */}
      {data.rituals.length > 0 && (
        <section className="world-section" id="rituals">
          <h2 className="section-heading">Rituals</h2>
          <div className="rituals-grid">
            {data.rituals.map((ritual) => (
              <div key={ritual.id} className="scroll-reveal">
                <RitualCard 
                  title={ritual.title} 
                  description={ritual.description} 
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Effects Section */}
      {data.effects.length > 0 && (
        <section className="world-section" id="effects">
          <h2 className="section-heading">Effects</h2>
          <div className="effects-content">
            {data.effects.map((effect) => (
              <div key={effect.id} className="effect-item scroll-reveal">
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
        <section className="world-section world-facts" id="facts">
          <h2 className="section-heading">Time Facts</h2>
          <div className="facts-grid">
            {data.facts.map((fact) => (
              <div key={fact.id} className="scroll-reveal">
                <FactPlaque 
                  title={fact.title} 
                  content={fact.content}
                  source={fact.source}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};