// Blog post metadata and types
export interface BlogPostFrontmatter {
  title: string;
  slug: string;
  description: string; // Meta description
  image?: string; // OG image
  imageAlt?: string;
  author?: string;
  publishedAt: string; // ISO 8601
  updatedAt?: string;
  readingTime?: number; // minutes
  category?: string;
  tags?: string[];
  keywords?: string[]; // SEO keywords
  internalLinks?: Array<{
    text: string;
    url: string;
  }>;
  relatedPosts?: string[]; // slugs
}

export interface BlogPost extends BlogPostFrontmatter {
  content: string; // HTML or markdown
  wordCount: number;
}

export interface BlogIndex {
  posts: BlogPostFrontmatter[];
  categories: Record<string, number>;
  tags: Record<string, number>;
}

// For SEO metadata
export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  url: string;
  published: string;
  updated?: string;
  author?: string;
  canonical?: string;
}

// Section-based blog content types for registry system
export type BlogSectionType =
  | 'quick-answer'
  | 'text'
  | 'cta'
  | 'comparison-table'
  | 'faq'
  | 'stats';

export interface QuickAnswerSectionProps {
  heading?: string;
  summary: string;
  bulletPoints?: Array<{ label: string; value: string }>;
}

export interface TextSectionProps {
  html: string;
}

export interface CTASectionProps {
  heading?: string;
  description?: string;
  buttons: Array<{
    label: string;
    href: string;
    variant?: 'primary' | 'secondary';
    emoji?: string;
  }>;
  backgroundColor?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  heading?: string;
  items: FAQItem[];
}

export interface ComparisonTableProps {
  heading?: string;
  headers: string[];
  rows: Array<{
    aspect: string;
    values: string[];
  }>;
}

export interface StatsSectionProps {
  heading?: string;
  stats: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
}

export interface BlogSection {
  type: BlogSectionType;
  heading?: string;
  props: QuickAnswerSectionProps | TextSectionProps | CTASectionProps | FAQSectionProps | ComparisonTableProps | StatsSectionProps;
}

export interface BlogPostContent {
  frontmatter: BlogPostFrontmatter;
  schema?: Record<string, unknown>;
  sections: BlogSection[];
}

export type BlogPostRegistry = Record<string, BlogPostContent>;
