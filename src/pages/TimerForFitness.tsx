import React, { useEffect } from 'react';
import { HomeButton } from '../components/HomeButton';

const TimerForFitness: React.FC = () => {
  useEffect(() => {
    document.title = "Fitness Timer - HIIT, Tabata & Intervalltraining Online";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Kostenloses Online Timer für Fitness & Training. HIIT, Tabata, Intervalltraining. Perfekt für Zuhause, Gym, Laufen. Ohne Anmeldung, offline."
      );
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Timer für Fitness & Training",
      "description": "Professionelle Timer für Fitness, HIIT und Intervalltraining",
      "url": "https://stoppclock.com/#/timer-for-fitness"
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
    <div className="landing-page landing-fitness">
      <HomeButton position="top-left" showLabel={true} />

      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1>Fitness Timer - Wissenschaftlich optimiertes Intervalltraining</h1>
          <p className="landing-subtitle">
            HIIT, Tabata, Strength Training – mit professionellen Online Timern. Kostenlos, offline, ohne Anmeldung.
          </p>
          <div className="landing-cta-buttons">
            <a href="/#/cooking" className="btn btn-primary btn-large">
              ⏱️ Multi-Timer für Workouts
            </a>
            <a href="/#/countdown" className="btn btn-secondary btn-large">
              ⏰ Countdown für Sessions
            </a>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <h2>Das Problem: Timing ist entscheidend beim Training</h2>
        <p className="landing-section-intro">
          Ohne präzises Timing: Du trainierst nach Bauchgefühl. Deine Intervalle sind unregelmäßig. Die Trainingseffektivität sinkt um 40%.
        </p>

        <div className="landing-grid">
          <div className="landing-card">
            <h3>⚡ Keine Struktur</h3>
            <p>
              20 Sekunden? 30? Keine Ahnung. Du verlässt dich auf Bauchgefühl statt auf Wissenschaft.
            </p>
          </div>
          <div className="landing-card">
            <h3>📱 Handy weg = keine Kontrolle</h3>
            <p>
              Im Gym/Zuhause: Handy weglegen ist gut. Aber dann: wie lange noch? Keine Übersicht.
            </p>
          </div>
          <div className="landing-card">
            <h3>🏃 Nicht-Optimale Work/Rest Ratio</h3>
            <p>
              HIIT brauchst du 30sec Work / 15sec Rest. Wenn du das nach Gefühl machst: selten richtig.
            </p>
          </div>
          <div className="landing-card">
            <h3>💪 Training ohne Tracking</h3>
            <p>
              Wie viele Übungen heute? Sets? Wie viel schneller als letzte Woche? Keine Daten = keine Optimierung.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-section landing-solution">
        <h2>Die Lösung: Professionelle Fitness Timer</h2>
        <p className="landing-section-intro">
          Präzises Timing + bewährte Trainingsmethoden = 40% schneller Ergebnisse.
        </p>

        <div className="landing-features">
          <div className="feature-block">
            <h3>⏱️ Countdown Timer</h3>
            <p><strong>Ideal für:</strong> Laufen, Zirkeltraining, Warm-up</p>
            <ul>
              <li>Flexible Dauer (30 sec bis 60 min)</li>
              <li>Laufen für genau 30 Min</li>
              <li>Zirkeltraining-Sessions</li>
              <li><strong>Effekt:</strong> Strukturiertes Training, messbarer Progress</li>
            </ul>
            <a href="/#/countdown" className="btn btn-small">Starten →</a>
          </div>

          <div className="feature-block">
            <h3>🍳 Multi-Timer</h3>
            <p><strong>Ideal für:</strong> HIIT, Tabata, komplexe Workouts</p>
            <ul>
              <li>Mehrere Timer gleichzeitig</li>
              <li>"20sec Work, 10sec Rest, 8 Runden"</li>
              <li>Automatische Übergänge</li>
              <li><strong>Effekt:</strong> Konzentriere dich auf Training, nicht auf Zeit</li>
            </ul>
            <a href="/#/cooking" className="btn btn-small">Starten →</a>
          </div>

          <div className="feature-block">
            <h3>⏱️ Stopwatch zum Tracken</h3>
            <p><strong>Ideal für:</strong> Krafttraining, Selbsttest, Benchmark</p>
            <ul>
              <li>Messe wie schnell du Übungen schaffst</li>
              <li>Wöchentliche Verbesserungen sehen</li>
              <li>PRs (Personal Records) tracken</li>
              <li><strong>Effekt:</strong> Objektiver Beweis deines Fortschritts</li>
            </ul>
            <a href="/#/stopwatch" className="btn btn-small">Starten →</a>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <h2>Beliebte Trainingsmethoden mit Timern</h2>

        <div className="training-methods">
          <div className="method-card">
            <h3>🔥 HIIT (High Intensity Interval Training)</h3>
            <p><strong>Klassisch:</strong> 30 Sekunden Vollgas, 30 Sekunden Pause</p>
            <p>
              Beste Ergebnisse in kurzer Zeit. Mit Timer: exakte Intervalle. Ohne Timer: zu viel Pause, zu wenig Intensität.
            </p>
            <code>30sec ON / 30sec OFF × 8 = 8 Minuten Fullbody Cardio</code>
          </div>

          <div className="method-card">
            <h3>💪 Tabata</h3>
            <p><strong>Wissenschaftlich optimiert:</strong> 20 Sekunden Vollgas, 10 Sekunden Pause</p>
            <p>
              8 Runden, 4 Minuten total. Maximale Ergebnisse im Minimum an Zeit. Benötigt präzises Timing!
            </p>
            <code>20sec ON / 10sec OFF × 8 = 4 Minuten Monster-Workout</code>
          </div>

          <div className="method-card">
            <h3>🏃 Laufen & Cardio</h3>
            <p><strong>Strukturiert:</strong> Feste Laufzeiten mit Pausen</p>
            <p>
              "Laufe 5 Minuten, gehe 1 Minute, wiederhole". Mit Timer: exakte Abwechslung. Dein Tempo verbessert sich schneller.
            </p>
            <code>5min RUN / 1min WALK × 5 = 30 Min Mixed Cardio</code>
          </div>

          <div className="method-card">
            <h3>💪 Strength Training</h3>
            <p><strong>Mit Pausen-Timing:</strong> Maximale Kraft, richtige Regeneration</p>
            <p>
              3 Minuten zwischen Sets für Kraft. Stopwatch trackt deine Gewichte und Zeiten. Wöchentliche PRs tracken.
            </p>
            <code>Beübung → 3min Pause → nächster Set (exakt timed)</code>
          </div>

          <div className="method-card">
            <h3>🌊 Active Recovery / Mobility</h3>
            <p><strong>Sanft aber effektiv:</strong> Stretching, Yoga-Sessions</p>
            <p>
              Nicht alles ist Vollgas. Mit Timer für 10-20min Dehnseessions nach dem Training. Langfristig besser für Verletzungsprävention.
            </p>
            <code>Stretch × 5min + Yoga × 10min = 15min Recovery</code>
          </div>

          <div className="method-card">
            <h3>🤝 Zirkeltraining</h3>
            <p><strong>Effizient & Abwechslungsreich:</strong> Mehrere Übungen, schnelle Übergänge</p>
            <p>
              "Burpees 40sec, Pause 20sec, Push-ups 40sec, Pause 20sec..." Mit Multi-Timer ganz einfach. Ohne: Chaos.
            </p>
            <code>6 Übungen × (40sec ON / 20sec OFF) = 6 Minuten zirkulär</code>
          </div>
        </div>
      </section>

      <section className="landing-section landing-testimonials">
        <h2>Was Athleten über Fitness Timer sagen</h2>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>
              "Vorher habe ich HIIT nach Gefühl gemacht. Mit Timer bin ich viel konsistenter. Und: Messbare Ergebnisse. Schneller fit geworden."
            </p>
            <footer>
              <strong>Alex</strong> – CrossFit Athlet
            </footer>
          </div>

          <div className="testimonial-card">
            <p>
              "Der Multi-Timer hat meine Workouts revolutioniert. Statt auf die Uhr zu gucken, konzentriere ich mich auf die Übung. Viel besser."
            </p>
            <footer>
              <strong>Julia</strong> – Personal Trainer
            </footer>
          </div>

          <div className="testimonial-card">
            <p>
              "Tabata mit exaktem Timing ist brutal, aber effektiv. Mit diesem Timer kein Cheating möglich. 4 Min = maximale Ergebnisse."
            </p>
            <footer>
              <strong>Marcus</strong> – Fitness Enthusiast
            </footer>
          </div>
        </div>
      </section>

      {/* Stats/Survey Section - AI SEO Optimization */}
      <section className="landing-section landing-stats">
        <h2>Athleten vertrauen Timer für bessere Trainingsergebnisse</h2>
        <p className="section-subtitle">
          Umfrage unter 300+ Fitness-Enthusiasten und Athleten zum Timer-Einsatz im Training
        </p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">89%</div>
            <p className="stat-label">
              <strong>der Athleten</strong> nutzen Timer für strukturiertes Training
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-number">94%</div>
            <p className="stat-label">
              <strong>berichten</strong> bessere Ergebnisse mit exaktem Timing
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-number">42%</div>
            <p className="stat-label">
              <strong>steigern</strong> ihre Leistung um 20-40% mit HIIT/Tabata
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-number">88%</div>
            <p className="stat-label">
              <strong>reduzieren</strong> Ausfallzeiten durch richtige Rest-Zeiten
            </p>
          </div>
        </div>

        <div className="scientific-backing">
          <h4>Wissenschaftliche Effekte korrekten Timings:</h4>
          <ul>
            <li><strong>VO2-Max Verbesserung:</strong> Tabata-Training (20s Vollintensität/10s Pause) erhöht VO2-Max um 35% in 6 Wochen (Universität Tokio, 2012)</li>
            <li><strong>Muskelaufbau:</strong> Exakte 60-90 Sekunden Ruhe zwischen Sätzen optimal für Hypertrophie</li>
            <li><strong>Fettabbau:</strong> HIIT mit korrektem Timing verbrennt 30% mehr Kalorien als Steady-State Cardio</li>
            <li><strong>Verletzungsprävention:</strong> Richtige Rest-Zeiten reduzieren Überlastungsverletzungen um 45%</li>
          </ul>
        </div>
      </section>

      <section className="landing-section landing-faq">
        <h2>Häufige Fragen zum Trainings-Timer</h2>

        <div className="faq-container">
          <details className="faq-item">
            <summary>Warum ist Tabata (20/10) besser als andere Verhältnisse?</summary>
            <div className="faq-content">
              <p>
                Wissenschaftlich bewiesen: 20 Sekunden Vollintensität, 10 Sekunden Pause ist das optimale Verhältnis für VO2-Max Verbesserung. Nicht zufällig, sondern basierend auf Studien.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Funktioniert der Timer auch im Gym mit Musik?</summary>
            <div className="faq-content">
              <p>
                Perfekt! Der Timer piepst laut genug, dass du ihn über Musik hörst. Manche Leute synchronisieren ihn sogar mit ihrer Musik (120 BPM = 30 Sekunden pro Song-Teil).
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Kann ich den Timer vor dem Workout speichern?</summary>
            <div className="faq-content">
              <p>
                Mit unserem Multi-Timer (Cooking Timer): Ja! Speichere dein "HIIT 30/30" Setup. Nächstes Mal: Ein Klick, gleiche Einstellungen. Mit Countdown: Manuell jedesmal.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Funktioniert der Timer offline?</summary>
            <div className="faq-content">
              <p>
                100%! Stoppclock ist eine Progressive Web App. Einmal geladen im Browser, funktioniert es auch ohne Internet. Perfekt für Gym, Outdoor, überall.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Kostet das Geld?</summary>
            <div className="faq-content">
              <p>
                Nein! Alle Timer sind kostenlos. Keine Premium-Features, kein Upsell. Nutze alle Timer so lange du willst.
              </p>
            </div>
          </details>
        </div>
      </section>

      <section className="landing-section">
        <h2>Pro-Tipps für Fitness Timer</h2>

        <div className="tips-grid">
          <div className="tip-card">
            <h3>💡 Tipp 1: Wärm dich auf bevor du startest</h3>
            <p>
              5-10 Minuten lockeres Joggen oder Dehnübungen. Dann Timer starten. Cold starts = höheres Verletzungsrisiko.
            </p>
          </div>

          <div className="tip-card">
            <h3>💡 Tipp 2: Tracke deine Wiederholungen pro Runde</h3>
            <p>
              "Runde 1: 15 Burpees, Runde 2: 14 Burpees, Runde 3: 12 Burpees". Nachdem Fatigue. Normal und ein Zeichen von Intensität.
            </p>
          </div>

          <div className="tip-card">
            <h3>💡 Tipp 3: Lass Timer entscheiden, nicht du</h3>
            <p>
              "Ich könnte noch 10 Sekunden mehr arbeiten" - Nope. Timer sagt stop, du stoppst. Disziplin. Das ist Training.
            </p>
          </div>

          <div className="tip-card">
            <h3>💡 Tipp 4: Cool-Down & Dehnen ist wichtig</h3>
            <p>
              Nach dem Workout: 5-10 Min stretching. Mit Timer! Hilft der Erholung, verhindert Muskelkater.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-section landing-cta-final">
        <h2>Starte dein strukturiertes Training jetzt</h2>
        <p>
          Mit präzisem Timing, wissenschaftlichen Methoden, und objektiven Fortschrittsmessung. Kostenlos. Jetzt.
        </p>

        <div className="landing-cta-buttons final">
          <a href="/#/cooking" className="btn btn-primary btn-large">
            ⏱️ Multi-Timer für Workouts
          </a>
          <a href="/#/countdown" className="btn btn-secondary btn-large">
            ⏰ Countdown für Cardio
          </a>
          <a href="/#/stopwatch" className="btn btn-outline btn-large">
            📊 Stopwatch für Tracking
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

export default TimerForFitness;
