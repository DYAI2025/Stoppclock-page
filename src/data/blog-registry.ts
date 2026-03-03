import { BlogPostFrontmatter } from '../types/blog-types';

/**
 * Blog-Registry — Zentrales Verzeichnis aller Blog-Posts
 *
 * WICHTIG: Diese Liste IMMER synchron mit blog-content/index.ts halten!
 * Wenn ein neuer Post in index.ts hinzugefügt wird, muss er auch hier erscheinen.
 *
 * Sortierung: Neueste zuerst (nach publishedAt)
 */
export const BLOG_POSTS: BlogPostFrontmatter[] = [
  // ── Neue Posts 2026 ────────────────────────────────────────────────────
  {
    title: 'Schachuhr Online — Regeln, Zeitkontrollen & Nutzung',
    slug: 'schachuhr-regeln-online',
    description: 'Alle Schachuhr-Regeln erklärt. Blitz, Rapid, Classical. Wie man eine digitale Schachuhr nutzt. Mit kostenloser Online-Schachuhr.',
    publishedAt: '2026-02-20',
    updatedAt: '2026-03-01',
    readingTime: 8,
    category: 'Spiele',
    tags: ['schach', 'schachuhr', 'timer', 'spielregeln'],
    image: '/og/timer-og.png',
    keywords: ['schachuhr online', 'schachuhr regeln', 'chess clock'],
  },
  {
    title: 'Intervalltimer für HIIT & Fitness — Der richtige Timer 2026',
    slug: 'intervalltimer-hiit',
    description: 'Welcher Intervalltimer ist der beste für HIIT, Tabata und Krafttraining? Work/Rest-Zyklen und Tipps für dein Home-Workout.',
    publishedAt: '2026-02-10',
    updatedAt: '2026-03-01',
    readingTime: 7,
    category: 'Fitness',
    tags: ['hiit', 'intervalltimer', 'fitness', 'workout'],
    image: '/og/fitness-og.png',
    keywords: ['intervalltimer hiit', 'tabata timer', 'workout timer'],
  },
  {
    title: 'Online Wecker ohne App — Browser-Alarm 2026',
    slug: 'online-wecker-ohne-app',
    description: 'Warum ein Browser-Wecker praktischer ist als eine App. Wie man ihn richtig nutzt und was du beachten musst.',
    publishedAt: '2026-02-01',
    updatedAt: '2026-03-01',
    readingTime: 6,
    category: 'Guides',
    tags: ['alarm', 'wecker', 'browser', 'online'],
    image: '/og/timer-og.png',
    keywords: ['online wecker', 'alarm ohne app', 'browser wecker'],
  },
  {
    title: 'Countdown Timer für Klassen & Schulen — Lehrer-Guide 2026',
    slug: 'countdown-timer-klasse',
    description: 'Wie Lehrer und Schüler Timer im Unterricht einsetzen. Beamer-Modus, stille Anzeige, Prüfungs-Timer.',
    publishedAt: '2026-01-20',
    updatedAt: '2026-03-01',
    readingTime: 8,
    category: 'Bildung',
    tags: ['schule', 'lehrer', 'timer', 'prüfung'],
    image: '/og/timer-og.png',
    keywords: ['countdown timer klasse', 'prüfungs timer schule', 'lehrer timer'],
  },
  {
    title: 'Stoppuhr Online — Der ultimative Guide 2026',
    slug: 'stoppuhr-online-guide',
    description: 'Alles über die digitale Stoppuhr: Wann sie besser ist als ein Timer, wie man Laps nutzt, wofür sie sich eignet.',
    publishedAt: '2026-01-15',
    updatedAt: '2026-03-01',
    readingTime: 7,
    category: 'Guides',
    tags: ['stoppuhr', 'timer', 'sport', 'produktivität'],
    image: '/og/timer-og.png',
    keywords: ['stoppuhr online', 'digitale stoppuhr', 'lap timer'],
  },

  // ── Bestehende Posts ────────────────────────────────────────────────────
  {
    title: 'Pomodoro vs Countdown — Was wann nutzen?',
    slug: 'pomodoro-vs-countdown',
    description: 'Was ist besser für deine Aufgabe? Wir vergleichen die beiden beliebtesten Timer-Methoden.',
    publishedAt: '2025-11-10',
    updatedAt: '2025-12-31',
    readingTime: 5,
    category: 'Vergleich',
    tags: ['pomodoro', 'countdown', 'vergleich'],
    keywords: ['pomodoro vs countdown', 'timer vergleich'],
  },
  {
    title: 'Pomodoro Timer Online — Der ultimative Guide 2026',
    slug: 'pomodoro-timer-online',
    description: 'Wie du mit einem Pomodoro Timer produktiver wirst. Kostenlos, ohne Anmeldung, direkt im Browser.',
    publishedAt: '2025-11-04',
    updatedAt: '2025-12-31',
    readingTime: 8,
    category: 'Pomodoro',
    tags: ['pomodoro', 'timer', 'produktivität', 'fokus'],
    image: '/og/pomodoro-og.png',
    keywords: ['pomodoro guide', 'pomodoro technik', 'pomodoro timer online'],
  },
];

/** Blog-Statistiken für Blog-Übersicht */
export function getBlogStats() {
  const categories: Record<string, number> = {};
  const tags: Record<string, number> = {};

  BLOG_POSTS.forEach(post => {
    if (post.category) {
      categories[post.category] = (categories[post.category] || 0) + 1;
    }
    post.tags?.forEach(tag => {
      tags[tag] = (tags[tag] || 0) + 1;
    });
  });

  return { categories, tags, total: BLOG_POSTS.length };
}
