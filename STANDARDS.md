# Stoppclock — Projektstandards & Single Source of Truth
> Version 2.0 | Stand: März 2026 | Verbindlich für alle Beiträge

---

## 🏗️ Architektur-Übersicht

```
stoppclock.com/
├── / (React SPA, Hash-Routing: /#/route)
│   ├── /#/countdown         Timer-Seiten
│   ├── /#/stopwatch
│   ├── /#/pomodoro
│   ├── ...
│   ├── /#/blog/             Blog-Routen
│   └── /#/timer-for-...     Use-Case-Landing-Pages
│
└── /static-pages/           Standalone HTML für SEO
    ├── /5-minuten-timer      → public/5-minuten-timer.html
    ├── /10-minuten-timer     → public/10-minuten-timer.html
    ├── /25-minuten-timer     → public/25-minuten-timer.html
    ├── /30-minuten-timer     → public/30-minuten-timer.html
    ├── /60-minuten-timer     → public/60-minuten-timer.html
    ├── /stoppuhr             → public/stoppuhr.html
    └── ...
```

---

## 🎯 Single Source of Truth

### SEO-Konfiguration
**→ `src/config/seo.ts`** (EINZIGE Quelle für alle SEO-Daten)
- Title, Description, Keywords, canonical, ogImage pro Route
- `useSEO.ts` liest ausschließlich von hier
- Niemals direkt in Komponenten SEO-Tags setzen

### AdSense-Konfiguration
**→ `src/config/ad-units.ts`** (EINZIGE Quelle für Ad-Slots)
- Publisher-ID, Slot-IDs, Visibility-Rules
- `isSlotConfigured()` immer vor Render aufrufen
- Neue Slots zuerst hier dokumentieren, DANN im AdSense Dashboard erstellen

### Blog-Content
**→ `src/data/blog-content/index.ts`** (Registry aller Posts)
**→ `src/data/blog-registry.ts`** (Frontmatter-Liste, immer sync halten!)

### App-Routing
**→ `src/main.tsx`** (Router-Definition)

---

## 📏 Code-Standards

### TypeScript
```typescript
// ✅ Gut: Nullcheck vor AdUnit
const adUnit = getAdUnit('home-top');
if (adUnit) return <AdUnit adUnit={adUnit} />;

// ❌ Schlecht: Non-null Assertion ohne Gewissheit
return <AdUnit adUnit={getAdUnit('some-maybe-unit')!} />;

// ✅ Gut: isSlotConfigured prüfen
if (!isSlotConfigured(slot.adSlotId)) return null;
```

### React-Komponenten
```
PascalCase.tsx          — Alle Komponenten
use*.ts                 — Alle Hooks
kebab-case.css          — CSS-Dateien pro Komponente
```

### CSS
- Design-Tokens aus `src/design-tokens.css` verwenden (`var(--fg)`, `var(--bg)` etc.)
- Keine Inline-Styles außer für dynamische Werte (z.B. timer.color von user-input)
- AdSense Container: IMMER `min-height: 90px` oder mehr (CLS-Prevention)

---

## 🔒 AdSense-Regeln (PFLICHT)

### Die 5 Gebote der AdSense-Compliance

1. **Kein Doppel-Render** — Eine Slot-ID darf pro Seite NUR EINMAL in `adsbygoogle.push({})` gehen
2. **Kein Render ohne Consent** — AdUnit.tsx prüft Consent; trotzdem niemals direkt `ins.adsbygoogle` außerhalb der Komponente rendern
3. **Kein Render bei leerem Slot** — `isSlotConfigured()` prüft 10-stellige Ziffernfolge; leere Strings → kein Render
4. **Kein Fullscreen-Ad** — `showInFullscreen: false` ist Standard, nie überschreiben
5. **Kein Timer-Running-Ad** (spezielle Timer-Seiten) — Respektiere `showWhenRunning` Regel

### Ad-Placement-Standards

