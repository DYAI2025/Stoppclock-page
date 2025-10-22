import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import AnalogCountdown from "./pages/AnalogCountdown";
import Countdown from "./pages/Countdown";
import Stopwatch from "./pages/Stopwatch";
import WorldClock from "./pages/WorldClock";
import Alarm from "./pages/Alarm";
import Metronome from "./pages/Metronome";
import ChessClock from "./pages/ChessClock";
import CycleTimer from "./pages/CycleTimer";
import DigitalClock from "./pages/DigitalClock";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import { AdSenseScript } from "./components/AdSenseScript";
import { ConsentBanner } from "./components/ConsentBanner";

function useHashRoute() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const f = () => force();
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return (location.hash || "#/").replace(/^#/, "");
}

function Home() {
  // Timer definitions: [route, label]
  const timers = [
    ["#/countdown", "Countdown"],
    ["#/stopwatch", "Stopwatch"],
    ["#/analog", "Analog Clock"],
    ["#/chess", "Chess Clock"],
    ["#/metronome", "Metronome"],
    ["#/world", "World Clock"],
    ["#/alarm", "Alarm"],
    ["#/cycle", "Cycle Timer"],
  ];

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <h1 className="home-title">STOPPCLOCK</h1>
        <div className="home-title-line"></div>
      </header>

      {/* Timer Grid */}
      <div className="home-grid">
        {timers.map(([route, label]) => (
          <a key={route} href={route} className="home-timer-card">
            <div className="home-timer-icon-placeholder"></div>
            <span className="home-timer-label">{label}</span>
          </a>
        ))}
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-links">
          <a href="#/impressum">Impressum</a>
          <span>•</span>
          <a href="#/datenschutz">Datenschutz</a>
        </div>
        <div className="home-footer-brand">Powered by DYAI</div>
      </footer>
    </div>
  );
}

const Placeholder = ({ title }: { title: string }) => (
  <div className="page"><h1>{title}</h1><p>Coming soon.</p></div>
);

function App() {
  const route = useHashRoute();

  return (
    <>
      {/* AdSense script loader - loads only with consent */}
      <AdSenseScript />

      {/* GDPR consent banner - shows on first visit */}
      <ConsentBanner />

      {/* Route content */}
      {route === "/" && <Home />}
      {route === "/analog" && <AnalogCountdown />}
      {route === "/countdown" && <Countdown />}
      {route === "/stopwatch" && <Stopwatch />}
      {route === "/cycle" && <CycleTimer />}
      {route === "/digital" && <DigitalClock />}
      {route === "/world" && <WorldClock />}
      {route === "/alarm" && <Alarm />}
      {route === "/metronome" && <Metronome />}
      {route === "/chess" && <ChessClock />}
      {route === "/impressum" && <Impressum />}
      {route === "/datenschutz" && <Datenschutz />}
      {!["", "/", "/analog", "/countdown", "/stopwatch", "/cycle", "/digital", "/world", "/alarm", "/metronome", "/chess", "/impressum", "/datenschutz"].includes(route) && (
        <div className="page"><h1>Not Found</h1></div>
      )}
    </>
  );
}

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Silently fail - app still works without SW
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><App /></StrictMode>
);
