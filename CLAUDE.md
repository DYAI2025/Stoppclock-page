# CLAUDE.md — Stoppclock
> Verbindliche Anweisungen für Claude Code bei der Arbeit an diesem Projekt

---

## Projekt-Kontext

Stoppclock ist eine React/TypeScript-SPA (Vite) mit Hash-Routing (`/#/route`).
**Deployment:** Netlify | **URL:** https://www.stoppclock.com

---

## Pflicht-Lektüre vor Änderungen

1. `STANDARDS.md` — alle Code/SEO/Ad-Standards (verbindlich)
2. `IMPLEMENTATION_PLAN.md` — Architekturentscheidungen und Begründungen

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

## Build-Befehle

```bash
npm run dev          # Dev-Server
npm run build        # Production Build (generiert auch dist/sitemap.xml)
npm run preview      # Preview auf :4173

# Tests (erfordern laufenden Preview-Server auf :4173)
npx vite preview --port 4173 &
npx playwright test tests/e2e/11-adsense-policy.spec.ts   # AdSense Tests
npx playwright test tests/e2e/12-seo-meta-tags.spec.ts    # SEO Tests
npx playwright test tests/e2e/13-blog-posts.spec.ts       # Blog Tests
npx playwright test tests/e2e/14-static-pages.spec.ts     # Static Page Tests

npm run doctor       # Forbidden-Token-Check
```

---

## Architektur-Highlights

### Single Source of Truth
| Thema | Datei |
|-------|-------|
| SEO-Metadaten | `src/config/seo.ts` |
| AdSense-Slots | `src/config/ad-units.ts` |
| Blog-Registry | `src/data/blog-content/index.ts` |
| App-Routing | `src/main.tsx` |

### Ad-Infrastruktur
```
AdSlot.tsx (neu, bevorzugt)   → placement-basiert, CLS-safe, consent-aware
AdUnit.tsx (bestehend)         → unit-basiert, consent-aware
NICHT: <ins> direkt / push() direkt
```

### Warum Hash-Routing
Hash-Routing bleibt aus pragmatischen Gründen (kein SSR-Umbau). SEO erfolgt über:
1. Statische HTML-Landingpages in `/public/*.html` (direkt indexierbar)
2. JavaScript-Rendering der SPA-Routen (Google rendert JS)
3. Korrekte canonical-URLs in `useSEO.ts`

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
```

---

*Zuletzt aktualisiert: März 2026*
