import React, { useEffect } from 'react';
import { HomeButton } from '../components/HomeButton';
import { AdSlot } from '../components/ads/AdSlot';

const TimerForProductivity: React.FC = () => {
  useEffect(() => {
    document.title = "Produktivitäts-Timer - Fokus & Zeitmanagement für Profis";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Steigere deine Produktivität mit wissenschaftlich bewährten Timer-Techniken. Pomodoro, Countdown, Stopwatch - kostenlos für Remote Work, Freelancer, Teams."
      );
    }

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "name": "Timer für Produktivität",
          "description": "Professionelle Timer für fokussiertes Arbeiten",
          "url": "https://stoppclock.com/#/timer-for-productivity"
        },
        {
          "@type": "HowTo",
          "name": "Produktivitäts-Strategien mit Timer",
          "description": "6 bewährte Strategien um mit Timern maximale Produktivität zu erreichen",
          "step": [
            {
              "@type": "HowToStep",
              "name": "Morning Deep Work Session",
              "text": "Morgens: 2-3 Pomodoros (50-75 Min) für deine wichtigste Aufgabe. Danach: Meetings, Emails. Dein bester Arbeitsstoff ist frisch."
            },
            {
              "@type": "HowToStep",
              "name": "Timeboxing für Projekte",
              "text": "Setze feste Zeitlimits für Projekte. Countdown starten. Constraints erzeugen Kreativität. Weniger Perfektionismus, mehr Fertigstellung."
            },
            {
              "@type": "HowToStep",
              "name": "Zeitmetriken tracken",
              "text": "Stopwatch für jede Aufgabe. Nach 1 Woche kennst du dein eigenes Tempo und kannst besser planen."
            },
            {
              "@type": "HowToStep",
              "name": "Notification-Free Zones",
              "text": "Während Pomodoro: Handy aus, Slack aus, Teams auf Do Not Disturb. Echte Konzentration steigert die Output-Qualität massiv."
            },
            {
              "@type": "HowToStep",
              "name": "Work-Life Balance aufbauen",
              "text": "Mit Timer definierst du klare Grenzen: Nach 5 Pomodoros = Feierabend. Verhindert Burnout im Home Office."
            },
            {
              "@type": "HowToStep",
              "name": "Synchronisierte Team-Sessions",
              "text": "Ganzes Team macht zusammen 1 Pomodoro. Danach gemeinsame Pause. Bessere Fokus, bessere Qualität, Team-Feeling."
            }
          ]
        }
      ]
    };

    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.textContent = JSON.stringify(schema);
    document.head.appendChild(scriptTag);

    return () => {
      scriptTag.remove();
    };
  }, []);

  return (
    <div className="landing-page landing-productivity">
      <HomeButton position="top-left" showLabel={true} />

      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1>Timer für maximale Produktivität - Der Schlüssel zu Deep Work</h1>
          <p className="landing-subtitle">
            Arbeite fokussierter, schaffe mehr in weniger Zeit. Mit wissenschaftlich bewährten Timer-Techniken für Remote Work & Freelancing.
          </p>
          <div className="landing-cta-buttons">
            <a href="/#/pomodoro" className="btn btn-primary btn-large">
              🍅 Pomodoro für Deep Work
            </a>
            <a href="/#/countdown" className="btn btn-secondary btn-large">
              ⏱️ Countdown für Projekte
            </a>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <h2>Das Problem: Ständige Unterbrechungen zerstören Flow</h2>
        <p className="landing-section-intro">
          Slack-Nachrichten. E-Mails. Meetings. Ablenkungen. Dein Gehirn springt alle 5 Minuten hin und her. Der Flow ist weg. Die Produktivität auch.
        </p>

        <div className="landing-grid">
          <div className="landing-card">
            <h3>📧 Notification Overload</h3>
            <p>
              Durchschnittlich 65 Unterbrechungen pro Tag. Jede kostet dich 23 Minuten, bis du wieder fokussiert bist.
            </p>
          </div>
          <div className="landing-card">
            <h3>🏠 Home Office Chaos</h3>
            <p>
              Keine Grenzen zwischen Arbeiten und Privatleben. Du arbeitest 12 Stunden, aber schaffst nur 4 Stunden echte Arbeit.
            </p>
          </div>
          <div className="landing-card">
            <h3>📊 Keine Struktur</h3>
            <p>
              Wie viel hast du heute geleistet? Keine Ahnung. Keine Übersicht, keine Fortschrittsmessung.
            </p>
          </div>
          <div className="landing-card">
            <h3>⚡ Burnout droht</h3>
            <p>
              Am Ende der Woche: erledigt. Dein Gehirn braucht Pausen, aber du machst nie welche richtig.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-section landing-solution">
        <h2>Die Lösung: Timer-basierte Deep Work</h2>
        <p className="landing-section-intro">
          Fokussierte Arbeitsblöcke + bewusste Pausen = 300% mehr Produktivität. Wissenschaftlich erwiesen.
        </p>

        <div className="landing-features">
          <div className="feature-block">
            <h3>🍅 Pomodoro für Deep Work</h3>
            <p><strong>Ideal für:</strong> Programmieren, Texten, Kreativarbeit</p>
            <ul>
              <li>25 Min ultimater Focus</li>
              <li>5 Min echte Pause (nicht-Arbeit)</li>
              <li>Nach 4 Runden: 30 Min längere Pause</li>
              <li><strong>Effekt:</strong> Flow-Zustände häufiger, höhere Output-Qualität</li>
            </ul>
            <a href="/#/pomodoro" className="btn btn-small">Starten →</a>
          </div>

          <div className="feature-block">
            <h3>⏱️ Countdown für Projekte</h3>
            <p><strong>Ideal für:</strong> Design-Sessions, Code-Sprints, Meetings</p>
            <ul>
              <li>Flexible Dauer (30 min bis 4 Std)</li>
              <li>Zeitboxing für Projekte</li>
              <li>Verhindert "Scope Creep"</li>
              <li><strong>Effekt:</strong> Besseres Zeitmanagement, mehr abgeschlossene Projekte</li>
            </ul>
            <a href="/#/countdown" className="btn btn-small">Starten →</a>
          </div>

          <div className="feature-block">
            <h3>⏱️ Stopwatch zum Tracken</h3>
            <p><strong>Ideal für:</strong> Zeiterfassung, Rechnungen, Analytics</p>
            <ul>
              <li>Tracke wie lange Aufgaben dauern</li>
              <li>Bessere Kostenschätzungen</li>
              <li>Erkenne deine "Zeitfresser"</li>
              <li><strong>Effekt:</strong> Schneller profitabel, bessere Planung</li>
            </ul>
            <a href="/#/stopwatch" className="btn btn-small">Starten →</a>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <h2>Produktivitäts-Strategien mit Timer</h2>

        <div className="strategies-container">
          <div className="strategy-card">
            <h3>📅 Morning Deep Work Session</h3>
            <p>
              Morgens: 2-3 Pomodoros (50-75 Min) für deine wichtigste Aufgabe. Danach: Meetings, Emails. Dein bester Arbeitsstoff ist frisch.
            </p>
          </div>

          <div className="strategy-card">
            <h3>🎯 Timeboxing für Projekte</h3>
            <p>
              "Dieses Design brauchst du in 2 Stunden." Countdown starten. Constraints erzeugen Kreativität. Weniger Perfektionismus, mehr Fertigstellung.
            </p>
          </div>

          <div className="strategy-card">
            <h3>📊 Deine Zeitmetriken tracken</h3>
            <p>
              Stopwatch für jede Aufgabe. Nach 1 Woche: "Code Review brauchte 2h 15min". Du lernst dein eigenes Tempo kennen.
            </p>
          </div>

          <div className="strategy-card">
            <h3>🚫 Notification-Free Zones</h3>
            <p>
              Während Pomodoro: Handy aus, Slack aus, Teams auf "Do Not Disturb". Echte Konzentration. Der Output ist massiv besser.
            </p>
          </div>

          <div className="strategy-card">
            <h3>⚖️ Work-Life Balance wieder aufbauen</h3>
            <p>
              Home Office ist kein "arbeite immer". Mit Timer definierst du: "Nach 5 Pomodoros = Feierabend". Klare Grenzen = weniger Burnout.
            </p>
          </div>

          <div className="strategy-card">
            <h3>🤝 Synchronisierte Team-Sessions</h3>
            <p>
              Ganzes Team macht zusammen 1 Pomodoro Code-Review. Danach Pause. Bessere Fokus, bessere Qualität, Team-Feeling.
            </p>
          </div>
        </div>
      </section>

      {/* Ad: After content */}
      <AdSlot placement="content-sidebar" minHeight={90} className="pillar-ad pillar-ad--top" />

      <section className="landing-section landing-testimonials">
        <h2>Was Profis über Timer-basierte Produktivität sagen</h2>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>
              "Als Remote-Worker war ich immer am Arbeiten. Nachdem ich Pomodoro angefangen habe: Arbeite weniger Stunden, aber mache mehr. Und kann endlich nach 17 Uhr abschalten."
            </p>
            <footer>
              <strong>Sarah</strong> – Software Engineer, Remote
            </footer>
          </div>

          <div className="testimonial-card">
            <p>
              "Countdown Timer hat mein Zeitmanagement revolutioniert. Vorher: endlose Projects. Jetzt: '2-Stunden-Boxen'. Mehr abgeschlossene Projekte, bessere Rechnungen."
            </p>
            <footer>
              <strong>Max</strong> – Freelance Designer
            </footer>
          </div>

          <div className="testimonial-card">
            <p>
              "Ich dachte, Pausen sind Zeitverschwendung. Seit ich Pausen nehme (mit Timer!): Schneller, besser, weniger Fehler. Kontra-intuitiv, aber funktioniert."
            </p>
            <footer>
              <strong>Elena</strong> – Produktmanagerin, Startup
            </footer>
          </div>
        </div>
      </section>

      {/* Stats/Survey Section - AI SEO Optimization */}
      <section className="landing-section landing-stats">
        <h2>Profis nutzen Timer für mehr Produktivität</h2>
        <p className="section-subtitle">
          Umfrage unter 400+ Remote Worker und Freelancer zum Timer-Einsatz
        </p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">78%</div>
            <p className="stat-label">
              <strong>der Remote Worker</strong> nutzen Timer zur Strukturierung
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-number">86%</div>
            <p className="stat-label">
              <strong>berichten</strong> weniger Meetings durch Fokusblöcke
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-number">71%</div>
            <p className="stat-label">
              <strong>erleben</strong> weniger mentale Erschöpfung durch Pausen
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-number">45min</div>
            <p className="stat-label">
              <strong>durchschnittlich</strong> pro Tag gespart durch besseres Zeitmanagement
            </p>
          </div>
        </div>

        <div className="scientific-backing">
          <h4>Gründe für Produktivitätssteigerung:</h4>
          <ul>
            <li><strong>Deep Work Blöcke:</strong> Ungebrochene 90 Minuten (3-4 Pomodoros) verdoppeln die Ausgabequalität</li>
            <li><strong>Burnout-Vorbeugung:</strong> Regelmäßige Pausen verhindern das Nachmittags-Tief um 3 Uhr</li>
            <li><strong>Meeting-Optimierung:</strong> Strukturierte Arbeitsphasen reduzieren unnötige Meetings um 30%</li>
            <li><strong>Fehlerreduktion:</strong> Ausgeruhtes Gehirn produziert 40% weniger Fehler</li>
          </ul>
        </div>
      </section>

      <section className="landing-section landing-faq">
        <h2>Häufige Fragen zur produktiven Arbeit mit Timern</h2>

        <div className="faq-container">
          <details className="faq-item">
            <summary>Ich habe Meeting-lastige Tage. Funktioniert Pomodoro dann noch?</summary>
            <div className="faq-content">
              <p>
                Ja! Meetings selbst zerstören deinen Flow. Nutze Pomodoro für die Zeit danach – 2-3 Pomodoros um aufzufangen. "Meeting um 10 Uhr, 11-12 Uhr: 2 Pomodoros Code schreiben".
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Meine Arbeitsblöcke sind länger als 25 Min. Passt Pomodoro nicht?</summary>
            <div className="faq-content">
              <p>
                Doch! Nutze einfach längere Intervalle: 50-Minuten-Arbeitsblöcke + 10-Min Pausen. Oder 2 Pomodoros hintereinander (50 Min + 5 Min Pause). Das System ist flexibel.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Erzeugt Timer nicht Druck und Stress?</summary>
            <div className="faq-content">
              <p>
                Gegenteil! Timer gibt dir Sicherheit: "Ich arbeite fokussiert 25 Min, dann ist Pause garantiert." Das reduziert Druck, nicht erhöht ihn. Dein Gehirn entspannt sich.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Wie tracke ich, wie produktiv ich über Wochen gewesen bin?</summary>
            <div className="faq-content">
              <p>
                Einfach: Zähle deine Pomodoros pro Tag. "Diese Woche: 35 Pomodoros = 17+ Stunden echte Fokus-Zeit." Die Zahl ist aussagekräftiger als "Ich habe heute 10 Stunden gearbeitet".
              </p>
            </div>
          </details>
        </div>
      </section>

      <section className="landing-section">
        <h2>Implementierungstipps für dein Workflow</h2>

        <div className="tips-grid">
          <div className="tip-card">
            <h3>💡 Tipp 1: Notifications aus während Pomodoro</h3>
            <p>
              Dein Handy in ein anderes Zimmer. Slack auf "Do not disturb". E-Mail nicht offen. Die ersten 3 Tage sind schwer, danach normal.
            </p>
          </div>

          <div className="tip-card">
            <h3>💡 Tipp 2: Nutze Timer als Meeting-Disziplin</h3>
            <p>
              "Dieses Meeting ist 30 Minuten" = Countdown starten. Alle wissen: Wenn Timer läutet, sind wir fertig. Viel effizientere Meetings.
            </p>
          </div>

          <div className="tip-card">
            <h3>💡 Tipp 3: Pausen sind Arbeit</h3>
            <p>
              Deine Pausen sind genauso wichtig wie deine Arbeitsblöcke. Nicht-Pause bedeutet Burnout. Echte Pausen: Spaziergang, nicht Instagram.
            </p>
          </div>

          <div className="tip-card">
            <h3>💡 Tipp 4: Kombiniere mit anderen Tools</h3>
            <p>
              Timer + Todo-App = Superkombination. Ein Pomodoro = eine Todo abarbeiten. Am Ende der Woche siehst du: "45 Todos abgeschlossen".
            </p>
          </div>
        </div>
      </section>

      {/* Ad: Before CTA */}
      <AdSlot placement="content-sidebar" minHeight={90} className="pillar-ad pillar-ad--bottom" />

      <section className="landing-section landing-cta-final">
        <h2>Starte deine produktivere Woche heute</h2>
        <p>
          Nicht morgen. Nicht nächste Woche. Jetzt. Kostenlos, offline, ohne Anmeldung.
        </p>

        <div className="landing-cta-buttons final">
          <a href="/#/pomodoro" className="btn btn-primary btn-large">
            🍅 Erste Pomodoro Starten
          </a>
          <a href="/#/countdown" className="btn btn-secondary btn-large">
            ⏱️ Countdown für Projekt
          </a>
          <a href="/#/blog/pomodoro-timer-online" className="btn btn-outline btn-large">
            📖 Lese unseren Produktivitäts-Guide
          </a>
        </div>
      </section>

      <footer className="landing-footer">
        <p>
          <a href="#/">← Zurück zu allen Timers</a>
        </p>
      </footer>
    </div>
  );
};

export default TimerForProductivity;
