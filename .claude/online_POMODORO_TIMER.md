Online-Pomodoro-Timer (hier „Pomodoro“ i.S.d. Technik), abgeleitet aus Marktmechaniken, Psychologie und den Mustern erfolgreicher Tools.

Zielbild

Ein schneller, zuverlässiger, ablenkungsarmer Timer, der Fokus, Motivation und Wohlbefinden unterstützt – nicht nur Minuten zählt. Er kombiniert radikale Einfachheit (Pomofocus-Stil) mit visualisierter Zeit (Time-Timer-Prinzip), anpassbaren Intervallen, leichtgewichtigen Aufgaben und optionalen Motivations-Features (Gamification, Social), ohne je überladen zu wirken.

Must-haves (ohne die es kein Produkt gibt)

1) Sofortstart & Frictionless UX

1-Klick-Start auf Standard 25:00 Pomodoro; große, kontrastreiche Anzeige.

Tastatur-Shortcuts: Start/Stop (Space), Nächste Phase (Enter), +/– 1 Minute (↑/↓).

„Auto-weiter“ (optional): Nach Ablauf automatisch in Pause/Arbeitsphase wechseln.

PWA-fähig (installierbar), blitzschneller Load (<1s auf moderater Verbindung).

2) Robuste Zeitmessung (Zuverlässigkeit > Features)

Präzise weiterlaufend im Hintergrund/bei Tab-Wechsel (WebWorker), korrekte Fortsetzung nach Sleep/Wake.

Korrektes Verhalten bei Netzverlust, DST-Wechsel, mehreren Tabs (nur 1 aktiver Timer).

Lokale Persistenz (LocalStorage/IndexedDB) für Sessions; keine Datenverluste.

3) Pomodoro-Kernlogik

Konfigurierbare Zyklen: Arbeit (Standard 25), Kurzpause (5), Langpause (15–30) nach n Zyklen.

Modus-Umschalter: Pomodoro | Flowtime (aufwärts zählen, Pause wenn Fokus nachlässt) | Custom Intervall.

Buttons „+5 verlängern“, „Früh beenden“, „Pause jetzt“.

4) Klarheit & Visualisierung

Deutlich lesbarer Countdown plus visuelle Fortschrittsdarstellung (Ring/Segment, optional „schwindende Scheibe“).

Farbcodierung: Arbeit/kurze Pause/lange Pause; farbfehlsicht-taugliche Palette.

Optionaler diskreter Fortschrittsbalken in der Browser-Tab-Leiste/Title-Badge.

5) Leichtgewichtige Aufgabenverwaltung

Inline-To-dos mit geschätzten Pomodoros (z. B. 2x25).

Schnelles Abhaken; automatische Session-Zuordnung zur aktiven Aufgabe.

Tagesziel (z. B. 6 Pomodoros) mit sichtbarem Fortschritt.

6) Feedback & Benachrichtigungen

System-Notifications (Web Push) & sanfte Töne (wahlweise stumm).

„Bitte-nicht-stören“-Hinweis (Anleitung/Shortcut), um OS-DND zu aktivieren.

Minimal invasiv, nie werbend während eines Pomodoros.

7) Datenschutz & Barrierefreiheit

Privacy-by-Default: lokal funktionsfähig, ohne Account.

Screenreader-Labels, fokussierbare Controls, hohe Kontraste, dyslexiefreundliche Schrift; Tastaturbedienbarkeit 100%.

Should-haves (macht gut → sehr gut)

8) Personalisierung & Energie-Management

Presets: „Standard“, „Deep Work“ (50/10), „Schreiben“, „Lernen“.

Adaptive Empfehlungen (regelbasiert): „Du brichst nach ~18 min häufig ab → kürzere Intervalle versuchen?“

Optional: Ambient-Sounds (Regen, Kamin, Lo-Fi) & Themes (dezent – Fokus zuerst).

9) Gamification – subtil & seriös

Streaks, sanfte Belohnungen (z. B. „Focus-Blätter“ statt schrille Punkte).

„Verlustaversion light“: Nur positive Bestärkung; nie Schuld-Gamification.

Team/Studium: „Gemeinsam fokussieren“-Sessions (Co-Focus), anonymisierte Anwesenheit.

10) Reports, Einsichten, Fortschritt

Tages/Wochen-Berichte: Fokuszeit je Aufgabe/Projekt, Pausenquote, längste ununterbrochene Session.

„Flow-Fenster“ (wann gelingt’s dir typischerweise?).

Export (CSV/ICS) & einfache API/Webhooks.

11) Integrationen (Premium-geeignet)

Todoist/Asana/Notion: Aufgaben verknüpfen.

Kalender-Sync: Fokusblöcke als „busy“ eintragen.

Browser-Extension (später): Soft-Site-Blocking, Fokus-Start aus jeder Seite.

12) Cross-Device Sync

Optionaler Account → verschlüsselte Cloud-Sync von Aufgaben/Sessions/Settings.

Datenschutz-Einstellung: lokale-only weiterhin möglich.

Won’t-haves (bewusste Nicht-Features zum Start)

Keine laute, aufdringliche Werbung (widerspricht Fokus-Versprechen).

Kein schweres Projektmanagement; der Timer bleibt Kern.

Kein aggressives „Hard-Blocking“ von Apps/Webseiten ohne Browser-Extension.

Detaillierte Funktionsanforderungen

A. Timer-Engine

Zustände: work | short_break | long_break | paused.

Übergänge: Auto/Nicht-Auto konfigurierbar; „Skip“ loggt verkürzte Dauer mit Flag.

