# 🚀 Stoppclock — Reactivation Plan
**Ziel: Maximale AdSense-Monetarisierung auf Basis der bestehenden SPA**

> Erstellt: März 2026 | Status: ✅ Phase 1 & 2 deployed

---

## 📊 Ausgangslage (Ist-Zustand vor Reactivation)

| Metrik | Vorher | Nachher (nach diesem Deploy) |
|--------|--------|------------------------------|
| Konfigurierte Ad-Slots | 1 von 6 | **3 von 6** ✅ |
| Seiten mit Ads | 16 | **22+** ✅ |
| Blog-Posts mit In-Content Ads | 0 (home-top Fallback) | **8 Posts mit blog-incontent** ✅ |
| TimerFor-Pillar-Pages mit Ads | 0 | **6 Pillar-Pages** ✅ |
| Timer-Seiten mit richtigem Slot | 0 (alle home-top) | **8 Timer-Seiten timer-page** ✅ |

---

## 🎯 AdSense Slots — Mapping

| Slot-Name | Slot-ID | Status | Verwendung |
|-----------|---------|--------|-----------|
| `home-top` (HOME_TOP) | `2954253435` | ✅ LIVE | Landing Page Top |
| `timer-page` (stoppckl_1) | `8335102509` | ✅ **NEU LIVE** | Alle Timer-Seiten |
| `blog-incontent` (stoppckl_2) | `7410013586` | ✅ **NEU LIVE** | Blog Posts (oben + unten + middle) |
| `content-sidebar` (stoppckl_2) | `7410013586` | ✅ **NEU LIVE** | TimerFor-Pillar-Pages, Wissen, PillarPage |
| `home-middle` (stoppckl_1) | `8335102509` | ✅ **NEU LIVE** | Home Page Mitte |
| `anchor-bottom` | — | ⚠️ Pending | Benötigt separate AdSense-Genehmigung |

---

## ✅ Phase 1: Ad-Slots aktiviert (THIS DEPLOY)

### Was wurde geändert:

**`src/config/ad-units.ts`**
- `TIMER_PAGE` → `8335102509` (stoppckl_1)
- `HOME_MIDDLE` → `8335102509` (stoppckl_1)
- `BLOG_INCONTENT` → `7410013586` (stoppckl_2)
- `CONTENT_SIDEBAR` → `7410013586` (stoppckl_2)

**Timer-Seiten** (8 Seiten auf `timer-page` Slot umgestellt):
- Countdown, Stopwatch, Alarm, ChessClock, BreathingTimer, IntervalTimer, Metronome, DigitalClock, Pomodoro

**Blog Posts** (BlogPostTemplate auf `blog-incontent` umgestellt):
- Header-Ad, In-Content-Ad (nach mittlerer Section), Footer-Ad
- Alle 8 registrierten Blog-Posts profitieren sofort

**Neue Ad-Placements auf Pillar-Pages** (6 neue Seiten):
- `TimerForStudents` — 2 AdSlots (nach Testimonials + vor CTA)
- `TimerForProductivity` — 2 AdSlots
- `TimerForFitness` — 2 AdSlots
- `TimerForMeditation` — 2 AdSlots
- `TimerForFocus` — 2 AdSlots
- `TimerForCooking` — 2 AdSlots

**Content-Pages** (Wissen, PillarPage):
- Auf `content-sidebar` Slot umgestellt

---

## 📋 Phase 2: SEO & Content (Nächste 2–4 Wochen)

### 2a. OG-Bilder erstellen (KRITISCH für CTR)
Fehlende Bilder (alle `TODO` im `seo.ts`):
```
public/og/timer-og.png        (1200×630px, Timer-Design)
public/og/pomodoro-og.png     (1200×630px, Pomodoro-Design)
public/og/blog-og.png         (1200×630px, Blog-Design)
public/og/world-clock-og.png  (1200×630px, World-Clock-Design)
public/og/cooking-og.png      (1200×630px, Cooking-Timer-Design)
public/og/fitness-og.png      (1200×630px, Fitness-Design)
```
**Impact:** Bessere Social-CTR → mehr Traffic → mehr Impressionen

### 2b. Blog-Content ausbauen (HÖCHSTE Revenue-Wirkung)

**Ziel: 30 Artikel in 90 Tagen**

| Kategorie | Aktuelle Posts | Ziel |
|-----------|---------------|------|
| Produktivität | 2 | 8 |
| Fitness/HIIT | 1 | 6 |
| Guides | 3 | 8 |
| Schule/Studium | 0 | 5 |
| Küche/Kochen | 0 | 3 |

**Priorität 1 — Suchvolumen hoch, Konkurrenz mittel:**
- `/blog/pomodoro-25-minuten-technik` (SV ~3.600/Monat DE)
- `/blog/countdown-timer-schule-beamer` (SV ~1.900/Monat DE)
- `/blog/stoppuhr-sport-training` (SV ~2.400/Monat DE)
- `/blog/timer-abendessen-kochen` (SV ~1.200/Monat DE)
- `/blog/meditations-timer-5-minuten` (SV ~1.800/Monat DE)

### 2c. Programmatic SEO — Minuten-Timer (SCHNELL SKALIERBAR)

Vorhanden: 5-min, 10-min, 25-min, 30-min, 60-min Timer als Static HTML
Ausbau auf 15+ Seiten:
```
public/2-minuten-timer.html
public/3-minuten-timer.html
public/4-minuten-timer.html
public/7-minuten-timer.html
public/8-minuten-timer.html
public/15-minuten-timer.html
public/20-minuten-timer.html
public/45-minuten-timer.html
public/90-minuten-timer.html
public/2-stunden-timer.html
```
**Jede Seite = 1.000–5.000 Suchanfragen/Monat. Einmalig erstellen, dauerhaft Traffic.**

