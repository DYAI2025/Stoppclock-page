import React from 'react';
import { blogPosts } from '../data/blog-content';
import BlogPostTemplate from '../components/BlogPostTemplate';
import { HomeButton } from '../components/HomeButton';

interface DynamicBlogRouterProps {
  slug: string;
}

const NotFound: React.FC = () => (
  <div className="blog-post-page">
    <HomeButton position="top-left" showLabel={true} />
    <div className="blog-content" style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1>Artikel nicht gefunden</h1>
      <p>Der gesuchte Blog-Artikel existiert nicht.</p>
      <p>
        <a href="#/blog" className="btn btn-primary">
          Zurück zum Blog
        </a>
      </p>
    </div>
  </div>
);

export const DynamicBlogRouter: React.FC<DynamicBlogRouterProps> = ({ slug }) => {
  const post = blogPosts[slug];

  if (!post) {
    return <NotFound />;
  }

  return <BlogPostTemplate post={post} />;
};

export default DynamicBlogRouter;
