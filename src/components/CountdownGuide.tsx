import React, { useState } from 'react';
import { useLang } from '../hooks/useLang';

interface CountdownGuideProps {
  onPresetSelect: (minutes: number) => void;
}

const content = {
  de: {
    miniStory: {
      title: 'Eine Insel im Tag',
      text: 'Du kennst das vielleicht: Der Tag ist voll, Tabs sind offen, das Handy blinkt – und plötzlich ist eine Stunde weg, ohne dass du genau sagen kannst, was du eigentlich gemacht hast. Ein einfacher Countdown kann daraus eine kleine Insel machen: 25 Minuten nur für eine Sache.'
    },
    whatItDoes: {
      title: 'Was der Countdown-Timer macht',
      text: 'Der Countdown-Timer misst nicht, wie lange du schon etwas tust, sondern begrenzt, wie lange du es tun willst. Du stellst eine Dauer ein – zum Beispiel 10, 25 oder 45 Minuten – und der Timer zählt sie präzise herunter.'
    },
    useCases: [
      {
        title: 'Fokusarbeit & Deep Work',
        items: ['25 Minuten konzentriert an einem Text schreiben', '50 Minuten an einer Aufgabe programmieren', '15 Minuten E-Mails aufräumen']
      },
      {
        title: 'Lernen & Üben',
        items: ['20 Minuten Vokabeln', '30 Minuten Instrument spielen', '40 Minuten Übungsaufgaben']
      },
      {
        title: 'Meetings & Workshops',
        items: ['10 Minuten Check-in-Runde', '5 Minuten Stillarbeitsphase', '15 Minuten Diskussion pro Thema']
      },
      {
        title: 'Alltag & Haushalt',
        items: ['7 Minuten Aufräum-Challenge', '12 Minuten Bad putzen', '5 Minuten kurze Atem- oder Stretch-Pause']
      }
    ],
    presets: [
      { label: '25 Min Fokus', minutes: 25, description: 'Für konzentrierte Arbeit' },
      { label: '10 Min Aufräumen', minutes: 10, description: 'Schnell Ordnung schaffen' },
      { label: '5 Min Pause', minutes: 5, description: 'Kurz durchatmen' },
      { label: '3 Min Atempause', minutes: 3, description: 'Augen zu, tief atmen' },
      { label: '45 Min Lernblock', minutes: 45, description: 'Für Lesen und Üben' }
    ],
    tips: [
      'Klein anfangen: Wenn dir 25 Minuten lang vorkommen, starte mit 10 oder 15 Minuten.',
      'Nur eine Aufgabe: Für jeden Countdown nur ein Fokus.',
      'Signal bewusst wahrnehmen: Wenn der Timer abläuft, nicht „kurz noch weitermachen".',
      'Zeit nicht „optimieren", sondern rahmen: Der Countdown ist kein Druckinstrument.'
    ],
    philosophy: 'Ein Countdown ist wie eine Tür, die du für einen Moment hinter dir schließt. Draußen wartet der restliche Tag, mit allen Nachrichten, Anfragen und Themen. Drinnen bist nur du, dein aktueller Schritt – und eine Zahl, die langsam kleiner wird.',
    sectionTitles: {
      quickStart: 'Schnellstart',
      tips: 'Tipps',
      philosophy: 'Zeit-Philosophie'
    }
  },
  en: {
    miniStory: {
      title: 'An Island in Your Day',
      text: 'You might know this feeling: The day is packed, tabs are open, your phone is buzzing – and suddenly an hour is gone without you knowing what you actually did. A simple countdown can turn that into a small island: 25 minutes for just one thing.'
    },
    whatItDoes: {
      title: 'What the Countdown Timer Does',
      text: 'The countdown timer doesn\'t measure how long you\'ve been doing something – it limits how long you want to do it. Set a duration – like 10, 25, or 45 minutes – and the timer counts down precisely.'
    },
    useCases: [
      {
        title: 'Focus Work & Deep Work',
        items: ['25 minutes of concentrated writing', '50 minutes programming on a task', '15 minutes clearing emails']
      },
      {
        title: 'Learning & Practice',
        items: ['20 minutes vocabulary', '30 minutes playing an instrument', '40 minutes practice exercises']
      },
      {
        title: 'Meetings & Workshops',
        items: ['10 minute check-in round', '5 minute silent work phase', '15 minute discussion per topic']
      },
      {
        title: 'Daily Life & Household',
        items: ['7 minute cleanup challenge', '12 minutes cleaning the bathroom', '5 minute breathing or stretch break']
      }
    ],
    presets: [
      { label: '25 Min Focus', minutes: 25, description: 'For concentrated work' },
      { label: '10 Min Cleanup', minutes: 10, description: 'Quick tidying up' },
      { label: '5 Min Break', minutes: 5, description: 'Catch your breath' },
      { label: '3 Min Breathe', minutes: 3, description: 'Close eyes, breathe deep' },
      { label: '45 Min Study', minutes: 45, description: 'For reading and practice' }
    ],
    tips: [
      'Start small: If 25 minutes feels long, start with 10 or 15 minutes.',
      'One task only: Each countdown gets just one focus.',
      'Notice the signal: When the timer ends, don\'t "just continue for a bit".',
      'Frame time, don\'t optimize it: The countdown isn\'t a pressure tool.'
    ],
    philosophy: 'A countdown is like a door you close behind you for a moment. Outside waits the rest of the day, with all its messages, requests, and topics. Inside, it\'s just you, your current step – and a number that slowly gets smaller.',
    sectionTitles: {
      quickStart: 'Quick Start',
      tips: 'Tips',
      philosophy: 'Time Philosophy'
    }
  }
};

export function CountdownGuide({ onPresetSelect }: CountdownGuideProps) {
  const [lang] = useLang();
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const c = content[lang];

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <div className="timer-guide">
      {/* Mini Story */}
      <section className="guide-section guide-intro">
        <h2 className="guide-title">{c.miniStory.title}</h2>
        <p className="guide-text">{c.miniStory.text}</p>
      </section>

      {/* What it does */}
      <section className="guide-section">
        <h3 className="guide-subtitle">{c.whatItDoes.title}</h3>
        <p className="guide-text">{c.whatItDoes.text}</p>
      </section>

      {/* Use Cases (collapsible) */}
      <section className="guide-section guide-usecases">
        {c.useCases.map((useCase, index) => (
          <div key={index} className="guide-usecase">
            <button
              type="button"
              className={`guide-usecase-toggle ${expandedSection === index ? 'expanded' : ''}`}
              onClick={() => toggleSection(index)}
            >
              <span className="guide-usecase-chevron">{expandedSection === index ? '▾' : '▸'}</span>
              {useCase.title}
            </button>
            {expandedSection === index && (
              <ul className="guide-usecase-list">
                {useCase.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      {/* Presets */}
      <section className="guide-section guide-presets">
        <h3 className="guide-subtitle">{c.sectionTitles.quickStart}</h3>
        <div className="guide-preset-grid">
          {c.presets.map((preset, index) => (
            <button
              key={index}
              type="button"
              className="guide-preset-btn"
              onClick={() => onPresetSelect(preset.minutes)}
              title={preset.description}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="guide-section guide-tips">
        <h3 className="guide-subtitle">{c.sectionTitles.tips}</h3>
        <ul className="guide-tips-list">
          {c.tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </section>

      {/* Philosophy */}
      <section className="guide-section guide-philosophy">
        <h3 className="guide-subtitle">{c.sectionTitles.philosophy}</h3>
        <blockquote className="guide-quote">{c.philosophy}</blockquote>
      </section>
    </div>
  );
}
