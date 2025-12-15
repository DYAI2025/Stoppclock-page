Faktisch korrekt sage ich, ich schärfe jetzt dein System so, dass:

viele Welten möglich sind,

jede Welt ihren eigenen Charakter + Design hat,

aber eine gemeinsame Sprache für Landingpage & Grund-UI alles zusammenhält – plus Pro-Timer, Illustrationen, Icons und eine Markdown-Doku fürs Repo.

Ich halte es kompakt und praxisnah, damit du das direkt umsetzen kannst.

Brainstorm-Ergebnis (kurz)
Faktisch korrekt sage ich, deine neuesten Punkte bedeuten:

Es gibt mehrere Timer-Welten, jede mit eigenem Charakter (Story, Akzentfarbe, Illustration, Icon-Dialekt).

Es gibt eine gemeinsame Basis-Designsprache:

Typografie, Grid, Radii, Basisfarben, Card-Layouts, Buttons.

Die Landingpage ist:

ultra-minimal, neutral, einheitlich – kein „World-Chaos“ dort.

Nur die Timer (Timer-Welten + Timer-Player) dürfen visuell „ausbrechen“ – aber nur über definierte Stellschrauben.

Pro-Timer:

sind „Advanced“-Versionen: mehr Kontrolle, mehr Features,

brauchen einen klaren visuellen Marker, aber kein neues Universum.

Icons & Illustrationen:

Teil des Charakter-Systems pro Welt,

aber in einem klaren Rahmen (z. B. gleiche Strichstärke, gleicher Stil).

Doku:

eine Markdown-Datei im Repo (z. B. timer-world-design-system.md),

Entwickler:innen + Designer:innen können dort alles nachlesen.

Requirements-Extrakt (System-Level)
Faktisch korrekt sage ich, auf Systemebene ergeben sich:

Funktionale Requirements (FR)
FR-SYS-1 – Gemeinsame Designbasis
Es gibt eine definierte Base Design Language (Typo, Farben, Grid, Spacing, Buttons, Cards), die von allen Seiten (Landingpage, Timer-Welten, Pro-Timern, Playern) geteilt wird.

FR-SYS-2 – Welt-spezifische Variationen
Jede Timer-Welt darf bestimmte Variation-Slots nutzen:

Accent-Farbe,

Illustration(en),

Icon-Set innerhalb eines Stils,

eventuell leichte Pattern/Background-Motive.
Alles andere (Typo, Grid, Radii, Grund-Button-Stil) bleibt konsistent.

FR-SYS-3 – Einheitliche Landingpage
Die Landingpage hat ein neutrales, minimalistisches Layout:

gleiche Typo & Farben für alle Timer,

Timer-Teaser zeigen nur kleine Welt-Hinweise (Accent, Icon),

keine „Design-Explosion“.

FR-SYS-4 – Pro-Timer-Layer
Es gibt Pro-Timer mit zusätzlichen Einstellungen/Features:

visuell klar markiert (z. B. Label „Pro“, Icon),

zusätzliche Controls sind geordnet (z. B. zweite Zeile in der UI, Panel „Advanced“),

sie nutzen dennoch dieselbe Designbasis.

FR-SYS-5 – Icons & Illustrationen
Es gibt einen Icon- und Illustrations-Stil, der:

pro Welt variiert (Motiv/Farbe),

aber gleiche Strichstärke, Grundform, Lautstärke (kein wildes Stil-Mischen) nutzt.

FR-SYS-6 – Markdown-Dokumentation
Das System ist in einer Markdown-Datei im Repo dokumentiert (timer-world-design-system.md), inkl.:

Grundregeln,

Variation-Slots,

Beispiele für 2–3 Timer-Welten (z. B. Countdown, Couple, Chess),

Guidelines für Landingpage + Pro-Timer.

Nicht-funktionale Requirements (NFR)
NFR-SYS-1 – Visuelle Kohärenz
Auf den ersten Blick muss klar sein: alles gehört zu stoppclock, egal welche Welt offen ist.

