Ich teile das in:

Brainstorm-Ergebnis (Stand + neue Marker-Ideen)

Requirements-Extrakt für die neuen Features

Implementierungsplan (Iteration 3)

Coverage-Matrix

Zeitplan Day-0–7

Risiken & Annahmen

1. Brainstorm-Ergebnis
1.1 Grobe Einschätzung: Was ist wahrscheinlich schon da / in Arbeit?
Logisch scheint mir, aus allem, was du beschrieben hast (Calm Minimal Grid, Timer-Welten, Chess/Couple-Timer-Texte, Designsystem-Skizzen):

Designbasis & Hauptseite (Calm Minimal Grid):

Layout- und Typo-Idee ist klar (Modern Minimalist-Style, Timer-Grid, Pinned-Leiste).

Wahrscheinlich existiert schon ein Figma oder erste React-Page.

Subjektive Schätzung: ~60–70 % „fertig genug für MVP“.

Timer Worlds (Couple / Chess / evtl. weitere):

Narrative Struktur (Character, Rituals, Effects, Time Facts) steht.

Texte für Couple & Chess sind weit, Designsystem-Entwurf ist da.

Subjektive Schätzung: ~40–50 % der World-Infrastruktur, ~70 % Content für 2 Welten.

Design System („Timer World Design System“):

Typo-Styles, Farbtoken-Ideen, Komponenten (Cards, Sections) sind definiert.

Noch nicht komplett in Code gegossen / konsolidiert.

Subjektive Schätzung: ~50–60 %.

Meta-Time-Features („Since then / Until then“) – aktuell:

Bisher nur als Idee / Marker erwähnt, kein UI/Architektur-Design.

Subjektive Schätzung: ~0–10 % (nur Brainstorm-Level).

Ich kann die ZIP nicht inspizieren, also sind das bewusste Annahmen, keine Fakten – eher eine „Planungs-Schätzung“.

1.2 Neue Feature-Klasse: „Meta Time / Time Weirdness“
Faktisch korrekt sage ich, du hast gerade einen ganzen Strauß neuer Feature-Ideen beschrieben, die sich alle um Markenzeitpunkte, Kalender und „unnütze, aber schöne“ Zeitinfos drehen:

A) „Since then“ Marker – vergangene Zeit seit besonderen Ereignissen

Seit dem Urknall (Big Bang) – symbolische, spielerische Anzeige.

Seit der Titanic-Katastrophe,

seit dem Ende des Zweiten Weltkriegs,

seit der ersten digitalen Uhr (Casio etc.),

seit beliebigen historischen / kulturellen Ereignissen.

→ Allgemeiner Mechanismus:

„Zeig mir, wie viel Zeit seit Ereignis X vergangen ist.“

B) „Until then“ Marker – Zeit bis zu besonderen Zeitpunkten

Bis zur nächsten Sommersonnenwende / Wintersonnenwende.

Bis zum nächsten Vollmond.

Bis zur nächsten Zeitumstellung (Sommer-/Winterzeit).

Wie lange die aktuelle Jahreszeit schon läuft + wie lange noch bis zur nächsten.

Zeit bis Weihnachten, Advent, „Fest X“.

→ Allgemeiner Mechanismus:

„Zeig mir, wie viel Zeit bis Ereignis Y bleibt.“

C) Multi-Kalender-Neujahr & globale Silvester-Uhr

Restzeit bis westliches Neujahr (31.12.).

Restzeit bis chinesisches Neujahr, thailändisches Neujahr, evtl. andere Kalender.

Anzeige pro Zeitzone/Ort: „Wann ist hier/da genau Neujahr?“

Eine Art „Neujahrs-Tafel“, die weltweit zeigt: „Hier ist es schon 202X, hier noch nicht“.

D) Film- & Popkultur-Sync („On-time timing“) – optional extra Verrücktheit

Idee: „Wenn du Film X um hh:mm startest, fällt Szene Y genau auf Zeitpunkt Z (Silvester, Mitternacht, etc.).“

