# Timer Worlds: Content Quality Upgrade Plan

> **Datum:** 2026-01-10  
> **Betrifft:** Stoppclock – Timer Worlds Narratives

---

## 1. Quality – Inhaltliche Tiefe & Korrektheit

### Aktuelle Schwächen
- Nur **1 von 9 Timern** hat derzeit Content (Pomodoro).
- Keine Quellenangaben für historische Fakten.
- Texte sind auf Englisch, obwohl die Zielgruppe (DE Schulen) oft deutschsprachig ist.

### Verbesserungsvorschläge
| # | Problem | Lösung | Aufwand |
|---|---------|--------|---------|
| Q1 | Fehlende Welten | Content für alle 9 Timer erstellen (Countdown, Stopwatch, Analog, Chess, etc.) | Hoch |
| Q2 | Keine Quellen | `source` Feld zum `FactPlaque`-Typ hinzufügen, mit Links zu Wikipedia/Studien | Mittel |
| Q3 | Nur Englisch | `locale` Feld hinzufügen, i18n-Support mit DE/EN Fallback | Mittel |
| Q4 | Flachwissen | Tiefergehende "Deep Dives" mit Unterabschnitten (z.B. `### Ursprung des Wortes`) | Niedrig |

---

## 2. UI/UX – Visuelle Präsentation & Navigation

### Aktuelle Schwächen
- Keine visuelle Unterscheidung zwischen den Welten (alle gleich gestylt).
- Keine Bilder oder Icons, reine Text-Wand.
- Keine Micro-Animationen, die Seite fühlt sich "statisch" an.

### Verbesserungsvorschläge
| # | Problem | Lösung | Aufwand |
|---|---------|--------|---------|
| U1 | Monotones Design | Pro Timer-World eine eigene Akzentfarbe (abgeleitet von `timers[]` in `main.tsx`) | Niedrig |
| U2 | Keine Bilder | Hero-Illustrationen pro Timer (generierte SVG-Icons oder AI-generated) | Mittel |
| U3 | Statische Seite | CSS-Animationen für Scroll-Reveals (Fade-in on scroll) | Niedrig |
| U4 | Keine Navigation | "Table of Contents" am Anfang der Seite mit Anchor-Links zu Sections | Niedrig |
| U5 | Kein Zurück-Link | Breadcrumb-Navigation (`Home > Timer Worlds > Pomodoro`) | Niedrig |

---

## 3. Reliability – Robustheit & Wartbarkeit

### Aktuelle Schwächen
- JSON wird manuell generiert – kein automatischer Build-Hook.
- Fallback für fehlenden Content ist schlicht ("A World in Preparation").
- Keine E2E-Tests für die neuen Komponenten.

### Verbesserungsvorschläge
| # | Problem | Lösung | Aufwand |
|---|---------|--------|---------|
| R1 | Manueller Build | Script in `package.json` integrieren: `"prebuild": "node scripts/parse-timer-worlds.mjs"` | Niedrig |
| R2 | Schwacher Fallback | Interaktives Fallback-UI mit "Vorschläge einreichen" CTA | Mittel |
| R3 | Keine Tests | Playwright-Test für `#/wissen/pomodoro`: Prüft Section-Titel und Anzahl Rituals | Mittel |
| R4 | Fehlerbehandlung | Try/Catch im Parser mit detailliertem Logging bei Markdown-Fehlern | Niedrig |

---

## 4. Infotainment – Engagement & Wiederkehrwert

### Aktuelle Schwächen
- Kein Gamification-Element (z.B. "Hast du das gewusst?"-Quiz).
- Keine Interaktion – reine Lese-Erfahrung.
- Fakten sind statisch, kein "Fakt des Tages"-Feature.

### Verbesserungsvorschläge
| # | Problem | Lösung | Aufwand |
|---|---------|--------|---------|
| I1 | Keine Interaktion | "Wusstest du?"-Karten mit Klick-zum-Aufdecken-Effekt | Mittel |
| I2 | Kein Quiz | Mini-Quiz am Ende jeder World-Seite: 3 Fragen, Score wird angezeigt | Hoch |
| I3 | Kein Tages-Fakt | `ClockFactsBoard` auf Home Page mit rotierendem Content aus `timer-worlds.json` verknüpfen | Mittel |
| I4 | Keine Audio-Option | Text-to-Speech Button für Barrierefreiheit und "Audio-Tour"-Gefühl | Hoch |

---

## Priorisierte Roadmap

### Phase 1: Foundation (1-2 Tage)
- [Q1] Content für Countdown, Stopwatch, Chess Clock hinzufügen.
- [R1] Prebuild-Hook für automatische JSON-Generierung.
- [U1] Akzentfarben pro Timer-World.

### Phase 2: Visual Polish (2-3 Tage)
- [U2] Hero-Illustrationen generieren.
- [U3] Scroll-Animationen implementieren.
- [U4] Table of Contents hinzufügen.
- [R3] E2E-Tests schreiben.

### Phase 3: Interactivity (3-5 Tage)
- [I1] Klick-zum-Aufdecken-Fakten.
- [I3] ClockFactsBoard-Integration.
- [Q3] i18n-Support mit Deutsch als primärer Sprache.

### Phase 4: Advanced (Optional)
- [I2] Mini-Quiz.
- [I4] Text-to-Speech.
- [Q2] Quellenangaben für alle Fakten.
