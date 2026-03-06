# Dead Ends & Navigation Gaps — Stoppclock Frontend

> Vollständige Bestandsaufnahme aller toten Links, Einbahnstraßen und unerreichbaren Seiten.  
> Stand: März 2026 · Basis: statische Code-Analyse aller `src/pages/` + `src/components/`

---

## Legende

| Symbol | Bedeutung |
|--------|-----------|
| 🔴 | Kaputt — klickbar aber führt zu 404 oder falscher Seite |
| 🟠 | Einbahnstraße — erreichbar, aber kein sinnvoller Weiterweg |
| 🟡 | Versteckt — Route existiert, aber kein einziger Link führt dorthin |
| 🟣 | Zombie — Code existiert, wird aber nie gerendert |
| ⚪ | Lücke — Inhalt fehlt, Seite zeigt Placeholder |

---

## 1. 🔴 Tote Links (kaputte hrefs)

### 1.1 `#/cycle` — Route nicht vorhanden

`CycleTimer.tsx` existiert als vollständige Seite, hat aber **keine Route in `main.tsx`**. Alle Links dorthin führen zu einem leeren Not-Found.

| Datei | Zeile | Kontext |
|-------|-------|---------|
| `src/components/PresetsSection.tsx` | 85 | `cycle: '#/cycle'` in routes-Map → Preset-Click navigiert dorthin |
| `src/components/PinnedTimersBoard.tsx` | 361 | `'CycleTimer': '#/cycle'` → gepinnte Cycle-Timer-Karte |

**Fix:** Route in `main.tsx` eintragen: `{route === "/cycle" && <CycleTimer />}` und in Not-Found-Whitelist aufnehmen.

---

### 1.2 `#/wissen` (ohne Slug) — Router-Lücke führt zu 404

Der Router prüft `route.startsWith('/wissen/')` — das Trailing-Slash ist Pflicht. Die Route `/wissen` (ohne Slug) fällt durch alle Checks und zeigt **Not Found**.

| Datei | Zeile | Kontext |
|-------|-------|---------|
| `src/components/timer-world/Breadcrumb.tsx` | 17 | `<a href="#/wissen">Wissen</a>` — Breadcrumb-Link auf Übersichts-Seite |

**Auswirkung:** Auf jeder Timer-World-Detailseite (`#/wissen/countdown`, etc.) führt der „Wissen"-Breadcrumb-Link zurück zu einer 404-Seite statt zur Übersicht.

**Fix-Optionen:**
- A) `#/wissen` → `#/timers` umleiten (TimerWorldsIndex ist die echte Übersicht)
- B) Explizite Route `/wissen` in Router eintragen die auf `TimerWorldsIndex` zeigt

---

### 1.3 `/#/route` statt `#/route` — Falsches Link-Format in 6 Seiten

Alle `TimerFor*.tsx`-Seiten nutzen `href="/#/countdown"` für CTA-Buttons, aber `href="#/"` für Back-Links. Das Format `/#/` ist technisch funktional auf GitHub Pages (navigiert zu `/`, dann setzt den Hash), hat aber **zwei Probleme**:

1. Der `?preset=3`-Parameter wird **nie ausgelesen** (Countdown liest `window.location.search`, das bei Hash-Routing leer ist)
2. Stilistisch inkonsistent mit dem Rest der App

**Betroffene Dateien (alle haben das gleiche Muster):**

| Datei | Anzahl `/#/`-Links | Kommentar |
|-------|--------------------|-----------|
| `src/pages/TimerForCooking.tsx` | 28 | inkl. `?preset=3`, `?preset=6`, `?preset=10` → kaputte Parameter |
| `src/pages/TimerForFitness.tsx` | 8 | |
| `src/pages/TimerForFocus.tsx` | 4 | |
| `src/pages/TimerForMeditation.tsx` | 4 | |
| `src/pages/TimerForProductivity.tsx` | 8 | |
| `src/pages/TimerForStudents.tsx` | 8 | |
| `src/pages/blog/PomodoroTimerOnline.tsx` | 12 | Legacy-Page (wird nie gerendert, s.u.) |
| `src/pages/blog/PomodoroVsCountdown.tsx` | 5 | Legacy-Page (wird nie gerendert, s.u.) |

