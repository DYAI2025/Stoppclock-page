# Custom Session Timer – aktuelle Funktionsweise und Ausbauideen

## Aktueller Stand

### Einstieg & Verwaltung
- Die Landingpage zeigt gespeicherte Sessions sowie Templates, erlaubt das Anlegen neuer Sessions und das Öffnen von Presets. Navigation führt in den Builder, den Preview- und den Run-Modus über Hash-Routen (z. B. `#/custom-sessions/builder`, `#/custom-sessions/run/:id`).【F:src/pages/CustomSessionsLanding.tsx†L18-L46】
- Sessions lassen sich als JSON exportieren (einzeln oder gesammelt) und wieder importieren; eingehende Dateien werden validiert, erhalten bei Bedarf eine neue ID und werden nach Erfolg bestätigt.【F:src/pages/CustomSessionsLanding.tsx†L49-L138】

### Session Builder
- Der Builder lädt bestehende Sessions oder Presets in das Formular und hält Name sowie Elementliste im lokalen State.【F:src/pages/SessionBuilder.tsx†L24-L59】
- Neue Elemente werden über ein Formular mit Typ, Dauer (Minuten/Sekunden), Fokus-Text, optionalem Phasennamen und auswählbarem Sound angelegt. Vor dem Hinzufügen greift eine Validierung; erfolgreiche Einträge werden mit UUID, Zeitstempel und Soundtyp gespeichert, das Formular wird danach zurückgesetzt.【F:src/pages/SessionBuilder.tsx†L61-L99】
- Elemente können gelöscht oder nach oben/unten verschoben werden, um die Reihenfolge anzupassen.【F:src/pages/SessionBuilder.tsx†L100-L116】
- Speichern aktualisiert entweder eine bestehende Session oder legt eine neue an; Starten speichert bei Bedarf und wechselt direkt in den Run-Modus der jeweiligen Session.【F:src/pages/SessionBuilder.tsx†L118-L150】

### Laufansicht (Session Runner)
- Beim Öffnen des Run-Modus wird die Session geladen; falls keine Laufzeitdaten existieren, wird ein initialer Runtime-State mit Index 0, verbleibender Zeit des ersten Elements und Gesamtdauer angelegt und in `localStorage` persistiert.【F:src/pages/SessionRunner.tsx†L17-L55】
- Ein driftarmer Timer auf Basis von `requestAnimationFrame` berechnet Restzeiten pro Element und wechselt automatisch zum nächsten Abschnitt; beim letzten Element wird der hinterlegte Sound abgespielt und der Status auf `COMPLETED` gesetzt.【F:src/pages/SessionRunner.tsx†L58-L123】
- Steuerungen: Start/Pause toggelt den Laufstatus, „Next“ springt manuell zum nächsten Element (mit Sound), „Reset“ setzt die Session nach Bestätigung auf den Anfang zurück; Statuswechsel aktualisieren Phase und verbleibende Zeit im persistenten Runtime-State.【F:src/pages/SessionRunner.tsx†L142-L199】

## Ausbau- und Individualisierungsideen
- **Erweiterte Elementeigenschaften:** Zusätzliche Felder wie Lautstärke pro Phase, visuelle Warnfarben oder Notizen könnten pro Element gespeichert und im Runner visualisiert werden.【F:src/pages/SessionBuilder.tsx†L61-L99】【F:src/pages/SessionRunner.tsx†L58-L199】
- **Automatische Vorwarnungen:** Konfigurierbare Vorwarnmarker (z. B. 60/30/10 Sekunden) mit separaten Sounds oder Farbakzenten würden die Zeitsteuerung stärker personalisieren.【F:src/pages/SessionRunner.tsx†L58-L123】
- **Tiefere Template-Unterstützung:** Presets könnten Kategorien, Tags oder empfohlene Einsatzszenarien speichern; die Landingpage könnte Filter/Suche anbieten und beim Import Dubletten erkennen.【F:src/pages/CustomSessionsLanding.tsx†L18-L138】
- **Synchronisation & Sharing:** Optionaler Exportlink oder QR-Code für einzelne Sessions und ein Abgleich über Cloud/Account oder WebRTC würde kollaborative Nutzung erlauben, anstatt nur lokaler `localStorage`-Datensätze.【F:src/pages/CustomSessionsLanding.tsx†L49-L138】
- **Analyse & Review:** Nach Abschluss ließen sich Laufstatistiken (z. B. tatsächliche vs. geplante Zeiten, manuelle Skips) speichern und als Bericht anzeigen, um zukünftige Sessions anzupassen.【F:src/pages/SessionRunner.tsx†L58-L199】

## Vorschlag für nächste Schritte
1. **Vorwarn-Feature umsetzen:** Im Runtime-State optionale Warnpunkte pflegen, im Runner zusätzliche Farb-/Sound-Hinweise triggern und im Builder pro Element konfigurierbar machen.
2. **Template-Metadaten und Suche:** Preset-Struktur um Tags/Kategorien erweitern, auf der Landingpage Filter und Textsuche einbauen sowie Import-Dubletten prüfen.
3. **Sharing-Option ergänzen:** Einzel-Session-Export um Kurzlink/QR erweitern (z. B. via `navigator.share` oder generiertem Data-URL), optional mit Hinweis auf Datenschutz.
