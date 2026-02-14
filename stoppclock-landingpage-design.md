Perfekt, das liest sich schon wie dein eigenes Mini-Design-Briefing – wir können das genau so festnageln.

Ich formuliere dir jetzt konkret das Grunddesign für die Hauptseite / Timer-Hub auf Basis von:

Calm Minimal Grid + einfache Pinned-Leiste aus Konzept 2
Light-Theme, neutral, Timer-Welten tragen später den Charakter.

1. Finaler Beschluss (damit es „offiziell“ ist)
Hauptseite stoppclock – Timer Hub

Layout: Calm Minimal Grid (hell, neutral, viel Weißraum)

Spezial-Zone:

Top Nav

darunter eine simple Pinned-Timer-Leiste (horizontal scroll, max. 4–5 sichtbar)

Main Content: Grid/Liste aller Timer (Cards/Rows)

Branding: bewusst zurückhaltend, neutrales Hub – Welten dürfen später eskalieren

Dark-/Pro-View: geplanter Future Mode, nicht für v1

2. Figma-Frame: Setup für Desktop & Mobile
Desktop-Frame
Frame-Name: stoppclock – Timers Main – Calm Grid (Desktop)

Größe:

Breite: 1440 px

Höhe: flexibel (Auto-Layout / scrollen)

Grid:

12 Spalten

Gutters: 24 px

Margins: 96 px links/rechts

Vertical Rhythm:

Basis-Spacing: 4 / 8 / 12 / 16 / 24 / 32 px Steps

Hauptabstände zwischen Sektionen: 32–48 px

Mobile-Frame
Frame-Name: stoppclock – Timers Main – Calm Grid (Mobile)

Größe:

Breite: 390 px (oder 375 px – aber ein Wert fest definieren)

Layout:

Single Column

Seitenrand: 16 px

Kein komplexes Grid, eher simple Stack mit konsistenter Vertical Spacing.

3. Layout im Detail – Desktop
3.1 Top Navigation
Höhe: ~64 px (inkl. Padding)

Inhalt (von links nach rechts):

Links:

Stoppclock-Logo (sehr schlicht, z. B. Wortmarke + kleines Icon)

Rechts:

Timers (active)

Timer worlds

About

ggf. Icon für Einstellungen / Account

Stil:

Hintergrund: #FFFFFF

