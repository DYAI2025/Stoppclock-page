import type { BlogPostRegistry, BlogPostFrontmatter } from '../../types/blog-types';

// Import all blog posts
import { pomodoroTimerOnline } from './productivity/pomodoro-timer-online';
import { pomodoroVsCountdown } from './productivity/pomodoro-vs-countdown';

// Aggregate all posts into a single registry
export const blogPosts: BlogPostRegistry = {
  'pomodoro-timer-online': pomodoroTimerOnline,
  'pomodoro-vs-countdown': pomodoroVsCountdown,
};

// Helper to get all frontmatter for blog index
export function getAllPostsFrontmatter(): BlogPostFrontmatter[] {
  return Object.values(blogPosts).map((post) => post.frontmatter);
}

// Helper to get posts by category
export function getPostsByCategory(category: string): BlogPostFrontmatter[] {
  return Object.values(blogPosts)
    .filter((post) => post.frontmatter.category === category)
    .map((post) => post.frontmatter);
}

// Helper to get posts by tag
export function getPostsByTag(tag: string): BlogPostFrontmatter[] {
  return Object.values(blogPosts)
    .filter((post) => post.frontmatter.tags?.includes(tag))
    .map((post) => post.frontmatter);
}

// Get all unique categories
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  Object.values(blogPosts).forEach((post) => {
    if (post.frontmatter.category) {
      categories.add(post.frontmatter.category);
    }
  });
  return Array.from(categories);
}

// Get all unique tags
export function getAllTags(): string[] {
  const tags = new Set<string>();
  Object.values(blogPosts).forEach((post) => {
    post.frontmatter.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
}

// Get blog routes for sitemap generation
export function getBlogRoutes(): string[] {
  return Object.keys(blogPosts).map((slug) => `/blog/${slug}`);
}

// Get SEO data for all posts
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
