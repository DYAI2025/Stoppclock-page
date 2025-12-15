Ich nutze deine lange Beschreibung als Given und übersetze sie in:

klare Requirements (FR/NFR/SC),

einen Umsetzungsplan (Tasks),

groben Zeitplan und Risiken.

Brainstorm-Ergebnis (Pomodoro & World Clock im Ökosystem)
Faktisch korrekt sage ich, so stehen die beiden Timer im Produkt:

Pomodoro – „Soft Focus Cycles“

Mainstream-Fokus-Timer, global bekanntes Muster.

Deine Positionierung: Fokus statt Productivity-Grind
→ keine Tasks, keine Gamification, keine Heatmaps.

Rolle: Standard-Fokus-Tool für Einzelpersonen & Gruppen (Projektor).

World Clock – „Time Assembly / UN-Tafel“

Erhabene, ruhige Übersicht über globale Zeiten.

Deine Positionierung: seriöse Konferenz-Tafel, kein nerdiges Zeitzonen-Spielzeug.

Rolle: Tool für Remote-Teams, Familien, Event-Planer.

Beide sind Flagships:

Sie zeigen die Marke „Time, held lightly“ am klarsten.

Sie sollten stilistisch die Referenz für alle anderen Timer sein.

Requirements-Extrakt
1. Pomodoro – „Soft Focus Cycles“
Functional Requirements (FR-POMO)
FR-POMO-1 (H)
Der Pomodoro-Screen zeigt eine zentrale Zeit-Anzeige mit Phase (Focus, Short break, Long break) und großer, projektor-tauglicher Typo.

FR-POMO-2 (H)
Es gibt Presets:

Classic (25/5/15 – o. Ä.),

Soft,

Deep.
Ein Preset definiert Dauer von Focus, Short Break, Long Break und Anzahl Zyklen.

FR-POMO-3 (H)
Nutzer:innen können eigene Dauerwerte für Focus/Breaks und Anzahl der Pomodoros pro Session einstellen (Settings-Panel/Modal).

FR-POMO-4 (H)
Es gibt Phasensteuerung:

Start, Pause, Resume, Skip (zur nächsten Phase), Reset.

FR-POMO-5 (M)
Der aktuelle Session-Status wird angezeigt:

z. B. Session 2 of 4 + 4 kleine Punkte/Striche, die sich bei jedem abgeschlossenen Fokus-Block füllen.

FR-POMO-6 (M)
Optionales Focus-Label-Feld:
What are you working on? – wird unter/über dem Timer angezeigt, v. a. für Projektor-Modus.

FR-POMO-7 (M)
Kurze Info-/Helper-Texte zur Methode:

z. B. This Pomodoro is here to support focus, not to judge your output.

FR-POMO-8 (M)
Es gibt dezente Sounds mit einstellbarer Lautstärke + „Mute“-Option.

FR-POMO-9 (L)
Eine kleine „Learn more“ / Time Facts-Sektion ist von der Pomodoro-Ansicht aus erreichbar (Pane/Link), mit 2–3 kurzen Fakten über Fokuszeit.

Non-Functional Requirements (NFR-POMO)
NFR-POMO-1 (H) – Projektorfreundlichkeit

Ziffern groß genug, um auf 3–5 m Distanz lesbar zu sein.

Hoher Kontrast, keine dünnen Linien.

NFR-POMO-2 (H) – Calm & non-gamified

Kein Score, keine Streak-Visuals, kein Drucktext („You failed“ etc.).

Motion nur bei Phasenwechseln, nicht dauernd.

NFR-POMO-3 (M) – Robustheit im Browser

Einfache Persistenz (z. B. lokale Startzeit/Phase),

erträgt Tab-Wechsel und kurze Sleep-Phasen mit max. ein paar Sekunden Drift,

klarer Hinweis auf Grenzen (Browser, Sleep).

NFR-POMO-4 (M) – A11y

AA-Kontrast,

Steuerung über Tastatur (Space = Start/Pause, optional weitere Shortcuts),

