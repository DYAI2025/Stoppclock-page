# Blog Post SEO Checklist
**Für jeden Blog-Artikel vor Veröffentlichung durchgehen!**

---

## 📝 CONTENT & KEYWORDS

### Title Tag (H1 + Browser Tab)
- [ ] **Length:** 50-60 characters (optimal für Google)
- [ ] **Primary keyword** am Anfang oder in erster Hälfte
- [ ] **Unique:** Kein anderer Artikel hat gleichen Title
- [ ] **Compelling:** User wollen draufklicken (CTR)

**Beispiel:**
```
✅ RICHTIG: "Pomodoro Timer Online - Kostenlos, Effektiv, Ohne Anmeldung"
❌ FALSCH: "Pomodoro" (zu kurz, keine Beschreibung)
```

### Meta Description
- [ ] **Length:** 150-160 characters (Google truncates beyond 160)
- [ ] **Contains primary keyword**
- [ ] **Compelling:** Reason to click
- [ ] **Includes benefit:** Was gewinnt der Reader?

**Template:**
```
Lerne [Benefit] mit [Primary Keyword]. [Hook/Proof]. [CTA].
```

**Beispiel:**
```
✅ "Lerne wie du mit einem Pomodoro Timer produktiver wirst.
   Kostenlos, ohne Anmeldung, direkt im Browser. Perfekt für
   Studieren, Arbeiten und Konzentration."
```

### Headings & Structure
- [ ] **H1 einmal:** Am Anfang des Artikels (gleich oder ähnlich wie Title Tag)
- [ ] **H2s:** Logische Abschnitte (max. 2-3 zwischen H2s)
- [ ] **H3s:** Unter-Punkte (optional)
- [ ] **Consistent:** No jumping from H2 to H4

**Beispiel Struktur:**
```
# H1: Pomodoro Timer Online - Kostenlos, Effektiv...

## H2: Was ist die Pomodoro-Technik?
### H3: Warum funktioniert Pomodoro?
### H3: Geschichte der Technik?

## H2: 5 Schritte zum erfolgreichen Pomodoro
### H3: Schritt 1: Wähle eine Aufgabe
### H3: Schritt 2: Starte den Timer
...

## H2: FAQ
```

### Content Length & Depth
- [ ] **Minimum:** 1,500 words (authority content)
- [ ] **Optimum:** 2,000-2,500 words (comprehensive)
- [ ] **Covers intent:** Antwortet wirklich auf die Frage?
- [ ] **Actionable:** Reader kann sofort etwas damit tun?

**Word Count prüfen:**
```bash
# Terminal command (wenn nötig)
wc -w /path/to/article.md
```

### Keywords & Semantic
- [ ] **Primary keyword:** 1-2% der Wörter (natürlich, nicht forciert!)
- [ ] **LSI keywords:** Verwandte Begriffe (z.B. "Pomodoro-Technik", "25 Minuten Timer", "Pausen")
- [ ] **Keyword variations:** Singular + Plural, Umb. etc.
- [ ] **Natural language:** Liest sich wie echtes Deutsch, nicht "SEO-Spam"

---

## 🔗 INTERNAL LINKING

### Link Quantity & Quality
- [ ] **Minimum 3 internal links** (optimal: 3-5)
- [ ] **Maximum 5 links pro 1,500 Wörter** (sonst wirkt spammig)
- [ ] **Links sind relevant** zum Kontext
- [ ] **Link text ist descriptive** (nicht "click here", sondern "Pomodoro Timer starten")

### Link Destinations
- [ ] **Links zu Timer-Pages:** z.B. `#/pomodoro`, `#/countdown`
- [ ] **Links zu verwandten Artikeln:** z.B. "Pomodoro vs Countdown"
- [ ] **Links zu Landing Pages:** z.B. `/timer-for-students/`
- [ ] **Anchor text enthält Keywords** (wenn natürlich möglich)

**Beispiel:**
```markdown
❌ FALSCH: "[Klick hier](/#/pomodoro)"
✅ RICHTIG: "[Starte unseren Pomodoro Timer](/#/pomodoro)"
```

### External Links
- [ ] **Minimum 2 external links** (zu autoritativen Quellen)
- [ ] **Zu Wikipedia, Studien, oder established brands**
- [ ] **Links sind relevant** zum Thema
- [ ] **Links öffnen in neuem Tab** (wenn mit `target="_blank"`)

**Beispiel:**
```markdown
✅ "Weitere Infos auf [Wikipedia: Pomodoro Technique](https://...)"
✅ "Studien zeigen: [Research Gate Link](https://...)"
```

---

## 📸 MEDIA & IMAGES