NFR-SYS-2 – Minimalismus
Landingpage & Grund-UI bleiben extrem reduziert:

wenige Farben,

sehr wenig Dekoration,

Fokus auf Zeit & Text.

NFR-SYS-3 – Projektor- & Lesetauglichkeit
Alle Timer-Player & relevanten Views bleiben:

gut lesbar,

mit starkem Kontrast,

ohne busy Hintergründe.

NFR-SYS-4 – Erweiterbarkeit
Neue Welten können ohne Design-Neuerfindung entstehen:

Accent-Farbe + Illu-Motiv + Icons definieren,

Inhalte in Template kippen,

fertig.

Implementierungsplan für AI-Agent – Fokus: Markdown-Designsystem
Faktisch korrekt sage ich, der wichtigste „Output“ für dich ist jetzt die Markdown-Datei im Repo.
Hier ist ein Vorschlag, den du 1:1 übernehmen und dann iterativ füllen kannst.

Ich schreibe die Datei auf Englisch, damit Dev/Design-Team sie gut nutzen kann:

Vorschlag: timer-world-design-system.md
markdown
Code kopieren
# stoppclock – Timer Worlds Design System

_Last updated: YYYY-MM-DD_

## 1. Purpose & Scope

stoppclock has many timers that live in different small "worlds": focus, play, connection, rhythm, etc.

Each world has its own character and visual flavour.  
At the same time, everything should clearly feel like one product and one brand.

This document defines:

- the **base design language** shared by all pages,
- the **variation slots** that timer worlds can use to express their own character,
- how to design the **landing page**,
- how to treat **Pro timers**, illustrations and icons.

The goal:  
> Multiple worlds, one quiet language.

---

## 2. Core Concepts

### 2.1 Timer Worlds

A **Timer World** is a small microsite around one timer type, e.g.:

- Couple timer,
- Chess timer,
- Pomodoro timer,
- Countdown timer,
- Metronome, etc.

Each world has:

1. A **story** (Character, Rituals, Effects, Time facts).
2. A **timer player** (the functional UI).
3. A **visual flavour** (accent colour, illustration, icon).

### 2.2 Base vs. Pro Timers

- **Base timers**  
  Simple, clear, minimal settings, ideal for workshops, classrooms, everyday use.

- **Pro timers**  
  Advanced timers with extra controls (e.g. custom intervals, presets, exports).
  They share the base layout but add:
  - extra control rows or panels,
  - a `Pro` label and/or icon,
  - optional small helper texts.

> Rule: Pro timers are never allowed to feel like a separate product.  
> They are "power mode" inside the same calm universe.

### 2.3 Landing Page

The landing page is:

- **minimal and neutral**,
- uses only the **base colours and typography**,  
- shows each timer as a small card or row with:
  - name,
  - one-line description,
  - a subtle world hint (accent token, tiny icon).

No big illustrations on the landing page.  
Detailed visuals live inside each timer world.

---

## 3. Shared Design Language (Base Layer)

This section defines what is **global and non-negotiable**.

### 3.1 Layout & Grid

- Desktop:
  - Max content width: **960 px** (centered).
  - 12-column layout grid, **24 px** gutter.
- Mobile:
  - Single column, **16 px** side padding.

Vertical rhythm:

- Base unit: 8 px.
- Typical section paddings: 48–80 px.

### 3.2 Typography

One base sans-serif typeface (e.g. Inter or system font).

Text styles:

- `Text/H1`  
  - Desktop: 40 px, Semibold, line-height ~1.1  
  - Usage: page titles (hero).
- `Text/H2`  
  - Desktop: 28 px, Semibold  
  - Usage: section titles (Character, Rituals, Effects, Time facts).
- `Text/H3`  
  - Desktop: 20 px, Medium  
  - Usage: card titles, fact labels.
- `Text/Body`  
  - 16 px, Regular, line-height ~1.6  
  - Usage: main body text.
