# Research & Technical Decisions

**Feature**: Google Ads Monetization & Traffic Growth
**Date**: 2025-10-20

## Technical Unknowns Resolved

### 1. Google AdSense Integration Best Practices

**Question**: How to implement AdSense without blocking page load?

**Research Findings**:
- AdSense script should be loaded asynchronously after critical content
- Use `async` attribute on script tag
- Delay injection until after `DOMContentLoaded` or user interaction
- Ad slots can be pre-defined in HTML with `<ins>` tags, scripts fill them later

**Decision**: Inject AdSense script after home page grid renders, use async attribute, pre-define ad slots in HTML.

---

### 2. Google Analytics 4 Setup

**Question**: How to implement GA4 with consent management?

**Research Findings**:
- GA4 uses gtag.js library
- Can be initialized with `consent: 'denied'` by default
- Update consent mode when user accepts: `gtag('consent', 'update', {...})`
- Custom events use `gtag('event', 'event_name', {...})`

**Decision**: Use GA4 with Google Consent Mode v2, initialize with denied consent, update on user acceptance.

---

### 3. Bilingual Blog Architecture

**Question**: Best URL structure for English/German blog?

**Options**:
- `/blog/en/` and `/blog/de/` (subdirectory)
- `/en/blog/` and `/de/blog/` (language prefix)
- `/blog/` with language selector

**Research Findings**:
- Subdirectory (`/blog/en/`) is SEO-friendly and clear
- Requires proper `hreflang` tags for Google
- Language switcher component needed
- Markdown files can be organized by language

**Decision**: Use `/blog/en/` and `/blog/de/` structure with hreflang tags and language switcher component.

---

### 4. Custom Branding Storage

**Question**: How to store custom logos without backend?

**Options**:
- Base64 encode and store in localStorage
- Use File API + IndexedDB for larger files
- External CDN upload (requires backend)

**Research Findings**:
- localStorage limit: 5-10MB (varies by browser)
- Base64 encoding increases size by ~33%
- 500KB image → ~665KB base64 → acceptable for localStorage
- IndexedDB more complex but handles larger files

**Decision**: Start with base64 + localStorage for MVP (500KB limit), can migrate to IndexedDB if users need larger images.

---

### 5. React Router for Blog

**Question**: How to integrate blog routing into existing hash router?

**Current Setup**: Stoppclock uses hash routing (`#/countdown`, `#/stopwatch`)

**Options**:
- Keep hash routing: `#/blog/en/article-slug`
- Migrate to BrowserRouter (requires server config)
- Hybrid: hash for timers, history for blog

**Decision**: Keep hash routing for consistency: `#/blog/en/article-slug`. Simple, no server config needed, preserves existing timer URLs.

---

### 6. Markdown Blog Rendering

**Question**: How to render markdown blog posts in React?

**Options**:
- `react-markdown` library (popular, feature-rich)
- `marked` + `DOMPurify` (lightweight)
- Static generation with Vite plugin

**Research Findings**:
- react-markdown: 50KB bundle, supports GFM, syntax highlighting
- marked: 20KB, simpler, requires sanitization
- Static generation: fastest but requires build-time generation

**Decision**: Use `react-markdown` with `remark-gfm` for GitHub Flavored Markdown support. Trade-off: bundle size for feature completeness and security.

---

### 7. Ad Placement Strategy

**Question**: Which AdSense ad formats for each placement?

**Research Findings**:
- **Home page**: Responsive display ads (auto-sized)
- **Setup screens**: Sidebar + bottom banner ads
- **Interstitials**: Full-width display ads (not pop-ups)
- **Anchor ads**: Official AdSense anchor ad format (bottom sticky)

**Decision**: Use AdSense responsive ad units for automatic sizing across devices.

---

### 8. Performance Monitoring

**Question**: How to ensure Lighthouse >90 with ads?

**Strategy**:
- Measure baseline before ads
- Use Lighthouse CI in GitHub Actions
- Monitor Core Web Vitals: LCP, FID, CLS
- Lazy load ads below fold
- Resource hints: `dns-prefetch` for Google domains

**Decision**: Add Lighthouse CI checks to prevent performance regressions, fail builds if score drops below 90.

---

## Open Technical Risks

### Risk 1: AdSense Policy Compliance
**Risk**: Google may reject new ad placements if they violate policies
**Mitigation**: Follow AdSense placement policies strictly, avoid accidental clicks, test before launch

### Risk 2: localStorage Quota Exceeded
**Risk**: Users with many timers + custom branding could hit localStorage limits
**Mitigation**: Implement quota monitoring, show warning before upload, offer clear/reset option

### Risk 3: Translation Quality
**Risk**: Poor translations could hurt credibility with German audience
**Mitigation**: Use professional translator or high-quality AI with human review, start with fewer high-quality posts

---

## Technology Stack Summary

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Ad Platform | Google AdSense | Already integrated, proven for education sites |
| Analytics | Google Analytics 4 | Industry standard, free, integrates with AdSense |
| Consent | Custom localStorage | Lightweight, no dependencies, GDPR-compliant |
| Blog Rendering | react-markdown | Feature-complete, secure, widely used |
| Blog Storage | Markdown files in repo | Simple, version-controlled, no CMS needed |
| Routing | React Router (hash) | Consistent with existing timer routing |
| Image Storage | base64 + localStorage | No backend needed, sufficient for MVP |
| Styling | Existing CSS tokens | Consistent with current design system |
| i18n | Manual JSON files | Simple, no library overhead for 2 languages |

---

## Next Steps

1. Create data model for consent, branding, blog posts
2. Design API contracts (internal hooks, utility functions)
3. Write detailed implementation plan with file structure
4. Generate task breakdown