Quasi ein Startzeit-Rechner für bestimmte Filmszenen („Forrest Gump“, „Harry Potter“, …).

Kern: „Zu welcher Uhrzeit muss ich starten, damit Szene Y mit Event Z zusammenfällt?“

1.3 Produkt-Vision für diese Marker
Rein subjektiv, aus meinem Denken ergibt sich:
Das schreit nach einer eigenen „Welt“ oder Kategorie, z. B.:

„Time Lab“ oder „Time Oddities“ oder „Time Museum“

Dort könnte man:

„Since then“ als vertikale Liste von Ereignissen haben: Big Bang, Titanic, WWII-Ende, erste Digitaluhr, eigenes Geburtsdatum (später).

„Until then“ für astronomische und kalendarische Zyklen (Solstice, Vollmond, Jahreszeiten, Feiertage).

„New Year Grid“ für globale Neujahrszeiten.

„Movie Sync“ als kleine, verrückte Spielwiese.

Wichtig: Alles im stoppclock-Stil: ruhig, typografisch, ohne blinkende Freakshow.

2. Requirements-Extrakt – Meta-Time / Marker-Features
2.1 Functional Requirements (FR)
FR-META-1 (H) – Meta-Time-Übersichtsseite
Es gibt eine eigene Meta-Time-Seite (z. B. /time-lab), die eine kuratierte Auswahl von Since-then- und Until-then-Markern darstellt, jeweils mit klarer Beschriftung und ruhiger Visualisierung.

FR-META-2 (H) – „Since then“-Engine
Das System kann für jede definierte Referenz (event_date, event_label) die vergangene Zeit bis jetzt berechnen und in mehreren Formaten anzeigen (Jahre, Tage, Stunden, Sekunden).

Data für Ereignisse (Big Bang, Titanic etc.) wird später geliefert – die Architektur muss datengetrieben sein.

FR-META-3 (H) – „Until then“-Engine
Das System kann für kommende Ereignisse (target_date) die verbleibende Zeit bis dahin berechnen und als Countdown darstellen (z. B. bis nächste Sommersonnenwende, nächster Vollmond, nächste Zeitumstellung, Weihnachten).

FR-META-4 (M) – Saison- & Jahreszeiten-Marker
Für die aktuelle Jahreszeit zeigt das System:

wie lange sie schon läuft (Since-then),

wie lange sie noch dauert (Until-then),

optional nettes Label („We’re X% through this season“).

FR-META-5 (M) – Multi-New-Year-Marker
Das System zeigt:

Restzeit bis zum nächsten westlichen Jahreswechsel,

Restzeit bis zum nächsten chinesischen/thailändischen Neujahr (Datenquelle später),

pro Standort/Zeitzone, wenn Nutzer:in einen Ort auswählt.

FR-META-6 (M) – Location- & Zeitzonen-Kontext
Der/die Nutzer:in kann optional einen Ort/Zeitzone setzen (oder automatisch erkennen lassen), und alle Marker passen sich dieser Zeitzone an.

FR-META-7 (L) – Film-Sync-Rechner
Für einige vordefinierte Filme/Events kann das System ausgeben:

„Wenn du Film X um hh:mm startest, fällt Szene Y genau auf Datum/Zeit Z.“

FR-META-8 (H) – UI-Integration in stoppclock
Die Marker sind:

über Navigation erreichbar (z. B. Tab „Time Lab“),

im selben Design-System (Typo, Grid),

nicht „lauter“ als die eigentlichen Timer.

2.2 Non-Functional Requirements (NFR)
NFR-META-1 (H) – Genauigkeit & Transparenz

Astronomische und kalendarische Events sollen nach zuverlässigen Quellen implementiert werden (z. B. Library/API – konkretes Tech-Detail später).

Wichtiger Punkt: Für symbolische Marker wie „since the Big Bang“ gibt es einen klaren Hinweis, dass es sich um eine angenäherte, spielerische Darstellung handelt.

NFR-META-2 (H) – Performance

Meta-Time-Seite lädt schnell (keine schweren Bilder, Berechnungen im ms-Bereich).

