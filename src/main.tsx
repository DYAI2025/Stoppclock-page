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
import Wissen from "./pages/Wissen";
import ImprintEn from "./pages/ImprintEn";
import PrivacyPolicyEn from "./pages/PrivacyPolicyEn";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import PillarPage from "./pages/PillarPage";
import TimePhilosophy from "./pages/TimePhilosophy";
import PomodoroTimerOnline from "./pages/blog/PomodoroTimerOnline";
import PomodoroVsCountdown from "./pages/blog/PomodoroVsCountdown";
import TimerForStudents from "./pages/TimerForStudents";
import TimerForProductivity from "./pages/TimerForProductivity";
import TimerForFitness from "./pages/TimerForFitness";
import { AdSenseScript } from "./components/AdSenseScript";
import { ConsentBanner } from "./components/ConsentBanner";
import TimerQuickInfo from "./components/TimerQuickInfo";
import ClockFactsBoard from "./components/ClockFactsBoard";
import { PinnedTimersProvider } from "./contexts/PinnedTimersContext";
import LanguageToggle from "./components/LanguageToggle";
import DarkModeToggle from "./components/DarkModeToggle";

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
  // Timer definitions with per-card accent colors
  const timers = [
    { route: "#/countdown", label: "Countdown", color: "#7B2CBF", colorRgb: "123, 44, 191" },
    { route: "#/stopwatch", label: "Stopwatch", color: "#00D9FF", colorRgb: "0, 217, 255" },
    { route: "#/analog", label: "Analog Clock", color: "#C77DFF", colorRgb: "199, 125, 255" },
    { route: "#/cooking", label: "Cooking Timer", color: "#FF6B9D", colorRgb: "255, 107, 157" },
    { route: "#/chess", label: "Chess Clock", color: "#E0AAFF", colorRgb: "224, 170, 255" },
    { route: "#/metronome", label: "Metronome", color: "#F59E0B", colorRgb: "245, 158, 11" },
    { route: "#/world", label: "World Clock", color: "#6B9BD1", colorRgb: "107, 155, 209" },
    { route: "#/alarm", label: "Alarm", color: "#EF4444", colorRgb: "239, 68, 68" },
    { route: "#/pomodoro", label: "Pomodoro", color: "#10B981", colorRgb: "16, 185, 129" },
  ];

  // Pillar pages (Blog/Content section)
  const pillars = [
    { route: "#/time-philosophy", label: "Space for Time", color: "#A855F7", colorRgb: "168, 85, 247" },
  ];

  return (
    <div className="home-page">
      {/* Title with integrated clock */}
      <div className="home-title-container">
        <DarkModeToggle />
        <LanguageToggle />
        <div className="home-title-with-clock">
          <span className="home-title-word">Stopp</span>
          <HomeAnalogClock />
          <span className="home-title-word">Clock</span>
        </div>
      </div>

      {/* Digital-style facts board above the timers */}
      <ClockFactsBoard />

      {/* TIMER SECTION */}
      <div className="home-section home-section-timers">
        {/* Timer Grid */}
        <div className="home-grid">
          {/* Long intro placed ON the section surface */}
          <div className="home-grid-header">
            Time, held lightly. Time is relative. The less we have, the more precious it becomes, then, strangely, it stretches on forever. Stop Clock won't solve time, but it lets you hold it for a moment: counting up, counting down, counting what matters. Use it as a tool, a daily helper, a nudge to think, a small philosophy and, sometimes, a reason to smile.
          </div>
          {timers.map(({ route, label, color, colorRgb }) => (
            <a
              key={route}
              href={route}
              className="home-timer-card"
              style={{ '--card-color': color, '--card-color-rgb': colorRgb } as React.CSSProperties}
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

        {/* Info section under timer grid */}
        <TimerQuickInfo />
      </div>

      {/* BLOG/PILLAR SECTION */}
      <div className="home-section home-section-pillars">
        <div className="section-title">Explore Further</div>
        <div className="home-grid">
          {pillars.map(({ route, label, color, colorRgb }) => (
            <a
              key={route}
              href={route}
              className="home-timer-card"
              style={{ '--card-color': color, '--card-color-rgb': colorRgb } as React.CSSProperties}
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
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-links">
          <a href="#/imprint">Imprint (EN)</a>
          <span>•</span>
          <a href="#/privacy">Privacy Policy (EN)</a>
          <span>•</span>
          <a href="#/impressum">Impressum (DE)</a>
          <span>•</span>
          <a href="#/datenschutz">Datenschutz (DE)</a>
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
  const isAbout = route.startsWith('/about/');
  const isWissen = route.startsWith('/wissen/');
  const isBlog = route.startsWith('/blog/');

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
      {(isAbout || isWissen) && <Wissen />}
      {route === "/blog/pomodoro-timer-online" && <PomodoroTimerOnline />}
      {route === "/blog/pomodoro-vs-countdown" && <PomodoroVsCountdown />}
      {isBlog && !route.includes("pomodoro-timer-online") && !route.includes("pomodoro-vs-countdown") && <div className="page"><h1>Blog Article Not Found</h1></div>}
      {route === "/timer-for-students" && <TimerForStudents />}
      {route === "/timer-for-productivity" && <TimerForProductivity />}
      {route === "/timer-for-fitness" && <TimerForFitness />}
      {route === "/imprint" && <ImprintEn />}
      {route === "/privacy" && <PrivacyPolicyEn />}
      {route === "/impressum" && <Impressum />}
      {route === "/datenschutz" && <Datenschutz />}
      {route === "/pillar" && <PillarPage />}
      {route === "/time-philosophy" && <TimePhilosophy />}
      {!["", "/", "/analog", "/countdown", "/stopwatch", "/pomodoro", "/cooking", "/digital", "/world", "/alarm", "/metronome", "/chess", "/imprint", "/privacy", "/impressum", "/datenschutz", "/pillar", "/time-philosophy", "/blog/pomodoro-timer-online", "/timer-for-students", "/timer-for-productivity", "/timer-for-fitness"].includes(route) && !isAbout && !isWissen && !isBlog && (
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
    ),
    "Raum für Zeit": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>
    )
  };

  return icons[type] || icons["Stopwatch"];
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PinnedTimersProvider>
      <App />
    </PinnedTimersProvider>
  </StrictMode>
);