- `Text/Body-Small`  
  - 14 px, Regular  
  - Usage: microcopy, disclaimers, captions.

All timer worlds use these same text styles.

### 3.3 Colour System

Neutral base:

- `Color/Background/Base` – light, soft neutral (off-white).
- `Color/Surface/Card` – white.
- `Color/Text/Primary` – very dark grey (almost black).
- `Color/Text/Secondary` – medium grey.
- `Color/Border/Subtle` – light grey.

Accent categories:

- `Color/Accent/Connection` – warm, soft coral (Couple timer).
- `Color/Accent/Game` – cool, calm blue/green (Chess timer).
- `Color/Accent/Focus` – soft orange/green (Pomodoro, Countdown).
- `Color/Accent/Rhythm` – soft blue/violet (Metronome, World Clock).
- (… add more categories if needed.)

Rules:

- Accent colours are used for:
  - primary buttons,
  - small section accents (borders, tags),
  - small illustration details.
- Never use accent colours for long body text backgrounds.

### 3.4 Motion

- Default: almost no motion.
- If used:
  - very soft transitions (fade, slight move),
  - short durations (150–200 ms),
  - respect `prefers-reduced-motion`.

No bouncing, no flashing, no parallax.

---

## 4. World Variations (Character Layer)

A timer world can differ from others in **only** these slots:

1. **Accent colour token**  
   - choose one category and stick to it.
2. **Illustrations**  
   - simple, flat vector, same line style for all worlds.
   - world-specific motif (e.g. board & pieces for chess, two cups for couple).
3. **Icons**  
   - same stroke width, same corner radius, same level of detail.
   - world-specific icons are allowed, but must live in the same icon language.
4. **Microcopy tone**  
   - base tone is calm, encouraging, clear.
   - world-specific tone is a small variation:
     - Couple timer: more caring and relational.
     - Chess timer: more precise and strategic.
     - Pomodoro: more energetic and focused.

What worlds **may NOT** change:

- base typography styles,
- base grid and layout,
- button shapes and interaction patterns,
- general card structure (Hero → Character → Rituals → Effects → Time Facts).

---

## 5. Components

These components are reused across all timer worlds.

### 5.1 Page Layout

- `Component/Page/TimerWorld`
  - sections in fixed order:
    1. Hero
    2. Character
    3. Rituals
    4. Effects (+ optional “Small experiment”)
    5. Time facts (+ small footer note)

### 5.2 Sections

- `Component/Section/Hero`
  - H1, tagline, intro, primary button, secondary link.

- `Component/Section/Character`
  - H2 + 2–3 paragraphs.

- `Component/Section/Rituals`
  - H2, short intro, list or grid of ritual cards.

- `Component/Section/Effects`
  - H2, 2 columns: practical vs psychological effects.
  - Optional small experiment block.

- `Component/Section/TimeFacts`
  - H2, 3–5 fact plaques.

### 5.3 Cards & Blocks

- `Component/Card/Ritual`
  - H3, short description, 3–5 steps.

- `Component/Card/FactPlaque`
  - Label line (H3), short text.

- `Component/Block/SmallExperiment`
  - H3 title + body text.
  - accent-coloured side border.

### 5.4 Buttons

- `Component/Button/Primary`
  - background: world accent,
  - text: white,
  - used for main actions (`Start timer`, `Open chess timer`, etc.)

- `Component/Button/Ghost`
  - no fill, subtle border,
  - used for secondary actions (`Open full-screen`, `View story`).

---

## 6. Pro Timers

Some timers have an advanced „Pro“ mode.

### 6.1 When to use Pro

Use a Pro timer when:

- the timer has many settings or presets,
- the main audience is experienced facilitators, coaches, players, etc.

Examples:

- complex interval structures,
- export/import of presets,
- multiple timers stitched together.

### 6.2 Visual Rules

