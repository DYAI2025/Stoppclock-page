import React from "react";

export default function About() {
  return (
    <div className="legal-page">
      <a href="#/" className="btn-home">Home</a>
      <h1>About Stoppclock</h1>

      <section>
        <h2>Our Mission</h2>
        <p>
          Stoppclock is a free, privacy-first web application designed to provide educators, students, professionals, and anyone who needs to manage time effectively with powerful yet simple timing tools. Our mission is to make time management accessible, distraction-free, and optimized for projection in classrooms and meeting spaces.
        </p>
      </section>

      <section>
        <h2>What We Offer</h2>
        <p>
          Stoppclock provides 8 specialized timer tools that work offline as a Progressive Web App (PWA):
        </p>
        <ul>
          <li><strong>Analog Countdown</strong> - Visual clock-style countdown up to 12 hours, perfect for exams</li>
          <li><strong>Digital Countdown</strong> - Precise digital countdown timer with customizable presets</li>
          <li><strong>Stopwatch</strong> - Count up timer with lap time recording</li>
          <li><strong>Pomodoro Timer</strong> - Focus technique timer with built-in task management</li>
          <li><strong>Cooking Timer</strong> - Multiple simultaneous timers for kitchen multitasking</li>
          <li><strong>Chess Clock</strong> - Dual timers for competitive games</li>
          <li><strong>Metronome</strong> - Musical tempo keeper with customizable BPM</li>
          <li><strong>World Clock</strong> - Track time across multiple time zones</li>
          <li><strong>Alarm</strong> - Simple alarm clock functionality</li>
        </ul>
      </section>

      <section>
        <h2>Why Stoppclock?</h2>
        <ul>
          <li><strong>Projector-Friendly</strong> - Large, high-contrast displays optimized for classroom projection</li>
          <li><strong>Fullscreen Mode</strong> - Distraction-free timing with keyboard shortcuts (Space, F, R)</li>
          <li><strong>Offline-Ready</strong> - Works without internet connection after first load (PWA)</li>
          <li><strong>Privacy-First</strong> - No tracking without explicit consent, data stays on your device</li>
          <li><strong>Cross-Tab Sync</strong> - Timer state synchronized across browser tabs</li>
          <li><strong>Mobile Responsive</strong> - Works seamlessly on phones, tablets, and desktops</li>
          <li><strong>Free Forever</strong> - Core functionality always free with optional ad support</li>
        </ul>
      </section>

      <section>
        <h2>Technology</h2>
        <p>
          Built with modern web technologies including React 18, TypeScript, and Vite, Stoppclock delivers 60 FPS animations via Canvas API for smooth analog clock rendering. The app uses Web Audio API for sound generation and Service Workers for offline functionality.
        </p>
        <p>
          All timer state is persisted locally using localStorage with cross-tab synchronization via StorageEvent API, ensuring your timers continue running even if you navigate away or refresh the page.
        </p>
      </section>

      <section>
        <h2>Who We Are</h2>
        <p>
          Stoppclock is developed and maintained by Benjamin Poersch, a software developer based in Berlin, Germany. The project started as a tool for classroom time management and has evolved into a comprehensive suite of timing utilities used by educators, students, and professionals worldwide.
        </p>
        <p>
          For inquiries, please visit our <a href="#/contact">Contact page</a>.
        </p>
      </section>

      <section>
        <h2>Open Source & Contributions</h2>
        <p>
          We believe in transparent development and continuous improvement. While the core codebase is proprietary, we welcome feedback, bug reports, and feature suggestions from our community.
        </p>
      </section>

      <section>
        <h2>Privacy & Compliance</h2>
        <p>
          Stoppclock takes user privacy seriously. We implement GDPR-compliant consent management and only collect minimal analytics data with explicit user permission. For details, see our <a href="#/privacy">Privacy Policy</a>.
        </p>
        <p>
          The site uses Google AdSense to provide optional ad-supported free access, but ads are never shown during active timer use in fullscreen mode, ensuring a distraction-free experience for classroom and professional environments.
        </p>
      </section>

      <p className="legal-lang-switch">
        <a href="#/impressum">German Imprint (Impressum)</a>
      </p>
    </div>
  );
}
