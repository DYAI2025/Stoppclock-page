import React, { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./design-tokens.css";
import "./styles.css";
import DynamicBlogRouter from "./pages/DynamicBlogRouter";

import { AdSenseScript } from "./components/AdSenseScript";
import { ConsentBanner } from "./components/ConsentBanner";
import { PinnedTimersProvider } from "./contexts/PinnedTimersContext";
import { SEOHead } from "./hooks/useSEO";
import LandingPage from "./pages/LandingPage";

// Code-split: Timer pages (loaded on demand)
const AnalogCountdown = lazy(() => import("./pages/AnalogCountdown"));
const Countdown = lazy(() => import("./pages/Countdown"));
const Stopwatch = lazy(() => import("./pages/Stopwatch"));
const WorldClock = lazy(() => import("./pages/WorldClock"));
const Alarm = lazy(() => import("./pages/Alarm"));
const Metronome = lazy(() => import("./pages/Metronome"));
const ChessClock = lazy(() => import("./pages/ChessClock"));
const CookingTimer = lazy(() => import("./pages/CookingTimer"));
const CouplesTimer = lazy(() => import("./pages/CouplesTimer"));
const DigitalClock = lazy(() => import("./pages/DigitalClock"));
const Pomodoro = lazy(() => import("./pages/Pomodoro"));
const TimeSince = lazy(() => import("./pages/TimeSince"));
const TimeLab = lazy(() => import("./pages/TimeLab"));

// Code-split: Content pages
const Wissen = lazy(() => import("./pages/Wissen"));
const ImprintEn = lazy(() => import("./pages/ImprintEn"));
const PrivacyPolicyEn = lazy(() => import("./pages/PrivacyPolicyEn"));
const Impressum = lazy(() => import("./pages/Impressum"));
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PillarPage = lazy(() => import("./pages/PillarPage"));
const TimePhilosophy = lazy(() => import("./pages/TimePhilosophy"));

// Code-split: Blog pages
const PomodoroTimerOnline = lazy(() => import("./pages/blog/PomodoroTimerOnline"));
const PomodoroVsCountdown = lazy(() => import("./pages/blog/PomodoroVsCountdown"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));

// Code-split: DFY Landing pages
const TimerForStudents = lazy(() => import("./pages/TimerForStudents"));
const TimerForProductivity = lazy(() => import("./pages/TimerForProductivity"));
const TimerForFitness = lazy(() => import("./pages/TimerForFitness"));
const TimerForCooking = lazy(() => import("./pages/TimerForCooking"));
const TimerForMeditation = lazy(() => import("./pages/TimerForMeditation"));
const TimerForFocus = lazy(() => import("./pages/TimerForFocus"));

// Code-split: Custom Sessions
const CustomSessionsLanding = lazy(() => import("./pages/CustomSessionsLanding"));
const SessionBuilder = lazy(() => import("./pages/SessionBuilder"));
const SessionRunner = lazy(() => import("./pages/SessionRunner"));
const SessionPreview = lazy(() => import("./pages/SessionPreview"));

// Code-split: Other pages
const TimerWorldsIndex = lazy(() => import("./pages/TimerWorldsIndex"));
const FactsPage = lazy(() => import("./pages/FactsPage"));
const CountdownGuide = lazy(() => import("./components/CountdownGuide").then(m => ({ default: m.CountdownGuide })));
const BreathingTimer = lazy(() => import("./pages/BreathingTimer"));
const IntervalTimer = lazy(() => import("./pages/IntervalTimer"));
const WidgetDemo = lazy(() => import("./pages/WidgetDemo"));

// Loading fallback component for lazy-loaded pages
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="loader-spinner"></div>
    </div>
  );
}

function useHashRoute() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const f = () => force();
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return (location.hash || "#/").replace(/^#/, "");
}