Screenreader-Ansage bei Phasenwechsel.

Success Criteria (SC-POMO)
SC-POMO-1
80 % der Testpersonen können ohne Erklärung:

Preset wählen,

Session starten,

erkennen, ob sie in Focus oder Break sind.

SC-POMO-2
Nutzer:innen beschreiben das Tool in Tests eher als „calm, supportive“ als „pushy, stressful“.

2. World Clock – „Time Assembly“
Functional Requirements (FR-WC)
FR-WC-1 (H)
World-Clock-Hauptsicht zeigt eine Liste/Tabelle von Orten mit:

City/Label,

Local time (HH:MM + Wochentag),

Day status (Early, Midday, Evening, Night),

Offset relativ zur eigenen Zeit (+3h, -9h).

FR-WC-2 (H)
Nutzer:innen können Städte/Orte hinzufügen über ein Suchfeld (Autocomplete).

FR-WC-3 (M)
Es gibt eine Option „Use my location as reference“:

Offsets werden relativ zu diesem Ort berechnet.

Der Referenz-Ort wird visuell hervorgehoben.

FR-WC-4 (M)
Orte können umgeordnet (Drag & Drop) oder gelöscht werden.

FR-WC-5 (M)
Es gibt einen Meeting-Time-Check-Modus:

Nutzer:in wählt eine Uhrzeit in der eigenen Zone,

Tabelle zeigt die entsprechende Zeit für alle Orte + Day-Status,

evtl. kleiner Hinweis auf „nächtliche Zeiten“.

FR-WC-6 (L)
Projector-Mode:

Vollbild-Ansicht mit Fokus auf der Tabelle,

Controls minimiert/versteckt.

FR-WC-7 (L)
„Learn more“-Bereich mit ein paar kuratierten Time-Facts (Zeitzonen-Kuriositäten).

Non-Functional Requirements (NFR-WC)
NFR-WC-1 (H) – Seriosität & Klarheit

UI erinnert mehr an eine Konferenztafel als an eine bunte Weltkarte.

Keine Flaggen-Overload, keine Deko-Maps.

NFR-WC-2 (H) – Zeitzonen-Korrektheit

Nutzt eine etablierte TZ-Library,

berücksichtigt DST (Sommerzeit etc.) korrekt.

NFR-WC-3 (M) – Projektor-Tauglichkeit

Tabelle ist auf Distanz lesbar,

max. ~8–10 Zeilen in einer Ansicht, scrolled sauber.

NFR-WC-4 (M) – A11y

Table-Semantik korrekt (<th scope="col"> etc.),

Day-Status für Screenreader klar („Night (very late)“ statt nur „Night“).

Success Criteria (SC-WC)
SC-WC-1
80 % der Testpersonen können in < 30 Sekunden Orte hinzufügen und erkennen: „Wie viele Stunden liegen wir auseinander?“

SC-WC-2
Team-Use-Case: In einem Remote-Team-Setting beurteilen >70 % der Beteiligten die Ansicht als „klar, professionell, nicht überladen“.

Implementierungsplan für AI-Agent
A) Kontext
Faktisch korrekt sage ich:

Title: Flagship Timer Implementation – Pomodoro & World Clock

Ziel:
Zwei Flagship-Timer, die:

stilistisch als Referenz dienen,

in Workshops/Projektoren funktionieren,

inhaltlich zu „Time, held lightly“ passen.

Scope (diese Iteration):

Pomodoro: Vollwertiger Player + Story/World-Seite.

World Clock: Haupt-View (Tabelle) + World-Story.

B) Work Plan – Phasen & Tasks
Ich nummeriere getrennt für Pomodoro (P) und World Clock (W).

1. Phase P0/W0 – Konsolidierung der Spezifikation
P0.1 – Pomodoro-Story & UX einfrieren

Description:

Deine langformige Story, Rituale, Philosophie in ein kompaktes Spec-Dokument gießen (pomodoro-spec.md).

