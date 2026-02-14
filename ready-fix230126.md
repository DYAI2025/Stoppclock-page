eady-fix230126
*Aufgaben:**

- [ ] trackEvent('pomodoro', 'start') in Pomodoro.tsx
- [ ] trackEvent('pomodoro', 'complete', duration) bei Pomodoro Complete
- [ ] trackEvent('stopwatch', 'start') in Stopwatch.tsx
- [ ] trackEvent für alle anderen Timer-Typen
- [ ] Testen ob Stats korrekt aggregiert werden

**Acceptance Criteria:**

- Alle Timer Sessions werden getrackt
- Completion Events mit Dauer werden gespeichert
- Stats Card zeigt korrekte Daten für alle Timer

---

### 3. SavePresetButton in alle Timer integrieren (2h)

**Status:** ⏳ TODO

**Aufgaben:**

- [ ] SavePresetButton zu allen 7 Timern hinzufügen
- [ ] getCurrentConfig() für jeden Timer implementieren
- [ ] Testen ob Preset-Speicherung funktioniert

---

## 🔗 **HIGH PRIORITY - Navigation & Link Fixes (Version 1 + 4)**

### 4. Timer Worlds Link-Route bauen & verbinden (3h)

**Status:** ⏳ TODO
**Betroffene Bereiche:**

- LandingPage Top-Nav: "Timer Worlds"
- LandingPage Banner: "Discover Timer Worlds"

**Aufgaben:**

- [ ] Neue Route `/timers` implementieren (übersichtliche Index-Seite).
- [ ] Datenquelle: `public/data/timer-worlds.json` laden und als Karten/Teaser listen.
- [ ] Jede Karte führt zu `#/wissen/<slug>` (existierende World-Detail-Logik).
- [ ] Fallback-Content: Wenn ein World-Entry fehlt, klare Empty-State-Message.

**Acceptance Criteria:**

- "Timer Worlds" und Banner führen nicht mehr zu Not Found.
- Index zeigt mind. Chess, Countdown, Pomodoro, Stopwatch.
- Jede Karte öffnet eine funktionierende World-Detailseite.

---

### 5. LandingPage Settings-Button echte Funktionalität (2h)

**Status:** ⏳ TODO
**Betroffene Bereiche:**

- LandingPage Top-Nav Settings-Button

**Aufgaben:**

- [ ] Settings-Panel/Modal bauen.
- [ ] Settings-Inhalte: Theme Toggle, Language Toggle, Consent/Ads Toggle.
- [ ] Persistente Speicherung (localStorage) für alle Settings.

**Acceptance Criteria:**

- Klick auf Settings öffnet Panel.
- Änderungen wirken sofort und bleiben nach Reload bestehen.

---

### 6. Blog Tag Links reparieren/verknüpfen (2h)

**Status:** ⏳ TODO
**Betroffene Bereiche:**

- Blog-Tag Links (z. B. `#/blog?tag=pomodoro`)

**Aufgaben:**

- [ ] Neue `/blog` Index-Seite erstellen (Liste + Tag-Filter).
- [ ] Tags an `/blog?tag=...` anbinden (clientseitige Filterung).
- [ ] Optional: Suche/Filter-UI für Tags.

**Acceptance Criteria:**

- Tag-Links führen auf `/blog` und filtern Artikel korrekt.
- Keine "Blog Article Not Found" Fehler mehr bei Tag-Klick.

---

### 7. Pomodoro-Artikel: Link reparieren (1h)

**Status:** ⏳ TODO
**Betroffene Bereiche:**

- `PomodoroTimerOnline` → Link `#/blog/timer-for-students`

**Aufgaben:**

- [ ] Linkziel ändern auf `#/timer-for-students` (existierende Route).
- [ ] Visueller Check, dass Link wie erwartet navigiert.

**Acceptance Criteria:**

- Link führt direkt zur Seite "Timer für Studenten".

## 🧪 **TESTING - E2E Tests schreiben**

### 4. Playwright E2E Tests für neue Features (4h)

**Status:** ⏳ TODO
**Datei:** `tests/presets-share-stats.spec.ts` (neu)

**Test Cases:**

- [ ] **Presets:** Create/Edit/Delete Preset Flow
- [ ] **Presets:** Max 10 Presets Limit
- [ ] **Presets:** Preset Start Navigation
- [ ] **Presets:** Usage Count Increment
- [ ] **Share:** Generate QR Code
- [ ] **Share:** Copy URL to Clipboard
- [ ] **Share:** Load Preset from URL
- [ ] **Stats:** Track Session Start
- [ ] **Stats:** Track Session Complete
- [ ] **Stats:** Calculate Streak
- [ ] **Stats:** StatsCard Expand/Collapse

---

## 📱 **MOBILE & PWA - Optimierungen**

### 5. Mobile UX Verbesserungen (3h)

**Status:** ⏳ TODO
