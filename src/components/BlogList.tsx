import React, { useState } from 'react';
import { BlogPostFrontmatter } from '../types/blog-types';

interface BlogListProps {
  posts: BlogPostFrontmatter[];
  categories?: Record<string, number>;
  tags?: Record<string, number>;
}

const BlogList: React.FC<BlogListProps> = ({ posts, categories = {}, tags = {} }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const hash = window.location.hash;
    const qIdx = hash.indexOf('?');
    if (qIdx !== -1) {
       const params = new URLSearchParams(hash.substring(qIdx));
       return params.get('category');
    }
    return null;
  });
  // Initialize from URL via simple window check or prop? 
  // Let's use a prop `initialTag` if we add it, or just read from URL here if we want to be self-contained.
  // But the parent BlogIndex is parsing URL.
  // Ideally we change Props.
  const [selectedTag, setSelectedTag] = useState<string | null>(() => {
    const hash = window.location.hash;
    const qIdx = hash.indexOf('?');
    if (qIdx !== -1) {
       const params = new URLSearchParams(hash.substring(qIdx));
       return params.get('tag');
    }
    return null;
  });

  // Sync with URL when state changes
  React.useEffect(() => {
    if (selectedTag) {
        // We can't easily push to hash without avoiding reload/jump if using hash router naively?
        // But here we are just reacting.
        // If we want to support back button, we should listen to URL.
        // For now, let's just let the internal state drive the view and maybe update URL?
        // Requirement: "Implement query param filtering (?tag=...)".
        // This usually implies URL -> State.
    }
  }, [selectedTag]);

  // Listen to hash change to update state if URL changes externally (e.g. back button)
  React.useEffect(() => {
    const handleHashChange = () => {
        const hash = window.location.hash;
        const qIdx = hash.indexOf('?');
        if (qIdx !== -1) {
            const params = new URLSearchParams(hash.substring(qIdx));
            const t = params.get('tag');
            const c = params.get('category');
            if (t !== selectedTag) setSelectedTag(t);
            if (c !== selectedCategory) setSelectedCategory(c);
        } else {
            if (selectedTag !== null) setSelectedTag(null);
            if (selectedCategory !== null) setSelectedCategory(null);
        }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [selectedTag, selectedCategory]);

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
              onClick={() => {
                setSelectedCategory(null);
                const currentPath = window.location.hash.split('?')[0];
                // Should we keep tags? Maybe. But usually clicking "All" clears category.
                // If tag is present, we might want to keep it or clear it?
                // For simplicity, let's clear category query param.
                const params = new URLSearchParams(window.location.hash.split('?')[1]);
                params.delete('category');
                const newSearch = params.toString();
                window.location.hash = newSearch ? `${currentPath}?${newSearch}` : currentPath;
              }}
            >
              Alle
            </button>
            {Object.entries(categories).map(([cat, count]) => (
              <button
                key={cat}
                className={selectedCategory === cat ? 'active' : ''}
                onClick={() => {
                   setSelectedCategory(cat);
                   const currentPath = window.location.hash.split('?')[0];
                   const params = new URLSearchParams(window.location.hash.split('?')[1]);
                   params.set('category', cat);
                   window.location.hash = `${currentPath}?${params.toString()}`;
                }}
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
                  onClick={() => {
                    const newTag = tag;
                    setSelectedTag(newTag);
                    // Update URL
                    const currentPath = window.location.hash.split('?')[0];
                    window.location.hash = `${currentPath}?tag=${newTag}`;
                  }}
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