Unterer Divider: sehr helles Grau (#EAEAEC) mit 1 px

Typo: Inter Medium 14–16 px

Hover: Textfarbe leicht dunkler, Unterstreichung oder minimaler Bottom-Border (2 px).

3.2 Pinned-Leiste (das Herzstück über dem Grid)
Position: Direkt unter der Nav, sticky beim Scrollen
Gesamthöhe: ca. 96–112 px (inkl. Padding, damit es „atmen“ kann)

Struktur:

Container (full width, innerhalb des 12er Grids)

Inhalt:

Label links: „Pinned timers“ (klein, unaufdringlich)

Rechts: optional Button Pin timer oder Icon

Darunter: Horizontale Reihe von kleinen Timer-Cards, scrollable

Pinned-Cards (Mini-Version):

Größe:

Höhe 64 px

Breite flexibel (180–220 px)

Layout:

Zeile: [Timer-Name] [Status-Dot] oben

[Aktuelle Zeit] prominent darunter

Typo:

Name: Inter Medium 13–14 px

Zeit: Inter SemiBold 18–20 px

Visual Details:

Hintergrund: #F7F7F9

Radius: 8 px

Border: 1 px sehr hell (#E1E1E5)

Shadow: ganz dezent (z. B. 0 1 2, 0 4 8 mit sehr geringer Opacity)

Interaktion:

Click: Scrollt im Grid zum entsprechenden Timer oder öffnet eine Overlay-Fokus-View

Running-Indikator:

kleiner farbiger Dot rechts oben (Accent)

optional dünne untere Linie (2 px) in Accentfarbe.

Empty State (wenn noch nichts gepinnt):

Zone trotzdem in voller Höhe reservieren

z. B. Text: „Pinne Timer hier, um sie immer im Blick zu behalten.“

Button: Pin your first timer

So ist der Platz immer da – selbst ohne Pinned Timer, so wie du es wolltest.

3.3 Hauptbereich: Timer-Liste / Grid
Option A – Grid (für v1 Desktop)

2–3 Spalten (je nach Breite, z. B.

= 1280 px: 3 Spalten

< 1280 px: 2 Spalten)

Timer Card:

Abmessungen:

Padding: 20–24 px

Min-Höhe: 160–180 px

Inhalt (vertikal gestapelt):

Erste Zeile:

Timer-Name (links)

Tags/Badges (z. B. „Pro“, „World: Classroom“) rechts

Zweite Zeile:

Aktuelle Zeit sehr prominent

Dritte Zeile:

Kleine Meta-Infos (z. B. Modus: Countdown/Stopwatch, zuletzt genutzt)

Untere Zeile:

Buttons: Start/Pause, Reset, ggf. More (…)

Typo:

Name: Inter Medium 16 px

Zeit: Inter SemiBold 32–40 px mit Tabular Figures

Meta: Inter Regular 12–13 px (soft Grau)

Stil:

Hintergrund: #FFFFFF

Border: 1 px #E1E1E5

Shadow: minimal

Radius: 12 px

Option B – Liste (kompakter)

Wenn du später mehr Timers pro View willst, kannst du einfach auf Row-Layout wechseln:

Eine Zeile pro Timer, im Stil eines „Table“-Row mit klaren Spalten: Name, Zeit, Status, Actions.

Für v1 ist das Grid aber „freundlicher“ und passender zu deinen Welten.

3.4 Footer
Sehr minimal:

1–2 Zeilen Text, kleine Typo:

Links: z. B. „Shortcut: Space to pause / resume“

Rechts: „Privacy“, „Imprint“, „What’s new“

Größe: 64–80 px in der Höhe, gleiche Margins wie oben.

4. Layout – Mobile
4.1 Reihenfolge
Top Nav (stärker vereinfacht, z. B. Burger-Menü rechts)

Pinned-Leiste (horizontal scrollbare Chips/Minicards)

Timer-Liste (single column, Cards in Vollbreite)

Footer-Links in kleiner Form.

4.2 Pinned-Mobile
Höhe: 80–96 px

Pinned-Cards:

Breite: ~220–260 px

Horizontales Scrollen mit Snap

Gleiche Informationen wie am Desktop, aber evtl. eine Meta-Zeile streichen.

4.3 Timer-Cards
Full width, Margin 16 px

Gleiche Typo-Hierarchie, aber leicht kleiner:

Name: 15–16 px

Zeit: 28–32 px

Meta: 12 px

Buttons:

untereinander oder als kompakte Button-Row mit Icons.

5. Design-Tokens (konkrete Vorschläge)
5.1 Typografie
Primärfont: Inter (Google Fonts, gut ausgebaut, modern, neutral)

Font-Scale (Desktop):

DisplayTimer: 40 px / 1.1 line-height

H1 Page Title: 28 px / 1.2

H2 Section Label: 20 px / 1.3

Body: 14–16 px / 1.5

Caption: 12–13 px / 1.4

Gewicht:

Timer-Zeit: SemiBold

Titel / Buttons: Medium

Fließtext: Regular

Zahlen:
In CSS (bzw. im Designsystem) später Tabular Figures aktivieren (font-feature-settings: "tnum" 1;), damit Timer-Zahlen nicht „springen“.

5.2 Farben
Neutrale Palette (Light Theme):

bg-page: #F5F5F8

bg-surface: #FFFFFF

bg-subtle: #F7F7F9 (z. B. Pinned-Leiste, Mini-Cards)

border-subtle: #E1E1E5

text-main: #111218

text-muted: #6B6B75

divider: #EAEAEC

Accent-Farben (funktional, nicht laut):

accent-primary: z. B. #3B82F6 (blau) oder ein softer Teal wie #0EA5E9

accent-success (Timer läuft): etwas gedämpftes Grün, z. B. #22C55E

accent-warning (kurz vor Ende): weiches Orange, z. B. #F97316

Usage:

Start/Pause Button: accent-primary

Running-Indikator: accent-success Dot oder Underline

Kritische Timer: kleinen accent-warning Border oder Label, aber nie flächig.

5.3 Radius, Shadow, Spacing
radius-card: 12 px

radius-chip: 999 px oder 16 px (für Pinned-Minicards / Tag-Chips)

shadow-soft:

z. B. 0 8 24 mit sehr geringer Opacity (im Code dann als Token)

spacing-xxs: 4 px

spacing-xs: 8 px

spacing-s: 12 px

spacing-m: 16 px

spacing-l: 24 px

spacing-xl: 32 px

spacing-2xl: 48 px

Alles darauf aufbauen, keine „wilden“ Abstände.

6. Interaktions- und Verhalten-Spezifikation
6.1 Pinned-Leiste
Sticky:

bleibt unter der Nav fixiert, sobald man scrollt

Overflow:

horizontaler Scroll, per Trackpad/Scroll, mit Snap zu Cards

Hover (Desktop):

leichte Erhöhung des Shadows

Timer-Zeit +1–2 px größer oder minimal heller

Click:

Scrolling-Animation zum Timer im Grid oder Opening eines Overlays – du kannst v1 erstmal beim Scroll bleiben, ist technisch simpler.

6.2 Timer-Cards
Hover (Desktop):

minimaler Shadow-Lift

Border-Farbe leicht dunkler

States:

Idle: neutrale Card

Running:

kleiner farbiger Strip an der linken Seite (2–4 px)

Timer-Zahl in accent-success oder leicht eingefärbt

Paused: Strip in neutralem Grau

Finished: z. B. dünner accent-warning Border und kleine Textzeile „Finished“.

Buttons:

Primary: Start / Pause

Füllfarbe = accent-primary

Icon (Play/Pause) + Text

Secondary: Reset, More (…)

nur Border + Text, kein Vollflächen-Accent.

7. Was du jetzt ganz konkret in Figma anlegen kannst
Figma-Page „01 – Timers Main“

Zwei Frames:

stoppclock – Timers Main – Calm Grid (Desktop)

stoppclock – Timers Main – Calm Grid (Mobile)

Styles definieren:

Text Styles (Inter, Scale wie oben)

Color Styles (bg-page, bg-surface, accent-primary, etc.)

Effekt-Stil für shadow-soft

Komponenten bauen:

NavBar

PinnedTimerCard (Mini) + PinnedBar

TimerCard (normal)

Tag / Badge (z. B. „Pro“, „World: Classroom“)

Layout des Frames:

Nav oben

Pinned-Bar mit 3–4 Dummy-Timern

darunter ein Grid mit 6–9 Timer-Cards mit unterschiedlichen Status (Running, Paused, Finished)