function App() {
  const route = useHashRoute();
  const isAbout = route.startsWith('/about/');
  const isWissen = route.startsWith('/wissen/');
  const isBlog = route.startsWith('/blog/');
  const isCustomSessions = route.startsWith('/custom-sessions');

  return (
    <>
      {/* Dynamic SEO Tags per Route */}
      <SEOHead />
      <AdSenseScript />

      {/* GDPR consent banner - shows on first visit */}
      <ConsentBanner />

      {/* Route content wrapped in Suspense for lazy-loaded components */}
      <Suspense fallback={<PageLoader />}>
        {route === "/" && <LandingPage />}
        {route === "/analog" && <AnalogCountdown />}
        {route === "/countdown" && <Countdown />}
        {route === "/stopwatch" && <Stopwatch />}
        {route === "/timesince" && <TimeSince />}
        {route === "/timelab" && <TimeLab />}
        {route === "/pomodoro" && <Pomodoro />}
        {route === "/cooking" && <CookingTimer />}
        {route === "/couples" && <CouplesTimer />}
        {route === "/digital" && <DigitalClock />}
        {route === "/world" && <WorldClock />}
        {route === "/alarm" && <Alarm />}
        {route === "/metronome" && <Metronome />}
        {route === "/chess" && <ChessClock />}
        {route === "/breathing" && <BreathingTimer />}
        {route === "/interval" && <IntervalTimer />}
        {route === "/widget-demo" && <WidgetDemo />}

        {route === "/facts" && <FactsPage />}
        {route === "/custom-sessions" && <CustomSessionsLanding />}
        {route.startsWith("/custom-sessions/builder") && <SessionBuilder />}
        {route.startsWith("/custom-sessions/run/") && <SessionRunner />}
        {route.startsWith("/custom-sessions/preview/") && <SessionPreview />}
        {route === "/timers" && <TimerWorldsIndex />}
        {route === "/blog" && <BlogIndex />}
        {(isAbout || isWissen) && <Wissen />}
        {isBlog && route !== "/blog" && (
          <DynamicBlogRouter slug={route.replace('/blog/', '')} />
        )}
        {route === "/timer-for-students" && <TimerForStudents />}
        {route === "/timer-for-productivity" && <TimerForProductivity />}
        {route === "/timer-for-fitness" && <TimerForFitness />}
        {route === "/timer-for-cooking" && <TimerForCooking />}
        {route === "/timer-for-meditation" && <TimerForMeditation />}
        {route === "/timer-for-focus" && <TimerForFocus />}
        {route === "/blog/countdown-timer-guide" && <CountdownGuide onPresetSelect={() => window.location.hash = '#/countdown'} />}
        {route === "/imprint" && <ImprintEn />}
        {route === "/privacy" && <PrivacyPolicyEn />}
        {route === "/impressum" && <Impressum />}
        {route === "/datenschutz" && <Datenschutz />}
        {route === "/about" && <About />}
        {route === "/contact" && <Contact />}
        {route === "/pillar" && <PillarPage />}
        {route === "/time-philosophy" && <TimePhilosophy />}
        {!["", "/", "/analog", "/countdown", "/stopwatch", "/pomodoro", "/cooking", "/couples", "/digital", "/world", "/alarm", "/metronome", "/chess", "/breathing", "/interval", "/widget-demo", "/imprint", "/privacy", "/impressum", "/datenschutz", "/about", "/contact", "/pillar", "/time-philosophy", "/blog/pomodoro-timer-online", "/timer-for-students", "/timer-for-productivity", "/timer-for-fitness", "/timer-for-cooking", "/timer-for-meditation", "/timer-for-focus", "/timesince", "/timelab", "/timers", "/blog"].includes(route) && !isAbout && !isWissen && !isBlog && !isCustomSessions && (
          <div className="page"><h1>Not Found</h1></div>
        )}
      </Suspense>
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
  <StrictMode>
    <PinnedTimersProvider>
      <App />
    </PinnedTimersProvider>
  </StrictMode>
);
