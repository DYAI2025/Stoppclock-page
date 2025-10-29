import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./design-tokens.css";
import "./styles.css";
import AnalogCountdown from "./pages/AnalogCountdown";
import Countdown from "./pages/Countdown";
import Stopwatch from "./pages/Stopwatch";
import WorldClock from "./pages/WorldClock";
import Alarm from "./pages/Alarm";
import Metronome from "./pages/Metronome";
import ChessClock from "./pages/ChessClock";
import CookingTimer from "./pages/CookingTimer";
import DigitalClock from "./pages/DigitalClock";
import Pomodoro from "./pages/Pomodoro";
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

// Elegant Analog Clock Component for Home Page
function HomeAnalogClock() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const drawClock = () => {
      const now = new Date();
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;

      // Draw carbon-black clock face (filled circle)
      ctx.fillStyle = "#0A1628"; // Deep ocean carbon black
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw hour markers (12, 3, 6, 9) in carbon black
      ctx.fillStyle = "#1A2942"; // Slightly lighter carbon for contrast
      ctx.font = `${radius * 0.15}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      [12, 3, 6, 9].forEach(num => {
        const angle = (num * Math.PI / 6) - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius * 0.8;
        const y = centerY + Math.sin(angle) * radius * 0.8;
        ctx.fillText(num.toString(), x, y);
      });

      // Calculate angles
      const hourAngle = ((hours + minutes / 60) * Math.PI / 6) - Math.PI / 2;
      const minuteAngle = ((minutes + seconds / 60) * Math.PI / 30) - Math.PI / 2;

      // Draw golden hour hand (shorter, thicker)
      ctx.strokeStyle = "#D4AF37"; // Golden color
      ctx.lineWidth = radius * 0.06;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(hourAngle) * radius * 0.5,
        centerY + Math.sin(hourAngle) * radius * 0.5
      );
      ctx.stroke();

      // Draw golden minute hand (longer, thinner)
      ctx.strokeStyle = "#D4AF37"; // Golden color
      ctx.lineWidth = radius * 0.04;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(minuteAngle) * radius * 0.75,
        centerY + Math.sin(minuteAngle) * radius * 0.75
      );
      ctx.stroke();

      // Draw center dot (golden)
      ctx.fillStyle = "#D4AF37";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.08, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(drawClock);
    };

    drawClock();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={120}
      className="home-analog-clock"
    />
  );
}

function Home() {
  // Timer definitions: [route, label]
  const timers = [
    { route: "#/countdown", label: "Countdown" },
    { route: "#/stopwatch", label: "Stopwatch" },
    { route: "#/analog", label: "Analog Clock" },
    { route: "#/chess", label: "Chess Clock" },
    { route: "#/metronome", label: "Metronome" },
    { route: "#/world", label: "World Clock" },
    { route: "#/alarm", label: "Alarm" },
    { route: "#/pomodoro", label: "Pomodoro" },
  ];

  return (
    <div className="home-page">
      {/* Title with integrated clock */}
      <div className="home-title-container">
        <div className="home-title-with-clock">
          <span className="home-title-word">Stopp</span>
          <HomeAnalogClock />
          <span className="home-title-word">Clock</span>
        </div>
      </div>

      {/* Timer Grid */}
      <div className="home-grid">
        {timers.map(({ route, label }) => (
          <a
            key={route}
            href={route}
            className="home-timer-card"
          >
            <div className="timer-card-inner">
              <div className="timer-icon-container">
                <TimerIcon type={label} />
              </div>
              <span className="timer-label">{label}</span>
            </div>
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
      {route === "/pomodoro" && <Pomodoro />}
      {route === "/cooking" && <CookingTimer />}
      {route === "/digital" && <DigitalClock />}
      {route === "/world" && <WorldClock />}
      {route === "/alarm" && <Alarm />}
      {route === "/metronome" && <Metronome />}
      {route === "/chess" && <ChessClock />}
      {route === "/impressum" && <Impressum />}
      {route === "/datenschutz" && <Datenschutz />}
      {!["", "/", "/analog", "/countdown", "/stopwatch", "/pomodoro", "/cooking", "/digital", "/world", "/alarm", "/metronome", "/chess", "/impressum", "/datenschutz"].includes(route) && (
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

// Minimalist SVG Timer Icons Component
function TimerIcon({ type }: { type: string }) {
  const icons: Record<string, JSX.Element> = {
    "Stopwatch": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="8"/>
        <path d="M12 9v4l2 2"/>
        <path d="M10 2h4"/>
        <path d="M12 2v2"/>
      </svg>
    ),
    "Countdown": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6v6l4 2"/>
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2v2"/>
        <path d="M2 12h2"/>
        <path d="M22 12h-2"/>
      </svg>
    ),
    "Analog": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    "Analog Clock": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    "Pomodoro": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
        <path d="M16.24 7.76l-1.5 1.5"/>
        <path d="M19 12h-2"/>
      </svg>
    ),
    "Cooking Timer": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="8"/>
        <path d="M12 9v4l3 2"/>
        <path d="M16.5 3.5L19 6"/>
        <path d="M7.5 3.5L5 6"/>
        <path d="M9 2h6"/>
      </svg>
    ),
    "World Clock": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    "Alarm": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="8"/>
        <path d="M12 9v4l2 2"/>
        <path d="M5 3L2 6"/>
        <path d="M22 6l-3-3"/>
        <path d="M6 19l-2 2"/>
        <path d="M18 19l2 2"/>
      </svg>
    ),
    "Metronome": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    "Chess Clock": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="12" rx="2"/>
        <path d="M12 8V4"/>
        <path d="M8 4h8"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
      </svg>
    ),
    "Digital Clock": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <path d="M7 10h.01"/>
        <path d="M7 14h.01"/>
        <path d="M17 10h.01"/>
        <path d="M17 14h.01"/>
        <path d="M12 10v4"/>
      </svg>
    )
  };

  return icons[type] || icons["Stopwatch"];
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><App /></StrictMode>
);
