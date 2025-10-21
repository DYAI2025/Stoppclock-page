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
import { AdUnit } from "./components/AdUnit";
import { getAdUnit } from "./config/ad-units";

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
  // Timer definitions: [route, label, iconPath]
  const timers = [
    ["#/stopwatch", "Stopwatch", "/icons/STOP_WATCH_BUTTON.png"],
    ["#/countdown", "Countdown", "/icons/DIGITAL_COUNTDOWN_BUTTON.png"],
    ["#/analog", "Analog", "/icons/ANALOG_COUNTDOWN_BUTTON.png"],
    ["#/cycle", "Cycle", "/icons/CYCLE_TIME_BUTTON.png"],
    ["#/world", "World Clock", "/icons/WORLD_TIME_BUTTON.png"],
    ["#/alarm", "Alarm", "/icons/ALARM_CLOCK_BUTTON.png"],
    ["#/metronome", "Metronome", "/icons/METRONOM_BUTTON.png"],
    ["#/chess", "Chess Clock", "/icons/CHESS_CLOCK_BUTTON.png"],
  ];

  return (
    <div className="home-page">
      {/* Title */}
      <div className="home-title-container">
        <h1 className="home-title">Stoppclock</h1>
      </div>

      {/* Timer Grid */}
      <div className="home-grid">
        {timers.map(([route, label, icon]) => (
          <a key={route} href={route} className="home-timer-card">
            <img src={icon} alt={label} className="home-timer-icon" />
            <span className="home-timer-label">{label}</span>
          </a>
        ))}
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <a href="#/impressum">Impressum</a>
        <span>•</span>
        <a href="#/datenschutz">Datenschutz</a>
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