| Placement | Slot | max-width | min-height | showWhenRunning |
|-----------|------|-----------|------------|-----------------|
| Home Top | `home-top` | 970px | 90px | true |
| Home Middle | `home-middle` | 970px | 250px | true |
| Timer-Seite | `timer-page` | 800px | 90px | false |
| Blog-Artikel | `blog-incontent` | 100% | 250px | true |
| Anchor Bottom | `anchor-bottom` | 728px | 90px | false |

### Neue Ad-Slot einrichten:
```bash
# 1. Im AdSense Dashboard: Ads > By ad unit > Display ads
# 2. Name: stoppclock_<placement>_<position>
# 3. Slot-ID (10 Ziffern) in src/config/ad-units.ts eintragen
# 4. AD_UNITS Array ergänzen
# 5. Test: npm run build && npm run preview → Prüfen ob slot in DOM erscheint
```

---

## 🔍 SEO-Regeln

### Meta-Tag Standards
```
Title:       max 60 Zeichen | Format: "[Hauptkeyword] — Stoppclock"
Description: 120-160 Zeichen | Enthält immer Hauptkeyword + CTA
Keywords:    3-5 Begriffe | KEIN Keyword-Stuffing
Canonical:   Immer absolute URL: https://www.stoppclock.com/route
```

### Neue Route hinzufügen — Checkliste:
- [ ] Route in `src/main.tsx` registrieren
- [ ] SEO-Config in `src/config/seo.ts` unter `SEO_ROUTES` hinzufügen
- [ ] Route in `public/sitemap.xml` hinzufügen
- [ ] Redirect-Script in `index.html` prüfen (falls clean URL → hash route)
- [ ] og:image kategoriespezifisch wählen (aus `OG_IMAGES` in seo.ts)

### Neuen Blog-Post hinzufügen — Checkliste:
- [ ] Content-Datei erstellen: `src/data/blog-content/<kategorie>/<slug>.ts`
- [ ] In `src/data/blog-content/index.ts` registrieren
- [ ] In `src/data/blog-registry.ts` als Frontmatter eintragen (neueste zuerst!)
- [ ] SEO-Config in `src/config/seo.ts` unter `/blog/<slug>` hinzufügen
- [ ] In `public/sitemap.xml` hinzufügen
- [ ] Playwright-Test: `slug` in `BLOG_SLUGS` Array in `tests/e2e/13-blog-posts.spec.ts` eintragen

### Content-Qualitäts-Mindeststandards:
```
Wortanzahl:          ≥ 800 Wörter (Blog-Post)
Abschnitte:          ≥ 4 Sections (quick-answer, text, faq, cta)
FAQ-Items:           ≥ 4 Fragen
Interne Links:       ≥ 3 Links zu anderen Timer-Seiten
CTA-Button:          Mindestens 1 primärer CTA auf relevante Timer-Seite
```

### Neue statische Landingpage hinzufügen:
- [ ] `public/<keyword>.html` erstellen (nach Muster von `25-minuten-timer.html`)
- [ ] Muss enthalten: title, description, canonical, og-tags, JSON-LD, H1, Content (≥ 300 Wörter), FAQ, CTA zur App
- [ ] In `public/sitemap.xml` eintragen
- [ ] In `tests/e2e/14-static-pages.spec.ts` zur STATIC_PAGES-Liste hinzufügen

---

## 🧪 Test-Standards

### Pflicht-Tests vor jedem Merge
```bash
npm run test:e2e                    # Alle E2E-Tests
# Kritische Test-Suites:
# 11-adsense-policy.spec.ts         AdSense Compliance
# 12-seo-meta-tags.spec.ts          SEO-Korrektheit
# 13-blog-posts.spec.ts             Blog-Integrität
# 14-static-pages.spec.ts           Static Pages
```

### Test-Naming-Konvention
```
NN-feature-area.spec.ts
└── NN = zweistellige Nummer (01, 02, ... 14, 15)
└── feature-area = kebab-case Bereich
```