Komplexe Berechnungen (z. B. Moon-Phases), falls nötig, gecacht oder in Worker ausgelagert.

NFR-META-3 (M) – Accessibility

Alle Infos sind textlich zugänglich (Screenreader),

Farben sind nur unterstützend (kein reiner „bunter Daten-Gag“).

NFR-META-4 (M) – Ruhe & Fokus

Optik bleibt „calm, minimal“;

keine übertriebenen Animationen;

humorvolle Inhalte ja, aber typografisch sauber.

2.3 Success Criteria (SC)
SC-META-1 – Auffindbarkeit
Mindestens 80 % der Testpersonen finden von der Hauptseite aus innerhalb von 10 Sekunden in den „Time Lab / Meta Time“-Bereich.

SC-META-2 – Verständlichkeit
Mindestens 80 % können nach kurzem Lesen erklären:

„Hier sehe ich, wie viel Zeit seit Ereignis X vergangen ist oder bis Ereignis Y bleibt.“

SC-META-3 – Spaß / „Delight“
In qualitativen Tests beschreiben >60 % der Nutzer:innen die Seite als „witzig“, „unerwartet“ oder „macht Lust, rumzuklicken“ – ohne dass sie die Seite als „unseriös“ empfinden.

SC-META-4 – Erweiterbarkeit
Neue Marker (weitere Ereignisse/Kalender) können ohne Codeänderung an der UI über Datenkonfiguration hinzugefügt werden.

3. Implementierungsplan für AI-Agent (Iteration 3 – Meta Time)
3.1 Kontext
Faktisch korrekt sage ich:

Title: Meta Time & Time Lab – Iteration 3

Ziel: Eine neue stoppclock-Dimension, in der Zeit-Marker (Since-then / Until-then / Kalender / Seasons / Pop-Culture) in einer ruhigen, modernen UI sichtbar werden – ohne die Kern-Timer zu stören.

Scope (Iteration 3):

MVP-Time-Lab-Seite mit:

3–5 „Since then“-Ereignissen,

3–5 „Until then“-Ereignissen (Solstice, Weihnachten, Jahres-Ende, evtl. nächster Vollmond),

Grundstruktur für Multi-New-Year,

Architektur-Hooks für Film-Sync (UI-Platzhalter, aber Logik kann nachgereicht werden).

Non-Scope (Iteration 3):

Vollständige Film-Datenbank,

alle Kalender der Welt,

detaillierte historische Datenbank.

3.2 Technischer Rahmen
Logisch scheint mir, auf Basis deiner bisherigen Präferenzen:

Tech-Stack:

Next.js + React

Tailwind CSS für Spacing/Typo

Optional: geringe Framer-Motion-Animationen (für sanfte Counter-Fades)

Architektur:

domain/meta-time/ mit:

events.ts (Liste der Marker: Big Bang, Titanic, etc.)

calculations.ts (Utility-Funktionen: since / until / season progress)

components/MetaMarkerCard, MetaSection etc.

Design-System:

Basierend auf Modern Minimalist (hell, klar, tech)

Pro Marker-Kategorie leichte Themen-Variationen (Ocean Depths/Golden Hour etc.), aber immer im Rahmen des Systems.

3.3 Work Plan – Iteration 3 (Phasen & Tasks)
Ich nummeriere Tasks als T3.x, weil Iteration 3.

Phase 3.0 – Repo-Audit & Mapping (Konzept-Check)
Ziel: Klären, was real schon existiert (wir hier im Chat können den Code nicht sehen, aber das ist eine Aufgabe für das Projektteam).

T3.0 – Repository-Status dokumentieren

Description:

Öffne das entpackte Repo, liste vorhandene Pages/Komponenten, prüfe, was von:

Calm Minimal Grid Hauptseite,

Timer-Welten-Struktur,

Design-System (Text/Color-Styles),

bereits existiert.

Mache eine Kurzübersicht („Feature → Status 0–100 %“).

Artifacts: docs/repo-status-iteration-3.md

DoD:

