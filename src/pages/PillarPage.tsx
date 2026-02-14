import { useState } from 'react';
import { HomeButton } from '../components/HomeButton';
import { AdUnit } from '../components/AdUnit';
import { getAdUnit } from '../config/ad-units';
import { Gauge, Search, Compass, FileText, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import '../styles/pillar-page.css';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const navigationItems: NavItem[] = [
  { id: 'overview', label: 'Overview', href: '#overview' },
  { id: 'features', label: 'Key Features', href: '#features' },
  { id: 'performance', label: 'Performance', href: '#performance' },
  { id: 'seo', label: 'SEO & Analytics', href: '#seo' },
  { id: 'location', label: 'Location & Access', href: '#location' },
  { id: 'related', label: 'Related Resources', href: '#related' },
];

const features = [
  {
    icon: Gauge,
    title: 'Core Web Vitals',
    description: 'Optimized for LCP, INP, and CLS with performance budgets per module and lazy-loaded assets.',
  },
  {
    icon: Search,
    title: 'SEO Optimized',
    description: 'Schema markup for FAQ, HowTo, Event, and Place entities with semantic HTML5 structure.',
  },
  {
    icon: Compass,
    title: 'Smart Navigation',
    description: 'Three-tier hierarchy with contextual cross-linking and mandatory backlinks for better UX.',
  },
  {
    icon: FileText,
    title: 'Information Dense',
    description: 'Minimalist yet content-rich presentation with clear visual hierarchy and readable typography.',
  },
];

const stats = [
  { value: '< 2.5s', label: 'LCP Target' },
  { value: '< 200ms', label: 'INP Target' },
  { value: '< 0.1', label: 'CLS Score' },
  { value: '100%', label: 'Accessibility' },
];

export default function PillarPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [tocOpen, setTocOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setTocOpen(false);
  };

  return (
    <div className="pillar-page">
      <HomeButton />

      {/* Hero Section */}
      <section className="pillar-hero">
        <img
          src="https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxjbG9jayUyMHRpbWVyJTIwd29ya3NwYWNlJTIwcHJvZHVjdGl2aXR5fGVufDB8MHx8Ymx1ZXwxNzYyMDM1ODI5fDA&ixlib=rb-4.1.0&q=85"
          alt="Modern minimalist clock or timer concept, professional business setting, clean workspace with time management theme, blue and gold color scheme - Ocean Ng on Unsplash"
          className="pillar-hero-image"
          loading="eager"
          width="1920"
          height="600"
        />
        <div className="pillar-hero-overlay">
          <h1 className="pillar-hero-title">StopClock Pillar Page</h1>
          <p className="pillar-hero-subtitle">
            High-performance timer ecosystem with information-dense content and CLS-safe monetization
          </p>
        </div>
      </section>

      {/* Ad Slot: Below Hero */}
      <div className="pillar-ad-slot hero-below">
        <AdUnit adUnit={getAdUnit('home-top')!} />
      </div>

      {/* Main Container */}
      <div className="pillar-container">
        {/* Sidebar Navigation (Desktop) */}
        <aside className="pillar-sidebar">
          <h2 className="pillar-sidebar-title">Navigation</h2>
          <nav>
            <ul className="pillar-nav-list">
              {navigationItems.map((item) => (
                <li key={item.id} className="pillar-nav-item">
                  <a
                    href={item.href}
                    className={`pillar-nav-link ${activeSection === item.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.id);
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="pillar-main">
          {/* Mobile TOC */}
          <div className="pillar-mobile-toc">
            <button
              className="pillar-toc-toggle"
              onClick={() => setTocOpen(!tocOpen)}
              aria-expanded={tocOpen}
            >
              <span>Table of Contents</span>
              {tocOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            <div className={`pillar-toc-content ${tocOpen ? '' : 'collapsed'}`}>
              <ul className="pillar-nav-list">
                {navigationItems.map((item) => (
                  <li key={item.id} className="pillar-nav-item">
                    <a
                      href={item.href}
                      className={`pillar-nav-link ${activeSection === item.id ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.id);
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="pillar-breadcrumb" aria-label="Breadcrumb">
            <a href="#/">Home</a>
            <span className="pillar-breadcrumb-separator">/</span>
            <span>Pillar Page</span>
          </nav>

          {/* Overview Section */}
          <section id="overview" className="pillar-section">
            <h2 className="pillar-section-title">Overview</h2>
            <div className="pillar-section-content">
              <p>
                Welcome to the StopClock pillar page ecosystem. This page demonstrates a modern,
                information-dense approach to content architecture with focus on performance,
                accessibility, and user experience.
              </p>
              <p>
                Our design philosophy emphasizes clear hierarchy, contextual navigation, and
                CLS-safe ad integration. Every element is optimized for Core Web Vitals while
                maintaining rich, valuable content for users.
              </p>
            </div>

            {/* Stats */}
            <div className="pillar-stats">
              {stats.map((stat, index) => (
                <div key={index} className="pillar-stat">
                  <div className="pillar-stat-value">{stat.value}</div>
                  <div className="pillar-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="pillar-section">
            <h2 className="pillar-section-title">Key Features</h2>
            <div className="pillar-cards-grid">
              {features.map((feature, index) => (
                <div key={index} className="pillar-card">
                  <div className="pillar-card-icon">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="pillar-card-title">{feature.title}</h3>
                  <p className="pillar-card-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Ad Slot: In-Content 1 */}
          <div className="pillar-ad-slot in-content">
            <AdUnit adUnit={getAdUnit('home-middle')!} />
          </div>

          {/* Performance Section */}
          <section id="performance" className="pillar-section">
            <h2 className="pillar-section-title">Performance Optimization</h2>
            <div className="pillar-section-content">
              <p>
                Our performance strategy focuses on three key metrics: Largest Contentful Paint (LCP),
                Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS).
              </p>
              <p>
                <strong>LCP Optimization:</strong> Hero images are loaded with priority, using
                optimized formats and responsive sizing. Target: &lt; 2.5 seconds.
              </p>
              <p>
                <strong>INP Optimization:</strong> JavaScript is minimized and deferred where possible.
                Interactive elements respond within 200ms. Target: &lt; 200ms.
              </p>
              <p>
                <strong>CLS Prevention:</strong> All ad slots have fixed dimensions. Images include
                width/height attributes. Layout shifts are eliminated. Target: &lt; 0.1.
              </p>
            </div>
          </section>

          {/* SEO Section */}
          <section id="seo" className="pillar-section">
            <h2 className="pillar-section-title">SEO & Analytics</h2>
            <div className="pillar-section-content">
              <p>
                Comprehensive schema markup ensures search engines understand our content structure.
                We implement FAQ, HowTo, Event, and Place schemas as appropriate.
              </p>
              <p>
                Our information architecture follows a three-tier hierarchy: Pillar pages lead to
                Hub pages, which connect to Detail pages. Every page includes contextual backlinks
                and related content suggestions.
              </p>
              <p>
                Analytics tracking respects user privacy with GDPR-compliant consent management.
                We monitor scroll depth, ad viewability, and user engagement metrics.
              </p>
            </div>
          </section>

          {/* Location Section with Map */}
          <section id="location" className="pillar-section">
            <h2 className="pillar-section-title">Location & Access</h2>
            <div className="pillar-section-content">
              <p>
                Our services are accessible globally through our web platform. For local events
                and meetups, we provide direct navigation links.
              </p>
            </div>

            {/* Map Preview with Click-to-Load */}
            <div className="pillar-map-container">
              <div className="pillar-map-preview">
                <img
                  src="https://images.unsplash.com/photo-1759802524049-2421ddaee0fe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxtYXAlMjBuYXZpZ2F0aW9uJTIwY2l0eSUyMHN0cmVldHN8ZW58MHwwfHx8MTc2MjAzNTgyOXww&ixlib=rb-4.1.0&q=85"
                  alt="Generic map preview, city streets, navigation concept, clean modern map interface - Vini Brasil on Unsplash"
                  className="pillar-map-preview-image"
                  loading="lazy"
                  width="1200"
                  height="400"
                />
                <div className="pillar-map-overlay">
                  <div className="pillar-map-overlay-text">Click to view interactive map</div>
                  <a
                    href="https://maps.google.com/?q=Berlin,Germany"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pillar-map-cta"
                  >
                    Get Directions <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Ad Slot: In-Content 2 */}
          <div className="pillar-ad-slot in-content">
            <AdUnit adUnit={getAdUnit('setup-main')!} />
          </div>

          {/* Related Resources */}
          <section id="related" className="pillar-section">
            <div className="pillar-related">
              <h2 className="pillar-related-title">Related Resources</h2>
              <ul className="pillar-related-list">
                <li className="pillar-related-item">
                  <a href="#/stopwatch" className="pillar-related-link">
                    <ChevronRight size={16} />
                    Stopwatch Tool
                  </a>
                </li>
                <li className="pillar-related-item">
                  <a href="#/countdown" className="pillar-related-link">
                    <ChevronRight size={16} />
                    Countdown Timer
                  </a>
                </li>
                <li className="pillar-related-item">
                  <a href="#/pomodoro" className="pillar-related-link">
                    <ChevronRight size={16} />
                    Pomodoro Timer
                  </a>
                </li>
                <li className="pillar-related-item">
                  <a href="#/analog" className="pillar-related-link">
                    <ChevronRight size={16} />
                    Analog Countdown
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </main>
      </div>

      {/* Sticky Ad Slots */}
      <div className="pillar-ad-slot sticky-mobile">
        <AdUnit adUnit={getAdUnit('anchor-bottom')!} />
      </div>
      <div className="pillar-ad-slot sticky-desktop">
        <AdUnit adUnit={getAdUnit('setup-main')!} />
      </div>
    </div>
  );
}