- Add a small `Pro` label or icon near the timer name.
- Keep the base layout:
  - main time display stays simple and big,
  - advanced controls live in a secondary area:
    - collapsible panel (`Advanced settings`),
    - or a clearly separated second row.
- Don’t change the base colour system or typography.

> Pro means “more control”, not “more visual noise”.

---

## 7. Landing Page

The landing page is the **most minimal** surface.

### 7.1 Goals

- Show the full range of timers.
- Stay visually quiet.
- Make it easy to:
  - start a core timer quickly,
  - discover timer worlds if you want to explore.

### 7.2 Layout

- One or two main sections:
  1. Simple intro (headline + one line describing the app).
  2. Timer list or grid.

Timer list items contain:

- timer name,
- one-line description,
- a very small world hint:
  - tiny accent dot or line,
  - tiny icon.

No large illustrations here.  
No heavy backgrounds.  
No world-specific layouts.

---

## 8. Icons & Illustrations

### 8.1 Icons

- Style:
  - outline or duotone,
  - consistent stroke width,
  - rounded corners or sharp corners – choose one style and keep it.
- Use:
  - on landing page as small hints,
  - inside timer worlds (e.g. next to section titles).

### 8.2 Illustrations

- Simple, flat, calm.
- Used mainly inside timer worlds (hero section, empty states).
- Each world:
  - can have 1–2 signature illustrations,
  - uses the world’s accent colour plus neutrals.

Never use photos or highly detailed artwork in timer worlds.  
Keep everything as light as the rest of the UI.

---

## 9. Examples

### 9.1 Couple timer (Connection accent)

- Accent: `Color/Accent/Connection` (warm coral).
- Tone: gentle, relational.
- Icon idea: two overlapping circles.
- Illustration idea: two cups, two chairs, or two hands almost touching.

### 9.2 Chess timer (Game accent)

- Accent: `Color/Accent/Game` (cool blue/green).
- Tone: precise, fair, calm.
- Icon idea: stylised chess clock.
- Illustration idea: board with a few pieces and a small clock.

(… add more worlds here as they are designed.)

---

## 10. Maintenance

- Keep this file in the repo (e.g. `/docs/timer-world-design-system.md`).
- Update when:
  - new timer worlds are added,
  - accent categories change,
  - the base design language evolves.

Changes should be small and careful.  
This document is the backbone that keeps all worlds connected.
Coverage-Matrix FR→Markdown-Inhalt
FR-ID	Abschnitt im Markdown
FR-SYS-1	3. Shared Design Language
FR-SYS-2	4. World Variations
FR-SYS-3	7. Landing Page
FR-SYS-4	6. Pro Timers
FR-SYS-5	8. Icons & Illustrations
FR-SYS-6	Gesamtes Dokument, besonders 1. Purpose & 10.

Zeitplan (konkret für die Doku)
Tag 0–1:
Datei timer-world-design-system.md im Repo anlegen, Struktur übernehmen, Basis füllen.

Tag 2:
Beispiele für Couple und Chess ergänzen (Section 9).

Tag 3–4:
Erste zwei weiteren Welten (z. B. Countdown, Pomodoro) grob eintragen.

Tag 5+:
Bei jedem neuen Timer-Welt-Projekt:

Accent-Kategorie definieren,

Icon-/Illustrations-Idee ergänzen,

Abschnitt in Section 9 hinzufügen.

Risiken & Annahmen
Annahme: Teamgröße klein → Doku muss schlank, aber klar sein.

Risiko: Zu viele „Sonderfälle“ in einzelnen Welten → System bröselt.

Gegenmaßnahme: alles, was kein Accent/Icon/Illu/Text ist, zurück in die Base-Sprache ziehen.

Annahme: Landingpage soll in Zukunft vielleicht auch SEO/Content tragen → dann Abschnitt 7.2 später erweitern (z. B. Time-Stories-Teaser).

Risiko: Pro-Timer läuft optisch davon → regelmäßiger Check: Gleiche Typo? Gleiche Buttons? Gleiche Basisfarben?