**Fix:** Alle `href="/#/X"` → `href="#/X"` ersetzen. Preset-Parameter separat via localStorage übergeben statt Query-String.

---

### 1.4 `/?t=<s>#/countdown` — Static Pages mit falschem Link-Muster

Die statischen SEO-Landingpages (`10-minuten-timer.html` etc.) nutzen `/?t=600#/countdown`. Das `?t=` Query-Param wird vom Countdown ebenfalls nicht via `window.location.search` ausgelesen — dieser landet auf der Hash-Route, aber mit 0 Sekunden.

**Betroffene Dateien:** `public/10-minuten-timer.html`, `public/30-minuten-timer.html`, `public/60-minuten-timer.html`, `public/25-minuten-timer.html`, `public/5-minuten-timer.html`, `public/stoppuhr.html`

**Fix:** Countdown liest Hash-Query-Params: `new URLSearchParams(location.hash.split('?')[1])` statt `window.location.search`.

---

## 2. 🟠 Einbahnstraßen (kein sinnvoller Weiterweg)

### 2.1 Facts Page (`#/facts`)

**Erreichbar über:** Einziger Einstieg ist `RandomFactWidget` auf der Landing Page (`src/components/RandomFactWidget.tsx:63`).

**Navigation auf der Seite:** Nur 3× `<HomeButton />` — kein Link zu Blog, Timer Worlds, verwandtem Content.

**Dead End:** Nutzer liest Facts → klickt Home → Ende. Kein Cross-Link zu `/timers`, `/blog`, oder verwandten Timer-Seiten.

---

### 2.2 TimerFor-Seiten (6 Seiten)

Alle 6 Seiten (`TimerForStudents`, `TimerForProductivity`, `TimerForFitness`, `TimerForCooking`, `TimerForMeditation`, `TimerForFocus`) haben nur **einen internen Link**: `← Zurück zu allen Timern` → `#/`.

**Fehlende Links:**
- Kein Link zum Blog (z.B. Pomodoro-Guide auf TimerForStudents)
- Kein Link zu Timer Worlds (`#/timers`)
- Kein Querverweis zu anderen TimerFor-Seiten
- Kein Link zum Blog-Index

---

### 2.3 Custom Sessions (`#/custom-sessions`)

**Flow:** Landing → Builder → Runner → (zurück zu Landing)

**Dead End SessionRunner:** Nach Ende einer Session zeigt der Runner nur "Zurück" → `#/custom-sessions`. Kein Hinweis auf Blog, keine Weiterempfehlung, kein Share-Prompt.

---

### 2.4 Blog-Posts ohne Querverlinkung

Die 5 neuen Blog-Posts (`stoppuhr-online-guide`, `countdown-timer-klasse`, `online-wecker-ohne-app`, `intervalltimer-hiit`, `schachuhr-regeln-online`) haben `related`-Slots im `BlogPostTemplate`, aber die verwandten Posts verlinken nicht zurück zu den Timern oder anderen Blog-Posts in einer sinnvollen Kette.

---

### 2.5 Timer-Detailseiten: Nur `← Home` als Weg zurück

Diese Seiten haben `HomeButton` aber keinen Breadcrumb und keinen Link zu Blog/World:

| Seite | Rückweg |
|-------|---------|
| `BreathingTimer` | AppHeader mit Home-Icon |
| `IntervalTimer` | AppHeader mit Home-Icon |
| `TimeLab` | `<HomeButton />` |
| `TimePhilosophy` | `<HomeButton />` |
| `FactsPage` | `<HomeButton />` (3×) |
| `Wissen/<slug>` | `<HomeButton />` |

---

## 3. 🟡 Versteckte Seiten (unerreichbar für normale Nutzer)

Diese Routen **existieren und rendern korrekt**, aber kein einziger Link im Frontend führt dorthin.

