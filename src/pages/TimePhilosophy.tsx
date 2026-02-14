
import React from 'react';
import { HomeButton } from '../components/HomeButton';

export default function TimePhilosophy() {
  return (
    <div className="page" style={{ padding: '96px 16px 48px', maxWidth: '800px', margin: '0 auto', color: 'var(--neutral-white)', textAlign: 'center' }}>
      <HomeButton />
      <h1 className="timer-title" style={{ fontSize: '3rem', marginBottom: '32px' }}>Raum für Zeit</h1>
      
      <section style={{ marginBottom: '48px', lineHeight: 1.8, fontSize: '1.2rem' }}>
        <p style={{ marginBottom: '24px' }}>
          Zeit. Ein unaufhaltsamer Fluss, der uns trägt. Wir versuchen sie zu fassen, zu messen, in Einheiten zu zerlegen. Sekunden, Minuten, Stunden. Wir jagen ihr nach, fürchten ihr Vergehen und sehnen uns doch nach Momenten, in denen sie stillzustehen scheint.
        </p>
        <p style={{ marginBottom: '24px' }}>
          Diese Seite ist ein Experiment. Ein Raum, um über Zeit nachzudenken. Nicht die gemessene, die geplante, die optimierte Zeit. Sondern die erlebte Zeit. Die Zeit, die sich dehnt und zusammenzieht, die in Erinnerungen weiterlebt und in der Vorausschau Gestalt annimmt.
        </p>
        <p>
          Was ist Zeit, wenn wir sie nicht auf einer Uhr ablesen? Ist sie ein Gefühl? Eine vierte Dimension? Eine Illusion? Vielleicht ist sie all das und nichts davon. Ein Mysterium, das sich nur im Erleben offenbart, aber im Moment des Erlebens nicht in Worte fassen lässt.
        </p>
      </section>

      <div style={{ borderTop: '1px solid var(--subtle-border)', paddingTop: '32px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Ein Raum zum Verweilen</h2>
        <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
          Nimm dir einen Moment. Atme. Beobachte.
        </p>
      </div>
    </div>
  );
}
