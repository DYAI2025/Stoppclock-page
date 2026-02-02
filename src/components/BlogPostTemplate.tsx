import React, { useEffect } from 'react';
import { HomeButton } from './HomeButton';
import { renderSection, generateFAQSchema } from './blog-sections';
import type { BlogPostContent, FAQSectionProps } from '../types/blog-types';

interface BlogPostTemplateProps {
  post: BlogPostContent;
}

export const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({ post }) => {
  const { frontmatter, schema, sections } = post;

  useEffect(() => {
    document.title = frontmatter.title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', frontmatter.description);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && frontmatter.keywords) {
      metaKeywords.setAttribute('content', frontmatter.keywords.join(', '));
    }

    const faqSection = sections.find((s) => s.type === 'faq');
    const faqSchema = faqSection
      ? generateFAQSchema((faqSection.props as FAQSectionProps).items)
      : null;

    const combinedSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          headline: frontmatter.title,
          description: frontmatter.description,
          image: frontmatter.image || `https://stoppclock.com/og/${frontmatter.slug}.png`,
          author: {
            '@type': 'Organization',
            name: frontmatter.author || 'Stoppclock',
          },
          datePublished: frontmatter.publishedAt,
          dateModified: frontmatter.updatedAt || frontmatter.publishedAt,
          inLanguage: 'de-DE',
          ...(schema || {}),
        },
        ...(faqSchema ? [faqSchema] : []),
      ],
    };

    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.textContent = JSON.stringify(combinedSchema);
    document.head.appendChild(scriptTag);

    return () => {
      document.head.removeChild(scriptTag);
    };
  }, [frontmatter, schema, sections]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <article className="blog-post-page">
      <HomeButton position="top-left" showLabel={true} />

      <header className="blog-post-header">
        <div className="blog-meta">
          {frontmatter.category && (
            <span className="blog-category">{frontmatter.category}</span>
          )}
          <span className="blog-date">{formatDate(frontmatter.publishedAt)}</span>
          {frontmatter.readingTime && (
            <span className="blog-reading-time">{frontmatter.readingTime} min Lesezeit</span>
          )}
        </div>

        <h1>{frontmatter.title}</h1>

        <p className="blog-description">{frontmatter.description}</p>
      </header>

      <div className="blog-content">
        {sections.map((section, index) => renderSection(section, index))}
      </div>

      <footer className="blog-post-footer">
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="blog-tags">
            {frontmatter.tags.map((tag) => (
              <a key={tag} href={`#/blog?tag=${tag}`} className="blog-tag">
                #{tag}
              </a>
            ))}
          </div>
        )}

        {frontmatter.updatedAt && (
          <p className="blog-updated">
            <em>Zuletzt aktualisiert: {formatDate(frontmatter.updatedAt)}</em>
          </p>
        )}

        {frontmatter.relatedPosts && frontmatter.relatedPosts.length > 0 && (
          <div className="blog-related">
            <h3>Weitere Artikel</h3>
            <ul>
              {frontmatter.relatedPosts.map((slug) => (
                <li key={slug}>
                  <a href={`#/blog/${slug}`}>{slug.replace(/-/g, ' ')}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="blog-back-cta">
          <a href="#/" className="btn btn-secondary">
            &larr; Zurück zu allen Timern
          </a>
        </div>
      </footer>
    </article>
  );
};

export default BlogPostTemplate;
