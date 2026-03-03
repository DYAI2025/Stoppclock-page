/**
 * SEO Konfiguration — Single Source of Truth
 *
 * ============================================================
 * VERWENDUNG:
 *   import { getSEOForRoute } from '../config/seo';
 *   const seo = getSEOForRoute('/countdown');
 *
 * REGELN:
 *   - Title: max 60 Zeichen (Google kürzt ab 60)
 *   - Description: max 160 Zeichen (Google kürzt ab 160)
 *   - Keywords: 3-5 relevante Begriffe, kein Keyword-Stuffing
 *   - ogImage: Immer route-spezifisch oder Kategorie-Bild
 * ============================================================
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  /** Open Graph Bild-URL (relativ zu /og/) */
  ogImage?: string;
  /** Canonical URL (ohne Domain, z.B. '/countdown') */
  canonical?: string;
  /** Sprache der Seite */
  lang?: 'de' | 'en';
  /** Schema.org Typ für JSON-LD */
  schemaType?: 'WebApplication' | 'Article' | 'BlogPosting' | 'FAQPage' | 'HowTo';
  /** Noindex: true für interne/rechtliche Seiten */
  noindex?: boolean;
}

const BASE_URL = 'https://www.stoppclock.com';
const DEFAULT_OG_IMAGE = '/og/cover-1200x630.png';

/** OG-Bilder pro Kategorie */
export const OG_IMAGES = {
  home: '/og/cover-1200x630.png',
  timer: '/og/timer-og.png',       // TODO: Erstellen (1200x630, Timer-Design)
  pomodoro: '/og/pomodoro-og.png', // TODO: Erstellen
  blog: '/og/blog-og.png',         // TODO: Erstellen
  world: '/og/world-clock-og.png', // TODO: Erstellen
  cooking: '/og/cooking-og.png',   // TODO: Erstellen
  fitness: '/og/fitness-og.png',   // TODO: Erstellen
  legal: '/og/cover-1200x630.png',
};

