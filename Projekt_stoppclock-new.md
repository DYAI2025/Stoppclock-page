PLAN (nummeriert, kurz)
Kontext & Nutzungsszenarien klären
Zielgruppen, typische Nutzung (Projektor vs. Solo, Workshop vs. Küche etc.), Abgleich mit dem vorhandenen Konzeptdokument.
UX-Ziele & Designprinzipien ableiten
Aus Marke („Time, held lightly“), Projektor-Fokus und Character·Ritual·Effect.
Informationsarchitektur definieren
Neue Navigations- und Seitenstruktur (Start, Timer-Player, Timer-Welten, Settings/Presets).
Wichtige Views textlich „wireframen“
Startseite, Timer-Übersicht, einzelne Timer (Countdown, Stopwatch, Pomodoro, etc.), Einstellungen/Presets.
Visuelle Sprache festlegen
Farben (mit Kontrast-Hinweisen), Typografie, Spacing/Grid, Icons/Illustrationen.
Microcopy & States skizzieren
Labels, Buttons, Empty States, Fehler, Tooltips + am Ende offene Fragen und Annahmen explizit machen.
Brainstorm-Ergebnis
Faktisch korrekt sage ich, dieses Brainstorm-Ergebnis fasst den Kontext aus deinem Konzeptdokument und den zusätzlichen Vorgaben zusammen.
Problem Statement
stoppclock.com ist eine Sammlung sehr reduzierter, projektorfreundlicher Timer & Uhren (Countdown, Stopwatch, Analog, Pomodoro, Cooking, World Clock, Alarm, Metronome, Chess Clock). Die App ist minimal, offline-fähig und soll „Werkzeug, täglicher Helfer, Denkanstoß, kleine Philosophie und manchmal ein Grund zum Lächeln“ sein. Gesucht ist ein Redesign, bei dem jeder Timer eine eigene, besondere Seite erhält – mit Story, Zeitfakten, klarer visueller Identität – ohne die Minimalität und Projektor-Tauglichkeit des Tools zu zerstören.
Zielgruppe & Nutzungsszenarien
Logisch scheint mir, die primären Szenarien (aus dem Konzept + allgemeinem Timer-Kontext) wie folgt zu bündeln:
Moderation & Workshops
Moderator:innen / Facilitator:innen mit Beamer/TV.
Timeboxing von Übungen, Diskussionen, Sprints.
Unterricht & Lehre
Lehrkräfte, Trainer:innen, Dozent:innen:
Stillarbeit, Prüfungs-Countdown, kurze Aktivierungen.
Fokus & Deep Work
Entwickler:innen, Wissensarbeiter:innen, Studierende:
Pomodoro, Stopwatch für Experimente („Wie lange brauche ich für …?“).
Alltag & Zuhause
Küche (Cooking Timer), kurze Routinen (2-Minuten-Aufräumtimer etc.).
Musik & Spiel
Metronome für Musiker:innen.
Chess Clock für Brettspielende.
Geräte & Umgebungen (Annahme, da keine Daten vorliegen):
Desktop/Laptop mit großem Screen oder Beamer.
Tablets in Unterricht/Raum.
Laptops/Desktops für Solo-Fokus.
Smartphones eher sekundär (Unterwegs-Kochen etc.).
→ Wichtige Ergänzung: Wir haben keine echten Nutzungsdaten (z. B. Anteil Projektor vs. Solo, Gerätetypen). Das beeinflusst die Priorisierung (siehe „Fehlende Infos“ unten).
UX-Ziele & Designprinzipien
Logisch scheint mir, dass sich aus deinem Briefing + Konzept folgende Ziele ableiten: Kernziele
Fokus & Lesbarkeit:
Timer müssen auf Distanz (Raum, Klasse, Workshop) klar lesbar sein; keine visuellen Störungen.
Zero Overload:
Ein Screen = eine Hauptaufgabe (Zeit laufen lassen oder über Zeit nachdenken).
Charakter · Ritual · Effect:
Jede Timer-Seite erzählt:
Character: Wer ist dieser Timer für dich?
Rituals: Wie nutzt du ihn konkret?
Effects: Welche Wirkung hat das auf Zeitgefühl & Alltag?
Projektorfreundlich & barrierearm:
Gute Kontraste, große Schrift, wenige Farben.
Klare Fokuszustände, Tastaturbedienung.
Konsistenz bei Vielfalt:
Jede Timer-Welt darf anders „klingen“, ist aber im Layout & Interaktionsmuster konsistent.
Designprinzipien
Calm Stories first: Textgetriebene Microsites (Konzept 1) als Basis, wie in deinem Dokument empfohlen.
Leichte Experimente: Kleine, einfache Interaktionen nur dort, wo sie Erkenntnis stiften (Mini-„Time Lab“ für Effects).
Mini-Museum: „Time Facts“ als kleine Ausstellungselemente (Plaques, Timeline-Elemente), nicht als überladener History-Block.
Scope
Faktisch korrekt sage ich, der Scope des hier beschriebenen Konzepts ist: In Scope
Neue IA für stoppclock.com (Navigation, Seitenstruktur).
Template für Timer-Welten-Seiten (Character · Ritual · Effect · Time Facts).
Anpassung der Timer-Player-Ansichten (Countdown etc.) an dieses System:
Projektorfreundliches Layout.
Verbindung zu den Timer-Welten.
Basale Einstellungen/Presets/Favoriten (nur konzeptionell, nicht tiefes Account-System).
Brandnahe Visual Language (Farben, Typografie, Spacing, Icon/Illustrations-Stil).
Microcopy (EN, inklusiv, I/you-Perspektive).
Out of Scope (für dieses Konzept)
Vollständiges Rebranding (Logo, Name, komplette Markenpositionierung).
User-Accounts, Sync, komplexe Sharing-Funktionen.
Vollständige PWA- oder Offline-Architektur-Details.
Komplette Analytics-Implementierung (nur Hypothesen und Messideen).
Constraints & fehlende Informationen
Faktisch korrekt sage ich, einige Rahmenbedingungen sind bekannt, andere nicht:
Bekannt / angenommener Rahmen
Minimalistisch, projektorfähig, offline-freundlich.
Kleine, flexible Struktur (wahrscheinlich 1–2 Personen, die Content pflegen).
Kein Interesse an „Feature-Bloat“.
Fehlende Infos (kritisch für Feinschliff)
Keine harten Nutzungszahlen (Welche Timer sind Top 3? Welche Geräte?).
Keine Daten zu Sprachen & Lokalisierung (nur Englisch? Mehrsprachig?).
Unklarer Tech-Stack (reines JS, React, SvelteKit etc. – dein Konzept erwähnt SvelteKit/Next.js als Optionen, ist aber kein harter Fakt).
→ Auswirkungen: Priorisierung der Timer-Welten (welche zuerst), Device-optimierung und technische Empfehlungen bleiben teilweise angenommen.
Lösungskonzept – IA & UX auf einen Blick
Logisch scheint mir, das bestehende „Timer-Welten“-Konzept zu einer dreistufigen Struktur auszubauen:
Functional Layer – „Timer Player“
Minimalistische Vollbild-Ansichten für:
/countdown, /stopwatch, /analog, /pomodoro, /cooking, /worldclock, /alarm, /metronome, /chess.
Sehr große Ziffern, klare Start/Stop/Reset-Controls, Projektor-Modus.
Narrative Layer – „Timer Worlds“
Für jeden Timer eine ruhige Microsite:
/timers – Übersicht.
/timers/pomodoro, /timers/countdown etc.
Struktur je Seite:
Character (Hero + Origin-Story).
Rituals (konkrete Use-Cases).
Effects (praktisch & psychologisch, evtl. Mini-Interaktionen).
Time Facts (Museum-Style Plaques).
CTA: „Open timer“.
Support Layer – „Settings & Presets“
Sehr kleine, klare Seite für:
Standards (z. B. Standarddauer für Countdown).
Favoriten (2–5 Timer, die auf der Startseite auftauchen).
Keine komplexe Personalisierung, eher lokaler Speicher.
Diese drei Layer greifen ineinander: Startseite → Timer auswählen → entweder direkt Timer-Player starten oder zuerst „About this timer“ lesen.
Requirements-Extrakt
Logisch scheint mir, dass wir für ein solides Redesign klare funktionale und nicht-funktionale Anforderungen formulieren sollten.
Funktionale Requirements (FR)
FR-1 (Timer-Übersicht) – Hoch
Die Seite /timers zeigt alle verfügbaren Timer als ruhiges Grid oder Liste mit Name, Kurzclaim und Link zu:
„Open timer“ (Player-Ansicht)
„About this timer“ (Timer-Welt).
FR-2 (Timer-Welten-Template) – Hoch
Jede Timer-Weltseite (/timers/<slug>) nutzt dasselbe Content-Template:
Hero (Name, Tagline, Character-Intro).
Character Story (1–3 Absätze).
3–5 Ritual-Cards mit Steps.
Effects-Abschnitt (praktisch/psychologisch, optional kleines Interaktionsmodul).
3–5 Time-Facts-Plaques.
CTA „Open timer“.
FR-3 (Verknüpfung Timer ↔ Timer-Welt) – Hoch
Jeder Timer-Player hat einen klar sichtbaren Link/Icon („About this timer“), der direkt zur passenden Timer-Welt führt, und umgekehrt (Button „Open timer“).
FR-4 (Startseite) – Mittel
Die Startseite bietet:
Schnellzugriff auf 3–6 Kern-Timer (z. B. Countdown, Stopwatch, Pomodoro).
Einen Einstieg in die Timer-Welten („Discover the timers“ → /timers).
Projektorfreundliche „One-click to full screen“-Aktion für den zuletzt genutzten oder favorisierten Timer (Annahme).
FR-5 (Settings/Presets/Favoriten) – Mittel
Es gibt eine einfache Settings-/Presets-Seite:
Speichern von Favoriten (2–5 Timer).
Optionale Standardwerte für ausgewählte Timer (z. B. Default-Countdown-Dauer).
Speicherung lokal im Browser (kein Account).
FR-6 (Navigation & Orientierung) – Hoch
Konsistente Navigation:
Globaler Nav-Eintrag „Timers“ → /timers.
Breadcrumbs auf Timer-Welten-Seiten (Timers > Pomodoro).
„Next timer / Previous timer“-Links in /timers/<slug>.
Nicht-funktionale Requirements (NFR)
NFR-1 – Lesbarkeit & Projektor – Hoch
Large-Type-Layout: Ziffern im Timer-Player so groß wie möglich.
Textzeilen in Timer-Welten max. ~70–80 Zeichen (Desktop).
NFR-2 – Kontrast & Accessibility – Hoch
Text/BG-Kontrast mindestens WCAG AA.
Fokuszustände klar sichtbar.
Tastaturbedienung für alle relevanten Controls (Start/Stop, Presets, Links).
NFR-3 – Minimal Interaktion – Hoch
Timer starten in max. 1–2 Interaktionen (Click/Key).
Keine überflüssigen Animationen (und respektieren prefers-reduced-motion).
NFR-4 – Performance & Offline-Freundlichkeit – Mittel
Timer-Player und Timer-Welten laden schnell (keine schweren Libs).
Inhalte (Texte, Illustrationen) so angelegt, dass statische Generierung möglich ist.
NFR-5 – Konsistenz & Re-Use – Mittel
Wiederverwendung von Komponenten (Hero, Ritual-Cards, Fact-Plaques) über alle Timer-Welten hinweg.
Success Criteria (SC)
SC-1 – Start-Path – Hoch
Nutzer:innen können einen der Haupt-Timer von der Startseite aus in max. 2 Interaktionen im Vollbild starten.
SC-2 – Lesbarkeit im Raum – Hoch
Timer-Player sind aus einer angenommenen Distanz von 3–5 m gut ablesbar (Zahlenhöhe, Kontrast, kein Clutter).
SC-3 – Understanding of Use – Mittel
Mindestens 80 % der getesteten Nutzer:innen können nach dem Lesen einer Timer-Weltseite erklären:
Wofür der Timer gedacht ist.
Wie ein typisches Ritual abläuft (z. B. Pomodoro-Zyklus).
SC-4 – Navigation Klarheit – Mittel
In Nutzertests finden 90 %:
Sowohl Timer-Player als auch Timer-Welt in < 10 Sekunden.
SC-5 – Content Skalierbarkeit – Mittel
Ein neuer Timer kann mit dem Template in < X Stunden Content erstellt werden (hier kein Wert, nur Zielrichtung, da keine Teamkapazitäten bekannt).
Implementierungsplan für AI-Agent
Logisch scheint mir, dass ein Ausführungs-Agent (oder ein UX/Product-Team) einen strukturierten Plan braucht, um dieses Konzept umzusetzen. Ich bleibe bewusst technikagnostisch, erwähne aber mögliche Artefakte.
1. Context
Title: Redesign „Timer-Welten & IA“ für stoppclock.com Summary:
Das Projekt strukturiert stoppclock.com neu in funktionale Timer-Player, narrative Timer-Welten und eine klare Navigation. Jede Timer-Art erhält eine eigene Microsite im Stil „Calm Stories“, die Character, Rituals, Effects und Time Facts vereint. Gleichzeitig bleiben Timer-Player extrem reduziert, projektorfreundlich und barrierearm. Scope
In scope: IA, Templates für Timer-Welten, Anpassung Timer-Player-UI, Visual Language, grundlegende Settings/Presets, Microcopy.
Out of scope: Neue Timer-Funktionalität, Accounts, tiefe Backend-Änderungen.
Success Criteria: Mapping auf SC-1 bis SC-5 aus dem Requirements-Extrakt.
2. Technical Framing
Faktisch korrekt sage ich, da der konkrete Tech-Stack nicht bekannt ist, beschreibt dieser Rahmen nur das Zielbild:
Tech Stack (Annahme):
Moderne Web-App (JS/TS), statisch generierbare Content-Pages (z. B. mit einem beliebigen Framework).
CSS-Variablen oder Utility-Framework für Theme-Styling.
Environment:
Bestehendes stoppclock-Repository (unbekannt).
Build-Pipeline für statische Seiten / Single-Page-App.
Repositories & Services:
1 Haupt-Repo für Frontend.
Optional: Content-Layer (Markdown/MDX, JSON oder Headless CMS).
Architektur-Overview:
„Timer Core“ (bestehende Timer-Player-Komponenten).
„Timer Worlds“ Content-Layer (JSON/Markdown pro Timer).
Routing: /<timer> für Player, /timers/<timer> für Worlds, /timers als Übersicht.
Designentscheidungen (key):
Content-Template statt „jede Seite per Hand“.
Strikte Trennung von Player vs. World.
Zentrale Design-Tokens (Farben, Typo, Spacing) plus Timer-spezifische Akzente.
3. Work Plan
Phase 0: Analyse & IA-Grundlage
T0.1: Bestehende stoppclock-IA & UIs auditieren
Description: Bestandsaufnahme aller vorhandenen Timer, URLs, Controls, Layouts und bestehenden Links („About the timers“ etc.).
Artifacts:
Kurzes Audit-Dokument (Liste aller Timer + aktuelle Routen).
Screenshot-Sammlung der wichtigsten Views.
DoD:
Alle existierenden Timer-Typen gelistet.
Aktuelle Navigationsstruktur dokumentiert.
Dependencies: None
Coverage: FR-1, FR-3, NFR-1 (indirekt)
T0.2: Content-Modell für Timer-Welten definieren
Description: Aus Character · Ritual · Effect · Time Facts ein strukturierter Satz Felder (z. B. JSON/YAML/Notion-Properties).
Artifacts:
Content-Schema (z. B. JSON- oder Notion-Template).
Beispiel-Eintrag für einen Timer (z. B. Pomodoro).
DoD:
Alle Elemente aus FR-2 abbildbar.
Schema von mindestens 1 Person aus dem Team reviewed.
Dependencies: T0.1
Coverage: FR-2, NFR-5
Phase 1: Informationsarchitektur & Navigation
T1.1: Neue IA & Routenstruktur ausarbeiten
Description: Definiere finale Seitenstruktur (Start, /timers, /timers/<slug>, Timer-Player-Routen) inkl. Navigations- und Breadcrumb-Regeln.
Artifacts:
IA-Diagramm (z. B. Miro/Figma/Markdown).
Routenliste im Repo (z. B. ia-routes.md).
DoD:
Alle FR-1, FR-3, FR-4, FR-6 Routen abgedeckt.
Team hat IA abgenickt.
Dependencies: T0.1
Coverage: FR-1, FR-3, FR-4, FR-6, SC-4
T1.2: Wireframe-Set für Kernviews erstellen
Description: Low/Medium-Fidelity-Wireframes für:
Startseite.
/timers Übersicht.
Timer-Welt (Template).
Timer-Player-Ansicht (z. B. Countdown).
Artifacts:
Wireframes (z. B. Figma/Whimsical) mit klar benannten Komponenten.
DoD:
Mindestens 1 Wireframe pro Kernview.
Annotation zu Projektor-Gebrauch (Zifferngrößen, Abstände).
Dependencies: T1.1
Coverage: FR-1 bis FR-4, NFR-1, NFR-3
Phase 2: Visual Language & Komponenten
T2.1: Design-Tokens & Typografie definieren
Description: Farben, Typo-Scale, Spacing-Scale, Ziffernstile festlegen.
Artifacts:
Design-Tokens-Dokument (z. B. design-tokens.md).
Style-Tafel im Design-Tool (Headings, Body, Accent, Ziffern).
DoD:
Token-Set deckt alle im Konzept genannten Fälle ab.
Kontrast-Check (mind. AA) dokumentiert.
Dependencies: T1.2
Coverage: NFR-1, NFR-2, NFR-5
T2.2: Timer-Welten-Komponenten spezifizieren
Description: UI-Komponenten beschreiben (Hero, Story-Block, Ritual-Card, Effect-Block, Fact-Plaque, CTA).
Artifacts:
Komponenten-Katalog (z. B. timer-worlds-components.md).
Optionale Figma-Component-Library.
DoD:
Jede Komponente mit Props/Varianten beschrieben.
Re-Use über alle Timer-Welten möglich.
Dependencies: T2.1
Coverage: FR-2, NFR-5
Phase 3: Timer-Welten für 1–2 Timer (MVP)
T3.1: Beispiel-Inhalte für Countdown & Pomodoro ausarbeiten
Description: Vollständige Texte (EN) für Character, Rituals, Effects, Time Facts für 2 Timer.
Artifacts:
Content-Dateien (z. B. pomodoro.yml, countdown.yml).
DoD:
Alle Content-Felder laut Schema gefüllt.
Testlesung auf Tonalität („calm, encouraging, clear“).
Dependencies: T0.2, T2.2
Coverage: FR-2, SC-3
T3.2: MVP-Implementierung der Timer-Welten-Ansicht
Description: Umsetzung der Template-Seite mit Content-Binding (Layout, Komponenten, Navigation + CTA „Open timer“).
Artifacts:
Template-Datei (z. B. TimerWorldPage).
Routen-Konfiguration für /timers und /timers/<slug>.
DoD:
Countdown & Pomodoro-Weltseiten rendern korrekt.
Navigation zwischen /timers, /timers/<slug> und Timer-Player funktioniert.
Dependencies: T3.1, T2.2, T1.1
Coverage: FR-1, FR-2, FR-3, FR-6, SC-4
Phase 4: Timer-Player-UI & Startseite
T4.1: Timer-Player-Layouts an Visual Language anpassen
Description: Bestehende Timer-Player visuell harmonisieren (Typo, Farben, Spacing) und konkrete Projektor-Modi sicherstellen.
Artifacts:
Updated UI-Spec für Countdown, Stopwatch, Pomodoro etc.
ggf. neue CSS-Module/Styles.
DoD:
Alle Haupt-Timer nutzen konsistente Design-Tokens.
Sichtprüfung: lesbar auf Standard-Beamer (interner Check).
Dependencies: T2.1, T1.2
Coverage: FR-3, FR-4, NFR-1, NFR-2, SC-1, SC-2
T4.2: Startseite & /timers-Übersicht finalisieren
Description: Umsetzung der Startseite mit Schnellzugriff auf Kern-Timer, Link zu /timers und klarer CTA „Open in full screen“.
Artifacts:
Startseiten-Template.
/timers-Grid/List-View.
DoD:
Haupt-Timer von Start aus in ≤2 Interaktionen im Vollbild startbar (interner Test).
/timers zeigt alle Timer mit Name, Kurzbeschreibung, Link.
Dependencies: T1.1, T4.1
Coverage: FR-1, FR-3, FR-4, SC-1, SC-4
Phase 5: Settings/Presets & Accessibility-Checks
T5.1: Settings/Presets-Konzept implementieren (MVP)
Description: Einfache Seite „Settings & presets“ mit Favoriten-Auswahl und optionalen Standardwerten pro Timer (lokale Speicherung).
Artifacts:
Settings-View.
Datenstruktur für Presets (z. B. localStorage-Schema).
DoD:
Favoriten beeinflussen Startseite (z. B. „pinned timers“).
Defaults werden beim Öffnen des jeweiligen Timers angewendet.
Dependencies: T1.1, T4.2
Coverage: FR-5, SC-1, SC-5
T5.2: Accessibility & Usability Smoke-Test
Description: Kurzer Testlauf (intern) mit Fokus auf Kontraste, Tab-Reihenfolge und Projektor-Szenarien.
Artifacts:
Checkliste (WCAG-Quick-Walkthrough).
Liste gefundener Issues.
DoD:
Alle Blocker (z. B. unbedienbare Controls) gefixt.
Kontrastprobleme dokumentiert & soweit möglich adressiert.
Dependencies: Alle UI-Tasks (T3.2, T4.1, T4.2, T5.1)
Coverage: NFR-1, NFR-2, NFR-3, SC-2
4. Validation & Handoff
Logisch scheint mir, folgende Testfälle sinnvoll:
TS-1 – Start-to-Fullscreen Path (SC-1)
Ablauf: Von Startseite einen Kern-Timer im Vollbild starten.
Erwartung: max. 2 Interaktionen (Click/Key) bis Vollbild.
TS-2 – Timer-Welten-Verständnis (SC-3)
Ablauf: 3–5 Testpersonen lesen eine Timer-Welt, beschreiben danach „Wofür?“ und „Wie nutze ich ihn?“.
Erwartung: Mehrheit kann grundlegende Verwendung erklären.
TS-3 – Navigation Klarheit (SC-4)
Ablauf: „Finde die Stopwatch und ihre Story-Seite“.
Erwartung: In < 10 Sekunden auffindbar.
TS-4 – Projektor-Lesbarkeit (SC-2)
Ablauf: Timer-Player auf großem Screen / simuliert, 3–5 m Abstand.
Erwartung: Ziffern und zentrale Informationen problemlos ablesbar.
TS-5 – Presets-Funktion (SC-1, SC-5)
Ablauf: Favoriten/Defaults setzen, Seite neu laden, Timer mit Presets starten.
Erwartung: Favoriten sichtbar, Defaults angewendet.
Finished Condition
Alle Tasks T0.1–T5.2 mit DoD erfüllt.
TS-1 bis TS-5 ohne kritische Probleme bestanden.
IA, Template & Visual Language dokumentiert und von dir abgenommen.
Mindestens 2 Timer-Welten live (MVP), klarer Weg zur Skalierung auf weitere Timer.
Coverage-Matrix FR→Tasks→Tests
Logisch scheint mir, diese vereinfachte Matrix zeigt die wichtigsten Abdeckungen:
ID	Typ	Kurzbeschreibung	Tasks	Tests	Notizen
FR-1	FR	/timers Übersicht	T1.1, T1.2, T3.2, T4.2	TS-3	Grid/List-Variante je nach Device
FR-2	FR	Timer-Welten-Template	T0.2, T2.2, T3.1, T3.2	TS-2	MVP: Countdown & Pomodoro
FR-3	FR	Verknüpfung Timer ↔ Timer-Welt	T1.1, T3.2, T4.1, T4.2	TS-1, TS-3	Link/Icon + CTA
FR-4	FR	Startseite mit Schnellzugriff	T1.2, T4.2	TS-1	Fokus auf 3–6 Kern-Timer
FR-5	FR	Settings/Presets/Favoriten	T5.1	TS-5	Nur lokal, kein Account
FR-6	FR	Navigation & Orientierung	T1.1, T3.2, T4.2	TS-3	Breadcrumbs, Next/Prev
NFR-1	NFR	Lesbarkeit & Projektor	T1.2, T2.1, T4.1	TS-4	Distanz nur angenommene Range
NFR-2	NFR	Kontrast & Accessibility	T2.1, T5.2	TS-4	Voll-WCAG-Audit optional später
NFR-3	NFR	Minimal Interaktion	T1.2, T4.1, T4.2	TS-1	1–2 Interaktionen Ziel
NFR-5	NFR	Konsistenz & Re-Use	T0.2, T2.2, T3.2	TS-2, TS-3	Designsystem-Light
SC-1	SC	Start in ≤2 Interaktionen	T4.2, T5.1	TS-1, TS-5	Exakte Messung in Tests
SC-2	SC	Projektor-Lesbarkeit	T4.1	TS-4	Eher qualitativer Test
SC-3	SC	Verständnis pro Timer-Welt	T3.1	TS-2	Nutzer:innen-Qualitest
SC-4	SC	Navigation klar	T1.1, T4.2	TS-3	Usability-Test
SC-5	SC	Content schnell skalierbar	T0.2, T3.1, T5.1	TS-5	Interne Einschätzung Zeitaufwand

