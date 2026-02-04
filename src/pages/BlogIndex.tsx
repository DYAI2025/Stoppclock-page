import React from 'react';
import { HomeButton } from '../components/HomeButton';
import BlogList from '../components/BlogList';
import { BLOG_POSTS, getBlogStats } from '../data/blog-registry';

export default function BlogIndex() {
  const { categories, tags } = getBlogStats();
  
  return (
    <div className="blog-index-page">
       <HomeButton />
       <BlogList posts={BLOG_POSTS} categories={categories} tags={tags} />
    </div>
  );
}