// =============================================================================
// SEO DATEN PRO ROUTE
// Route = Hash-Pfad ohne '#', z.B. '/', '/countdown', '/blog/pomodoro-timer-online'
// =============================================================================
const SEO_ROUTES: Record<string, SEOConfig> = {

  // ── HOME ────────────────────────────────────────────────────────────────
  '/': {
    title: 'Stoppclock — Kostenloser Online Timer | Pomodoro & Stoppuhr',
    description: 'Kostenloser Online Timer ohne Download. Pomodoro, Countdown, Stoppuhr, Metronom, World Clock & mehr. 100% gratis, keine Anmeldung.',
    keywords: 'online timer kostenlos, countdown timer, stoppuhr, pomodoro timer',
    ogImage: OG_IMAGES.home,
    canonical: '/',
    lang: 'de',
    schemaType: 'WebApplication',
  },

  // ── TIMER SEITEN ─────────────────────────────────────────────────────────
  '/countdown': {
    title: 'Countdown Timer Online — Kostenlos | Stoppclock',
    description: 'Digitaler Countdown Timer bis 12 Stunden. Perfekt für Prüfungen, Präsentationen, Küche. Alarm-Sound. Kein Download nötig.',
    keywords: 'countdown timer online, digitaler timer, prüfung timer, kostenlos',
    ogImage: OG_IMAGES.timer,
    canonical: '/countdown',
    lang: 'de',
  },
  '/stopwatch': {
    title: 'Stoppuhr Online — Mit Rundenzeiten | Stoppclock',
    description: 'Stoppuhr mit Laps-Funktion. Ideal für Sport, Präsentationen und Projektarbeit. Letzte Runden gespeichert. 100% kostenlos.',
    keywords: 'stoppuhr online, lap timer, rundenzähler, sport timer',
    ogImage: OG_IMAGES.timer,
    canonical: '/stopwatch',
    lang: 'de',
  },
  '/analog': {
    title: 'Analoger Countdown — Zeiger-Uhr | Stoppclock',
    description: 'Analoger Countdown bis 12 Stunden mit klassischer Zeigeranzeige. Ideal für Beamer in Prüfungen und Seminaren.',
    keywords: 'analog countdown, zeiger timer, prüfung timer beamer, analoguhr countdown',
    ogImage: OG_IMAGES.timer,
    canonical: '/analog',
    lang: 'de',
  },
  '/pomodoro': {
    title: 'Pomodoro Timer Online — 25 Min Fokus | Stoppclock',
    description: 'Pomodoro Timer für produktives Arbeiten. 25/5 Min Work/Break-Zyklen. Anpassbare Intervalle. Kein Account nötig.',
    keywords: 'pomodoro timer, produktivität, focus timer, pomodoro technik',
    ogImage: OG_IMAGES.pomodoro,
    canonical: '/pomodoro',
    lang: 'de',
  },
  '/cooking': {
    title: 'Kochtimer Online — Mehrere Timer | Stoppclock',
    description: 'Gleichzeitig mehrere Kochtimer für Pasta, Eier, Backen. Mit Sound-Alarm. Kein Herd-Timer nötig.',
    keywords: 'kochtimer online, eierkochen timer, pasta timer, küchen timer',
    ogImage: OG_IMAGES.cooking,
    canonical: '/cooking',
    lang: 'de',
  },
  '/couples': {
    title: 'Couples Timer — Fairer Dialog-Timer | Stoppclock',
    description: 'Timer für faire Gesprächszeit zu zweit. Ideal für Paargespräche, Remote-Meetings und strukturierte Diskussionen.',
    keywords: 'couples timer, dialog timer, redezeit timer, gesprächs timer',
    ogImage: OG_IMAGES.timer,
    canonical: '/couples',
    lang: 'de',
  },
  '/digital': {
    title: 'Digitale Uhr Online — Groß & Klar | Stoppclock',
    description: 'Große digitale Uhr-Anzeige mit Datum. Ideal als Desktop-Hintergrund, für Beamer und Präsentationen.',
    keywords: 'digitale uhr online, digital clock, uhr anzeige groß',
    ogImage: OG_IMAGES.timer,
    canonical: '/digital',
    lang: 'de',
  },
  '/world': {
    title: 'Weltzeituhr Online — Zeitzonen-Vergleich | Stoppclock',
    description: 'Weltzeituhr mit mehreren Zeitzonen. Ideal für internationale Teams und Remote-Arbeit. Sommerzeit-Automatik.',
    keywords: 'weltzeituhr online, world clock, zeitzonen vergleich, internationale zeit',
    ogImage: OG_IMAGES.world,
    canonical: '/world',
    lang: 'de',
  },
  '/alarm': {
    title: 'Online Wecker — Alarm im Browser | Stoppclock',
    description: 'Online Wecker mit Sound. Bis zu 10 gleichzeitige Alarme. Browser-Benachrichtigung. Kein App-Download nötig.',
    keywords: 'online wecker, alarm online, browser wecker, kostenloser wecker',
    ogImage: OG_IMAGES.timer,
    canonical: '/alarm',
    lang: 'de',
  },
  '/metronome': {
    title: 'Metronom Online — BPM 30–300 | Stoppclock',
    description: 'Digitales Metronom mit einstellbarem BPM (30–300). Klick-Sound, visuelle Anzeige. Perfekt für Musiker und Gesangsübungen.',
    keywords: 'metronom online, bpm metronom, musiker timer, taktgeber',
    ogImage: OG_IMAGES.timer,
    canonical: '/metronome',
    lang: 'de',
  },
  '/chess': {
    title: 'Schachuhr Online — Digitale Chess Clock | Stoppclock',
    description: 'Digitale Schachuhr für zwei Spieler. Blitz, Rapid, Classic Zeitkontrollen. Spielerwechsel per Klick. Kostenlos.',
    keywords: 'schachuhr online, chess clock, blitzschach timer, schach zeitkontrolle',
    ogImage: OG_IMAGES.timer,
    canonical: '/chess',
    lang: 'de',
  },
  '/timesince': {
    title: 'Zeit seit Datum — Count-Up Timer | Stoppclock',
    description: 'Berechne wie lange es her ist: Jubiläen, Jahrestage, Meilensteine. Anzeige in Jahren, Tagen, Stunden, Minuten.',
    keywords: 'zeit seit datum, count up timer, jahrestag rechner, tage zählen',
    ogImage: OG_IMAGES.timer,
    canonical: '/timesince',
    lang: 'de',
  },
  '/timelab': {
    title: 'Time Lab — Timer-Experimente | Stoppclock',
    description: 'Experimentiere mit Timer-Einstellungen. Custom Sessions, Intervalle, Runden. Finde deinen perfekten Timer.',
    keywords: 'custom timer, intervall timer, timer einstellungen, zeitlabor',
    ogImage: OG_IMAGES.timer,
    canonical: '/timelab',
    lang: 'de',
  },
  '/breathing': {
    title: 'Atemübungs-Timer — Breathe & Relax | Stoppclock',
    description: 'Geführter Atemtimer für Entspannung und Fokus. 4-7-8, Box Breathing, Kohärenz-Atmung. Kostenlos im Browser.',
    keywords: 'atemübung timer, breathing timer, entspannung timer, atemtechnik',
    ogImage: OG_IMAGES.fitness,
    canonical: '/breathing',
    lang: 'de',
  },
  '/interval': {
    title: 'Intervalltimer — HIIT & Workout Timer | Stoppclock',
    description: 'Intervalltimer für HIIT, Krafttraining und Sport. Work/Rest Zyklen konfigurierbar. Beep-Sound. Kostenlos.',
    keywords: 'intervalltimer, hiit timer, workout timer, fitness timer',
    ogImage: OG_IMAGES.fitness,
    canonical: '/interval',
    lang: 'de',
  },

  // ── CONTENT / LANDING PAGES ──────────────────────────────────────────────
  '/timer-for-students': {
    title: 'Timer für Studenten — Lern-Timer | Stoppclock',
    description: 'Spezieller Timer für Studenten. Pomodoro fürs Lernen, Prüfungs-Countdown, Pausen-Erinnerung. Perfekt für Uni und Fernstudium.',
    keywords: 'timer für studenten, lerntimer, prüfung countdown, uni timer',
    ogImage: OG_IMAGES.pomodoro,
    canonical: '/timer-for-students',
    lang: 'de',
  },
  '/timer-for-productivity': {
    title: 'Produktivitäts-Timer — Focus & Deep Work | Stoppclock',
    description: 'Steigere deine Produktivität mit dem richtigen Timer. Pomodoro, Flow Timer, Deep Work Sessions. Weniger Ablenkung.',
    keywords: 'produktivität timer, focus timer, deep work timer, flow timer',
    ogImage: OG_IMAGES.pomodoro,
    canonical: '/timer-for-productivity',
    lang: 'de',
  },
  '/timer-for-fitness': {
    title: 'Fitness-Timer — HIIT & Workout | Stoppclock',
    description: 'Fitness Timer für HIIT, Intervalltraining, Krafttraining. Mit Rundenzähler und Pausen-Timer. Home Workout optimiert.',
    keywords: 'fitness timer, hiit timer, workout timer, interval training',
    ogImage: OG_IMAGES.fitness,
    canonical: '/timer-for-fitness',
    lang: 'de',
  },
  '/timer-for-meditation': {
    title: 'Meditationstimer — Ruhig & Ablenkungsfrei | Stoppclock',
    description: 'Meditationstimer mit sanftem Gong-Ton. Ablenkungsfrei, ohne Werbung während der Session. Für alle Meditationsformen.',
    keywords: 'meditationstimer, meditation timer, achtsamkeit timer, mindfulness',
    ogImage: OG_IMAGES.timer,
    canonical: '/timer-for-meditation',
    lang: 'de',
  },
  '/timer-for-focus': {
    title: 'Fokus-Timer — Deep Work Sessions | Stoppclock',
    description: 'Fokus-Timer für tiefe Konzentrationsphasen. Ablenkungsarm, anpassbar, mit Pausen-Reminder. Für Freelancer und Remote-Worker.',
    keywords: 'fokus timer, deep work, konzentration timer, arbeiten ohne ablenkung',
    ogImage: OG_IMAGES.pomodoro,
    canonical: '/timer-for-focus',
    lang: 'de',
  },
  '/timer-for-cooking': {
    title: 'Kochtimer — Küchen-Timer Online | Stoppclock',
    description: 'Mehrere Kochtimer gleichzeitig. Vorkonfiguriert für Eier, Pasta, Reis, Backen. Mit Alarm-Sound.',
    keywords: 'kochtimer, küchen timer, eierkocher timer, backtimer',
    ogImage: OG_IMAGES.cooking,
    canonical: '/timer-for-cooking',
    lang: 'de',
  },
  '/time-philosophy': {
    title: 'Raum für Zeit — Zeitphilosophie | Stoppclock',
    description: 'Gedanken über Zeit, Produktivität und das Wesen des Moments. Philosophie trifft praktischen Umgang mit Zeit.',
    keywords: 'zeitphilosophie, gedanken über zeit, zeitmanagement philosophie',
    ogImage: OG_IMAGES.home,
    canonical: '/time-philosophy',
    lang: 'de',
  },
  '/timers': {
    title: 'Alle Timer — Timer-Übersicht | Stoppclock',
    description: 'Alle verfügbaren Timer auf einen Blick: Countdown, Pomodoro, Stoppuhr, Schachuhr, Metronom und mehr.',
    keywords: 'alle timer, timer übersicht, online timer sammlung',
    ogImage: OG_IMAGES.home,
    canonical: '/timers',
    lang: 'de',
  },
  '/facts': {
    title: 'Zeitfakten — Interessantes über Zeit | Stoppclock',
    description: 'Faszinierende Fakten über Zeit, Uhren und Zeitmessung. Wissenswertes aus Geschichte und Wissenschaft.',
    keywords: 'zeitfakten, uhren fakten, zeitmessung geschichte',
    ogImage: OG_IMAGES.home,
    canonical: '/facts',
    lang: 'de',
  },

  // ── BLOG ─────────────────────────────────────────────────────────────────
  '/blog': {
    title: 'Blog — Timer-Tipps & Produktivität | Stoppclock',
    description: 'Artikel über Produktivität, Timer-Nutzung, Pomodoro-Technik und Zeitmanagement. Praktische Tipps für besseres Zeitmanagement.',
    keywords: 'timer blog, produktivität tipps, zeitmanagement artikel',
    ogImage: OG_IMAGES.blog,
    canonical: '/blog',
    lang: 'de',
  },
  '/blog/pomodoro-timer-online': {
    title: 'Pomodoro Timer Online — Der ultimative Guide | Stoppclock',
    description: 'Wie Pomodoro Timer deine Produktivität um 40-70% steigern. Wissenschaftlich belegt. Mit kostenlosem Timer zum Sofort-Starten.',
    keywords: 'pomodoro timer online, pomodoro guide, pomodoro technik erklärt',
    ogImage: OG_IMAGES.pomodoro,
    canonical: '/blog/pomodoro-timer-online',
    lang: 'de',
    schemaType: 'BlogPosting',
  },
  '/blog/pomodoro-vs-countdown': {
    title: 'Pomodoro vs Countdown — Was wann nutzen? | Stoppclock',
    description: 'Pomodoro vs klassischer Countdown im direkten Vergleich. Für welche Aufgaben ist was besser? Entscheidungshilfe mit Beispielen.',
    keywords: 'pomodoro vs countdown, timer vergleich, produktivität timer wahl',
    ogImage: OG_IMAGES.pomodoro,
    canonical: '/blog/pomodoro-vs-countdown',
    lang: 'de',
    schemaType: 'BlogPosting',
  },
  '/blog/stoppuhr-online-guide': {
    title: 'Stoppuhr Online — Guide & Tipps | Stoppclock',
    description: 'Alles über die digitale Stoppuhr. Wann sie besser ist als ein Timer, wie man Laps nutzt und wofür sie sich eignet.',
    keywords: 'stoppuhr online guide, digitale stoppuhr, lap timer erklärt',
    ogImage: OG_IMAGES.timer,
    canonical: '/blog/stoppuhr-online-guide',
    lang: 'de',
    schemaType: 'BlogPosting',
  },
  '/blog/countdown-timer-klasse': {
    title: 'Countdown Timer für Klassen & Schulen | Stoppclock',
    description: 'Wie Lehrer und Schüler Timer im Unterricht nutzen. Beamer-Modus, Prüfungs-Timer, stille Anzeige. Mit konkreten Empfehlungen.',
    keywords: 'countdown timer klasse, prüfungs timer schule, lehrer timer beamer',
    ogImage: OG_IMAGES.timer,
    canonical: '/blog/countdown-timer-klasse',
    lang: 'de',
    schemaType: 'BlogPosting',
  },
  '/blog/online-wecker-ohne-app': {
    title: 'Online Wecker ohne App — Browser-Alarm | Stoppclock',
    description: 'Warum ein Browser-Wecker oft praktischer ist als eine App. Wie man ihn richtig nutzt und welche Vorteile er bietet.',
    keywords: 'online wecker ohne app, browser wecker, alarm ohne download',
    ogImage: OG_IMAGES.timer,
    canonical: '/blog/online-wecker-ohne-app',
    lang: 'de',
    schemaType: 'BlogPosting',
  },
  '/blog/intervalltimer-hiit': {
    title: 'Intervalltimer für HIIT & Fitness | Stoppclock',
    description: 'Der richtige Intervalltimer für HIIT, Tabata, CrossFit. Wie man Work/Rest-Zyklen optimiert und warum Timing so wichtig ist.',
    keywords: 'intervalltimer hiit, tabata timer, fitness interval guide',
    ogImage: OG_IMAGES.fitness,
    canonical: '/blog/intervalltimer-hiit',
    lang: 'de',
    schemaType: 'BlogPosting',
  },
  '/blog/schachuhr-regeln-online': {
    title: 'Schachuhr Regeln & Online-Nutzung | Stoppclock',
    description: 'Alle Schachuhr-Regeln erklärt. Blitz, Rapid, Classical. Wie man eine digitale Schachuhr nutzt. Mit kostenloser Online-Uhr.',
    keywords: 'schachuhr regeln, chess clock online, blitzschach zeitkontrolle',
    ogImage: OG_IMAGES.timer,
    canonical: '/blog/schachuhr-regeln-online',
    lang: 'de',
    schemaType: 'BlogPosting',
  },

  // ── RECHTLICHES ──────────────────────────────────────────────────────────
  '/impressum': {
    title: 'Impressum — Stoppclock',
    description: 'Impressum von Stoppclock gemäß TMG.',
    canonical: '/impressum',
    lang: 'de',
    noindex: true,
  },
  '/datenschutz': {
    title: 'Datenschutz — Stoppclock',
    description: 'Datenschutzerklärung von Stoppclock. Wie wir mit deinen Daten umgehen.',
    canonical: '/datenschutz',
    lang: 'de',
    noindex: true,
  },
  '/imprint': {
    title: 'Imprint — Stoppclock',
    description: 'Legal imprint of Stoppclock.',
    canonical: '/imprint',
    lang: 'en',
    noindex: true,
  },
  '/privacy': {
    title: 'Privacy Policy — Stoppclock',
    description: 'Privacy policy and data protection information for Stoppclock.',
    canonical: '/privacy',
    lang: 'en',
    noindex: true,
  },
  '/about': {
    title: 'Über Stoppclock — Das Projekt | Stoppclock',
    description: 'Über Stoppclock. Projektorfreundliche Timer und Uhren. Open-Source-Gedanke, datenschutzorientiert, werbefinanziert.',
    keywords: 'über stoppclock, stoppclock projekt',
    canonical: '/about',
    lang: 'de',
  },
  '/contact': {
    title: 'Kontakt — Stoppclock',
    description: 'Kontaktiere das Stoppclock-Team. Feedback, Fragen, Kooperationsanfragen.',
    canonical: '/contact',
    lang: 'de',
  },
};

