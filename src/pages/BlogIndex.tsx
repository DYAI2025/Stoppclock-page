import React from 'react';
import { HomeButton } from '../components/HomeButton';
import BlogList from '../components/BlogList';
import { AdUnit } from '../components/AdUnit';
import { getAdUnit } from '../config/ad-units';
import { BLOG_POSTS, getBlogStats } from '../data/blog-registry';

export default function BlogIndex() {
  const { categories, tags } = getBlogStats();
  
  return (
    <div className="blog-index-page">
       <HomeButton />
       {/* hori2 — Horizontal Banner über Blog-Liste */}
       <div className="hori2-banner hori2-banner--top">
         <AdUnit adUnit={getAdUnit('hori2')!} showLabel={true} />
       </div>
       <BlogList posts={BLOG_POSTS} categories={categories} tags={tags} />
       {/* hori2 — Horizontal Banner unter Blog-Liste */}
       <div className="hori2-banner hori2-banner--bottom">
         <AdUnit adUnit={getAdUnit('hori2')!} showLabel={true} />
       </div>
    </div>
  );
}
