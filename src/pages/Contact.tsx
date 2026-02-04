import React from "react";

export default function Contact() {
  return (
    <div className="legal-page">
      <a href="#/" className="btn-home">Home</a>
      <h1>Contact Us</h1>

      <section>
        <h2>Get in Touch</h2>
        <p>
          We welcome your questions, feedback, and suggestions about Stoppclock. Whether you've found a bug, have a feature request, or just want to share how you're using our timers, we'd love to hear from you.
        </p>
      </section>

      <section>
        <h2>Contact Information</h2>
        <address>
          <strong>Stoppclock</strong><br />
          c/o Benjamin Poersch<br />
          Grazer Damm 207<br />
          12157 Berlin<br />
          Germany
        </address>
        <p>
          <strong>Email:</strong> <a href="mailto:Ben.Poersch@dyai.app">Ben.Poersch@dyai.app</a><br />
          <strong>Phone:</strong> <a href="tel:+491707061239">+49 170 7061239</a>
        </p>
      </section>

      <section>
        <h2>Business Inquiries</h2>
        <p>
          For business partnerships, custom implementations, or licensing inquiries, please contact us via email with "Business Inquiry" in the subject line.
        </p>
        <p>
          <strong>VAT ID:</strong> DE307270013
        </p>
      </section>

      <section>
        <h2>Technical Support</h2>
        <p>
          If you're experiencing technical issues with Stoppclock, please include the following information in your message:
        </p>
        <ul>
          <li>Browser name and version (e.g., Chrome 120, Firefox 121)</li>
          <li>Operating system (e.g., Windows 11, macOS Sonoma, iOS 17)</li>
          <li>Device type (desktop, mobile, tablet)</li>
          <li>Description of the issue and steps to reproduce</li>
          <li>Any error messages you see</li>
        </ul>
        <p>
          This information helps us diagnose and fix problems more quickly.
        </p>
      </section>

      <section>
        <h2>Feature Requests</h2>
        <p>
          Have an idea for a new timer type or feature? We're always looking to improve Stoppclock based on user feedback. Send us your suggestions via email.
        </p>
        <p>
          Popular feature requests that align with our mission of distraction-free, classroom-friendly time management are prioritized for development.
        </p>
      </section>

      <section>
        <h2>Press & Media</h2>
        <p>
          For press inquiries, interviews, or media requests, please contact us via email with "Press Inquiry" in the subject line.
        </p>
      </section>

      <section>
        <h2>Privacy & Data Requests</h2>
        <p>
          For questions about data privacy, GDPR requests, or to exercise your rights under applicable data protection laws, please see our <a href="#/privacy">Privacy Policy</a> or contact us via email.
        </p>
        <p>
          Note: Stoppclock stores all timer data locally on your device. We do not collect or store personal information on our servers unless you explicitly provide it (e.g., via email contact).
        </p>
      </section>

      <section>
        <h2>Response Time</h2>
        <p>
          We aim to respond to all inquiries within 2-3 business days. Technical support requests may take longer depending on the complexity of the issue.
        </p>
        <p>
          <strong>Business Hours:</strong> Monday - Friday, 9:00 - 17:00 CET (Central European Time)
        </p>
      </section>

      <p className="legal-lang-switch">
        <a href="#/about">About Stoppclock</a> | <a href="#/privacy">Privacy Policy</a> | <a href="#/imprint">Imprint</a>
      </p>
    </div>
  );
}
