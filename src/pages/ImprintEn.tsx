import React from "react";

export default function ImprintEn() {
  return (
    <div className="legal-page">
      <a href="#/" className="btn-home">Home</a>
      <h1>Imprint</h1>

      <section>
        <h2>Service Provider</h2>
        <address>
          Benjamin Poersch<br />
          Grazer Damm 207<br />
          12157 Berlin – Germany
        </address>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Email: <a href="mailto:Ben.Poersch@dyai.app">Ben.Poersch@dyai.app</a><br />
          Phone: <a href="tel:+491707061239">+49 170 7061239</a>
        </p>
      </section>

      <section>
        <h2>VAT Identification Number</h2>
        <p>VAT ID: DE307270013</p>
      </section>

      <section>
        <h2>Responsible for Content</h2>
        <p>
          Responsible according to § 55 para. 2 RStV (and § 18 MStV):<br />
          Benjamin Poersch, address as listed above.
        </p>
      </section>

      <section>
        <h2>Hosting</h2>
        <p>
          Self-hosted infrastructure located in Germany. No external hosting provider contract exists.
        </p>
      </section>

      <section>
        <h2>Disclaimer</h2>

        <h3>Liability for Content</h3>
        <p>
          As a service provider, we are responsible for our own content on these pages in accordance with § 7 para. 1 TMG under the
          general laws. According to §§ 8 to 10 TMG, however, we are not obliged to monitor transmitted or stored third-party
          information or to investigate circumstances indicating unlawful activity.
        </p>

        <h3>Liability for Links</h3>
        <p>
          Our offer contains links to external third-party websites whose content we cannot influence. Therefore we cannot assume any
          liability for such external content. The respective provider or operator of the pages is always responsible for the content
          of the linked pages.
        </p>
      </section>

      <section>
        <h2>Copyright</h2>
        <p>
          The content and works created by the site operators on these pages are subject to German copyright law. Duplication,
          processing, distribution and any kind of exploitation outside the limits of copyright require the written consent of the
          respective author or creator.
        </p>
      </section>

      <p className="legal-lang-switch">
        Looking for the German version? <a href="#/impressum">Zum Impressum</a>
      </p>
    </div>
  );
}