Zeitplan (Day 0–7 Ship-Loop)
Logisch scheint mir, ein realistischer Mini-Zyklus könnte so aussehen (für MVP mit 1–2 Timer-Welten):
Day 0 – Ziel & DoD schärfen
T0.1 (Audit) grob.
T0.2 (Content-Schema).
Ziel: Klarheit über Timerliste & Template.
Day 1–2 – IA & Design-Grundlagen
Day 1: T1.1 (IA/Routen), T1.2 (Wireframes).
Day 2: T2.1 (Design-Tokens), Start T2.2 (Komponenten).
Ziel: Wireframes + Basistypo + Farbsystem stehen.
Day 3 – Erste Timer-Welten-Inhalte
T3.1 (Content für Countdown & Pomodoro).
Interne Testlesung (Ton, Genderneutralität, EN).
Ziel: 2 voll ausgearbeitete Content-Sätze.
Day 4–5 – Umsetzung MVP-Views
Day 4: T3.2 (Timer-Welten-Template), Routing /timers, /timers/<slug>.
Day 5: T4.1 (Timer-Player optisch harmonisieren), T4.2 (Startseite).
Ziel: Alles klickbar, End-to-End Flow: Start → Timer-Welt → Timer-Player.
Day 6 – Settings & Checks
T5.1 (Settings/Presets).
T5.2 (Accessibility/Projector-Smoketest).
Ziel: Favoriten + Presets funktionieren, keine groben A11y-Blocker.
Day 7 – Mini-Launch & Beobachtung
Interne/erste öffentliche Version ausrollen.
Erste Beobachtungen: Klickpfade, Scrolltiefe (sobald Analytics vorhanden).
Ziel: Lernen für Skalierung auf weitere Timer.
Risiken & Annahmen
Faktisch korrekt sage ich, diese Punkte sind wichtig transparent zu halten:
Fehlende Analytics-Daten
Risiko: IA oder Priorisierung spiegelt nicht reale Nutzung wider.
Gegenmaßnahme: MVP ausrollen und Tracking (Klicks auf Timer, Scrolltiefe, Verweildauer) nachziehen.
Content-Aufwand pro Timer
Risiko: Vollständige Character/Ritual/Effect/Facts-Texte für alle Timer sprengen Kapazitäten.
Gegenmaßnahme: MVP-Content (Hero + 3 Rituale + 3 Facts) und später iteratives Ausbauen.
Tech-Stack-Unklarheit
Risiko: IA/Template-Idee passt nicht gut zum bestehenden Code.
Gegenmaßnahme: Vor der Implementation T0.1-Erkenntnisse mit Dev checken.
Projektor-Szenarien unterschätzt
Risiko: Design wird am Laptop geprüft, aber nicht „in groß“.
Gegenmaßnahme: Mindestens ein echter Beamer-Test vor Launch.
Marken-Tonalität
Risiko: Personifizierung der Timer wirkt zu verspielt oder unpassend.
Gegenmaßnahme: Kleine, klare Style-Guidelines für Ton & Wortwahl; Probetexte.
Offene Fragen an das Team
Logisch scheint mir, diese Fragen würden das Konzept deutlich schärfen:
Top-Timer & Priorisierung
Welche 3–5 Timer sind heute am wichtigsten (Nutzung, Bauchgefühl, Marke)? Mit denen sollten wir Timer-Welten starten.
Geräte-Mix & Projektor-Anteil
Wie häufig werden Timer real auf Beamer/TV vs. nur am Laptop/Tablet genutzt (auch nur subjektive Einschätzung)?
Sprachen & Lokalisierung
Bleibt stoppclock vorerst rein englisch, oder planst du mittelfristig Mehrsprachigkeit (DE, weitere)?
Tech-Stack-Realität
Welcher konkrete Frontend-Stack läuft aktuell (Plain JS, React, SvelteKit, etwas anderes)? Gibt es schon einen Content-Layer?
Rolle von „Space for Time“ / Blog
Sollen Timer-Welten später mit längeren Texten/Essays (Time Museum / User Stories) verknüpft werden, oder strikt kurz & knapp bleiben?
Team-Kapazität für Content
Wie viel Zeit pro Woche kannst du realistisch in das Schreiben/Kuratieren der Texte investieren (damit wir Content-Tiefe planen können)?
Wenn du möchtest, kann ich als nächsten Schritt eine konkrete Beispielseite (inkl. kompletter Texte & Microcopy) für z. B. den Pomodoro- oder Countdown-Timer im beschriebenen Layout ausformulieren.