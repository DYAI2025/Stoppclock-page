import { useLang } from '../hooks/useLang';
import TimerIcon, { TimerIconType } from './TimerIcon';
import React from 'react';

export function TimerQuickInfo() {
  const [lang] = useLang();
  const purposeStyles = {
    alarm: { color: '#EF4444', rgb: '239,68,68', label: lang === 'en' ? 'Alarm' : 'Alarm' },
    psychology: { color: '#7B2CBF', rgb: '123,44,191', label: lang === 'en' ? 'Psychology' : 'Psychologie' },
    relationship: { color: '#FF69B4', rgb: '255,105,180', label: lang === 'en' ? 'Relationship' : 'Beziehung' },
    stopwatch: { color: '#00D9FF', rgb: '0,217,255', label: lang === 'en' ? 'Stopwatch' : 'Stoppuhr' },
    countdown: { color: '#F59E0B', rgb: '245,158,11', label: lang === 'en' ? 'Countdown' : 'Countdown' },
    games: { color: '#E0AAFF', rgb: '224,170,255', label: lang === 'en' ? 'Games' : 'Spiele' },
    time: { color: '#6B9BD1', rgb: '107,155,209', label: lang === 'en' ? 'Clock' : 'Uhrzeit' },
    productivity: { color: '#10B981', rgb: '16,185,129', label: lang === 'en' ? 'Productivity' : 'Produktivität' },
  } as const;

  type PurposeKey = keyof typeof purposeStyles;

  const items: {
    key: string;
    name: string;
    desc: string;
    purpose: PurposeKey;
    categories: string[];
    icon: TimerIconType;
  }[] = [
    {
      key: 'stopwatch',
      name: lang === 'en' ? 'Stopwatch' : 'Stoppuhr',
      desc: lang === 'en'
        ? 'Start, stop, and lap times with crisp millisecond precision.'
        : 'Start, Stopp und Runden mit millisekundengenauer Präzision.',
      purpose: 'stopwatch',
      categories: lang === 'en' ? ['#precision', '#sports', '#focus'] : ['#Präzision', '#Sport', '#Fokus'],
      icon: 'Stopwatch',
    },
    {
      key: 'countdown',
      name: lang === 'en' ? 'Countdown' : 'Countdown',
      desc: lang === 'en'
        ? 'Counts down a fixed duration with warning sounds you can trust.'
        : 'Zählt eine feste Dauer mit verlässlichen Warnhinweisen.',
      purpose: 'countdown',
      categories: lang === 'en' ? ['#deadlines', '#events', '#alerts'] : ['#Deadlines', '#Events', '#Warnung'],
      icon: 'Countdown',
    },
    {
      key: 'analog',
      name: lang === 'en' ? 'Analog Clock' : 'Analoguhr',
      desc: lang === 'en'
        ? 'A classic face that keeps remaining time tangible at a glance.'
        : 'Eine klassische Uhr, die Restzeit auf einen Blick greifbar macht.',
      purpose: 'time',
      categories: lang === 'en' ? ['#clarity', '#visual', '#calm'] : ['#Klarheit', '#Visuell', '#Ruhe'],
      icon: 'Analog Clock',
    },
    {
      key: 'pomodoro',
      name: 'Pomodoro',
      desc: lang === 'en'
        ? 'Work in focus sprints with planned pauses to keep momentum.'
        : 'Arbeite in Fokus-Sprints mit geplanten Pausen für den Flow.',
      purpose: 'productivity',
      categories: lang === 'en' ? ['#productivity', '#study', '#habit'] : ['#Produktivität', '#Lernen', '#Routine'],
      icon: 'Pomodoro',
    },
    {
      key: 'cooking',
      name: lang === 'en' ? 'Cooking Timer' : 'Küchentimer',
      desc: lang === 'en'
        ? 'Multiple kitchen timers with custom names for every dish.'
        : 'Mehrere Küchentimer mit eigenen Namen für jedes Gericht.',
      purpose: 'countdown',
      categories: lang === 'en' ? ['#mealprep', '#alarms', '#multitask'] : ['#Kochen', '#Alarme', '#Multitasking'],
      icon: 'Cooking Timer',
    },
    {
      key: 'world',
      name: lang === 'en' ? 'World Clock' : 'Weltuhr',
      desc: lang === 'en'
        ? 'Follow cities across time zones and never miss a handoff.'
        : 'Verfolge Zeitzonen weltweit und verpasse keinen Handover.',
      purpose: 'time',
      categories: lang === 'en' ? ['#remote', '#teams', '#travel'] : ['#Remote', '#Teams', '#Reisen'],
      icon: 'World Clock',
    },
    {
      key: 'alarm',
      name: lang === 'en' ? 'Alarm' : 'Alarm',
      desc: lang === 'en'
        ? 'Labels, repeats, and wake-up tones designed to be reliable.'
        : 'Labels, Wiederholungen und Wecktöne auf Zuverlässigkeit getrimmt.',
      purpose: 'alarm',
      categories: lang === 'en' ? ['#wake', '#routines', '#safety'] : ['#Aufstehen', '#Routinen', '#Sicherheit'],
      icon: 'Alarm',
    },
    {
      key: 'metronome',
      name: lang === 'en' ? 'Metronome' : 'Metronom',
      desc: lang === 'en'
        ? 'BPM control with a steady click to anchor rhythm practice.'
        : 'BPM-Steuerung mit konstantem Klick für verlässliches Timing.',
      purpose: 'psychology',
      categories: lang === 'en' ? ['#music', '#cadence', '#guardrails'] : ['#Musik', '#Takt', '#Leitplanken'],
      icon: 'Metronome',
    },
    {
      key: 'chess',
      name: lang === 'en' ? 'Chess Clock' : 'Schachuhr',
      desc: lang === 'en'
        ? 'Dual clocks keep every match fair with quick player swaps.'
        : 'Zwei Uhren halten jede Partie fair mit schnellen Spielerwechseln.',
      purpose: 'games',
      categories: lang === 'en' ? ['#games', '#competition', '#fairplay'] : ['#Games', '#Wettkampf', '#Fairplay'],
      icon: 'Chess Clock',
    },
  ];

  return (
    <section className="timer-info" aria-labelledby="timer-info-title">
      <h2 id="timer-info-title">{lang === 'en' ? 'About the Timers' : 'Über die Timer'}</h2>
      <div className="timer-info-grid">
        {items.map(item => {
          const purpose = purposeStyles[item.purpose];
          return (
            <a
              className="timer-info-item"
              key={item.key}
              href={lang === 'en' ? `#/about/${item.key}` : `#/wissen/${item.key}`}
              style={{ '--info-accent-rgb': purpose.rgb } as React.CSSProperties}
            >
              <div className="timer-info-top">
                <div className="timer-info-icon">
                  <TimerIcon type={item.icon} />
                </div>
                <div className="timer-info-title-row">
                  <span className="timer-info-name">{item.name}</span>
                  <span className="timer-info-purpose" aria-label={purpose.label}>{purpose.label}</span>
                </div>
              </div>
              <p className="timer-info-desc">{item.desc}</p>
              <div className="timer-info-tags" aria-label={lang === 'en' ? 'Categories' : 'Kategorien'}>
                {item.categories.map(tag => (
                  <span className="timer-info-tag" key={tag}>{tag}</span>
                ))}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

export default TimerQuickInfo;
