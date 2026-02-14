# World Clock Spec: "Time Assembly"

## 1. Vision & Philosophie

**"The UN Table, not a gadget."**
Diese Weltzeituhr ist keine bunte Spielerei mit Flaggen und Tageslicht-Kurven. Sie ist eine seriöse, ruhige Übersichtstafel für Profis, Teams und Familien, die über Zeitzonen hinweg verbunden sind. Sie strahlt Ruhe und Überblick aus.

## 2. Functional Requirements (FR)

### FR-WC-1: List View (Main) (High)

Eine klare Liste/Tabelle von Orten, die folgendes zeigt:

- **City/Label:** Name des Ortes (z.B. "Tokyo", "Berlin").
- **Local Time:** HH:MM (digital).
- **Day Status:** Visuelle Indikation der Tageszeit (Early Morning, Day, Evening, Night).
- **Offset:** Abstand zur *eigenen* Zeit oder Referenzzeit (+9h, -6h).

### FR-WC-2: Search & Add (High)

- Eingabefeld mit Autocomplete für Städte/Zeitzonen.
- Hinzufügen zur Liste.

### FR-WC-3: Reference Mode (Medium)

- Option "Use my location as reference" (Standard).
- Option, einen *anderen* Ort als Nullpunkt zu setzen (z.B. "Wie spät ist es bei den anderen, wenn ich in NY bin?").

### FR-WC-4: Edit/Manage (Medium)

- Löschen von Orten.
- Reordering (Drag & Drop oder Up/Down Buttons).

### FR-WC-5: Meeting Time Checker (Medium)

- "Time Travel" Modus: Ich verstelle die Basis-Zeit (z.B. per Slider oder Input auf "Morgen 15:00").
- Alle Listen-Einträge aktualisieren sich auf diesen Zeitpunkt.
- Hilft bei der Meeting-Planung ("Ist dann in Sydney schon Nacht?").

### FR-WC-6: Projector Mode (Low)

- Reduzierte Ansicht: Nur die Tabelle, riesig.
- Für Konferenzräume, wo die Uhr als "Wall Display" läuft.

### FR-WC-7: Curated Facts (Low)

- Kleine "Did you know?" Boxen zu Zeitzonen (z.B. "China has only one time zone despite its size").

## 3. Non-Functional Requirements (NFR)

### NFR-WC-1: Seriosität

- Typografie: Monospace für Zahlen (Tabular Nums), klare Sans-Serif für Namen.
- Keine Flaggen-Icons (wirken oft billig/unruhig), eher neutrale Icons oder gar keine.

### NFR-WC-2: Korrektheit

- Nutzung einer robusten Library (z.B. `Intl` API oder `date-fns-tz`).
- Korrekte Sommerzeit (DST) Behandlung.

### NFR-WC-3: A11y

- Semantisch korrekte Tabellenstruktur.
- Screenreader-freundliche Status-Ansagen ("Night time in Tokyo").

## 4. UI/UX Skizze

```
+-------------------------------------------------------+
|  [Home]                                 [Add City +]  |
|                                                       |
|  Reference: My Location (Berlin)      [Meeting Check] |
|                                                       |
|  ---------------------------------------------------  |
|  BERLIN (You)        14:35          Day       ±0h     |
|  ---------------------------------------------------  |
|  NEW YORK            08:35          Morning   -6h     |
|  ---------------------------------------------------  |
|  TOKYO               21:35          Night     +7h     |
|  ---------------------------------------------------  |
|  SYDNEY              23:35          Night     +9h     |
|  ---------------------------------------------------  |
|                                                       |
+-------------------------------------------------------+
```

## 5. Domain Model (TypeScript Draft)

```typescript
type DayPeriod = 'early' | 'morning' | 'day' | 'evening' | 'night' | 'lateNight';

interface WorldClockEntry {
  id: string;
  city: string;
  timezone: string; // IANA 'Europe/Berlin'
  label?: string;   // Optional custom label ('Grandma')
  sortOrder: number;
}

interface WorldClockState {
  entries: WorldClockEntry[];
  referenceTime: Date | null; // If null, use live 'now'. If set, we are in 'Meeting Check' mode.
  referenceLocationId: string | null; // If null, use local user browser time.
}
```
