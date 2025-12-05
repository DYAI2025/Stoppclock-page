# Timer-Funktionsübersicht (stoppclock.com)

Diese Dokumentation fasst die aktuelle Funktionsweise aller Timer zusammen. Jede Sektion nennt den Link (Hash-Route), die wichtigsten Bedienoptionen sowie Persistenz- und Tastaturfunktionen.

## Digital Countdown (`#/countdown`)
- **Zweck:** Klassischer Countdown bis zu 12 Stunden; ideal für Präsentationen oder Sport.
- **Speicherort:** `localStorage` unter `sc.v1.countdown` (speichert Laufstatus, Restzeit, Signaleinstellungen).
- **Bedienung:** Start/Pause, Reset, Presets, +/- Buttons und Eingabefeld; Warnschwelle (Standard 10 s) mit Ton/Flash.
- **Tastenkürzel:** Leertaste Start/Pause, `R` Reset, `F` Fullscreen, Pfeil-↑/↓ ändern die Zeit; Eingabefelder blockieren Shortcuts.
- **Besonderheiten:** Passt die Anzeige automatisch an die verfügbare Breite an; kann via URL-Parametern (`?duration=…&autostart=1`) vorbefüllt werden.

## Analog Countdown (`#/analog`)
- **Zweck:** Visueller Countdown (bis 4 h) mit Uhrzeigern und Fortschrittsringen.
- **Speicherort:** `localStorage` unter `sc.v1.analog` (Dauer, Restzeit, Warnschwelle, Signalwahl).
- **Bedienung:** Digitale HMS-Anzeige plus Canvas-Uhr, Presets (5–30 Min.), +/- Schritte und benutzerdefinierte Minuten-Eingabe; Start/Pause/Reset, Fullscreen und „Pin to Main Page“.
- **Tastenkürzel:** Leertaste Start/Pause, `R` Reset, `F` Fullscreen, Pfeil-↑/↓ ±10 s.
- **Signale:** Optionaler Ton und Bildschirm-Flash; Warnung standardmäßig bei 60 s Rest.

## Stopwatch (`#/stopwatch`)
- **Zweck:** Aufwärtslaufender Timer mit Rundenzeiten.
- **Speicherort:** `localStorage` unter `sc.v1.stopwatch` (Status, vergangene Zeit, Laps, Signalpräferenzen).
- **Bedienung:** Start/Pause, Reset, Lap-Liste mit Split- und Gesamtzeiten, Fullscreen, Pin-to-Home.
- **Tastenkürzel:** Leertaste Start/Pause, `R` Reset, `L` neue Runde, `F` Fullscreen.
- **Signale:** Optionaler Ton/Flash bei Start/Stop; kann deaktiviert werden.

## Digital Clock (`#/clock`)
- **Zweck:** Großformatige Echtzeitanzeige.
- **Bedienung:** Umschalten 12/24 h, Sekundenanzeige und Fullscreen; Kontrastierte Variante für Projektion.
- **Tastenkürzel:** `F` Fullscreen, `T` toggelt Sekunden, `C`/`H` Formatwechsel.

## World Clock (`#/world`)
- **Zweck:** Mehrere Zeitzonen parallel anzeigen.
- **Bedienung:** Startset aus häufigen Städten, hinzufügen/entfernen eigener Zonen, Sortierung per Drag/Buttons.
- **Persistenz:** Ausgewählte Städte werden lokal gespeichert und beim Wiederaufruf rekonstruiert.

## Alarm (`#/alarm`)
- **Zweck:** Mehrere Weckzeiten mit Labeln verwalten.
- **Bedienung:** Alarme hinzufügen/entfernen, Ein-/Ausschalten pro Eintrag, optionale Schlummerfunktion; nutzt Systemzeit.
- **Signale:** Ton- und Flash-Hinweise, sofern im Browser erlaubt.

## Metronome (`#/metronome`)
- **Zweck:** Rhythmusklick für Musikübung.
- **Bedienung:** BPM-Eingabe (Buttons oder Tippfeld), Start/Stop, Betonungen je Takt; Lautstärke und Klang konfigurierbar.
- **Persistenz:** Letzte BPM und Akzent-Einstellungen werden gespeichert.

## Chess Clock (`#/chess`)
- **Zweck:** Zwei-Wege-Schachuhr mit getrennten Restzeiten.
- **Bedienung:** Start/Pause, Reset, Zeitvoreinstellungen, Spielerwechsel per großem Button oder Leertaste; optionales Inkrement pro Zug.
- **Persistenz:** Speichert Restzeiten und aktiven Spieler zwischen Sessions.

## Cooking Timer (`#/cooking`)
- **Zweck:** Mehrere parallele Küchen-Timer.
- **Bedienung:** Presets (z. B. Tee, Pasta), freie Eingabe, individuelle Start/Pause/Reset pro Timer; farbcodierte Karten.
- **Persistenz:** Jeder Timerzustand wird lokal gehalten, sodass laufende Kochzeiten über Seitenwechsel bestehen bleiben.

## Couples Timer (`#/couples`)
- **Zweck:** Abwechselnde Slots für Paare (z. B. Gesprächszeit).
- **Bedienung:** Zwei Timer mit getrennten Namen/Farben, ein gemeinsamer Start/Pause/Wechsel-Button; optionale Überziehungswarnung.
- **Persistenz:** Speichert Namen, Farben und Restzeiten.

## Pomodoro (`#/pomodoro`)
- **Zweck:** Arbeits-/Pausenzyklen (25/5 Min. Standard) mit automatischem Wechsel.
- **Bedienung:** Start/Pause, Reset, Zahl der Zyklen, Anpassung von Fokus- und Pausenlängen.
- **Persistenz:** Fortschritt und aktive Phase werden gesichert; Ton/Flash am Phasenende.

## Custom Sessions (`#/custom-sessions` & `#/session-builder` → `#/session-runner`)
- **Zweck:** Eigene Sequenzen aus beliebigen Blöcken (Arbeits-, Pausen-, Warm-up-Phasen) zusammenstellen.
- **Bedienung:** Im Builder Schritte definieren und speichern; im Runner werden Phasen nacheinander mit Restzeit, Überspringen/Zurück und Fullscreen abgespielt.
- **Persistenz:** Sessions werden lokal gespeichert und können wiederverwendet oder dupliziert werden.

## Cycle Timer (`#/cycle`)
- **Zweck:** Wiederholte Intervalle (Intervalltraining), getrennte Work-/Rest-Zeit und Anzahl der Zyklen.
- **Bedienung:** Start/Pause/Reset, nächste/vorherige Phase, Anzeige aktueller Runde; optionale Töne/Flash beim Phasenwechsel.
- **Persistenz:** Aktuelle Runde, verbleibende Zeit und Signaloptionen bleiben erhalten.