// =============================================================================
// PUBLIC API
// =============================================================================

const DEFAULT_SEO: SEOConfig = {
  title: 'Stoppclock — Kostenloser Online Timer',
  description: 'Kostenloser Online Timer ohne Download. Pomodoro, Countdown, Stoppuhr & mehr.',
  ogImage: DEFAULT_OG_IMAGE,
  lang: 'de',
};

/** SEO-Konfiguration für eine Route holen */
export function getSEOForRoute(route: string): SEOConfig {
  return SEO_ROUTES[route] ?? DEFAULT_SEO;
}

/** Vollständige Canonical-URL für eine Route */
export function getCanonicalUrl(route: string): string {
  const config = getSEOForRoute(route);
  const path = config.canonical ?? route;
  return `${BASE_URL}${path}`;
}

/** OG-Bild-URL (immer absolut) */
export function getOgImageUrl(route: string): string {
  const config = getSEOForRoute(route);
  const image = config.ogImage ?? DEFAULT_OG_IMAGE;
  return image.startsWith('http') ? image : `${BASE_URL}${image}`;
}

/** Alle konfigurierten Routen (für Sitemap-Generierung) */
export function getAllSEORoutes(): Array<{ route: string; config: SEOConfig }> {
  return Object.entries(SEO_ROUTES).map(([route, config]) => ({ route, config }));
}

/** Prüft ob eine Route noindex ist */
export function isNoindexRoute(route: string): boolean {
  return SEO_ROUTES[route]?.noindex === true;
}
