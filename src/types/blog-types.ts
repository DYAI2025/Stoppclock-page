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