| Route | Seite | Letzter bekannter Zugang |
|-------|-------|--------------------------|
| `#/pillar` | `PillarPage.tsx` | Kein Link im gesamten Frontend |
| `#/time-philosophy` | `TimePhilosophy.tsx` | Kein Link im gesamten Frontend |
| `#/widget-demo` | `WidgetDemo.tsx` | Kein Link (Developer-Tool?) |
| `#/timelab` | `TimeLab.tsx` | Kein Link im Frontend |
| `#/timesince` | `TimeSince.tsx` | Nur in LandingPage TIMERS-Array — kein AppHeader-Link |
| `#/couples` | `CouplesTimer.tsx` | Nur in LandingPage TIMERS-Array |
| `#/digital` | `DigitalClock.tsx` | Nur in LandingPage TIMERS-Array |
| `#/analog` | `AnalogCountdown.tsx` | Nur in LandingPage TIMERS-Array |

**Kritisch:** `#/pillar` und `#/time-philosophy` sind vollständige Content-Seiten (Pillar-Seite, Philosophie-Text) die bei SEO-Crawls nicht erreichbar sind, da kein Link zeigt dorthin.

---

## 4. 🟣 Zombie-Code (nie gerendert)

### 4.1 Legacy Blog-Pages — tot durch DynamicBlogRouter

`main.tsx` importiert und lazy-loadt diese Seiten, rendert sie aber **nie**. Der `DynamicBlogRouter` übernimmt **alle** `/blog/*`-Routen bevor individuelle Route-Checks greifen könnten:

```tsx
// main.tsx — dieser Check ist nie wahr, weil isBlog=true zuerst matched:
{route === "/blog/pomodoro-timer-online" && <PomodoroTimerOnline />}  // ← DEAD
```

| Datei | Import in main.tsx | Gerendert? |
|-------|--------------------|------------|
| `src/pages/blog/PomodoroTimerOnline.tsx` | ✅ Ja (lazy) | ❌ Nie |
| `src/pages/blog/PomodoroVsCountdown.tsx` | ✅ Ja (lazy) | ❌ Nie |

**Tatsächlich gerendert wird:** `DynamicBlogRouter` → `BlogPostTemplate` mit Daten aus `blog-content/index.ts`.

Die Legacy-Pages haben eigenes HTML/Markup das vom `BlogPostTemplate` abweicht — sie sind obsolet aber nicht gelöscht.

---

### 4.2 `Discover.tsx` — Vollständige Seite ohne Route

`src/pages/Discover.tsx` ist eine vollständige implementierte Seite ("Discover Time Facts"), aber:
- **Kein Import** in `main.tsx`
- **Keine Route** in Router
- **Kein Link** von irgendeiner anderen Seite

Die Seite ist komplett unerreichbar.

---

### 4.3 `CycleTimer.tsx` — Implementiert, nicht geroutet

Vollständiger Timer mit LocalStorage, Preset-Support und HomeButton. Kein Route-Eintrag in `main.tsx`. Wird von `PresetsSection` und `PinnedTimersBoard` verlinkt (→ 404).

---

### 4.4 `TimerAbout.tsx` — Unklar ob benutzt

`TimerAbout.tsx` liest `location.hash` und unterscheidet zwischen `/about/<slug>` und `/wissen/<slug>`. Die Seite `Wissen.tsx` rendert jedoch `TimerWorldLayout` direkt — `TimerAbout` wird nicht importiert oder verwendet.

---

## 5. ⚪ Inhaltslücken (Seiten mit Placeholder-Content)

### 5.1 Timer Worlds: 9 von 15 fehlen

`TimerWorldsIndex` (`#/timers`) zeigt alle Worlds die in `public/data/timer-worlds.json` stehen. Aktuell sind **6 von 15 Timern** dokumentiert:

| Status | Timer |
|--------|-------|
| ✅ Vorhanden | `breathing`, `chess`, `countdown`, `interval`, `pomodoro`, `stopwatch` |
| ⚪ Fehlt → Placeholder | `analog`, `timesince`, `cooking`, `couples`, `metronome`, `world` (WorldClock), `alarm`, `digital`, `custom-sessions` |

Wenn `TimerWorldsIndex` auf einen fehlenden World verlinkt (alle Timer mit `href="#/wissen/<slug>"`), zeigt `Wissen.tsx` den Text **"A World in Preparation"** — eine saubere Fallback-Message, aber kein echter Content.

