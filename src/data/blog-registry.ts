import { BlogPostFrontmatter } from '../types/blog-types';

export const BLOG_POSTS: BlogPostFrontmatter[] = [
  {
    title: "Pomodoro Timer Online - Kostenlos, Effektiv, Ohne Anmeldung",
    slug: "pomodoro-timer-online",
    description: "Lerne wie du mit einem Pomodoro Timer produktiver wirst. Perfekt für Studieren, Arbeiten und Konzentration.",
    publishedAt: "2025-11-04",
    updatedAt: "2025-12-31",
    readingTime: 8,
    category: "Pomodoro",
    tags: ["pomodoro", "timer", "produktivität", "fokus"],
    image: "/og/pomodoro-timer.png"
  },
  {
    title: "Countdown Timer Anleitung – So nutzt du ihn richtig",
    slug: "countdown-timer-guide",
    description: "Der ultimative Guide zum Countdown Timer. Wann ist er besser als Pomodoro? Wie stellst du ihn effektiv ein?",
    publishedAt: "2025-10-15",
    readingTime: 6,
    category: "Guides",
    tags: ["countdown", "guide", "produktivität"],
  },
  {
    title: "Timer für Studenten – Effizient lernen",
    slug: "timer-for-students",
    description: "Wie Studenten mit Timern bessere Noten schreiben. Lernmethoden, Pausenmanagement und Fokus-Strategien.",
    publishedAt: "2025-09-20",
    readingTime: 10,
    category: "Lernen",
    tags: ["studenten", "lernen", "pomodoro", "timer"],
  },
  {
    title: "Pomodoro vs Countdown – Der Unterschied erklärt",
    slug: "pomodoro-vs-countdown",
    description: "Was ist besser für deine Aufgabe? Wir vergleichen die beiden beliebtesten Timer-Methoden.",
    publishedAt: "2025-11-10",
    readingTime: 5,
    category: "Vergleich",
    tags: ["pomodoro", "countdown", "vergleich"],
  }
];

// Helper to get counts
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

  return { categories, tags };
}