### Featured Image
- [ ] **Image present:** Blog-Post hat Hero-Image am Anfang
- [ ] **Size:** Mind. 1200x630px (OG-optimiert)
- [ ] **Format:** PNG (transparent) oder JPG (fotos)
- [ ] **Compressed:** <500KB file size (PageSpeed!)
- [ ] **Alt-text:** Beschreibend, nicht "image123"

**Alt-text Beispiel:**
```
❌ FALSCH: alt="image"
✅ RICHTIG: alt="Pomodoro Timer UI mit 25-Minuten Countdown auf Stoppclock"
```

### Body Images
- [ ] **Relevant zu Content:** Jedes Bild hat Sinn
- [ ] **Compressed:** <200KB pro Image
- [ ] **Lazy loading:** `loading="lazy"` auf Bildern
- [ ] **Descriptive alt-text:** Für Accessibility + SEO
- [ ] **Not too many:** Max. 5-8 Bilder pro 2000 Wörter

### Image Guidelines
- Screenshots müssen clear sein (min. 72 DPI)
- Tabellen/Charts als Bild besser lesbar
- Brand logo/timer screenshots zeigen, wie es aussieht

---

## 📊 STRUCTURED DATA & SCHEMA

### BlogPosting Schema
- [ ] **Markup present** in page `<head>`
- [ ] **Contains:**
  - `headline` (H1)
  - `description` (Meta Description)
  - `image` (Featured Image URL)
  - `author` (Author Name)
  - `datePublished` (ISO 8601 format)
  - `dateModified` (wenn updated)

**Template:**
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Pomodoro Timer Online - Kostenlos...",
  "description": "Lerne wie du...",
  "image": "https://stoppclock.com/blog/pomodoro-hero.png",
  "author": {
    "@type": "Organization",
    "name": "Stoppclock"
  },
  "datePublished": "2025-11-04",
  "dateModified": "2025-11-04"
}
```

### BreadcrumbList Schema
- [ ] **Markup present** für Navigation
- [ ] **Items:**
  - Home → "https://stoppclock.com"
  - Blog → "https://stoppclock.com/blog"
  - Article Title → current URL

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://stoppclock.com"},
    {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://stoppclock.com/blog"},
    {"@type": "ListItem", "position": 3, "name": "Pomodoro Timer Online", "item": "https://stoppclock.com/blog/pomodoro-timer-online"}
  ]
}
```

### FAQPage Schema (if article has FAQ)
- [ ] **Used if article has FAQ section**
- [ ] **Each Q&A pair has schema**
- [ ] **Proper formatting**

---

## 🚀 TECHNICAL SEO

### Meta Tags
- [ ] **Viewport:** `<meta name="viewport" content="width=device-width">`
- [ ] **Charset:** `<meta charset="utf-8">`
- [ ] **Language:** `<html lang="de">` (German)
- [ ] **Canonical:** `<link rel="canonical" href="...">`

### Performance
- [ ] **Lighthouse Score:** >90 (check on PageSpeed Insights)
- [ ] **Core Web Vitals:**
  - [ ] LCP (Largest Contentful Paint): <2.5s
  - [ ] FID (First Input Delay): <100ms
  - [ ] CLS (Cumulative Layout Shift): <0.1
- [ ] **Page Size:** <3MB (ideally <1MB)
- [ ] **Images compressed:** WebP or optimized JPG

### Mobile Friendliness
- [ ] **Mobile viewport:** Properly sized
- [ ] **Touch targets:** Min. 44x44px
- [ ] **Readable font:** Min. 16px base
- [ ] **No intrusive interstitials**

### Page Speed Tools
```
1. PageSpeed Insights: https://pagespeed.web.dev
2. GTmetrix: https://gtmetrix.com
3. WebPageTest: https://webpagetest.org
```

---

## 📱 MOBILE & ACCESSIBILITY

### WCAG Compliance
- [ ] **Headings:** Proper hierarchy (no jumps)
- [ ] **Contrast:** Text readable (4.5:1 for body, 3:1 for headers)
- [ ] **Links:** Underlined or clearly distinct
- [ ] **Images:** All have alt-text
- [ ] **Form inputs:** Have labels

### Mobile Testing
- [ ] **Test on actual mobile device** (not just DevTools)
- [ ] **Portrait + Landscape:** Both work
- [ ] **Touch-friendly:** Easy to tap links/buttons
- [ ] **Readable:** No zooming needed for text

**Mobile Testing Tools:**
```
1. Chrome DevTools: F12 → Responsive Design Mode
2. Google Mobile-Friendly Test
3. Real device testing (iPhone/Android)
```

---

## 📈 ANALYTICS & TRACKING

