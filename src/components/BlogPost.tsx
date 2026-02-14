import React from 'react';
import { BlogPostFrontmatter } from '../types/blog-types';

interface BlogPostProps {
  post: BlogPostFrontmatter & { content: string };
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  return (
    <article className="blog-post">
      {/* SEO Metadata - rendered in head by parent */}

      {/* Header */}
      <header className="blog-post-header">
        <div className="blog-meta">
          <span className="blog-category">{post.category || 'Timer'}</span>
          <span className="blog-date">
            {new Date(post.publishedAt).toLocaleDateString('de-DE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          {post.readingTime && (
            <span className="blog-reading-time">{post.readingTime} min Lesezeit</span>
          )}
        </div>

        <h1 className="blog-title">{post.title}</h1>
        <p className="blog-description">{post.description}</p>
      </header>

      {/* Featured Image */}
      {post.image && (
        <figure className="blog-featured-image">
          <img
            src={post.image}
            alt={post.imageAlt || post.title}
            loading="lazy"
          />
        </figure>
      )}

      {/* Content */}
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <footer className="blog-footer">
          <div className="blog-tags">
            {post.tags.map(tag => (
              <a
                key={tag}
                href={`#/blog?tag=${encodeURIComponent(tag)}`}
                className="blog-tag"
              >
                #{tag}
              </a>
            ))}
          </div>

          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <section className="blog-related">
              <h3>Verwandte Artikel</h3>
              <ul>
                {post.relatedPosts.map(slug => (
                  <li key={slug}>
                    <a href={`#/blog/${slug}`}>
                      {/* Title would be fetched from post index */}
                      {slug}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </footer>
      )}

      {/* CTA - Back to Home */}
      <div className="blog-cta">
        <a href="#/" className="btn btn-primary">
          ← Zurück zu allen Timern
        </a>
      </div>
    </article>
  );
};

export default BlogPost;
