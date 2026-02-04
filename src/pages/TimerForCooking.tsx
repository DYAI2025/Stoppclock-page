import React, { useEffect } from 'react';
import { HomeButton } from '../components/HomeButton';

const TimerForCooking: React.FC = () => {
  useEffect(() => {
    document.title = "Timer für Kochen - Präzise Kochzeiten für perfekte Gerichte";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Kostenloser Online Kochtimer für präzises Kochen. Eierkochen, Pasta, Backzeit, Fleisch. Perfekte Ergebnisse ohne verkohltes Essen. Ohne Anmeldung."
      );
    }

    // Schema.org - WebPage + HowTo
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "name": "Timer für Kochen - Präzise Kochzeiten",
          "description": "Kostenloser Online Kochtimer mit präzisen Zeiten für Eier, Pasta, Fleisch, Backen und mehr",
          "url": "https://stoppclock.com/#/timer-for-cooking",
          "mainEntity": {
            "@type": "Service",
            name: "Online Kochtimer",
            description: "Professioneller Timer für präzises Kochen"
          }
        },
        {
          "@type": "HowTo",
          "name": "Perfekt kochen mit Timer",
          "description": "Anleitung für präzises Kochen mit digitalem Timer",
          "step": [
            {
              "@type": "HowToStep",
              "name": "Wähle dein Gericht",
              "text": "Eierkochen, Pasta, Fleisch, Backen – wähle die passende Kochzeit."
            },
            {
              "@type": "HowToStep",
              "name": "Stelle den Timer ein",
              "text": "Nutze den Countdown Timer mit exakter Zeit oder unsere Presets."
            },
            {
              "@type": "HowToStep",
              "text": "Koche ohne Stress – der Timer erinnert dich rechtzeitig.",
              "name": "Koche entspannt"
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
    <div className="landing-page landing-cooking">
      <HomeButton position="top-left" showLabel={true} />

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1>Timer für Kochen – Nie wieder verkohltes Essen</h1>
          <p className="landing-subtitle">
            Präzise Kochzeiten für perfekte Ergebnisse. Eierkochen, Pasta, Steak, Backen – alles easy. Kostenlos, ohne Anmeldung.
          </p>
          <div className="landing-cta-buttons">
            <a href="/#/countdown" className="btn btn-primary btn-large">
              ⏱️ Kochtimer Starten
            </a>
            <a href="/#/cooking" className="btn btn-secondary btn-large">
              🍳 Multi-Timer für komplexe Gerichte
            </a>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="landing-section">
        <h2>Das Problem: Kochen nach Gefühl geht schief</h2>
        <div className="landing-grid">
          <div className="landing-card">
            <h3>🥚 Eier perfekt kochen?</h3>
            <p>
              Weich (3 min), mittel (6 min), hart (10 min) – ohne Timer? Unmöglich. Zu früh: flüssig. Zu spät: gummiartig.
            </p>
          </div>
          <div className="landing-card">
            <h3>🍝 Pasta al Dente</h3>
            <p>
              "8-10 Minuten" steht auf der Packung. Aber dein Herd? Anders. Ohne Timer: verkocht oder bissfest? Ungewiss.
            </p>
          </div>
          <div className="landing-card">
            <h3>🥩 Steak auf den Punkt</h3>
            <p>
              Medium-rare innen, braun außen. Ohne Timer? Selten perfekt. Zu kurz: roh. Zu lang: zäh.
            </p>
          </div>
          <div className="landing-card">
            <h3>🎂 Backen timing</h3>
            <p>
              Kuchen 30 min bei 180°C? Ofenthermometer, Backpapier, Temperatur – zu viele Variablen. Timer rettet!
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="landing-section landing-solution">
        <h2>Die Lösung: Präzise Kochtimer</h2>
        <p className="landing-section-intro">
          Exakte Zeiten = perfekte Ergebnisse. Kein Rätselraten mehr.
        </p>

        <div className="landing-features">
          <div className="feature-block">
            <h3>⏱️ Countdown Timer</h3>
            <p><strong>Ideal für:</strong> Eierkochen, Pasta, Gemüse, Reis</p>
            <ul>
              <li>1 Minute bis 12 Stunden</li>
              <li>Eier: 3/6/10 Min Presets</li>
              <li>Pasta: exakte Packungszeit</li>
              <li><strong>Effekt:</strong> Perfekte Konsistenz, jedes Mal</li>
            </ul>
            <a href="/#/countdown" className="btn btn-small">Timer starten →</a>
          </div>

          <div className="feature-block">
            <h3>🍳 Multi-Timer</h3>
            <p><strong>Ideal für:</strong> Komplexe Gerichte, Meal Prep</p>
            <ul>
              <li>Mehrere Timer gleichzeitig</li>
              <li>"Kartoffeln 20 min, Gemüse 10 min"</li>
              <li>Automatische Übergänge</li>
              <li><strong>Effekt:</strong> Alles fertig zur gleichen Zeit</li>
            </ul>
            <a href="/#/cooking" className="btn btn-small">Multi-Timer →</a>
          </div>

          <div className="feature-block">
            <h3>🔔 Alarm & Sound</h3>
            <p><strong>Ideal für:</strong> Ablenkung beim Kochen</p>
            <ul>
              <li>Lauter Piepton wenn Zeit um</li>
              <li>Du kannst dich auf's Kochen konzentrieren</li>
              <li>Browser-Tab zeigt Notification</li>
              <li><strong>Effekt:</strong> Nie wieder vergessenes Essen</li>
            </ul>
            <a href="/#/alarm" className="btn btn-small">Alarm nutzen →</a>
          </div>
        </div>
      </section>

      {/* Cooking Times Reference */}
      <section className="landing-section">
        <h2>Kochzeiten-Guide – Die wichtigsten Zeiten</h2>
        <p className="landing-section-intro">
          Wie lange wofür? Hier die wissenschaftlich optimalen Zeiten:
        </p>

        <div className="cooking-times-table">
          <table>
            <thead>
              <tr>
                <th>Gericht</th>
                <th>Optimale Zeit</th>
                <th>Timer</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>🥚 Weiches Ei (Wolkenei)</td>
                <td>3 Minuten</td>
                <td><a href="/#/countdown?preset=3">3 Min Timer</a></td>
              </tr>
              <tr>
                <td>🥚 Mittelhartes Ei</td>
                <td>6 Minuten</td>
                <td><a href="/#/countdown?preset=6">6 Min Timer</a></td>
              </tr>
              <tr>
                <td>🥚 Hartes Ei</td>
                <td>10 Minuten</td>
                <td><a href="/#/countdown?preset=10">10 Min Timer</a></td>
              </tr>
              <tr>
                <td>🍝 Pasta (al dente)</td>
                <td>Packung + 1 min</td>
                <td><a href="/#/countdown">Custom Timer</a></td>
              </tr>
              <tr>
                <td>🍚 Reis (weiß)</td>
                <td>15-18 Minuten</td>
                <td><a href="/#/countdown">18 Min Timer</a></td>
              </tr>
              <tr>
                <td>🥔 Kartoffeln (gekocht)</td>
                <td>20-25 Minuten</td>
                <td><a href="/#/countdown">22 Min Timer</a></td>
              </tr>
              <tr>
                <td>🥩 Steak (Medium)</td>
                <td>3-4 min pro Seite</td>
                <td><a href="/#/countdown">4 Min Timer</a></td>
              </tr>
              <tr>
                <td>🍗 Hähnchen (gebraten)</td>
                <td>6-8 min pro Seite</td>
                <td><a href="/#/countdown">8 Min Timer</a></td>
              </tr>
              <tr>
                <td>🐟 Fisch (Filet)</td>
                <td>4-5 Minuten</td>
                <td><a href="/#/countdown">5 Min Timer</a></td>
              </tr>
              <tr>
                <td>🥦 Brokkoli (gedämpft)</td>
                <td>5-7 Minuten</td>
                <td><a href="/#/countdown">6 Min Timer</a></td>
              </tr>
              <tr>
                <td>🍳 Spiegelei</td>
                <td>3-4 Minuten</td>
                <td><a href="/#/countdown">3 Min Timer</a></td>
              </tr>
              <tr>
                <td>🥣 Haferflocken</td>
                <td>3-5 Minuten</td>
                <td><a href="/#/countdown">4 Min Timer</a></td>
              </tr>
              <tr>
                <td>☕ Kaffee (French Press)</td>
                <td>4 Minuten</td>
                <td><a href="/#/countdown">4 Min Timer</a></td>
              </tr>
              <tr>
                <td>🍵 Tee (schwarz)</td>
                <td>3-5 Minuten</td>
                <td><a href="/#/countdown">4 Min Timer</a></td>
              </tr>
              <tr>
                <td>🥫 Suppe (aufwärmen)</td>
                <td>5-10 Minuten</td>
                <td><a href="/#/countdown">8 Min Timer</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="cooking-note">
          <p><strong>💡 Profi-Tipp:</strong> Diese Zeiten basieren auf Standard-Herdeintensität (mittlere Hitze). Passzeiten bei deinem Herd an!</p>
        </div>
      </section>

      {/* Multi-Timer Scenarios */}
      <section className="landing-section">
        <h2>Multi-Timer Szenarien – Alles gleichzeitig fertig</h2>
        <p className="landing-section-intro">
          Der Traum jedes Kochs: Alle Komponenten sind zur gleichen Zeit fertig.
        </p>

        <div className="cooking-scenarios">
          <div className="scenario-card">
            <h3>🍝 Pasta mit Soße</h3>
            <ul>
              <li>Timer 1: Pasta (12 min)</li>
              <li>Timer 2: Soße (15 min)</li>
              <li>→ Starte Soße 3 min früher</li>
            </ul>
            <a href="/#/cooking" className="btn btn-small">Multi-Timer →</a>
          </div>

          <div className="scenario-card">
            <h3>🥩 Steak mit Beilage</h3>
            <ul>
              <li>Timer 1: Steak (4 min/Seite)</li>
              <li>Timer 2: Kartoffeln (20 min)</li>
              <li>→ Starte Kartoffeln zuerst</li>
            </ul>
            <a href="/#/cooking" className="btn btn-small">Multi-Timer →</a>
          </div>

          <div className="scenario-card">
            <h3>🍱 Meal Prep</h3>
            <ul>
              <li>Timer 1: Reis (18 min)</li>
              <li>Timer 2: Gemüse (8 min)</li>
              <li>Timer 3: Protein (10 min)</li>
              <li>→ Alles fertig für Portionierung</li>
            </ul>
            <a href="/#/cooking" className="btn btn-small">Multi-Timer →</a>
          </div>

          <div className="scenario-card">
            <h3>🍳 Full English Breakfast</h3>
            <ul>
              <li>Timer 1: Speck (6 min)</li>
              <li>Timer 2: Eier (4 min)</li>
              <li>Timer 3: Bohnen (8 min)</li>
              <li>Timer 4: Toast (3 min)</li>
            </ul>
            <a href="/#/cooking" className="btn btn-small">Multi-Timer →</a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="landing-section landing-testimonials">
        <h2>Was Hobbyköche über den Kochtimer sagen</h2>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>
              "Endlich perfekte Eier! Weich, mittel oder hart – jedes Mal. Der 3-Minuten-Timer hat mein Frühstück revolutioniert."
            </p>
            <footer>
              <strong>Lisa, 28</strong> – Food Bloggerin
            </footer>
          </div>

          <div className="testimonial-card">
            <p>
              "Multi-Timer für Meal Prep ist ein Game-Changer. Reis, Gemüse, Huhn – alles gleichzeitig fertig. Keine kalten Komponenten mehr!"
            </p>
            <footer>
              <strong>Markus, 34</strong> – Fitness-Enthusiast
            </footer>
          </div>

          <div className="testimonial-card">
            <p>
              "Als Anfänger hatte ich immer Angst beim Kochen. Mit Timer weiß ich genau, wann ich was machen muss. Viel entspannter!"
            </p>
            <footer>
              <strong>Sarah, 24</strong> – Koch-Anfängerin
            </footer>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="landing-section landing-faq">
        <h2>Häufige Fragen zum Kochtimer</h2>

        <div className="faq-container">
          <details className="faq-item">
            <summary>Wie lange koche ich Eier perfekt?</summary>
            <div className="faq-content">
              <p>
                <strong>Weich (Wolkenei):</strong> 3 Minuten<br/>
                <strong>Mittelhart:</strong> 6 Minuten<br/>
                <strong>Hart:</strong> 10 Minuten<br/>
                <br/>
                Diese Zeiten gelten für Eier direkt aus dem Kühlschrank. Bei Raumtemperatur 1 Minute weniger.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Kann ich mehrere Timer gleichzeitig laufen lassen?</summary>
            <div className="faq-content">
              <p>
                Ja! Unser <a href="/#/cooking">Multi-Timer (Cooking Timer)</a> kann bis zu 5 parallele Timer verwalten. Perfekt für komplexe Gerichte.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Funktioniert der Timer auch ohne Internet?</summary>
            <div className="faq-content">
              <p>
                Ja! Stoppclock ist eine Progressive Web App (PWA). Einmal geladen, funktioniert sie auch offline im Flugmodus. Perfekt für die Küche ohne WLAN.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Was passiert wenn ich den Tab schließe?</summary>
            <div className="faq-content">
              <p>
                Der Timer läuft im Browser weiter, auch wenn du den Tab wechselst. Du hörst den Alarm, wenn die Zeit um ist. Notifications erscheinen, wenn erlaubt.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Kostet der Kochtimer etwas?</summary>
            <div className="faq-content">
              <p>
                Nein! 100% kostenlos. Keine Premium-Features, keine Werbe-Unterbrechungen im Timer. Nutze so viel du willst.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* Pro Tips */}
      <section className="landing-section">
        <h2>Profi-Tipps für präzises Kochen</h2>

        <div className="tips-grid">
          <div className="tip-card">
            <h3>💡 Tipp 1: Stelle den Timer VOR dem Kochen</h3>
            <p>
              Timer einstellen, dann erst Kochen beginnen. Nicht während des Kochens – das lenkt ab.
            </p>
          </div>

          <div className="tip-card">
            <h3>💡 Tipp 2: Ofen 10°C niedriger bei Umluft</h3>
            <p>
              Bei Umluft: 10-20°C niedriger als angegeben. Timer entsprechend anpassen (oft 5-10 min länger).
            </p>
          </div>

          <div className="tip-card">
            <h3>💡 Tipp 3: Fleisch ruhen lassen</h3>
            <p>
              Steak 5 min ruhen lassen nach dem Braten. Mit Timer! In der Zeit verteilen sich Säfte.
            </p>
          </div>

          <div className="tip-card">
            <h3>💡 Tipp 4: Pasta 1 min früher abgießen</h3>
            <p>
              Wenn du die Soße noch fertig machst: Pasta 1 min früher abgießen. Sie zieht noch nach beim Mischen.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-section landing-cta-final">
        <h2>Koche präzise – nie wieder verkohlt</h2>
        <p>
          Exakte Zeiten für perfekte Ergebnisse. Eier, Pasta, Steak, Backen – alles easy. Kostenlos. Jetzt ausprobieren.
        </p>

        <div className="landing-cta-buttons final">
          <a href="/#/countdown" className="btn btn-primary btn-large">
            ⏱️ Countdown Timer
          </a>
          <a href="/#/cooking" className="btn btn-secondary btn-large">
            🍳 Multi-Timer
          </a>
          <a href="/#/alarm" className="btn btn-outline btn-large">
            🔔 Alarm
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

export default TimerForCooking;