### Was getestet werden MUSS:
- Jeder neue Blog-Post → `13-blog-posts.spec.ts` erweitern
- Jede neue statische Seite → `14-static-pages.spec.ts` erweitern
- Jede neue AdUnit → `11-adsense-policy.spec.ts` prüfen
- Jede neue Route → `12-seo-meta-tags.spec.ts` ergänzen

---

## 🔄 Deployment-Workflow

```bash
# Development
npm run dev

# Vor Commit
npm run doctor        # Forbidden-Tokens-Check
npm run build         # Build (generiert auch Sitemap)
npm run preview       # Preview-Server auf :4173

# Tests (erfordern Preview-Server)
npm run test:e2e      # Alle Tests
npm run test:e2e:ui   # Tests mit GUI

# Deployment (Netlify)
# Automatisch via Git-Push auf main
# _redirects sorgt für SPA-Routing
```

### Sitemap aktualisieren:
```bash
# Manuell beim Hinzufügen neuer Seiten:
node scripts/gen-sitemap.mjs

# ODER: Direkt in public/sitemap.xml editieren
# Wichtig: lastmod immer auf aktuelles Datum setzen!
```

---

## 📦 Dependency-Standards

### Installieren von neuen Paketen:
```bash
# Nur nach Team-Abstimmung
# Präferenz: Wenig Dependencies, Browser-APIs bevorzugen
npm install <paket> --save       # Runtime
npm install <paket> --save-dev   # Dev/Test
```

### Verbotene Patterns:
```typescript
// ❌ Kein document.write()
// ❌ Kein eval()
// ❌ Keine Inline Event-Handler in JSX
// ❌ Keine console.log() in Production (nur console.error, console.warn)
// ❌ Kein dangerouslySetInnerHTML außer in Blog-Content-Renderer
```

---

## 🔐 Security-Standards

### Content Security Policy (CSP)
Gedefault in `index.html`. Neue externe Scripts müssen:
1. In der CSP allowlist eingetragen werden
2. Auf Trust Level geprüft werden
3. In der Datenschutzerklärung dokumentiert werden

### DSGVO-Compliance
- Keine personenbezogenen Daten ohne Consent
- Analytics nur nach `consent.analyticsEnabled === true`
- AdSense nur nach `consent.adsEnabled === true`
- LocalStorage nur für App-Funktionalität (keine Tracking-Daten)

---

## 📈 Performance-Budgets

| Metric | Ziel | Maximum |
|--------|------|---------|
| LCP | < 2.5s | < 4.0s |
| INP | < 200ms | < 500ms |
| CLS | < 0.1 | < 0.25 |
| Bundle Size | < 200KB (gzip) | < 350KB |
| Image WebP | Alle neuen Bilder | — |

---

## 🤖 AI-Assistenten-Regeln

Wenn Claude Code (oder ähnliche AI) an diesem Projekt arbeitet:

1. **IMMER** `src/config/seo.ts` aktualisieren wenn neue Routen hinzugefügt werden
2. **IMMER** Sitemap aktualisieren wenn neue Seiten erstellt werden
3. **NIEMALS** direkte `document.title` Setzer außerhalb von `useSEO.ts` hinzufügen
4. **NIEMALS** `adsbygoogle.push({})` direkt in Komponenten schreiben (nur über `AdUnit.tsx` oder `AdSlot.tsx`)
5. **IMMER** `isSlotConfigured()` prüfen bevor Ad-Rendering
6. **NIEMALS** Fake/Placeholder Slot-IDs (wie '1234567890') committen
7. **IMMER** Playwright-Tests für neue Blog-Posts und Seiten erweitern
8. Nach größeren Änderungen: `npm run build` ausführen und Build-Fehler fixen

---

*Zuletzt aktualisiert: März 2026 | Maintainer: Stoppclock-Team*
