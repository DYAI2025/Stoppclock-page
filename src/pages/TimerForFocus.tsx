import React, { useEffect } from 'react';
import { HomeButton } from '../components/HomeButton';

const TimerForFocus: React.FC = () => {
  useEffect(() => {
    document.title = "Timer für Focus & Deep Work – Ablenkungsfreies Arbeiten";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Focus Timer für Deep Work, konzentriertes Arbeiten und Produktivität. 50-Minuten Flow-Blöcke. Keine Ablenkungen. Kostenlos."
      );
    }

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "name": "Timer für Focus & Deep Work",
          "description": "Professioneller Focus Timer für konzentriertes Arbeiten, Flow States und Produktivität",
          "url": "https://stoppclock.com/#/timer-for-focus"
        },
        {
          "@type": "HowTo",
          "name": "Deep Work mit Timer",
          "description": "Anleitung für fokussiertes Arbeiten mit Flow Timer",
          "step": [
            { "@type": "HowToStep", "name": "Eliminiere Ablenkungen", "text": "Handy weg, Browser zu, Tür zu." },
            { "@type": "HowToStep", "name": "Wähle 50 Min Block", "text": "Flow-optimierte Dauer für tiefes Arbeiten." },
            { "@type": "HowToStep", "name": "Arbeite ununterbrochen", "text": "Nur die eine Aufgabe. Keine Pausen." },
            { "@type": "HowToStep", "name": "10 Min Pause", "text": "Echte Erholung. Aufstehen. Bewegen." }
          ]
        }
      ]
    };

    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.textContent = JSON.stringify(schema);
    document.head.appendChild(scriptTag);

    return () => { scriptTag.remove(); };
  }, []);

  return (
    <div className="landing-page landing-focus">
      <HomeButton position="top-left" showLabel={true} />

      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1>Timer für Focus – Deep Work ohne Ablenkung</h1>
          <p className="landing-subtitle">
            50-Minuten Flow-Blöcke für konzentriertes Arbeiten. Programmieren, Schreiben, kreative Projekte. Ablenkungsfrei. Kostenlos.
          </p>
          <div className="landing-cta-buttons">
            <a href="/#/countdown" className="btn btn-primary btn-large">
              🎯 50 Min Focus Block
            </a>
            <a href="/#/countdown" className="btn btn-secondary btn-large">
              ⏱️ Custom Focus Timer
            </a>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <h2>Das Problem: Ablenkungen zerstören Produktivität</h2>
        <div className="landing-grid">
          <div className="landing-card">
            <h3>📱 Constant Context Switching</h3>
            <p>Jede Unterbrechung: 23 Minuten um wieder in den Flow zu kommen (UC Irvine Studie).</p>
          </div>
          <div className="landing-card">
            <h3>🌐 Internet-Kaninchenbau</h3>
            <p>"Nur schnell was nachschlagen" → 30 Minuten später bei YouTube gelandet.</p>
          </div>
          <div className="landing-card">
            <h3>💭 Offene Loops</h3>
            <p>Zu viele Aufgaben im Kopf. Kein Platz für echte Kreativität.</p>
          </div>
          <div className="landing-card">
            <h3>😫 Surface Work</h3>
            <p>Den ganzen Tag beschäftigt, aber nichts Wichtiges geschafft. Frustrierend.</p>
          </div>
        </div>
      </section>

      <section className="landing-section landing-solution">
        <h2>Die Lösung: Focus Timer für Deep Work</h2>
        <p className="landing-section-intro">
          Cal Newport's Deep Work Methode: Ununterbrochene fokussierte Arbeit = mehr und bessere Ergebnisse.
        </p>

        <div className="landing-features">
          <div className="feature-block">
            <h3>⏰ 50-Minuten Blocks</h3>
            <p><strong>Wissenschaftlich optimiert:</strong> 50 Min Fokus, 10 Min Pause. Passt zu natürlichen Energiezyklen.</p>
          </div>
          <div className="feature-block">
            <h3>🔇 Ablenkungsfrei</h3>
            <p>Kein Sound, keine Benachrichtigungen. Nur du und deine Arbeit.</p>
          </div>
          <div className="feature-block">
            <h3>📊 Single-Task</h3>
            <p>Eine Aufgabe. Eine Zeit. Kein Multitasking. 100% Fokus.</p>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <h2>Deep Work Timer Anleitung</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Eliminiere Ablenkungen</h3>
            <p>Handy in anderen Raum. Browser zu (außer was du brauchst). Tür zu. Ohrstöpsel rein.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Wähle deine Aufgabe</h3>
            <p>Eine Aufgabe. Nicht "alles". "Artikel schreiben" nicht "blog posts". Konkret.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Starte den 50-Minuten Timer</h3>
            <p>Kein Aufstehen, kein Unterbrechen, kein Aufgeben. 50 Minuten. Das schaffst du.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>10-Minuten echte Pause</h3>
            <p>Stehe auf. Geh spazieren. Trink Wasser. NICHT Handy. Dein Gehirn braucht Erholung.</p>
          </div>
          <div className="step">
            <div className="step-number">5</div>
            <h3>Wiederhole</h3>
            <p>2-3 Focus Blöcke am Stück = 2-3 Stunden hochkonzentriertes Arbeiten. Besser als 8 Stunden Oberflächlichkeit.</p>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <h2>Wofür ist Focus Timer perfekt?</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <h3>💻 Programmieren</h3>
            <p>Flow States beim Code schreiben. Komplexe Probleme lösen. Bug-Fixes.</p>
          </div>
          <div className="tip-card">
            <h3>✍️ Schreiben</h3>
            <p>Blog Posts, Bücher, Emails. Kreatives Schreiben braucht ununterbrochene Zeit.</p>
          </div>
          <div className="tip-card">
            <h3>📊 Analyse & Daten</h3>
            <p>Excel, Reports, Research. Tiefe Denkarbeit ohne Unterbrechung.</p>
          </div>
          <div className="tip-card">
            <h3>🎨 Design & Kreatives</h3>
            <p>UI Design, Fotos bearbeiten, Videos schneiden. Kreativität braucht Fokus.</p>
          </div>
        </div>
      </section>

      <section className="landing-section landing-testimonials">
        <h2>Was Profis über Focus Timer sagen</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"Mit 50-Minuten Blöcken schaffe ich mehr als vorher in 4 Stunden surfen. Game changer für Programmierer."</p>
            <footer><strong>Jan, 29</strong> – Full-Stack Developer</footer>
          </div>
          <div className="testimonial-card">
            <p>"Endlich mein Buch fertig geschrieben. Jeden Tag 2 Stunden Deep Work. Ohne Timer wäre das nie passiert."</p>
            <footer><strong>Maria, 35</strong> – Autorin</footer>
          </div>
        </div>
      </section>

      <section className="landing-section landing-faq">
        <h2>Häufige Fragen</h2>
        <div className="faq-container">
          <details className="faq-item">
            <summary>Warum 50 Minuten und nicht Pomodoro (25)?</summary>
            <div className="faq-content">
              <p>Pomodoro ist toll für Lernen und Verwaltungsaufgaben. Für kreatives Arbeiten (Code, Schreiben, Design) braucht man länger, um in den Flow zu kommen. 50 Min ist der Sweet Spot.</p>
            </div>
          </details>
          <details className="faq-item">
            <summary>Was wenn ich mitten in einer Aufgabe bin?</summary>
            <div className="faq-content">
              <p>Timer klingelt → Pause! Selbst wenn du noch drin bist. Pause macht dich langfristig produktiver. Du kannst danach weitermachen.</p>
            </div>
          </details>
          <details className="faq-item">
            <summary>Kann ich die Zeit anpassen?</summary>
            <div className="faq-content">
              <p>Ja! 50 Min ist ein Vorschlag. Manche nehmen 45, andere 60. Teste was für dich funktioniert.</p>
            </div>
          </details>
        </div>
      </section>

      <section className="landing-section landing-cta-final">
        <h2>Starte deinen Deep Work Tag</h2>
        <p>50-Minuten Fokus-Blöcke für echte Ergebnisse. Keine Ablenkungen. Nur du und deine Arbeit.</p>
        <div className="landing-cta-buttons final">
          <a href="/#/countdown" className="btn btn-primary btn-large">🎯 50 Min Focus Block</a>
          <a href="/#/countdown" className="btn btn-secondary btn-large">⏱️ Custom Timer</a>
        </div>
      </section>

      <footer className="landing-footer">
        <p><a href="#/">← Zurück zu allen Timern</a></p>
      </footer>
    </div>
  );
};

export default TimerForFocus;
