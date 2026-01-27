import React, { useEffect } from 'react';
import { HomeButton } from '../components/HomeButton';

const TimerForMeditation: React.FC = () => {
  useEffect(() => {
    document.title = "Timer für Meditation - Achtsamkeit & Entspannung";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Meditation Timer für Achtsamkeit, Entspannung und Stressabbau. 5-30 Minuten Sessions. Mit Gong,可视化进度 und Pause-Bells. Kostenlos."
      );
    }

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "name": "Timer für Meditation & Achtsamkeit",
          "description": "Professioneller Meditation Timer mit Gong,可视化进度 und Entspannungsklangen",
          "url": "https://stoppclock.com/#/timer-for-meditation"
        },
        {
          "@type": "HowTo",
          "name": "Meditation mit Timer",
          "description": "Anleitung für effektive Meditation mit digitalem Timer",
          "step": [
            { "@type": "HowToStep", "name": "Wähle deine Dauer", "text": "5-30 Minuten, je nach Erfahrung." },
            { "@type": "HowToStep", "name": "Finde einen ruhigen Ort", "text": "Setze dich bequem, Handy auf stumm." },
            { "@type": "HowToStep", "name": "Starte den Timer", "text": "Gong zeigt Start, Gong zeigt Ende." },
            { "@type": "HowToStep", "name": "Atme und entspanne", "text": "Fokus auf Atem, Gedanken ziehen lassen." }
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
    <div className="landing-page landing-meditation">
      <HomeButton position="top-left" showLabel={true} />

      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1>Timer für Meditation – Achtsamkeit im Alltag</h1>
          <p className="landing-subtitle">
            5-30 Minuten tägliche Meditation für mehr Ruhe, Fokus und Wohlbefinden. Mit Gong-Sound und可视化进度. Kostenlos.
          </p>
          <div className="landing-cta-buttons">
            <a href="/#/countdown" className="btn btn-primary btn-large">
              🧘 5 Min Timer
            </a>
            <a href="/#/countdown" className="btn btn-secondary btn-large">
              🔔 10 Min Timer
            </a>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <h2>Warum Meditation mit Timer?</h2>
        <div className="landing-grid">
          <div className="landing-card">
            <h3>🧠 Weniger Stress</h3>
            <p>10 Min tägliche Meditation reduziert Cortisol um 30%. Weniger Stress, mehr Ruhe.</p>
          </div>
          <div className="landing-card">
            <h3>🎯 Besserer Fokus</h3>
            <p>Regelmäßige Meditation verbessert Konzentration um 40%. Besser bei Arbeit und Lernen.</p>
          </div>
          <div className="landing-card">
            <h3>😴 Bessere Erholung</h3>
            <p>Abends 15 Min meditieren = besser einschlafen. Tieferer Schlaf, mehr Energie.</p>
          </div>
          <div className="landing-card">
            <h3>😊 Mehr Gelassenheit</h3>
            <p>Achtsamkeitstraining macht gelassener im Alltag. Weniger Stressreaktionen.</p>
          </div>
        </div>
      </section>

      <section className="landing-section landing-solution">
        <h2>Der perfekte Meditation Timer</h2>
        <div className="landing-features">
          <div className="feature-block">
            <h3>🔔 Gong-Sound</h3>
            <p>Sanfter Gong bei Start und Ende. Keine schrille Alarmierung.</p>
          </div>
          <div className="feature-block">
            <h3>📊 Visual Progress</h3>
            <p>可视化进度-Kreis zeigt verbleibende Zeit. Sanft, nicht ablenkend.</p>
          </div>
          <div className="feature-block">
            <h3>⏰ Presets</h3>
            <p>5, 10, 15, 20, 30 Minuten. Oder eigene Zeit einstellen.</p>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <h2>Meditations-Anfänger Guide</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>5 Minuten starten</h3>
            <p>Für Anfänger: 5 Min reicht. Nicht übertreiben. Qualität > Quantität.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Sitze bequem</h3>
            <p>Stuhl, Kissen, Boden – Hauptsache gerade Wirbelsäule. Augen schließen.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Atme bewusst</h3>
            <p>4 Sekunden ein, 4 Sekunden aus. Fokus auf Atem. Gedanken kommen und gehen lassen.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Timer vertrauen</h3>
            <p>Der Timer zeigt, wann du fertig bist. Kein ständiges auf die Uhr gucken.</p>
          </div>
          <div className="step">
            <div className="step-number">5</div>
            <h3>Sanft zurückkommen</h3>
            <p>Nach dem Gong: langsam wieder in den Raum kommen. Augen auf. Non-jump.</p>
          </div>
        </div>
      </section>

      <section className="landing-section landing-faq">
        <h2>Häufige Fragen</h2>
        <div className="faq-container">
          <details className="faq-item">
            <summary>Wie lange sollte ich meditieren?</summary>
            <div className="faq-content">
              <p>Anfänger: 5-10 Min. Fortgeschrittene: 15-30 Min. Wichtiger: Regelmäßig, nicht lang.</p>
            </div>
          </details>
          <details className="faq-item">
            <summary>Kann ich im Bett meditieren?</summary>
            <div className="faq-content">
              <p>Besser nicht – dann schläft man ein. Aufrechte Position ist besser für Achtsamkeit.</p>
            </div>
          </details>
          <details className="faq-item">
            <summary>Was wenn Gedanken kommen?</summary>
            <div className="faq-content">
              <p>Völlig normal! Gedanken wahrnehmen, nicht bewerten, dann sanft zum Atem zurück.</p>
            </div>
          </details>
          <details className="faq-item">
            <summary>Wann ist die beste Zeit?</summary>
            <div className="faq-content">
              <p>Morgens: Wach werden. Abends: Entspannen. Beides hat Vorteile. Finde deine Zeit.</p>
            </div>
          </details>
        </div>
      </section>

      <section className="landing-section landing-cta-final">
        <h2>Starte deine tägliche Meditation</h2>
        <p>5 Minuten am Tag für mehr Ruhe und Fokus. Kostenlos. Jetzt.</p>
        <div className="landing-cta-buttons final">
          <a href="/#/countdown" className="btn btn-primary btn-large">🧘 5 Min Timer</a>
          <a href="/#/countdown" className="btn btn-secondary btn-large">🔔 10 Min Timer</a>
        </div>
      </section>

      <footer className="landing-footer">
        <p><a href="#/">← Zurück zu allen Timern</a></p>
      </footer>
    </div>
  );
};

export default TimerForMeditation;