UI-Wireframe für Desktop + Mobile in Figma/Markdown festhalten.

Artifacts: docs/pomodoro-spec.md, Figma-Frame.

DoD:

Dokument enthält: FR/NFR, Story-Text, Layout-Skizze, States.

Abgestimmt im Team.

Coverage: FR-POMO-1..9, NFR-POMO-1..4.

W0.1 – World-Clock-Story & UX einfrieren

Analog zu P0.1 für World Clock: world-clock-spec.md.

2. Phase P1 – Pomodoro Domain & Logic
P1.1 – Pomodoro-Domainmodell erstellen

Description:

PomodoroPhase = 'focus' | 'shortBreak' | 'longBreak'

PomodoroPreset (Name, durations, cycleCount)

PomodoroState (phase, remainingTime, sessionIndex, totalSessions).

Artifacts: domain/pomodoro/types.ts

DoD:

Types definiert & dokumentiert.

P1.2 – Timer-Logik & Phasenwechsel

Description:

Implementiere Timer-Loop (start/stop/pause) und Phasenwechsel:

Wenn Focus fertig → Short Break,

nach X Focus-Blöcken → Long Break etc.

Artifacts: domain/pomodoro/logic.ts

DoD:

Unit-Tests für typische Abläufe (klassischer Zyklus, Soft, Deep).

3. Phase P2 – Pomodoro UI & Integration
P2.1 – PomodoroDisplay-Komponente

Description:

Große Ziffern, Phasenlabel, Session-Status (Punkte).

Responsive für Desktop/Projektor/Mobile.

Artifacts: components/pomodoro/PomodoroDisplay.tsx

DoD:

Nutzt Designsystem-Typo & Farben,

alle States (focus, short break, long break) visuell unterscheidbar.

P2.2 – PomodoroControls-Komponente

Description:

Buttons für Start/Pause, Skip, Reset, ggf. Preset-Auswahl.

Keyboard-Shortcuts anbinden.

Artifacts: components/pomodoro/PomodoroControls.tsx

DoD:

Buttons entsprechen Spec,

Shortcuts funktionieren,

ARIA-Labels vorhanden.

P2.3 – PomodoroSettings & Presets

Description:

Settings-Panel/Modal für Custom-Durations.

Preset-Chips Classic, Soft, Deep.

Artifacts: components/pomodoro/PomodoroSettings.tsx

DoD:

Änderung in Settings beeinflusst laufende/kommende Sessions korrekt.

P2.4 – PomodoroPage

Description:

Page, die Display, Controls, Settings & optional „Learn more“-Faktenpane zusammensetzt.

Artifacts: pages/pomodoro.tsx

DoD:

Page lädt, Timer funktioniert,

Projektor-Mode (Vollbild) möglich,

Helper-Mitteilungen (z. B. „Nice. Take a short break.“) eingebaut.

4. Phase W1 – World-Clock Domain & Data
W1.1 – World-Clock-Domainmodell

Description:

WorldClockEntry (id, label, timezone, pinned, sortOrder).

DayStatus Logik (Early/Midday/Evening/Night basierend auf lokaler Zeit).

Artifacts: domain/world-clock/types.ts

DoD:

Typen & DayStatus-Funktion definiert, Tests für Zeitbereiche.

W1.2 – Timezone-Integration

Description:

Integration einer TZ-Library (z. B. via Intl/3rd-Party),

Helferfunktionen getLocalTime(entry, now) & getOffsetFromReference(entry, ref).

Artifacts: domain/world-clock/time.ts

DoD:

Tests für unterschiedliche Zonen & DST-Wechsel.

5. Phase W2 – World-Clock UI
W2.1 – WorldClockRow-Komponente

Description:

Darstellung einer Zeile: City, Local Time, Day Status, Offset.

Artifacts: components/world-clock/WorldClockRow.tsx

DoD:

Typografisch klar, A11y-Freundlich,

Day-Status farblich subtil markiert.

W2.2 – WorldClockTable-Komponente