Dokument mit Liste aller relevanten Pages/Components ist im Repo.

Für jede Hauptkomponente gibt es eine kurze Status-Notiz.

Dependencies: none

Coverage: indirekt alle FRs; Basis für Planung.

Phase 3.1 – Domain Design „Meta Time“
T3.1 – Meta-Time-Domainmodell definieren

Description:

Definiere Datenstrukturen wie:

MetaEvent (id, type: 'since' | 'until', name, description, referenceDate, category, visualThemeId, flags: 'symbolic', sourceHint).

Lege fest, wie seasons, new year, astronomical events modelliert werden (z. B. eigene Typen oder MetaEvent + calculator).

Artifacts: domain/meta-time/types.ts, docs/meta-time-domain.md

DoD:

Types sind implementiert (oder mindestens exakt spezifiziert).

Dokument erklärt: wie legt man ein neues Event an?

Dependencies: T3.0

Coverage: FR-META-2, FR-META-3, FR-META-4, FR-META-5, SC-META-4

T3.2 – Calculations & Utilities (Since/Until)

Description:

Implementiere Utility-Funktionen:

getTimeSince(referenceDate, now, timezone)

getTimeUntil(targetDate, now, timezone)

getSeasonProgress(now, hemisphere) (Season-Start/Ende später konfigurierbar)

Berücksichtige Timezone-Param.

Artifacts: domain/meta-time/calculations.ts

DoD:

Unit-Tests für verschiedene Beispiele (Vergangenheit, Zukunft, jetzt).

Edge Cases (event in the future for since → handled mit Hinweis).

Dependencies: T3.1

Coverage: FR-META-2, FR-META-3, FR-META-4, NFR-META-1

Phase 3.2 – Meta-Time-Content (MVP-Ereignisliste)
T3.3 – MVP-Ereignis-Katalog anlegen

Description:

Lege eine erste events.ts an mit z. B.:

Since: Big Bang (symbolic), Titanic, End WWII, erste Digitaluhr.

Until: nächste Sommersonnenwende, nächstes westliches Neujahr, nächstes Weihnachtsfest.

Markiere symbolische Events (isSymbolic: true).

Artifacts: domain/meta-time/events.ts

DoD:

Liste existiert mit mind. 3–5 since + 3–5 until-Events.

Symbolische / unsichere Daten haben Hinweis im Kommentar.

Dependencies: T3.1

Coverage: FR-META-2, FR-META-3

T3.4 – New-Year- und Season-Setups definieren

Description:

Konfiguriere:

westliches Neujahr (Greg.-Kalender),

mind. 1 weiteres (z. B. chinesisches oder thailändisches Neujahr; Daten erstmal als Platzhalter).

Jahreszeiten: Startdaten für Nordhalbkugel (Frühling, Sommer, Herbst, Winter).

Artifacts: domain/meta-time/calendars.ts

DoD:

Datenstruktur für NewYearEvent & Season existiert.

Dummy-/Platzhalterdaten mit TODO-Kommentaren sind dokumentiert.

Dependencies: T3.1

Coverage: FR-META-4, FR-META-5

Phase 3.3 – Meta-Time-UI (Time Lab Seite)
T3.5 – UI-Konzept „Time Lab“ entwerfen

Description:

Entwirf in Figma/Markdown die Struktur für /time-lab:

Hero: Time Lab – odd and quiet ways to look at time.

Section: „Since then“ (Liste von Cards)

Section: „Until then“ (Liste von Cards)

Subsection: seasons / new year teaser.

Definiere Komponenten: MetaMarkerCard, MetaSection, MetaHero.

Artifacts: design/time-lab-wireframe.fig oder docs/time-lab-wireframe.md

DoD:

Wireframe dokumentiert (Desktop + Mobile).

Komponenten-Namen sind mit Frontend abgestimmt.

Dependencies: T3.0

Coverage: FR-META-1, FR-META-8

T3.6 – MetaMarkerCard-Komponente implementieren

Description:

Baue MetaMarkerCard mit:

Name / Label,

