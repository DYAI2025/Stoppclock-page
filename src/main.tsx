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
  // Each timer has: route, label, iconPath, buttonPath, borderColor
  const items: Array<[string, string, string, string, string]> = [
    ["#/stopwatch", "Stopwatch", "/icons/STOP_WATCH_ICON.png", "/icons/STOP_WATCH_BUTTON.png", "#4a6955"],
    ["#/countdown", "Countdown", "/icons/DIGITAL_COUNTDOWN_ICON.png", "/icons/DIGITAL_COUNTDOWN_BUTTON.png", "#36454f"],
    ["#/analog", "Analog Countdown", "/icons/ANALOG_COUNTDOWN_ICON.png", "/icons/ANALOG_COUNTDOWN_BUTTON.png", "#d4a574"],
    ["#/cycle", "Cycle Timer", "/icons/CYCLE_TIME_ICON.png", "/icons/CYCLE_TIME_BUTTON.png", "#6b7546"],
    ["#/world", "World Clock", "/icons/WORLD_TIME_ICON.png", "/icons/WORLD_TIME_BUTTON.png", "#5a7c99"],
    ["#/alarm", "Alarm", "/icons/ALARM_CLOCK_ICON.png", "/icons/ALARM_CLOCK_BUTTON.png", "#6b4f4a"],
    ["#/metronome", "Metronome", "/icons/METRONOM_ICON.png", "/icons/METRONOM_BUTTON.png", "#7a5c8f"],
    ["#/chess", "Chess Clock", "/icons/CHESS_CLOCK_ICON.png", "/icons/CHESS_CLOCK_BUTTON.png", "#8b6f47"]
  ];

  return (
    <>
      <h1 className="home-title">Stoppclock</h1>
      <div className="home-grid">
        {items.map(([href, label, iconPath, buttonPath, borderColor]) => (
          <a key={href} className="timer-card" href={href} style={{borderColor}}>
            <img
              src={iconPath}
              alt={`${label} icon`}
              className="timer-icon-top"
            />
            <img
              src={buttonPath}
              alt={label}
              className="timer-button"
            />
          </a>
        ))}
      </div>
      <footer className="footer">
        <a href="#/impressum">Impressum</a>
        <span>•</span>
        <a href="#/datenschutz">Datenschutz</a>
      </footer>
    </>
  );
}

const Placeholder = ({ title }: { title: string }) => (
  <div className="page"><h1>{title}</h1><p>Coming soon.</p></div>
);

function App() {
  const route = useHashRoute();
  if (route === "/") return <Home />;
  if (route === "/analog") return <AnalogCountdown />;
  if (route === "/countdown") return <Countdown />;
  if (route === "/stopwatch") return <Stopwatch />;
  if (route === "/cycle") return <CycleTimer />;
  if (route === "/digital") return <DigitalClock />;
  if (route === "/world") return <WorldClock />;
  if (route === "/alarm") return <Alarm />;
  if (route === "/metronome") return <Metronome />;
  if (route === "/chess") return <ChessClock />;
  if (route === "/impressum") return <Impressum />;
  if (route === "/datenschutz") return <Datenschutz />;
  return <div className="page"><h1>Not Found</h1></div>;
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
