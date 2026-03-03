# Stoppclock — Implementierungsplan: AdSense-Optimierung & Traffic-Steigerung
> Stand: März 2026 | Kritisch überprüfte Version 2.0

---

## 🔍 Kritische Plan-Überprüfung

### Warum Hash-Routing NICHT komplett migriert wird
Hash-basiertes Routing (`/#/route`) ist SEO-technisch limitiert, aber ein kompletter
Wechsel zu SSR/SSG (Next.js/Remix) würde 3-4 Wochen Refactoring bedeuten und alle
Timer-Funktionen gefährden. **Bessere Alternative:** Statische HTML-Landingpages pro
Keyword (bereits mit `/25-minuten-timer.html` begonnen) — diese ranken und
leiten zur App weiter. Diese Strategie skaliert ohne Risiko.

### Warum duales Consent-System beibehalten wird (angepasst)
Google Funding Choices (fundingchoicesmessages.google.com) ist Google-zertifiziert und
notwendig für "Funding Choices" Revenue. Das eigene ConsentBanner wird so angepasst,
dass es NUR zeigt wenn Google FC nicht aktiv ist (Fallback-Modus).

### Warum alle Timer-Seiten separate AdSense-Slots bekommen
Derzeit nutzen 12+ Seiten denselben Slot `home-top`. Das verhindert:
- Viewability-Optimierung pro Seitentyp
- A/B-Testing
- Korrekte Revenue-Attribution
→ Neue Slot-Struktur mit TODO-Markers für Dashboard-Konfiguration.

---

## Phase 1: Critical Bug Fixes (Revenue at Risk) 🔴
**Ziel:** Stoppe aktive Revenue-Verluste sofort

| # | Bug | Datei | Auswirkung |
|---|-----|-------|-----------|
| 1.1 | Doppelter AdUnit (Zeilen 65+69) | Pomodoro.tsx | AdSense Policy-Verstoß |
| 1.2 | Doppelter HomeButton | Pomodoro.tsx | UI-Bug |
| 1.3 | Import HOME_TOP_SLOT_ID (existiert nicht) | ResponsiveAd.tsx | TypeScript-Error |
| 1.4 | AdUnit rendert ohne Config-Check | AdUnit.tsx | Invalid AdSense Requests |
| 1.5 | Fake Slot-ID '6789012345' | ad-units.ts | Invalid Ad Requests |
| 1.6 | Anchor-Ad pointer-events: none | styles.css | Anzeigen nicht klickbar |

---

## Phase 2: AdSense-Hardening 🟠
**Ziel:** Robuste, policy-konforme Ad-Infrastruktur

| # | Maßnahme | Erwarteter Impact |
|---|----------|-------------------|
| 2.1 | Neues `AdSlot.tsx` - zentrales Ad-Component mit Config-Guard, Label, CLS-Prevention | -80% invalid requests |
| 2.2 | Dedizierte Slot-Kategorien: `timer-page`, `content-page`, `blog-page` | Bessere Revenue-Attribution |
| 2.3 | min-height auf 250px (Medium Rectangle) für Content-Pages | -CLS, +Revenue |
| 2.4 | Consent-System: Google FC primär, ConsentBanner als Fallback | GDPR-konform |
| 2.5 | SPA Route-Change: Ad-Units neu initialisieren bei Navigation | Korrekte Impressions |
| 2.6 | "Anzeige"-Label über jedem Ad-Slot | Nutzervertrauen |

---

## Phase 3: SEO-Foundation 🟠
**Ziel:** Indexierbarkeit und Rich-Snippet-Optimierung

| # | Maßnahme | Erwarteter Impact |
|---|----------|-------------------|
| 3.1 | Sitemap komplett neu schreiben (nur real arbeitende URLs) | Crawling-Effizienz |
| 3.2 | Canonical-URLs auf Basis realer Deployment-Strategie fixieren | Kein Duplicate-Content |
| 3.3 | BlogPosting/Article JSON-LD für alle Blog-Posts | Rich Snippets |
| 3.4 | og:image pro Route-Kategorie (6 Kategorien) | Social-CTR +30% |
| 3.5 | hreflang-Tags (de primär, en sekundär) | Internationale Indexierung |
| 3.6 | Redirect-Script in index.html reparieren | Korrekte Clean-URL-Handhabung |

