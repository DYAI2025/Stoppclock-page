import React, { useState } from 'react';
import { BlogPostFrontmatter } from '../types/blog-types';

interface BlogListProps {
  posts: BlogPostFrontmatter[];
  categories?: Record<string, number>;
  tags?: Record<string, number>;
}

const BlogList: React.FC<BlogListProps> = ({ posts, categories = {}, tags = {} }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = posts.filter(post => {
    if (selectedCategory && post.category !== selectedCategory) return false;
    if (selectedTag && !post.tags?.includes(selectedTag)) return false;
    return true;
  });

  return (
    <div className="blog-list-page">
      <header className="blog-list-header">
        <h1>Stoppclock Blog</h1>
        <p>Tipps, Guides und Wissen rund um Timer & Zeitmanagement</p>
      </header>

      {/* Filters */}
      <aside className="blog-filters">
        {/* Categories */}
        {Object.keys(categories).length > 0 && (
          <div className="filter-group">
            <h3>Kategorien</h3>
            <button
              className={!selectedCategory ? 'active' : ''}
              onClick={() => setSelectedCategory(null)}
            >
              Alle
            </button>
            {Object.entries(categories).map(([cat, count]) => (
              <button
                key={cat}
                className={selectedCategory === cat ? 'active' : ''}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat} ({count})
              </button>
            ))}
          </div>
        )}

        {/* Tags */}
        {Object.keys(tags).length > 0 && (
          <div className="filter-group">
            <h3>Tags</h3>
            {Object.entries(tags)
              .sort((a, b) => b[1] - a[1]) // Sort by count descending
              .slice(0, 10) // Top 10
              .map(([tag, count]) => (
                <button
                  key={tag}
                  className={selectedTag === tag ? 'active' : ''}
                  onClick={() => setSelectedTag(tag)}
                >
                  #{tag} ({count})
                </button>
              ))}
          </div>
        )}
      </aside>

      {/* Blog Post List */}
      <main className="blog-post-list">
        {filteredPosts.length === 0 ? (
          <p className="no-posts">Keine Artikel gefunden.</p>
        ) : (
          <div className="posts-grid">
            {filteredPosts.map(post => (
              <article key={post.slug} className="blog-post-card">
                {post.image && (
                  <a href={`#/blog/${post.slug}`} className="post-image-link">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                    />
                  </a>
                )}

                <div className="post-content">
                  <div className="post-meta">
                    <span className="post-category">{post.category}</span>
                    <span className="post-date">
                      {new Date(post.publishedAt).toLocaleDateString('de-DE', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <h2>
                    <a href={`#/blog/${post.slug}`}>{post.title}</a>
                  </h2>

                  <p className="post-description">{post.description}</p>

                  <div className="post-footer">
                    {post.readingTime && (
                      <span className="reading-time">
                        {post.readingTime} min Lesezeit
                      </span>
                    )}
                    <a href={`#/blog/${post.slug}`} className="read-more">
                      Mehr lesen →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogList;
