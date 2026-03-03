import type { BlogPostRegistry, BlogPostFrontmatter } from '../../types/blog-types';

// ── Produktivität ───────────────────────────────────────────────────────────
import { pomodoroTimerOnline } from './productivity/pomodoro-timer-online';
import { pomodoroVsCountdown } from './productivity/pomodoro-vs-countdown';

// ── Guides (neue Posts 2026) ────────────────────────────────────────────────
import { stoppuhrOnlineGuide } from './guides/stoppuhr-online-guide';
import { countdownTimerKlasse } from './guides/countdown-timer-klasse';
import { onlineWeckerOhneApp } from './guides/online-wecker-ohne-app';

// ── Fitness ─────────────────────────────────────────────────────────────────
import { intervaltimerHiit } from './fitness/intervalltimer-hiit';

// ── Spiele ──────────────────────────────────────────────────────────────────
import { schachuhrRegelnOnline } from './games/schachuhr-regeln-online';

// =============================================================================
// Blog-Post-Registry — Hier alle Posts registrieren
// Key = slug (URL-Pfad nach /blog/)
// =============================================================================
export const blogPosts: BlogPostRegistry = {
  // Produktivität
  'pomodoro-timer-online': pomodoroTimerOnline,
  'pomodoro-vs-countdown': pomodoroVsCountdown,

  // Guides
  'stoppuhr-online-guide': stoppuhrOnlineGuide,
  'countdown-timer-klasse': countdownTimerKlasse,
  'online-wecker-ohne-app': onlineWeckerOhneApp,

  // Fitness
  'intervalltimer-hiit': intervaltimerHiit,

  // Spiele
  'schachuhr-regeln-online': schachuhrRegelnOnline,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/** Alle Frontmatter-Objekte für den Blog-Index */
export function getAllPostsFrontmatter(): BlogPostFrontmatter[] {
  return Object.values(blogPosts)
    .map((post) => post.frontmatter)
    .sort((a, b) => {
      // Neueste zuerst
      const dateA = new Date(a.updatedAt ?? a.publishedAt).getTime();
      const dateB = new Date(b.updatedAt ?? b.publishedAt).getTime();
      return dateB - dateA;
    });
}

/** Posts nach Kategorie filtern */
export function getPostsByCategory(category: string): BlogPostFrontmatter[] {
  return Object.values(blogPosts)
    .filter((post) => post.frontmatter.category === category)
    .map((post) => post.frontmatter);
}

/** Posts nach Tag filtern */
export function getPostsByTag(tag: string): BlogPostFrontmatter[] {
  return Object.values(blogPosts)
    .filter((post) => post.frontmatter.tags?.includes(tag))
    .map((post) => post.frontmatter);
}

/** Alle einzigartigen Kategorien */
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  Object.values(blogPosts).forEach((post) => {
    if (post.frontmatter.category) categories.add(post.frontmatter.category);
  });
  return Array.from(categories).sort();
}

/** Alle einzigartigen Tags */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  Object.values(blogPosts).forEach((post) => {
    post.frontmatter.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/** Blog-Routen für Sitemap-Generierung */
export function getBlogRoutes(): string[] {
  return Object.keys(blogPosts).map((slug) => `/blog/${slug}`);
}

/**
 * SEO-Daten aller Blog-Posts für useSEO Hook
 * @deprecated Nutze stattdessen src/config/seo.ts direkt
 */
export function getBlogSEOData(): Record<string, { title: string; description: string; keywords?: string }> {
  const seoData: Record<string, { title: string; description: string; keywords?: string }> = {};
  Object.entries(blogPosts).forEach(([slug, post]) => {
    seoData[`/blog/${slug}`] = {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      keywords: post.frontmatter.keywords?.join(', '),
    };
  });
  return seoData;
}

/**
 * Related Posts für einen bestimmten Post holen
 */
export function getRelatedPosts(slug: string, limit = 3): BlogPostFrontmatter[] {
  const post = blogPosts[slug];
  if (!post?.frontmatter.relatedPosts) return [];

  return post.frontmatter.relatedPosts
    .slice(0, limit)
    .map((relatedSlug) => blogPosts[relatedSlug]?.frontmatter)
    .filter((f): f is BlogPostFrontmatter => f !== undefined);
}

/** Gesamtzahl der Blog-Posts */
export function getBlogPostCount(): number {
  return Object.keys(blogPosts).length;
}
