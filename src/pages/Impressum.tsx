import React from "react";

export default function Impressum() {
  return (
    <div className="legal-page">
      <a href="#/" className="btn-home">Home</a>
      <h1>Impressum</h1>

      <section>
        <h2>Dienstanbieter</h2>
        <address>
          Benjamin Poersch<br />
          Grazer Damm 207<br />
          12157 Berlin – Deutschland
        </address>
      </section>

      <section>
        <h2>Kontakt</h2>
        <p>
          E-Mail: <a href="mailto:Ben.Poersch@dyai.app">Ben.Poersch@dyai.app</a><br />
          Telefon: <a href="tel:+491707061239">+49 170 7061239</a>
        </p>
      </section>

      <section>
        <h2>Umsatzsteuer-Identifikationsnummer</h2>
        <p>USt-IdNr.: DE307270013</p>
      </section>

      <section>
        <h2>Verantwortlich für den Inhalt</h2>
        <p>
          Verantwortlich im Sinne von § 55 Abs. 2 RStV (bzw. § 18 MStV):<br />
          Benjamin Poersch, Anschrift wie oben.
        </p>
      </section>

      <section>
        <h2>Hosting</h2>
        <p>
          Privat gehostet. Technische Infrastruktur wird privat betrieben (Deutschland).
          Es besteht kein externer Hosting-Dienstvertrag.
        </p>
      </section>

      <section>
        <h2>Haftungsausschluss</h2>

        <h3>Haftung für Inhalte</h3>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
          allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
          zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
        </p>

        <h3>Haftung für Links</h3>
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
          Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
          Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
        </p>
      </section>

      <section>
        <h2>Urheberrecht</h2>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
          Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
          Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
        </p>
      </section>

      <p className="legal-lang-switch">
        Need the English text? <a href="#/imprint">Read the imprint in English</a>
      </p>
    </div>
  );
}
