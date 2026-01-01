import React, { useState } from 'react';
import { useLang } from '../hooks/useLang';

interface PomodoroGuideProps {
  onPresetSelect: (workMinutes: number, breakMinutes: number, label: string) => void;
}

const content = {
  de: {
    miniStory: {
      title: 'Arbeiten im eigenen Takt',
      text: 'Viele To-do-Listen scheitern nicht an der Menge, sondern an dem Gefühl, dass alles gleichzeitig wichtig ist. Du springst von Thema zu Thema, beantwortest schnell noch diese Nachricht, startest etwas Neues – und am Ende fühlt sich alles unfertig an. Der Pomodoro-Timer dreht das um: Er sagt nicht „Mach alles", sondern nur: „Mach jetzt 25 Minuten lang genau eine Sache. Dann atmen wir gemeinsam durch."'
    },
    whatItDoes: {
      title: 'Was der Pomodoro-Timer macht',
      text: 'Die klassische Pomodoro-Technik teilt deine Arbeit in feste Blöcke: 25 Minuten konzentriert arbeiten, 5 Minuten Pause, nach 4 Blöcken eine längere Pause (15–30 Minuten). Der Timer führt dich durch diesen Rhythmus – ohne dass du ständig neu entscheiden musst.'
    },
    useCases: [
      {
        title: 'Konzentrierte Wissensarbeit',
        items: ['Texte schreiben, Präsentationen vorbereiten', 'Konzepte und Strategien ausarbeiten', 'Programmieraufgaben oder Debugging']
      },
      {
        title: 'Lernen & Studium',
        items: ['Kapitel in Fachbüchern lesen', 'Übungsaufgaben lösen', 'Karteikarten oder Zusammenfassungen erstellen']
      },
      {
        title: 'Kreative Arbeit',
        items: ['Skizzen und Layouts entwerfen', 'Musik oder Texte schreiben', 'Ideensprints, Brainstorming, Storyboards']
      }
    ],
    presets: [
      { label: 'Klassisch 25/5', workMinutes: 25, breakMinutes: 5, description: 'Der Standard-Pomodoro' },
      { label: 'Sanft 15/5', workMinutes: 15, breakMinutes: 5, description: 'Ideal bei Müdigkeit' },
      { label: 'Intensiv 50/10', workMinutes: 50, breakMinutes: 10, description: 'Für tiefe Arbeit im Flow' },
      { label: 'Lern-Sprint 30/10', workMinutes: 30, breakMinutes: 10, description: 'Für Lernsessions' }
    ],
    tips: [
      'Vor jedem Block klar entscheiden: Schreib dir kurz auf, was du in den nächsten 25 Minuten tun willst.',
      'Pausen wirklich als Pausen nutzen: Kein Mail-Postfach, keine Social-Media-Feeds.',
      'Blocks zählen, nicht Stunden: Statt „Ich habe 3 Stunden gearbeitet" → „Heute waren es 6 Pomodoros".',
      'Mit Energie arbeiten, nicht dagegen: Wenn 25 Minuten zu lang sind, reduziere auf 15.',
      'Nicht dogmatisch werden: Die Technik ist ein Werkzeug, kein Gesetz.'
    ],
    philosophy: 'Der Pomodoro-Timer ist kein Metronom für Perfektion. Er ist eher wie ein ganz ruhiger Coach, der dir sagt: „Lass uns einfach diesen einen Block machen. Danach schauen wir weiter." Zeit fühlt sich weniger überwältigend an, wenn sie in überschaubare Stücke geteilt ist.',
    sectionTitles: {
      quickStart: 'Pomodoro-Setups',
      tips: 'Tipps',
      philosophy: 'Zeit-Philosophie'
    }
  },
  en: {
    miniStory: {
      title: 'Working in Your Own Rhythm',
      text: 'Many to-do lists fail not because of quantity, but because everything feels equally urgent. You jump from topic to topic, quickly answer that message, start something new – and in the end, everything feels unfinished. The Pomodoro Timer flips that: It doesn\'t say "Do everything," just: "Do exactly one thing for 25 minutes. Then we\'ll breathe together."'
    },
    whatItDoes: {
      title: 'What the Pomodoro Timer Does',
      text: 'The classic Pomodoro technique divides your work into fixed blocks: 25 minutes of focused work, 5 minutes break, after 4 blocks a longer break (15-30 minutes). The timer guides you through this rhythm – without you having to constantly decide anew.'
    },
    useCases: [
      {
        title: 'Concentrated Knowledge Work',
        items: ['Writing texts, preparing presentations', 'Working out concepts and strategies', 'Programming tasks or debugging']
      },
      {
        title: 'Learning & Studying',
        items: ['Reading chapters in textbooks', 'Solving practice problems', 'Creating flashcards or summaries']
      },
      {
        title: 'Creative Work',
        items: ['Designing sketches and layouts', 'Writing music or texts', 'Idea sprints, brainstorming, storyboards']
      }
    ],
    presets: [
      { label: 'Classic 25/5', workMinutes: 25, breakMinutes: 5, description: 'The standard Pomodoro' },
      { label: 'Gentle 15/5', workMinutes: 15, breakMinutes: 5, description: 'Ideal when tired' },
      { label: 'Intense 50/10', workMinutes: 50, breakMinutes: 10, description: 'For deep work in flow' },
      { label: 'Study Sprint 30/10', workMinutes: 30, breakMinutes: 10, description: 'For study sessions' }
    ],
    tips: [
      'Decide clearly before each block: Write down what you want to do in the next 25 minutes.',
      'Use breaks as actual breaks: No email inbox, no social media feeds.',
      'Count blocks, not hours: Instead of "I worked 3 hours" → "Today was 6 Pomodoros".',
      'Work with your energy, not against it: If 25 minutes feels too long, reduce to 15.',
      'Don\'t be dogmatic: The technique is a tool, not a law.'
    ],
    philosophy: 'The Pomodoro Timer isn\'t a metronome for perfection. It\'s more like a calm coach saying: "Let\'s just do this one block. Then we\'ll see." Time feels less overwhelming when it\'s divided into manageable pieces.',
    sectionTitles: {
      quickStart: 'Pomodoro Setups',
      tips: 'Tips',
      philosophy: 'Time Philosophy'
    }
  }
};

export function PomodoroGuide({ onPresetSelect }: PomodoroGuideProps) {
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
              onClick={() => onPresetSelect(preset.workMinutes, preset.breakMinutes, preset.label)}
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
