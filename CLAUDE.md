# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Verbindliche Anweisungen für Claude Code bei der Arbeit an diesem Projekt

---

## Projekt-Kontext

Stoppclock ist eine React 18/TypeScript-SPA (Vite + SWC) mit handgeschriebenem Hash-Routing (`/#/route`).
**Deployment:** Netlify (auto-deploy auf `main`) | **URL:** https://www.stoppclock.com

---

## Pflicht-Lektüre vor Änderungen

1. `STANDARDS.md` — alle Code/SEO/Ad-Standards (verbindlich)
2. `IMPLEMENTATION_PLAN.md` — Architekturentscheidungen und Begründungen
3. `DEAD_ENDS.md` — bekannte Navigation-Gaps und tote Links

---

## Build & Test

```bash
npm run dev          # Dev-Server (Vite)
npm run build        # Pipeline: parse-timer-worlds → vite build → gen-sitemap
npm run preview      # Preview auf :4173

# Unit Tests (Vitest)
npm run test         # Vitest im Watch-Mode
npm run test:ui      # Vitest mit Browser-UI

# E2E Tests (Playwright — erfordern laufenden Preview-Server auf :4173)
npx vite preview --port 4173 &
npx playwright test                                        # Alle Tests
npx playwright test tests/e2e/11-adsense-policy.spec.ts    # Einzelne Suite
npm run test:e2e:ui                                        # Playwright mit GUI

npm run doctor       # Forbidden-Token-Check (scannt nach Fake-Slot-IDs etc.)
```

### Build-Pipeline Detail
`npm run build` führt drei Schritte aus:
1. `scripts/parse-timer-worlds.mjs` — generiert Timer-World-Daten aus Markdown
2. `vite build` — React-Bundle + Statische Assets
3. `scripts/gen-sitemap.mjs` — generiert `dist/sitemap.xml` aus Routes

---

## Kritische Regeln

### AdSense (NIEMALS verletzen)
```
❌ NIEMALS adsbygoogle.push() direkt in Komponenten
❌ NIEMALS <ins class="adsbygoogle"> außerhalb von AdUnit.tsx / AdSlot.tsx
❌ NIEMALS AdSense-Script in index.html hardcoden (DSGVO-Verstoß!)
❌ NIEMALS Fake-Slot-IDs committen (z.B. '1234567890')
✅ IMMER isSlotConfigured() prüfen bevor Ad gerendert wird
✅ IMMER getAdUnit() oder getBestAdUnitForPage() verwenden
```

### SEO (IMMER synchron halten)
```
Wenn eine neue Route hinzugefügt wird, MÜSSEN aktualisiert werden:
  1. src/config/seo.ts        → SEO_ROUTES eintragen
  2. public/sitemap.xml       → <url> hinzufügen
  3. tests/e2e/12-seo-meta-tags.spec.ts → falls getestet werden soll
```

### Blog-Posts (vollständige Checkliste)
```
Wenn ein neuer Blog-Post erstellt wird:
  1. src/data/blog-content/<kategorie>/<slug>.ts erstellen
  2. src/data/blog-content/index.ts  → importieren + registrieren
  3. src/data/blog-registry.ts       → Frontmatter eintragen (neueste zuerst!)
  4. src/config/seo.ts               → /blog/<slug> eintragen
  5. public/sitemap.xml              → <url> hinzufügen
  6. tests/e2e/13-blog-posts.spec.ts → slug zu BLOG_SLUGS hinzufügen

Erlaubte Section-Typen: quick-answer | text | cta | faq | comparison-table | stats
Props für comparison-table: { headers: string[], rows: [{aspect, values}] }
Props für stats: { stats: [{value, label, description?}] }
```

---

## Architektur

### Routing
Kein Router-Library — handgeschriebener Hash-Router in `src/main.tsx` via `useHashRoute()`.
Alle Seiten außer `LandingPage` sind lazy-loaded (`React.lazy`). Die Not-Found-Logik ist ein
manuelles Exclude-Array am Ende der Route-Matches in `App()`.

Neue Route hinzufügen:
1. Lazy-Import oben in `main.tsx`
2. Route-Match im `<Suspense>`-Block
3. Slug zum Not-Found-Exclude-Array hinzufügen
4. SEO + Sitemap aktualisieren (siehe Checkliste oben)

### Single Source of Truth
| Thema | Datei |
|-------|-------|
| SEO-Metadaten | `src/config/seo.ts` |
| AdSense-Slots | `src/config/ad-units.ts` |
| Blog-Registry | `src/data/blog-content/index.ts` + `src/data/blog-registry.ts` |
| App-Routing | `src/main.tsx` |
| Design-Tokens | `src/design-tokens.css` (CSS Custom Properties: `--fg`, `--bg`, etc.) |
| Consent-State | `src/utils/consent.ts` (LocalStorage-basiert) |

### Ad-Infrastruktur
```
AdSlot.tsx (neu, bevorzugt)   → placement-basiert, CLS-safe, consent-aware
AdUnit.tsx (bestehend)         → unit-basiert, consent-aware
AdSenseScript.tsx              → Lädt AdSense-Script dynamisch NUR nach Consent
NICHT: <ins> direkt / push() direkt
```

### DSGVO/Consent-Flow
`AdSenseScript` (in `main.tsx` eingebunden) prüft `loadConsent().adsEnabled` und lädt
das AdSense-Script erst nach Consent. `ConsentBanner` ist Fallback wenn Google Funding
Choices nicht aktiv ist. Alle Ad-Komponenten prüfen Consent intern.

### Warum Hash-Routing
Hash-Routing bleibt aus pragmatischen Gründen (kein SSR-Umbau). SEO erfolgt über:
1. Statische HTML-Landingpages in `/public/*.html` (direkt indexierbar)
2. JavaScript-Rendering der SPA-Routen (Google rendert JS)
3. Korrekte canonical-URLs in `useSEO.ts`

### Content-Pipelines
- **Blog:** TS-Dateien in `src/data/blog-content/<kategorie>/` → registriert in `index.ts` → gerendert über `DynamicBlogRouter` + `BlogPostTemplate`
- **Timer Worlds:** Markdown → `scripts/parse-timer-worlds.mjs` (Build-Time) → JSON → `TimerWorldsIndex`
- **Facts:** `scripts/parse-facts.mjs` → `FactsPage`
- **Static SEO Pages:** Standalone HTML in `public/` (z.B. `25-minuten-timer.html`)

---

## Häufige Fallstricke

```typescript
// ❌ FALSCH — Non-null assertion bei potentiell unconfigured slots
<AdUnit adUnit={getAdUnit('timer-page')!} />

// ✅ RICHTIG — Nullcheck
const adUnit = getAdUnit('timer-page');
if (adUnit) return <AdUnit adUnit={adUnit} />;

// ❌ FALSCH — Direktes document.title setzen (wird von useSEO überschrieben)
document.title = 'Mein Titel';

// ✅ RICHTIG — In seo.ts eintragen, useSEO setzt es automatisch

// ❌ FALSCH — Fake-Slot-ID
adSlotId: '1234567890'  // Sieht valide aus, ist aber fake!

// ✅ RICHTIG — Leerer String für nicht-konfigurierte Slots
adSlotId: ''  // isSlotConfigured() gibt false zurück → kein Render

// ❌ FALSCH — Neue Route ohne Not-Found-Exclude
// Route matcht, aber Not-Found-Div rendert AUCH weil Slug nicht im Array

// ✅ RICHTIG — Slug zum Exclude-Array in main.tsx hinzufügen
```

---

*Zuletzt aktualisiert: März 2026*
