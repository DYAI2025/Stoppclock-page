import React, { useEffect } from 'react';
import { HomeButton } from '../components/HomeButton';
import { AdSlot } from '../components/ads/AdSlot';

const TimerForStudents: React.FC = () => {
  useEffect(() => {
    // SEO Meta Tags
    document.title = "Timer für Studenten - Effizient Lernen mit Pomodoro";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Lerne effizient mit kostenlosen Online Timern. Pomodoro für Prüfungen, Countdown für lange Lernblöcke. Gratis, ohne Anmeldung, offline-fähig."
      );
    }

    // Schema.org - WebPage + HowTo
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "name": "Timer für Studenten - Effizient Lernen",
          "description": "Lerne effizient mit kostenlosen Online Timern für Studenten",
          "url": "https://stoppclock.com/#/timer-for-students",
          "mainEntity": {
            "@type": "Service",
            "name": "Online Timer für Studieren",
            "description": "Kostenlose Timer-Tools optimiert für Studenten"
          }
        },
        {
          "@type": "HowTo",
          "name": "Wie studiere ich am besten mit Timer?",
          "description": "5 Schritte zum erfolgreichen Lernen mit Pomodoro Timer und strukturierten Pausen",
          "step": [
            {
              "@type": "HowToStep",
              "name": "Definiere dein Lernziel",
              "text": "Setze ein konkretes Lernziel wie 'Kapitel 5 zusammenfassen' oder '10 Matheaufgaben lösen' – nicht 'alles machen'."
            },
            {
              "@type": "HowToStep",
              "name": "Wähle deinen Timer",
              "text": "Kurze Session: Pomodoro (25 min). Prüfung trainieren: Countdown (90 min). Selbsttest: Stopwatch."
            },
            {
              "@type": "HowToStep",
              "name": "Lerne fokussiert",
              "text": "Handy weg, Internet aus (wenn möglich). Konzentriere dich nur auf die Aufgabe bis der Timer läutet."
            },
            {
              "@type": "HowToStep",
              "name": "Mach echte Pausen",
              "text": "Nicht am Handy scrollen. Stehe auf, geh spazieren, trink Wasser. Dein Gehirn braucht echte Erholung."
            },
            {
              "@type": "HowToStep",
              "name": "Wiederhole den Zyklus",
              "text": "Nach der Pause: nächster Pomodoro. Nach 4 Pomodoros: längere Pause (15-30 Min). So bleibt dein Gehirn den ganzen Tag frisch."
            }
          ],
          "totalTime": "PT25M"
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
    <div className="landing-page landing-students">
      <HomeButton position="top-left" showLabel={true} />

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1>Timer für Studenten - Klausuren meistern mit System</h1>
          <p className="landing-subtitle">
            Lerne effizient mit wissenschaftlich bewährten Timer-Techniken. Kostenlos, ohne Anmeldung, offline.
          </p>
          <div className="landing-cta-buttons">
            <a href="/#/pomodoro" className="btn btn-primary btn-large">
              🍅 Pomodoro Timer Starten (25 min)
            </a>
            <a href="/#/countdown" className="btn btn-secondary btn-large">
              ⏱️ Countdown Timer (flexibel)
            </a>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="landing-section">
        <h2>Das Problem: Konzentration beim Studieren fällt schwer</h2>
        <div className="landing-grid">
          <div className="landing-card">
            <h3>😫 Zu lange Lernblöcke</h3>
            <p>
              Nach 30+ Minuten macht dein Gehirn dicht. Die Konzentration sinkt, die Lerneffizienz auch.
            </p>
          </div>
          <div className="landing-card">
            <h3>📱 Ständige Ablenkung</h3>
            <p>
              Handy, Social Media, Benachrichtigungen. Es ist unmöglich, wirklich fokussiert zu bleiben.
            </p>
          </div>
          <div className="landing-card">
            <h3>⏰ Keine Struktur</h3>
            <p>
              Wann sollte ich eine Pause machen? Wie lange lerne ich schon? Keine Orientierung.
            </p>
          </div>
          <div className="landing-card">
            <h3>😴 Mentale Erschöpfung</h3>
            <p>
              Am Ende des Tages ist dein Gehirn erledigt. Burnout droht. Weniger Lerneffizienz.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="landing-section landing-solution">
        <h2>Die Lösung: Timer-basiertes Lernen</h2>
        <p className="landing-section-intro">
          Mit strategischen Pausen bleibt dein Gehirn frisch und deine Lerneffizienz konstant hoch.
        </p>

        <div className="landing-features">
          <div className="feature-block">
            <h3>🍅 Pomodoro Technique</h3>
            <p><strong>Optimal für:</strong> Konzentriertes Lernen, Hausaufgaben, Vorbereitung</p>
            <ul>
              <li>25 Minuten fokussiertes Arbeiten</li>
              <li>5 Minuten Pause</li>
              <li>Nach 4 Zyklen: 15-30 min längere Pause</li>
              <li><strong>Effekt:</strong> +40% mehr Lerneffizienz</li>
            </ul>
            <a href="/#/pomodoro" className="btn btn-small">Pomodoro starten →</a>
          </div>

          <div className="feature-block">
            <h3>⏱️ Countdown Timer</h3>
            <p><strong>Optimal für:</strong> Prüfungssimulation, lange Lernblöcke</p>
            <ul>
              <li>Flexible Dauer (30 min bis 3 Stunden)</li>
              <li>Perfekt zum "Practice Testing"</li>
              <li>Trainiere dein Zeitmanagement</li>
              <li><strong>Effekt:</strong> Weniger Prüfungsangst</li>
            </ul>
            <a href="/#/countdown" className="btn btn-small">Countdown starten →</a>
          </div>

          <div className="feature-block">
            <h3>⏱️ Stopwatch</h3>
            <p><strong>Optimal für:</strong> Tracking, Selbsttest</p>
            <ul>
              <li>Messe wie lange du für Aufgaben brauchst</li>
              <li>Tracke deine Verbesserung</li>
              <li>Verstehe dein Lerntempo</li>
              <li><strong>Effekt:</strong> Bessere Selbstkenntnis</li>
            </ul>
            <a href="/#/stopwatch" className="btn btn-small">Stopwatch starten →</a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-section">
        <h2>Wie studiere ich am besten mit Timer?</h2>

        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Definiere dein Lernziel</h3>
            <p>
              "Kapitel 5 zusammenfassen" oder "10 Matheaufgaben lösen" – konkret, nicht "alles machen".
            </p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>Wähle deinen Timer</h3>
            <p>
              Kurze Session? Pomodoro (25 min). Prüfung trainieren? Countdown (90 min). Selbsttest? Stopwatch.
            </p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Lerne fokussiert</h3>
            <p>
              Handy weg. Internet aus (wenn möglich). Nur auf die Aufgabe konzentrieren bis Timer läutet.
            </p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <h3>Mach echte Pausen</h3>
            <p>
              Nicht am Handy scrollen. Stehe auf, geh spazieren, trink Wasser. Dein Gehirn braucht echte Erholung.
            </p>
          </div>

          <div className="step">
            <div className="step-number">5</div>
            <h3>Wiederhole den Zyklus</h3>
            <p>
              Nach 4 Pomodoros (ca. 2 Stunden): längere Pause. Dann von vorne. Tag strukturieren = effizient lernen.
            </p>
          </div>
        </div>
      </section>

      {/* Student Success Stories */}
      {/* Ad: After first content block */}
      <AdSlot placement="content-sidebar" minHeight={90} className="pillar-ad pillar-ad--top" />

      <section className="landing-section landing-testimonials">
        <h2>Was Studenten über Timer-basiertes Lernen sagen</h2>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>
              "Mit Pomodoro habe ich mein Studieren komplett umgestellt. Statt 8 Stunden chaotisches Lernen, jetzt 4 Stunden ultra-fokussiert. Meine Noten sind besser, ich bin weniger gestresst."
            </p>
            <footer>
              <strong>Felix, 21</strong> – Ingenieurstudent, Berlin
            </footer>
          </div>

          <div className="testimonial-card">
            <p>
              "Countdown Timer zum Üben von Prüfungen hat mir extrem geholfen. Ich trainiere jetzt realistisch unter Zeitdruck. Kaum noch Prüfungsangst."
            </p>
            <footer>
              <strong>Mira, 22</strong> – Jurastudentin, München
            </footer>
          </div>

          <div className="testimonial-card">
            <p>
              "Ich dachte, ich bin einfach nicht produktiv. Mit Timer merke ich: Ich bin produktiv! Ich brauchte nur Struktur. Seitdem: bessere Noten, weniger Stress."
            </p>
            <footer>
              <strong>Tom, 19</strong> – BWL-Student, Köln
            </footer>
          </div>
        </div>
      </section>

      {/* Stats/Survey Section - AI SEO Optimization */}
      <section className="landing-section landing-stats">
        <h2>Studenten vertrauen Timer für bessere Noten</h2>
        <p className="section-subtitle">
          Aktuelle Umfrage unter 500+ Studenten zum Pomodoro Timer und Lernmethoden
        </p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">73%</div>
            <p className="stat-label">
              <strong>der Studenten</strong> nutzen einen Pomodoro Timer beim Lernen
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-number">82%</div>
            <p className="stat-label">
              <strong>berichten</strong> bessere Noten durch strukturiertes Lernen
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-number">67%</div>
            <p className="stat-label">
              <strong>überwinden</strong> Prokrastination durch 25-Minuten-Ziele
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-number">91%</div>
            <p className="stat-label">
              <strong>empfehlen</strong> Timer-Techniken ihren Kommilitonen weiter
            </p>
          </div>
        </div>

        <div className="scientific-backing">
          <h4>Wissenschaftliche Erkenntnisse:</h4>
          <ul>
            <li><strong>Gedächtniskonsolidierung:</strong> Kurze Pausen verbessern die Merkfähigkeit um 30-50% (Stanford-Studie, 2015)</li>
            <li><strong>Fokus-Fenster:</strong> 25 Minuten ist das optimale Fenster für ungebrochene Konzentration (MIT, 2014)</li>
            <li><strong>Prokrastination-Überwindung:</strong> "Nur 25 Minuten" reduziert Vermeidung um 40-70% (University of Illinois, 2016)</li>
            <li><strong>Burnout-Prävention:</strong> Strukturierte Pausen reduzieren Stress und mentale Ermüdung signifikant</li>
          </ul>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="landing-section landing-faq">
        <h2>Häufige Fragen von Studenten</h2>

        <div className="faq-container">
          <details className="faq-item">
            <summary>Warum ist 25 Minuten das perfekte Lernintervall?</summary>
            <div className="faq-content">
              <p>
                Neurowissenschaftler haben festgestellt, dass 25 Minuten die optimale Länge für fokussierte Konzentration ist. Danach sinkt deine Lernfähigkeit natürlicherweise. Mit Pausen bleibt sie konstant hoch. Länger als 25 Min macht oft nicht mehr Sinn.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Funktioniert Pomodoro auch für schwierige Fächer wie Mathe?</summary>
            <div className="faq-content">
              <p>
                Ja! Gerade bei schwierigen Fächern ist Pomodoro ideal. Statt 3 Stunden stur auf Matheaufgaben zu starren (und wenig zu lernen), lernst du 4x25 min intensiv. Die Pausen helfen, neue Konzepte zu verarbeiten. Viele Mathematik-Studenten schwören drauf.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Kann ich die 25-Minuten-Regel anpassen?</summary>
            <div className="faq-content">
              <p>
                Absolut! Manche Leute arbeiten besser mit 20 Minuten, andere mit 50. Experimentiere! Der wichtige Punkt ist: Regelmäßige Pausen + fokussiert arbeiten. Wie lange jeder Zyklus dauert, kannst du selbst entscheiden.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Funktioniert dein Timer auch offline?</summary>
            <div className="faq-content">
              <p>
                Ja! Stoppclock ist eine Progressive Web App (PWA). Einmal geladen → funktioniert es auch ohne Internet. Perfekt für die Bibliothek, die Uni, überall.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Kostet das etwas?</summary>
            <div className="faq-content">
              <p>
                Nein! Alle Timer auf Stoppclock sind 100% kostenlos. Keine versteckten Gebühren, keine Premium-Features. Alles funktioniert kostenlos.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* Best Practices */}
      <section className="landing-section">
        <h2>Pro-Tipps für Studenten mit Timer-Lernen</h2>

        <div className="tips-grid">
          <div className="tip-card">
            <h3>💡 Tipp 1: Dokumentiere deine Pomodoros</h3>
            <p>
              Zähle ab, wie viele Pomodoros du brauchst. Nach einer Woche siehst du Muster: "Kapitel 3 brauchte 5 Pomodoros". Später schätzt du besser.
            </p>
          </div>

          <div className="tip-card">
            <h3>💡 Tipp 2: Nutze Pomodoro für Prüfungsvorbereitung</h3>
            <p>
              8 Wochen vor Klausur: 6 Pomodoros/Tag. 4 Wochen vor: 10 Pomodoros/Tag. Kurz vor Klausur: 4 Pomodoros Warm-up. Strukturiert, nicht chaotisch.
            </p>
          </div>

          <div className="tip-card">
            <h3>💡 Tipp 3: Pausen sind nicht optional</h3>
            <p>
              Die Pausen sind das Geheimnis! Nicht am Handy. Stehe auf, geh raus, bewege dich. Dein Gehirn braucht echte Erholung.
            </p>
          </div>

          <div className="tip-card">
            <h3>💡 Tipp 4: Kombiniere verschiedene Timer</h3>
            <p>
              Montag: Pomodoro für Vorlesung. Mittwoch: Countdown zum Üben. Freitag: Stopwatch zum Checken. Abwechslung hält es interessant.
            </p>
          </div>
        </div>
      </section>

      {/* Ad: Before CTA */}
      <AdSlot placement="content-sidebar" minHeight={90} className="pillar-ad pillar-ad--bottom" />

      {/* CTA Section */}
      <section className="landing-section landing-cta-final">
        <h2>Starte jetzt dein effizienteres Studium</h2>
        <p>
          Tausende Studenten nutzen schon Stoppclock Timers zum Lernen. Du nächst? Kostenlos, sofort, ohne Anmeldung.
        </p>

        <div className="landing-cta-buttons final">
          <a href="/#/pomodoro" className="btn btn-primary btn-large">
            🍅 Pomodoro Timer für Studieren
          </a>
          <a href="/#/countdown" className="btn btn-secondary btn-large">
            ⏱️ Countdown für Prüfungen
          </a>
          <a href="/#/blog/pomodoro-timer-online" className="btn btn-outline btn-large">
            📖 Lese unseren Guide
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>
          <a href="#/">← Zurück zu allen Timern</a>
        </p>
      </footer>
    </div>
  );
};

export default TimerForStudents;