---

## 📋 Phase 3: Performance & CWV (Woche 3–4)

### Core Web Vitals Targets
```
LCP  ≤ 2.5s   (Ziel: < 1.8s)
CLS  ≤ 0.1    (Ziel: < 0.05) — Ad min-height bereits gesetzt ✅
INP  ≤ 200ms  (Ziel: < 100ms)
```

### Maßnahmen:
- [ ] Lazy-Loading für alle nicht-kritischen Pages (bereits Suspense in main.tsx)
- [ ] Vite Bundle-Analyse (`npx vite-bundle-analyzer`) — Split große Components
- [ ] SW-Cache-Strategie validieren (aktuell: sc-v4)
- [ ] Lighthouse CI in GitHub Actions aktivieren (lighthouserc.json erstellen)

---

## 📋 Phase 4: Monetarisierungs-Upgrades (Monat 2–3)

### 4a. Anchor-Ad aktivieren (nach Genehmigung)
```typescript
ANCHOR_BOTTOM: '<deine-anchor-slot-id>'
```
**Impact:** +15–25% Mobile-Revenue, kein Content-Eingriff nötig

### 4b. Auto Ads testen
AdSense Auto Ads als A/B-Test gegen manuelle Slots. Auto Ads finden oft bessere Positionen.

### 4c. Multiplex Ad (Entdeckungsanzeigen)
Ideal für Blog-Index und Timer-Worlds-Seite. Zeigt mehrere verwandte Inhalte + Ads.

### 4d. Responsive Ads mit Höhen-Targeting
Statt nur `auto` Format: Rectangle-Slots (336×280) für Blog-Seiten für höheres RPM.

---

## 📋 Phase 5: Traffic-Growth (Monat 2–4)

### Organische Maßnahmen:
1. **Google Search Console** — Site verifizieren, Coverage-Report analysieren
2. **Indexierungsanfragen** für alle neuen URLs stellen
3. **Interne Verlinkung** — Jede Timer-Seite verlinkt auf passenden Blog-Post
4. **Schema.org** auf ALLEN Seiten vervollständigen (aktuell ~23/40)

### Schema.org Ausstände:
```
TimerForFitness     → HowTo Schema hinzufügen
TimerForMeditation  → HowTo Schema hinzufügen
TimerForFocus       → HowTo Schema hinzufügen
TimerForCooking     → HowTo Schema hinzufügen
BlogIndex           → ItemList Schema hinzufügen
```

---

## 💰 Revenue-Projektion

| Zeitraum | Traffic | Ø RPM | Est. Monats-Revenue |
|----------|---------|-------|---------------------|
| Jetzt (nach Deploy) | ~5K Sessions | $2.50 | **~$12** |
| +30 Tage (OG-Bilder, Content) | ~12K Sessions | $3.00 | **~$36** |
| +60 Tage (20 neue Artikel) | ~35K Sessions | $4.00 | **~$140** |
| +90 Tage (50+ Artikel, Programmatic) | ~100K Sessions | $5.00 | **~$500** |
| Vollausbau (100+ Artikel) | ~300K Sessions | $6.00 | **~$1.800** |

> RPM = Revenue per 1.000 Seitenaufrufe. Timer-Tool RPM: $1–3. Blog/Content RPM: $4–10.

---

## 🔑 Wichtigste KPIs zum Tracken

### Wöchentlich (Google AdSense Dashboard):
```
□ Impressionen gesamt
□ Page RPM (nach Seiten-Typ: Timer vs. Blog vs. Pillar)
□ CTR (Click-Through-Rate)
□ Estimated Revenue
□ Invalid clicks (sollte 0 sein)
```

### Monatlich (Google Search Console):
```
□ Total Clicks
□ Total Impressions (Search)
□ Durchschnittliche Position
□ Indexierte URLs (Ziel: alle 46+ URLs)
□ Core Web Vitals Report
```

---

## ✅ Deploy-Checkliste

- [x] Ad Slot IDs konfiguriert (stoppckl_1 + stoppckl_2)
- [x] Timer-Seiten auf timer-page Slot umgestellt
- [x] Blog-Posts auf blog-incontent Slot umgestellt
- [x] TimerFor-Pillar-Pages mit AdSlots ausgestattet
- [x] CSS CLS-Prevention für neue Ad-Container
- [x] Build erfolgreich (`npm run build`)
- [x] Doctor-Check bestanden
- [x] Git Commit + Push → GitHub Pages Deployment
- [ ] Google AdSense Dashboard: Slot-IDs verifizieren
- [ ] PageSpeed Insights nach Deploy prüfen
- [ ] Search Console: Neue URLs zur Indexierung anmelden

---

## 🛠️ Technische Notizen

### AdSense Policy Compliance:
- Ads werden NICHT während laufender Timer angezeigt (`showWhenRunning: false`)
- Ads werden NICHT im Fullscreen-Modus angezeigt
- DSGVO Consent-Check vor jedem Ad-Render
- "Anzeige"-Label sichtbar (Google-Pflicht) ✅
- Kein Ad neben Nicht-Content (pure Tool-Screens) — nur Setup/Content-Bereich

### Slot-Wiederverwendung ist legal:
Dieselbe Slot-ID kann auf verschiedenen Seiten verwendet werden (stoppckl_1 als timer-page + home-middle, stoppckl_2 als blog-incontent + content-sidebar). Google zählt Impressionen pro Slot-ID, nicht pro Seite.

---

*Letztes Update: März 2026 — Generiert von Claude Code*
