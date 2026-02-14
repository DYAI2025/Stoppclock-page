# Pomodoro Spec: "Soft Focus Cycles"

## 1. Vision & Philosophie

**"Time, held lightly" applied to Focus.**
Der Pomodoro-Timer in Stoppclock ist kein Werkzeug zur Selbstoptimierung oder Überwachung. Er ist ein *Rhythmus-Geber*. Er hilft, in den Fokus zu gleiten ("Soft Focus") und Pausen als essenziellen Teil der Arbeit zu zelebrieren.

- **Kein Stress:** Keine aggressiven Alarme, keine rote "Gefahr"-Farbe bei Zeitablauf.
- **Kein Gamification-Druck:** Keine Streaks, keine Scores, keine "failed sessions".
- **Supportive:** Der Timer ist ein Begleiter, kein Vorgesetzter.

## 2. Functional Requirements (FR)

### FR-POMO-1: Zentrale Anzeige (High)

- Große, projektor-taugliche Zeitanzeige (Minuten:Sekunden).
- Klare Anzeige der aktuellen Phase: `Focus`, `Short Break`, `Long Break`.
- Visuell so gestaltet, dass der Status aus 3-5m Entfernung erkennbar ist.

### FR-POMO-2: Presets (High)

Nutzer können aus vordefinierten Rhythmen wählen:

- **Classic:** 25m Focus / 5m Short Break / 15m Long Break (nach 4 Zyklen).
- **Soft:** 45m Focus / 10m Short Break / 20m Long Break (flexibler, weniger Unterbrechung).
- **Deep:** 90m Focus / 15m Short Break (Ultradian Rhythm).

### FR-POMO-3: Custom Settings (High)

- Anpassbare Dauer für alle 3 Phasen.
- Anpassbare Anzahl der Zyklen bis zur Long Break.
- Erreichbar über ein Settings-Panel/Modal.

### FR-POMO-4: Phasensteuerung (High)

- **Controls:** Start, Pause, Resume.
- **Skip:** Möglichkeit, eine Phase vorzeitig zu beenden und zur nächsten zu springen (z.B. "I'm done early").
- **Reset:** Zurücksetzen der Session auf Anfang.

### FR-POMO-5: Session Progress (Medium)

- Visuelle Indikation des Fortschritts im Gesamtzyklus (z.B. "Cycle 2 of 4").
- Subtile Punkte/Balken, die sich füllen.

### FR-POMO-6: Focus Label (Medium)

- Optionales Textfeld: "What are you working on?".
- Wird prominent angezeigt, um in Gruppen den Fokus zu setzen.

### FR-POMO-7: Supportive Feedback (Medium)

- "Helper Text" statt System-Status.
- Z.B. "Breathe. You're doing great." statt "Time remaining".

### FR-POMO-8: Audio (Medium)

- Sanfter Gong/Chime am Ende einer Phase.
- Mute-Button.
- Volume-Slider (optional für MVP).

### FR-POMO-9: Learn More (Low)

- Kleine Sektion/Link zu "Why this works", kurze Erklärung der "Soft Focus"-Methode.

## 3. Non-Functional Requirements (NFR)

### NFR-POMO-1: Projektor-Tauglichkeit

- High Contrast Mode (automatisch oder toggle).
- Keine dünnen Grautöne für essenzielle Infos.

### NFR-POMO-2: Calm UI

- Motion nur bei Statuswechseln.
- Keine "tickenden" Sekunden-Animationen (optional: "Breathing" Sekunden wie im TimeSince-Design).

### NFR-POMO-3: Robustheit

- Überlebt Browser-Refresh (speichert Startzeit/Status in LocalStorage).
- Korrigiert Drift nach Tab-Switch (berechnet Zeit gegen Start-Timestamp, nicht per Interval-Tick).

### NFR-POMO-4: Accessibility

- Tastatur-Steuerung: Space = Start/Pause.
- Screenreader-Ansagen bei Phasenwechsel ("Focus session ended. Take a break.").

## 4. UI/UX Skizze (Mental Model)

```text
+-------------------------------------------------------+
|  [Home]                                     [Settings]|
|                                                       |
|           [ Cycle 2 / 4 • • — — ]                     |
|                                                       |
|                  25:00                                |
|                                                       |
|              Focus Phase                              |
|                                                       |
|       "Drafting the new architecture specs"           |
|                                                       |
|          [ Play/Pause ]  [ Skip ]  [ Reset ]          |
|                                                       |
+-------------------------------------------------------+
```

## 5. Domain Model (TypeScript Draft)

```typescript
type Phase = 'focus' | 'shortBreak' | 'longBreak';

interface PomodoroPreset {
  id: string;
  name: string;
  focusDuration: number; // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
}

interface PomodoroState {
  isRunning: boolean;
  currentPhase: Phase;
  remainingSeconds: number;
  completedCycles: number;
  totalCycles: number;
  activePresetId: string;
  focusLabel: string;
}
```