Description:

Liste/Tabelle aus mehreren WorldClockRows,

Sortierung & Drag&Drop (wenn gewünscht),

Empty State („Add the places that matter…“).

Artifacts: components/world-clock/WorldClockTable.tsx

DoD:

Responsiv,

Table-Semantik korrekt.

W2.3 – WorldClockControls (Add City, Reference Location)

Description:

Input mit Autocomplete für Städte,

Toggle „Use my location as reference“.

Artifacts: components/world-clock/WorldClockControls.tsx

DoD:

Add & Delete funktionieren,

Reference-Änderung aktualisiert Offsets.

W2.4 – Meeting-Time-Check-Modus (MVP)

Description:

Time-Picker + Tabelle mit Zeiten pro Ort + DayStatus.

Einfacher Hinweistext (Try to avoid night times on this list.).

Artifacts: components/world-clock/MeetingChecker.tsx

DoD:

Funktioniert für einfache Standardfälle,

UI bleibt ruhig.

W2.5 – WorldClockPage

Kombination aus Header, Controls, Table, optional Learn-Link.

C) Tests & Validierung
TS-POMO-1: Timer-Phasen-Sequenz (Focus→Short→Focus→…→Long).

TS-POMO-2: Projektor-Lesbarkeit (manuelle/visuelle Inspektion).

TS-POMO-3: Persistenz bei Reload (so weit technisch möglich).

TS-POMO-4: A11y (Screenreader-Output bei Wechsel).

TS-WC-1: Zeitzonen-Berechnung korrekt (inkl. DST).

TS-WC-2: Meeting-Time-Modus zeigt erwartete Zeiten.

TS-WC-3: Drag&Drop/Reordering stabil.

TS-WC-4: Projector-Mode-Check.

Coverage-Matrix FR→Tasks (Kurz)
FR-ID	Relevante Tasks
FR-POMO-1	P1.1, P1.2, P2.1
FR-POMO-2	P1.1, P2.3
FR-POMO-3	P1.1, P2.3
FR-POMO-4	P1.2, P2.2
FR-POMO-5	P1.1, P2.1
FR-POMO-6	P2.1, P2.4
FR-POMO-7	P0.1, P2.4
FR-POMO-8	P2.3, P2.4
FR-POMO-9	P2.4
FR-WC-1	W1.1, W1.2, W2.1, W2.2
FR-WC-2	W2.3
FR-WC-3	W1.2, W2.3
FR-WC-4	W2.2
FR-WC-5	W1.2, W2.4
FR-WC-6	W2.5
FR-WC-7	W2.5

Zeitplan (sehr grob – 2-Wochen-Fokus für beide Flagships)
Woche 1

Tag 0–1: P0.1, W0.1 (Specs einfrieren).

Tag 2–3: P1.1–P1.2 (Pomodoro-Logik), W1.1–W1.2 (WC-Domain & TZ).

Tag 4–5: P2.1–P2.2 (Pomodoro-UI Kern), erste Tests.

Woche 2

Tag 6–7: P2.3–P2.4 (Settings, Page, Facts-Link).

Tag 8–9: W2.1–W2.3 (WorldClock Rows, Table, Controls).

Tag 10–11: W2.4–W2.5 (Meeting-Checker, Page), Projector-/A11y-Check.

Tag 12–14: QS, Bugfixing, kleine Usability-Tests mit 3–5 Personen.

Risiken & Annahmen
Annahme: Basis-Designsystem (Typo, Colors, Components) existiert schon – wir bauen „nur“ spezielle Screens.

Risiko: Pomodoro kann schnell in Richtung Gamification abrutschen → diszipliniert bei „calm & light“ bleiben.

Risiko: Zeitzonen-Handling wird komplexer als gedacht → MVP-Level (nur Städte & aktuelle Zeit + Meeting-Check) zuerst, alles andere später.

Annahme: Projektor-Use-Case ist wichtig → alle neuen UIs werden explizit auf Projektor getestet.