---

### 5.2 `TimePhilosophy.tsx` — Minimaler Stub

Enthält nur 3 kurze Absätze philosophischen Text und einen HomeButton. Keine Links, keine Struktur, kein Mehrwert für Nutzer oder SEO.

---

### 5.3 `PillarPage.tsx` — Technische Seite ohne Kontext

Zeigt Performance/SEO-Metriken der App (Core Web Vitals etc.) — sieht nach einer internen Dashboard-Seite aus, die versehentlich im Router geblieben ist.

---

## 6. Globale Navigations-Lücken

### 6.1 AppHeader Nav: Nur 3 Links

Die globale Navigation (`AppHeader.tsx:126-128`) zeigt exakt 3 Links:
```
Timers | Timer Worlds | About
```

**Komplett fehlend in der Nav:**
- Blog (`#/blog`) — Hauptinhalt mit 7+ Posts
- Facts (`#/facts`)
- Custom Sessions (`#/custom-sessions`)
- Kontakt (`#/contact`)

### 6.2 Footer (LandingPage): Nur 3 Links

Footer in `LandingPage.tsx` zeigt: `Privacy | Imprint | About`  
Fehlt: Blog, Timer Worlds, Sitemap, Contact

### 6.3 Kein Breadcrumb-Standard

Nur wenige Seiten haben Breadcrumbs (`ChessClock`, `Countdown`). Die meisten Seiten haben keinen Kontext wo man sich befindet.

---

## Priorisierte Fixes

### 🔴 Sofort (kaputt)

| # | Problem | Aufwand | Datei(en) |
|---|---------|---------|-----------|
| 1 | `#/cycle` Route eintragen | XS | `main.tsx` |
| 2 | `#/wissen` Breadcrumb → `#/timers` | XS | `Breadcrumb.tsx:17` |
| 3 | Alle `/#/X` → `#/X` in 6 TimerFor-Seiten | S | 6× `TimerFor*.tsx` |
| 4 | Countdown Hash-Query-Params lesen | S | `Countdown.tsx` |

### 🟠 Bald (Einbahnstraßen schließen)

| # | Problem | Aufwand | Datei(en) |
|---|---------|---------|-----------|
| 5 | Facts Page: Links zu Blog & TimerWorlds | XS | `FactsPage.tsx` |
| 6 | TimerFor-Seiten: Querlinks (Blog, andere TimerFor) | S | 6× `TimerFor*.tsx` |
| 7 | Blog nav-link in AppHeader | XS | `AppHeader.tsx` |
| 8 | Blog-Posts: Footer-Nav mit Blog-Index-Link | XS | `BlogPostTemplate.tsx` |

### 🟡 Mittelfristig (versteckte Seiten)

| # | Problem | Aufwand | Datei(en) |
|---|---------|---------|-----------|
| 9 | `#/pillar` verlinken oder entfernen | XS | Entscheidung nötig |
| 10 | `#/time-philosophy` verlinken (z.B. About-Seite) | XS | `About.tsx` |
| 11 | `Discover.tsx` Route eintragen oder löschen | XS | `main.tsx` |
| 12 | Timer Worlds für 9 fehlende Timer schreiben | XL | `public/data/timer-worlds.json` |

### 🟣 Cleanup (Dead Code)

| # | Problem | Aufwand | Datei(en) |
|---|---------|---------|-----------|
| 13 | Legacy `pages/blog/Pomodoro*.tsx` löschen | XS | 2 Dateien |
| 14 | `TimerAbout.tsx` klären ob benutzt | XS | Analyse |
| 15 | Lazy-Imports der Legacy-Blog-Pages aus main.tsx | XS | `main.tsx` |

---

## Routen-Statusmatrix (vollständig)

