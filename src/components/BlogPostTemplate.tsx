import React, { useEffect } from 'react';
import { HomeButton } from './HomeButton';
import { AdUnit } from './AdUnit';
import { getAdUnit } from '../config/ad-units';
import { renderSection, generateFAQSchema } from './blog-sections';
import { getRelatedPosts } from '../data/blog-content';
import type { BlogPostContent, FAQSectionProps } from '../types/blog-types';

interface BlogPostTemplateProps {
  post: BlogPostContent;
}

export const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({ post }) => {
  const { frontmatter, schema, sections } = post;

  // JSON-LD Structured Data — BlogPosting + FAQPage Schema
  useEffect(() => {
    document.title = frontmatter.title;

    const faqSection = sections.find((s) => s.type === 'faq');
    const faqSchema = faqSection
      ? generateFAQSchema((faqSection.props as FAQSectionProps).items)
      : null;

    const blogPostingSchema = {
      '@type': 'BlogPosting',
      '@id': `https://www.stoppclock.com/blog/${frontmatter.slug}`,
      headline: frontmatter.title,
      description: frontmatter.description,
      image: frontmatter.image || `https://www.stoppclock.com/og/blog-og.png`,
      url: `https://www.stoppclock.com/blog/${frontmatter.slug}`,
      author: {
        '@type': 'Organization',
        name: frontmatter.author || 'Stoppclock',
        url: 'https://www.stoppclock.com',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Stoppclock',
        url: 'https://www.stoppclock.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.stoppclock.com/icons/icon-192.png',
        },
      },
      datePublished: frontmatter.publishedAt,
      dateModified: frontmatter.updatedAt || frontmatter.publishedAt,
      inLanguage: 'de-DE',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://www.stoppclock.com/blog/${frontmatter.slug}`,
      },
      keywords: frontmatter.keywords?.join(', '),
      articleSection: frontmatter.category,
      ...(schema || {}),
    };

    const combinedSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        blogPostingSchema,
        ...(faqSchema ? [faqSchema] : []),
      ],
    };

    const scriptId = `blog-schema-${frontmatter.slug}`;
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(combinedSchema);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) document.head.removeChild(el);
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

  const relatedPosts = getRelatedPosts(frontmatter.slug);

  // Mittlere Section für Blog-Ad (nach dem 3. Abschnitt)
  const adInsertAfterSection = Math.max(2, Math.floor(sections.length / 2));

  return (
    <article className="blog-post-page" itemScope itemType="https://schema.org/BlogPosting">
      <HomeButton position="top-left" showLabel={true} />

      {/* Strukturierte Daten via Microdata (zusätzlich zu JSON-LD) */}
      <meta itemProp="headline" content={frontmatter.title} />
      <meta itemProp="datePublished" content={frontmatter.publishedAt} />
      <meta itemProp="dateModified" content={frontmatter.updatedAt || frontmatter.publishedAt} />
      <meta itemProp="inLanguage" content="de-DE" />
      {frontmatter.image && <meta itemProp="image" content={frontmatter.image} />}

      <header className="blog-post-header">
        <div className="blog-meta">
          {frontmatter.category && (
            <span className="blog-category" itemProp="articleSection">{frontmatter.category}</span>
          )}
          <time className="blog-date" dateTime={frontmatter.publishedAt} itemProp="datePublished">
            {formatDate(frontmatter.publishedAt)}
          </time>
          {frontmatter.readingTime && (
            <span className="blog-reading-time">{frontmatter.readingTime} min Lesezeit</span>
          )}
        </div>

        <h1 itemProp="headline">{frontmatter.title}</h1>

        <p className="blog-description" itemProp="description">{frontmatter.description}</p>

        {/* Ad nach Header — blog-incontent Slot (stoppckl_2) */}
        <div className="blog-ad-header">
          <AdUnit adUnit={getAdUnit('blog-incontent') ?? getAdUnit('home-top')!} showLabel={true} />
        </div>
      </header>

      <div className="blog-content" itemProp="articleBody">
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {renderSection(section, index)}

            {/* Ad nach mittlerer Section */}
            {index === adInsertAfterSection && (
              <div className="blog-ad-incontent">
                <AdUnit adUnit={getAdUnit('blog-incontent') ?? getAdUnit('home-top')!} showLabel={true} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <footer className="blog-post-footer">
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="blog-tags" aria-label="Artikel-Tags">
            {frontmatter.tags.map((tag) => (
              <a key={tag} href={`#/blog?tag=${tag}`} className="blog-tag" rel="tag">
                #{tag}
              </a>
            ))}
          </div>
        )}

        {frontmatter.updatedAt && (
          <p className="blog-updated">
            <em>
              Zuletzt aktualisiert:{' '}
              <time dateTime={frontmatter.updatedAt}>{formatDate(frontmatter.updatedAt)}</time>
            </em>
          </p>
        )}

        {/* Verwandte Artikel — mit echten Titeln */}
        {relatedPosts.length > 0 && (
          <nav className="blog-related" aria-label="Verwandte Artikel">
            <h3>Das könnte dich auch interessieren</h3>
            <ul>
              {relatedPosts.map((related) => (
                <li key={related.slug}>
                  <a href={`#/blog/${related.slug}`}>
                    <strong>{related.title}</strong>
                    <span className="blog-related-desc">{related.description}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Bottom Ad — blog-incontent Slot (stoppckl_2) */}
        <div className="blog-ad-footer">
          <AdUnit adUnit={getAdUnit('blog-incontent') ?? getAdUnit('home-top')!} showLabel={true} />
        </div>

        <div className="blog-back-cta">
          <a href="#/blog" className="btn btn-secondary">
            ← Alle Artikel
          </a>
          <a href="#/" className="btn btn-primary">
            Timers öffnen →
          </a>
        </div>
      </footer>
    </article>
  );
};

export default BlogPostTemplate;