---

## Phase 4: Content-Expansion & Traffic 🟡
**Ziel:** 3x organischer Traffic in 90 Tagen

### 4.1 Neue Blog-Posts (5 Stück, DE-fokussiert)
| Slug | Keyword | Suchvolumen (geschätzt) |
|------|---------|------------------------|
| `stoppuhr-online-guide` | "Stoppuhr online" | ~12.000/Monat |
| `countdown-timer-klasse` | "Timer für Klassen" | ~8.000/Monat |
| `online-wecker-ohne-app` | "Online Wecker" | ~15.000/Monat |
| `intervalltimer-hiit` | "Intervalltimer HIIT" | ~6.000/Monat |
| `schachuhr-regeln-online` | "Schachuhr online" | ~4.000/Monat |

### 4.2 Neue statische SEO-Landingpages (8 Stück)
| Datei | Target-Keyword | Monatl. Searches |
|-------|---------------|-----------------|
| `10-minuten-timer.html` | "10 minuten timer" | ~40.000 |
| `30-minuten-timer.html` | "30 minuten timer" | ~25.000 |
| `60-minuten-timer.html` | "60 minuten timer" | ~18.000 |
| `stoppuhr.html` | "stoppuhr online" | ~12.000 |
| `online-wecker.html` | "online wecker" | ~15.000 |
| `pruefungstimer.html` | "prüfungs timer" | ~6.000 |
| `lern-timer.html` | "lern timer" | ~8.000 |
| `workout-timer.html` | "workout timer" | ~9.000 |

### 4.3 LandingPage Hero auf Deutsch
H1 "Zeit. Einfach gehalten." (DE-SEO statt englisch)

---

## Phase 5: CI/CD Tests 🟡
**Ziel:** Regressionen verhindern

| Test | Framework | Kategorie |
|------|-----------|-----------|
| Kein Ad-Render ohne Consent | Playwright | AdSense Policy |
| Kein doppelter AdUnit pro Route | Playwright | AdSense Policy |
| Korrekter Canonical-Tag pro Route | Playwright | SEO |
| Meta-Title enthält Route-Keyword | Playwright | SEO |
| Blog-Posts haben Article-Schema | Playwright | SEO |
| Sitemap: Alle URLs return 200 | Playwright | Crawlability |
| AdUnit: Keine leeren Slot-IDs | Unit Test (Vitest) | AdSense |
| Consent-System: Korrekte Defaults | Unit Test (Vitest) | GDPR |
| isSlotConfigured() Logik | Unit Test (Vitest) | AdSense |

---

## Phase 6: Project SOT & Standards 📚

- `STANDARDS.md` — Code/SEO/Ad-Placement-Standards (SSoT für Team)
- `CLAUDE.md` Update — Projektspezifische AI-Anweisungen
- `README.md` Update — Vollständige Entwickler-Dokumentation
- `src/config/seo.ts` — SEO-Konfiguration als SSoT (raus aus useSEO.ts)
- `src/config/ad-units.ts` — Bereits vorhanden, wird vervollständigt

---

## Zeitplan
```
Tag 1-2:  Phase 1 (Critical Bugs) + Phase 2 (AdSense Hardening)
Tag 3:    Phase 3 (SEO Foundation) 
Tag 4-5:  Phase 4 (Content Expansion)
Tag 6:    Phase 5 (Tests)
Tag 7:    Phase 6 (Standards)
```

## Erwarteter Gesamt-Impact (90 Tage)
- AdSense Revenue: +60-80% (durch korrekte Konfiguration + mehr Seiten)
- Organischer Traffic: +150-200% (durch neue Blog-Posts + Static Pages)
- Core Web Vitals: CLS Score von ~0.15 → < 0.1
- SEO-Sichtbarkeit: 5 neue Rich-Snippets im SERP