kurze Beschreibung,

Hauptwert (XX years, YY days oder in X days, Y hours),

optional Subwerte (z. B. „= XYZ seconds“),

Symbol-Hinweis, wenn Event symbolisch ist (This is a symbolic approximation.).

Artifacts: components/meta/MetaMarkerCard.tsx

DoD:

Card ist responsiv, nutzt Designsystem-Styles,

erhält Daten nur aus MetaEvent + Berechnungsfunktionen.

Dependencies: T3.2, T3.3

Coverage: FR-META-1, FR-META-2, FR-META-3, NFR-META-3, NFR-META-4

T3.7 – Time-Lab-Seite implementieren

Description:

Implementiere Seite /time-lab:

lädt MetaEvents aus events.ts,

gruppiert sie nach type (since, until, season, newyear),

rendert je Gruppe eine Section mit MetaMarkerCard-Grid.

Artifacts: pages/time-lab.tsx

DoD:

Page lädt ohne Fehler,

erste Events werden korrekt berechnet & angezeigt,

Lighthouse / Performance ok,

Focus/Tab-Nav funktioniert.

Dependencies: T3.2, T3.3, T3.5, T3.6

Coverage: FR-META-1, FR-META-2, FR-META-3, FR-META-4, FR-META-5

Phase 3.4 – Navigation & Integration
T3.8 – Navigationseintrag & Teaser

Description:

Füge in der Haupt-Navigation einen Eintrag „Time Lab“ (oder ähnlicher Name) hinzu.

Optional: auf der Timer-Hauptseite (/timers) ein kleiner Teaser-Block:
Curious about time? Visit the Time Lab for symbolic and seasonal clocks.

Artifacts: layout/Header.tsx, pages/timers.tsx (Update)

DoD:

Link sichtbar auf Desktop und Mobile,

Time Lab von der Hauptseite aus erreichbar.

Dependencies: T3.7

Coverage: SC-META-1

Phase 3.5 – Optional: Film-Sync Skeleton
T3.9 – Film-Sync-Konzept & Platzhalter

Description:

Definiere Datenmodell für Film-Sync (FilmSyncEntry: film, sceneDescription, offsetFromStart, targetEvent).

Baue einen kleinen Platzhalter-Abschnitt in Time Lab:
„Movie sync (coming soon)“ mit 1–2 Beispielzeilen.

Logik zur exakten Berechnung kann später ergänzt werden.

Artifacts: domain/meta-time/film-sync.ts, UI-Platzhalter in /time-lab

DoD:

Platzhalter zeigt Konzept, ohne echte Berechnung zu behaupten.

Datenmodell vorhanden, aber Events können leer sein oder TODO-markiert.

Dependencies: T3.1, T3.7

Coverage: FR-META-7 (teilweise), SC-META-4 (Erweiterbarkeit)

4. Coverage-Matrix FR→Tasks→Tests (Kurzfassung)
ID	Typ	Abgedeckte Tasks	Tests (Beispiele)
FR-META-1	FR	T3.5, T3.6, T3.7, T3.8	TS-1: Time-Lab lädt & gruppiert
FR-META-2	FR	T3.1, T3.2, T3.3	TS-2: Since-then-Berechnung
FR-META-3	FR	T3.1, T3.2, T3.3	TS-3: Until-then-Berechnung
FR-META-4	FR	T3.1, T3.2, T3.4, T3.7	TS-4: Season-Progress
FR-META-5	FR	T3.1, T3.4, T3.7	TS-5: New-Year-Restzeit
FR-META-6	FR	(später: Location-Handling)	TS-6: Zeitzonenwechsel
FR-META-7	FR	T3.9 (Konzept), später mehr	TS-7: Film-Sync-Sanity (später)
FR-META-8	FR	T3.5, T3.6, T3.7, T3.8	TS-8: Style-Konsistenz
NFR-META-1	NFR	T3.2, T3.3, T3.4	TS-9: Data- & Hinweis-Check
NFR-META-2	NFR	T3.7	TS-10: Performance
NFR-META-3	NFR	T3.6, T3.7	TS-11: A11y (Screenreader)
NFR-META-4	NFR	T3.5, T3.6	Visuelles Review
SC-META-1	SC	T3.8, T3.7	Usability-Test: Auffindbarkeit
SC-META-2	SC	T3.5, T3.6, T3.7	Usability-Test: Verständnis
SC-META-3	SC	T3.7, T3.9	Qualitative Interviews
SC-META-4	SC	T3.1, T3.3, T3.4, T3.9	Code-Review (Erweiterbarkeit)