| Route | Renderer | Links von außen | Weg zurück | Status |
|-------|----------|-----------------|------------|--------|
| `/` | LandingPage | – (Startseite) | – | ✅ |
| `/countdown` | Countdown | LP, viele | AppHeader Home | ✅ |
| `/stopwatch` | Stopwatch | LP | AppHeader Home | ✅ |
| `/pomodoro` | Pomodoro | LP | AppHeader Home | ✅ |
| `/chess` | ChessClock | LP | AppHeader+Breadcrumb | ✅ |
| `/cooking` | CookingTimer | LP | HomeButton | ✅ |
| `/couples` | CouplesTimer | LP | HomeButton | 🟡 nav only |
| `/alarm` | Alarm | LP | HomeButton | ✅ |
| `/world` | WorldClock | LP | HomeButton | ✅ |
| `/metronome` | Metronome | LP | HomeButton | ✅ |
| `/digital` | DigitalClock | LP | HomeButton | 🟡 nav only |
| `/analog` | AnalogCountdown | LP | HomeButton | 🟡 nav only |
| `/breathing` | BreathingTimer | LP | AppHeader Home | 🟠 kein Back |
| `/interval` | IntervalTimer | LP | AppHeader Home | 🟠 kein Back |
| `/timesince` | TimeSince | LP | HomeButton | 🟡 nav only |
| `/timelab` | TimeLab | Keiner | HomeButton | 🟡 hidden |
| `/custom-sessions` | CustomSessionsLanding | LP | HomeButton | ✅ |
| `/custom-sessions/builder` | SessionBuilder | CustomSessions | HomeButton | ✅ |
| `/custom-sessions/run/:id` | SessionRunner | Builder | Back-Button | 🟠 |
| `/custom-sessions/preview/:id` | SessionPreview | CustomSessions | Back-Button | ✅ |
| `/blog` | BlogIndex | AppHeader, Footer | HomeButton | ✅ |
| `/blog/:slug` | DynamicBlogRouter | BlogIndex | HomeButton | ✅ |
| `/blog/countdown-timer-guide` | CountdownGuide | 1 Blog-Post | – | 🟡 |
| `/timers` | TimerWorldsIndex | AppHeader, LP Banner | HomeButton | ✅ |
| `/wissen/:slug` | Wissen | TimerWorldsIndex | HomeButton | ✅ |
| `/wissen` | **404** | Breadcrumb | – | 🔴 |
| `/facts` | FactsPage | RandomFactWidget | HomeButton | 🟠 |
| `/about` | About | AppHeader, Footer | HomeButton | ✅ |
| `/contact` | Contact | About | HomeButton | ✅ |
| `/impressum` | Impressum | Footer | HomeButton | ✅ |
| `/imprint` | ImprintEn | Footer, Impressum | HomeButton | ✅ |
| `/datenschutz` | Datenschutz | – | HomeButton | 🟡 hidden |
| `/privacy` | PrivacyPolicyEn | Footer, ConsentBanner | HomeButton | ✅ |
| `/pillar` | PillarPage | **Kein Link** | HomeButton | 🟡 hidden |
| `/time-philosophy` | TimePhilosophy | **Kein Link** | HomeButton | 🟡 hidden |
| `/widget-demo` | WidgetDemo | **Kein Link** | HomeButton | 🟡 dev-only |
| `/timer-for-students` | TimerForStudents | Blog-Links | HomeButton | 🟠 |
| `/timer-for-productivity` | TimerForProductivity | Blog-Links | HomeButton | 🟠 |
| `/timer-for-fitness` | TimerForFitness | Blog-Links | HomeButton | 🟠 |
| `/timer-for-cooking` | TimerForCooking | keiner | HomeButton | 🟡+🟠 |
| `/timer-for-meditation` | TimerForMeditation | keiner | HomeButton | 🟡+🟠 |
| `/timer-for-focus` | TimerForFocus | keiner | HomeButton | 🟡+🟠 |
| `/cycle` | **404** | PresetsSection, PinnedBoard | – | 🔴 |
| – | CycleTimer.tsx | – | HomeButton | 🟣 zombie |
| – | Discover.tsx | – | HomeButton | 🟣 zombie |
| – | TimerAbout.tsx | – | – | 🟣 unklar |
| – | pages/blog/PomodoroTimerOnline.tsx | – | – | 🟣 zombie |
| – | pages/blog/PomodoroVsCountdown.tsx | – | – | 🟣 zombie |