### Google Analytics Tags
- [ ] **GA4 tag present** on page
- [ ] **Event tracking:** Click on timer links tracked
- [ ] **Scroll depth:** Tracked (how far users scroll)
- [ ] **Time on page:** Measured

### UTM Parameters
- [ ] **Share links include UTM:**
  - `?utm_source=blog`
  - `&utm_medium=article`
  - `&utm_campaign=pomodoro`

**Example:**
```
https://stoppclock.com/#/pomodoro?utm_source=blog&utm_medium=article&utm_campaign=pomodoro_timer_online
```

### GSC (Google Search Console)
- [ ] **Article URL added to GSC** (in post-publication)
- [ ] **"Request Indexing"** button clicked
- [ ] **Canonical URL** set correctly (usually self-referencing)

---

## ✍️ WRITING QUALITY

### Grammar & Style
- [ ] **Spell check:** No typos (use Grammarly or similar)
- [ ] **German grammar:** Proper case, articles, etc.
- [ ] **Tone:** Friendly, helpful, not salesy
- [ ] **Consistency:** same terminology throughout

### Readability
- [ ] **Paragraphs:** Short (2-4 sentences max)
- [ ] **Scannable:** Bold/italics for key points
- [ ] **Lists:** Use bullet points for clarity
- [ ] **Conclusion:** Summarize main points

**Readability Score:**
Use Hemingway Editor (online free) to check readability.

---

## 🎯 CTA & CONVERSION

### Call-to-Action
- [ ] **CTA present:** "Try the timer", "Learn more", etc.
- [ ] **CTA links to timer:** e.g., `#/pomodoro`
- [ ] **CTA is prominent:** Bold, colored, or button-styled
- [ ] **CTA appears multiple times:** Intro + middle + end

### User Journey
- [ ] **Article leads to timer:** Logical next step
- [ ] **Timer link is direct:** No extra clicks
- [ ] **Landing pages linked:** For related solutions

**Example CTA:**
```
🔥 Ready? [Start our Pomodoro Timer now](/#/pomodoro) 🍅
```

---

## 📋 PRE-PUBLICATION CHECKLIST

### Content Review
- [ ] Proof-read artikel einmal mehr
- [ ] Grammar/spell check durchgeführt
- [ ] All links tested (gehen sie wohin?)
- [ ] Images loaded richtig
- [ ] Formatting korrekt (bold, italics, lists)

### SEO Review
- [ ] Title: 50-60 chars ✓
- [ ] Meta description: 150-160 chars ✓
- [ ] H1 present + optimized ✓
- [ ] Internal links: 3+ ✓
- [ ] External links: 2+ ✓
- [ ] Images with alt-text ✓
- [ ] Schema markup ✓

### Technical Review
- [ ] Lighthouse score >90 ✓
- [ ] Mobile friendly ✓
- [ ] Page speed acceptable ✓
- [ ] Canonical URL set ✓
- [ ] Analytics tags present ✓

### Marketing Review
- [ ] Featured image prepared
- [ ] Social media description drafted
- [ ] CTA buttons are clickable
- [ ] Related articles linked

---

## 📤 PUBLICATION CHECKLIST

### Before Going Live
- [ ] Article scheduled or set to publish
- [ ] URL slug finalized (no changes after!)
- [ ] Canonical URL correct
- [ ] Featured image uploaded & linked

### After Publication
- [ ] [ ] Article live (check live URL)
- [ ] [ ] Internal links working
- [ ] [ ] External links valid
- [ ] [ ] Images loading
- [ ] [ ] Mobile view checked
- [ ] [ ] Schema markup valid (schema.org validator)
- [ ] [ ] GSC: "Request Indexing" submitted

### Promotion (First 24 hours)
- [ ] [ ] Social media posts scheduled
- [ ] [ ] Internal linking from homepage
- [ ] [ ] Link added to blog index/archive
- [ ] [ ] Related articles updated with link back

---

## ✅ FINAL SIGN-OFF

```
Author: _______________
Date: _______________
All checks passed: ☐ YES ☐ NO

If NO, address issues before publication.
```

---

## 🔄 POST-PUBLICATION MONITORING (First 2 weeks)

### Week 1
- [ ] Check GSC for indexing status
- [ ] Monitor keyword rankings (Rank Tracker)
- [ ] Check Google Analytics for traffic
- [ ] Fix any crawl errors in GSC

### Week 2
- [ ] Update meta description if CTR is low (<2%)
- [ ] Add more internal links if bounce rate is high
- [ ] Check if related articles got linked
- [ ] Monitor backlinks (if any)

---

**Use this checklist for every blog article!** ✅