Genauigkeit: Abweichung < ±1 s/25 min; Hintergrund-Drift korrigieren via „now() – lastTick“.

Akzeptanzkriterien

Start → Countdown läuft auch bei Tabwechsel weiter.

Sleep/Wake: Nach Wake stimmt Restzeit ±2 s; Timer endet nicht im Schlaf.

Doppelte Tabs: Neues Tab zeigt Info „Timer läuft in anderem Tab“ + „übernehmen“-Button.

B. Aufgaben & Schätzung

Felder: title, project(optional), est_pomos, done, notes.

Schnell-Eingabe (Return fügt hinzu); Drag-to-reorder.

Session schreibt task_id, planned=25, actual=23 in Log.

C. Visualisierung & Audio

Progress-Ring + große mm:ss; farbfehlsichere Palette.

Drei Alarmstile: Gong, Bell, Vibration (Mobil); Lautstärke-Slider; „Nur visuell“.

D. Flowtime-Modus

Start zählt aufwärts; „Fokus ließ nach“ → Klick „Pause“; Pause automatisch proportional (z. B. Arbeit/5).

Report markiert Flow-Sessions separat.

E. Reports

Metriken: Fokuszeit, erledigte Pomodoros, Durchschnittslänge, Pausenquote, Streak.

Diagramme: Balken (Tage), Heatmap (Tageszeiten), Top-Aufgaben.

Export: CSV; ICS für „Focus Blöcke“ im Kalender.

F. Integrationen (optionale Premium-Stufe)

OAuth zu Todoist/Asana; Mapping task_id ↔ external_id.

Webhooks (z. B. onSessionEnd): POST {task, duration, started_at}.

Kalender: ICS-Feed + Google Calendar API.

G. Settings

Intervalle, Auto-Start, Langpause-Frequenz, Töne, Benachrichtigungen, Themes.

Datenschutz: „lokal-only“ vs. „Account-Sync (End-to-End verschlüsselt)“.

H. Barrierefreiheit

WCAG 2.2 AA, ARIA für Timerrolle, Skip-Links, Fokus-Ringe.

Farbschemata: Standard, Protan/Deutan-freundlich, High Contrast.

Schriftgröße skalierbar; Live-Region für Timer-Ansagen (Screenreader).

Nicht-funktionale Anforderungen

Performance

Time-to-Interactive < 1 s; 60 fps bei Animationen; Audio-Start < 100 ms Latenz.

Bundle < 100 KB gz (MVP); offline-fähig via Service Worker.

Sicherheit & Datenschutz

Keine Drittanbieter-Tracker im Fokus-Modus.

DSGVO-konform; klare Daten-Retention; Opt-in für Telemetrie.

Premium-Sync: ruhende Daten AES-256; Transport TLS; mögliche E2E-Option.

Zuverlässigkeit

Unit-/E2E-Tests für Timer-Edgecases (Sleep, Tabwechsel, Offline).

Konfliktlösung bei Mehrgerät-Nutzung (last-writer-wins + Merge für Logs).

Monetarisierung (kohärent mit Produktversprechen)

Freemium

Kostenlos: Kern-Timer, Aufgaben, Basis-Reports, lokale Nutzung.

Pro: Cloud-Sync, Integrationen, erweiterte Reports, Co-Focus, Themes/Ambient, Webhooks, Kalender-Sync.

Keine In-Timer-Ads; niemals Störung während Fokus.

Messgrößen (Produkt-Health & Nutzerwert)

North Star: Tägliche/wochentliche fokussierte Netto-Minuten pro aktivem Nutzer.

Aktivierungsquote: % Nutzer, die in der 1. Session ≥2 Pomodoros abschließen.

7-Tage-Retention; Anteil „Auto-weiter aktiv“; Anteil, der Aufgaben mit Est. versieht.

„Fokusabbruch-Rate“ vor 10 min (Reduktion = gutes Zeichen).

User Flows (Kurz)

Onboarding (60 s): Ziel auswählen (z. B. Lernen), Preset wählen, optional Daily Goal, „Start“.

Session: Aufgabe wählen → Start → Ende-Hinweis → loggen → kurze Reflexionsfrage (optional) → weiter.

Report: Tagesziele checken, kleine Einsicht (z. B. „Meiste Qualität morgens“).

Technische Skizze (Web-MVP)

Frontend: PWA (React/Vue/Svelte), Timer im WebWorker, Service Worker für Offline & Push.

State: Local-first (IndexedDB), optionale Sync-Schicht (z. B. Supabase/Firestore) für Pro.

Audio/Notif: Web Audio API, Notifications API; Fallbacks für iOS.

Extension (später): Soft-Blocking & Quick-Start.

Ethik & Psychologie (Design-Leitplanken)

Zeit sichtbar & begreifbar (Visualisierung), kein Angst-Design.

Gamification als Antrieb, nie als Bestrafung.

Pausen respektieren (keine „heroische Dauerarbeit“ glorifizieren).

Nutzerautonomie: Flowtime verfügbar, Pomodoro voreingestellt.

MoSCoW-Priorisierung (Auszug)

Must: Sofortstart, robuste Timer-Engine, Pomodoro/Flowtime, Visualisierung, Benachrichtigungen, Aufgaben-Light, PWA, A11y-Basics, Privacy-lokal.
Should: Reports, Presets, sanfte Gamification, Ambient/Theme, Kalender-/Todo-Integrationen, Sync.
Could: Co-Focus, Webhooks, Browser-Extension, erweiterte Analysen.
Won’t (vorerst): Harte Blocker ohne Extension, Ads, schweres PM.
