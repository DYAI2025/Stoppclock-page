import { useEffect, useState, useCallback } from "react";

// Custom hook to track hash-based location changes
function useLocation() {
  const [location, setLocation] = useState({
    hash: window.location.hash || "#/"
  });

  useEffect(() => {
    const handleHashChange = () => {
      setLocation({ hash: window.location.hash || "#/" });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return location;
}

// SEO Metadata für jede Route
const seoData: Record<string, { title: string; description: string; keywords?: string }> = {
  "/": {
    title: "Stoppclock — Kostenloser Online Timer | Pomodoro, Countdown, Stoppuhr",
    description: "Kostenloser Online Timer ohne Download. Pomodoro, Countdown, Stoppuhr, Metronom, World Clock & mehr. 100% kostenlos, keine Anmeldung, werbefinanziert.",
    keywords: "online timer, kostenlos, countdown, stoppuhr, pomodoro timer",
  },
  "/countdown": {
    title: "Countdown Timer Online — Stoppclock",
    description: "Digitaler Countdown Timer bis 12 Stunden. Mit Warnungen bei Ablauf. Perfekt für Prüfungen, Präsentationen, Kochen. Kein Download nötig.",
    keywords: "countdown timer online, digitaler timer, prüfung timer, kostenlos",
  },
  "/stopwatch": {
    title: "Stoppuhr Online — Stoppclock",
    description: "Stoppuhr mit Rundenzeiten (Laps). Projektfreundlich für Präsentationen und Sport. Speichert letzte Runden. 100% kostenlos.",
    keywords: "stoppuhr online, lap timer, rundenzähler, sport timer",
  },
  "/analog": {
    title: "Analog Countdown — Stoppclock",
    description: "Analoger Countdown mit Zeiger-Anzeige. Bis 12 Stunden. Ideal für Prüfungen, Seminare, Vorträge. Beamer-freundlich.",
    keywords: "analog countdown, uhr countdown, prüfung timer, zeiger timer",
  },
  "/pomodoro": {
    title: "Pomodoro Timer Online — Stoppclock",
    description: "Pomodoro Timer für produktives Arbeiten. 25/5 Minuten Work/Break Cycles. Anpassbare Intervalle. Kein Account nötig.",
    keywords: "pomodoro timer, produktivität, arbeiten timer, focus timer",
  },
  "/cooking": {
    title: "Kochtimer Online — Stoppclock",
    description: "Kochtimer für präzises Kochen. Eierkochen, Pasta, Backzeit. Mit Alarmton. Kein Herd-Timer nötig.",
    keywords: "kochtimer, eierkochen timer, pasta timer, küchen timer",
  },
  "/couples": {
    title: "Couples Timer — Stoppclock",
    description: "Timer für Paare. Gemeinsame Countdowns, Work/Life Balance Tracking. Perfekt für Remote-Paare.",
    keywords: "couples timer, paare timer, gemeinsamer timer, relationship timer",
  },
  "/digital": {
    title: "Digital Clock — Stoppclock",
    description: "Große digitale Uhr-Anzeige. Weltzeit, Alarm, Wecker.immer sichtbar. Perfekt als Desktop-Hintergrund.",
    keywords: "digital clock, uhr anzeige, weltzeit, alarm",
  },
  "/world": {
    title: "World Clock — Stoppclock",
    description: "Weltzeituhr mit mehreren Zeitzonen. Compare Zeiten für internationale Teams. Sommerzeit-Automatik.",
    keywords: "world clock, weltzeit, zeitzonen, international",
  },
  "/alarm": {
    title: "Alarm Online — Stoppclock",
    description: "Online Wecker mit Sound. Stellen Sie bis zu 10 Alarme. Browser-Tab-Notification bei Aktivierung.",
    keywords: "alarm, wecker, online wecker, timer alarm",
  },
  "/metronome": {
    title: "Metronom Online — Stoppclock",
    description: "Metronom mit einstellbarem BPM (30-300). Audio-Ticks, Visuelle Anzeige. Perfekt für Musiker.",
    keywords: "metronom, bpm, schlagzahl, musiker timer",
  },
  "/chess": {
    title: "Schachuhr Online — Stoppclock",
    description: "Digitale Schachuhr für zwei Spieler. Verschiedene Zeitkontrollen (Blitz, Rapid, Classic). Spieler-Wechsel mit einem Klick.",
    keywords: "schachuhr, chess clock, zwei spieler timer, blitzschach",
  },
  "/timesince": {
    title: "Time Since — Stoppclock",
    description: "Zeit seit Datum berechnen. Count up Timer für Jubiläen, Jahrestage, Meilensteine. In Tagen, Stunden, Minuten.",
    keywords: "time since, countdown up, jahrestag timer, tage zählen",
  },
  "/timelab": {
    title: "Time Lab — Stoppclock",
    description: "Experimentiere mit Timer-Einstellungen. Custom Sessions, Intervalle, Runden. Teste verschiedene Timer-Designs.",
    keywords: "time lab, custom timer, intervalle, test timer",
  },
  "/blog": {
    title: "Blog — Stoppclock",
    description: "Artikel über Produktivität, Timer-Nutzung, Pomodoro-Technik und Zeitmanagement. Tipps für besseres Zeitmanagement.",
    keywords: "blog, produktivität, zeitmanagement, timer tipps",
  },
  "/blog/pomodoro-timer-online": {
    title: "Pomodoro Timer Online — Der ultimative Guide 2026 | Stoppclock",
    description: "Alles über Pomodoro Timer online nutzen. Wie die Pomodoro-Technik funktioniert, beste Einstellungen und Alternativen. Inkl. kostenlosem Timer.",
    keywords: "pomodoro guide, pomodoro technik, produktivität steigern",
  },
  "/blog/pomodoro-vs-countdown": {
    title: "Pomodoro vs Countdown — Was wann nutzen? | Stoppclock",
    description: "Pomodoro vs klassischer Countdown: Wann nutzt man was? Vergleich der Timer-Arten für Produktivität, Arbeit und Fokus.",
    keywords: "pomodoro vs countdown, timer vergleich, produktivität",
  },
  "/timer-for-students": {
    title: "Timer für Studenten — Lerntimer & Prüfungstimer | Stoppclock",
    description: "Spezieller Timer für Studenten. Pomodoro für Lernen, Prüfungs-Countdown, Pausen-Erinnerung. Perfekt für Uni und Fernstudium.",
    keywords: "timer für studenten, lerntimer, prüfung timer, uni timer",
  },
  "/timer-for-productivity": {
    title: "Timer für Produktivität — Focus Timer | Stoppclock",
    description: "Boost deine Produktivität mit dem richtigen Timer. Pomodoro, Flow Timer, Deep Work Sessions. Weniger Ablenkung, mehr Fokus.",
    keywords: "produktivität timer, focus timer, deep work, flow timer",
  },
  "/timer-for-fitness": {
    title: "Timer für Fitness — Intervalltimer & Workout Timer | Stoppclock",
    description: "Fitness Timer für HIIT, Intervalltraining, Krafttraining. Mit Rundenzähler und Pausen-Timer. Perfekt für Home Workout.",
    keywords: "fitness timer, intervall timer, workout timer, hiit",
  },
  "/time-philosophy": {
    title: "Raum für Zeit — Philosophie & Zeitmanagement | Stoppclock",
    description: "Gedanken über Zeit, Produktivität und das Wesen der Zeit. Philosophie trifft praktische Timer-Nutzung.",
    keywords: "zeitphilosophie, zeitmanagement, nachdenken über zeit",
  },
  "/about": {
    title: "About — Stoppclock",
    description: "Über Stoppclock. Projektfreundliche Timer und Uhren. Open Source, werbefinanziert, privacy-first.",
    keywords: "about, über uns, stoppclock über",
  },
  "/contact": {
    title: "Contact — Stoppclock",
    description: "Kontaktiere uns. Feedback, Fragen, Partnerschaft. Wir freuen uns von dir zu hören.",
    keywords: "contact, kontakt, feedback",
  },
  "/impressum": {
    title: "Impressum — Stoppclock",
    description: "Impressum von Stoppclock. Angaben gemäß TMG.",
    keywords: "impressum, rechtliches",
  },
  "/privacy": {
    title: "Privacy Policy — Stoppclock",
    description: "English privacy policy. How we handle data, cookies, and your rights.",
    keywords: "privacy, datenschutz, gdpr",
  },
};

export function useSEO() {
  const location = useLocation();

  useEffect(() => {
    // Default SEO data
    const defaultSEO = {
      title: "Stoppclock — Kostenloser Online Timer",
      description: "Kostenloser Online Timer ohne Download. Pomodoro, Countdown, Stoppuhr & mehr.",
    };

    // Route-spezifische Daten finden
    const route = location.hash.replace("#", "") || "/";
    const seo = seoData[route] || defaultSEO;

    // Document title und Meta Tags setzen
    document.title = seo.title;
    
    // Meta Description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement("meta");
      descMeta.setAttribute("name", "description");
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute("content", seo.description);

    // Keywords (optional)
    if (seo.keywords) {
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (!keywordsMeta) {
        keywordsMeta = document.createElement("meta");
        keywordsMeta.setAttribute("name", "keywords");
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.setAttribute("content", seo.keywords);
    }

    // Open Graph Updates
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.setAttribute("content", seo.title);
    if (ogDesc) ogDesc.setAttribute("content", seo.description);

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", `https://www.stoppclock.com${route}`);

  }, [location.hash]);
}

// Component für einfache Nutzung
export function SEOHead() {
  useSEO();
  return null;
}