5. Zeitplan (Day 0–7 Ship-Loop für Iteration 3)
Logisch scheint mir, ein realistischer Mini-Sprint könnte so aussehen:

Day 0 – Ziel schärfen, Repo-Status

T3.0: Repo-Audit durchführen, Status-Doku schreiben.

T3.1: Domainmodell grob skizzieren.

Day 1 – Domain & Utilities

T3.1: MetaEvent/Season/NewYear-Types finalisieren.

T3.2: getTimeSince / getTimeUntil / Season-Helper implementieren (+ schnelle Unit-Tests).

Day 2 – Content & Daten

T3.3: MVP-Ereignisliste (Big Bang, Titanic, WWII, erste Uhr, Weihnachten, Neujahr).

T3.4: Season- & New-Year-Konfiguration (Platzhalterdaten).

Day 3 – Time-Lab UI-Konzept

T3.5: Layout in Figma/Markdown definieren.

Erste Implementierung von MetaMarkerCard (T3.6 beginnen).

Day 4 – Time-Lab Page

T3.6 abschließen: Card-Komponente.

T3.7: /time-lab Page implementieren, Daten binden.

Day 5 – Integration & Feinschliff

T3.8: Navigation + Teaser in Hauptseite einbauen.

A11y/Performance-Check, Copy-Tuning („symbolic approximation“-Hinweise).

Day 6 – Optional: Film-Sync-Platzhalter

T3.9: Datenmodell & Mini-Section „Movie sync (coming soon)“.

Day 7 – Review & Ship

Kleine User-Tests (2–3 Leute): Finden & verstehen sie Time Lab?

Bugs fixen, Feature als Beta markieren.

6. Risiken & Annahmen
Annahmen (transparent):

Ich konnte die ZIP nicht entpacken → meine Fortschritts-% sind heuristische Schätzungen, kein Audit.

Du hast bereits:

ein Grund-Designsystem im Einsatz,

eine Timer-Hauptseite, die später den „Time Lab“-Link aufnehmen kann.

Event- und Kalenderdaten (chinesisches Neujahr, exakte Vollmonde, Urknall-Alter) werden später aus zuverlässigen Quellen eingebunden.

Risiken & Gegenmaßnahmen:

Daten-Genauigkeit & Vertrauen

Risiko: Historische & astronomische Daten sind heikel; User könnten Präzision erwarten.

Gegenmaßnahme:

Symbolische Events klar als solche labeln,

Quellen/Disclaimer verlinken,

kritische Marker (z. B. Big Bang) ausdrücklich als „approximate, playful“ markieren.

Scope-Creep bei „Weirdness“

Risiko: Zu viele Gag-Features → Produkt wirkt nicht mehr fokussiert.

Gegenmaßnahme:

MVP-Kuratierung: lieber wenige, sehr gut gestaltete Marker.

Time Lab bewusst als „Side Wing“ labeln, nicht als Kern-Tool.

Tech-Komplexität (Zeitzonen, Kalender)

Risiko: Schnell viele Sonderfälle (Zeitzonen, Non-Gregorian-Kalender).

Gegenmaßnahme:

Iteration 3 nur mit 1–2 zusätzlichen Kalendern und sauberer Architektur.

Später Schrittweise erweitern.

Kohärenz mit bestehendem Design

Risiko: Time Lab wirkt wie eigenes Produkt.

Gegenmaßnahme:

Gleiche Typo & Layout wie Timer-Welten,

Themes nur als leichte Akzente verwenden (nicht full-screen).