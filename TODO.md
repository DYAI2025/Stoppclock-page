# TODO.md - Stoppclock Development Roadmap

## 🎯 **Aktueller Status**
✅ Phase 1: Custom Presets System (COMPLETE)
✅ Phase 2: QR Code Share (COMPLETE)
✅ Phase 3: Daily Stats & Streaks (COMPLETE)

**Was funktioniert:**
- Custom Presets erstellen/bearbeiten/löschen (max 10)
- QR Code Sharing für Countdown Timer
- Stats Tracking für Countdown Timer
- StatsCard mit Streaks auf Home Page

**Was fehlt:**
- Integration in die anderen 7 Timer
- E2E Tests für neue Features
- Mobile Optimierungen
- Performance Verbesserungen

---

## 🔥 **HIGH PRIORITY - Fehlende Integration**

### 1. Share Button in alle Timer integrieren (3h)
**Status:** ⏳ TODO
**Betroffene Dateien:**
- `src/pages/Pomodoro.tsx`
- `src/pages/Stopwatch.tsx`
- `src/pages/AnalogCountdown.tsx`
- `src/pages/CookingTimer.tsx`
- `src/pages/ChessClock.tsx`
- `src/pages/Metronome.tsx`

**Aufgaben:**
- [ ] ShareButton zu Pomodoro hinzufügen
- [ ] ShareButton zu Stopwatch hinzufügen
- [ ] ShareButton zu Analog Timer hinzufügen
- [ ] ShareButton zu Cooking Timer hinzufügen
- [ ] ShareButton zu Chess Clock hinzufügen
- [ ] ShareButton zu Metronome hinzufügen
- [ ] URL Preset Loading für alle Timer implementieren
- [ ] getCurrentConfig() Funktion für jeden Timer schreiben

**Acceptance Criteria:**
- Jeder Timer hat "🔗 Teilen" Button
- QR Code funktioniert für alle Timer-Typen
- URL Loading lädt korrekte Konfiguration

---

### 2. Event Tracking in alle Timer integrieren (2h)
**Status:** ⏳ TODO

**Aufgaben:**
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

**Aufgaben:**
- [ ] QR Code Share auf Mobile optimieren (größerer QR Code)
- [ ] Share-Button Native Share API nutzen (navigator.share)
- [ ] StatsCard auf Mobile besser gestalten
- [ ] Preset Cards auf Mobile testen
- [ ] Touch-Gesten für Preset Edit/Delete

**Acceptance Criteria:**
- Native Share API funktioniert auf iOS/Android
- QR Code ist auf Mobile gut lesbar
- Alle Komponenten responsive

---

### 6. PWA Install Prompt (1h)
**Status:** ⏳ TODO

**Aufgaben:**
- [ ] Custom Install Prompt UI erstellen
- [ ] "Zu Startbildschirm hinzufügen" Button
- [ ] Install Analytics tracken

---

## 🎨 **UI/UX - Verbesserungen**

### 7. Preset Categories & Search (3h)
**Status:** 💡 IDEA

**Features:**
- [ ] Preset Categories (Work, Study, Fitness, Meditation)
- [ ] Search Bar für Presets
- [ ] Filter nach Timer-Typ
- [ ] Sortierung (Meistgenutzt, Neueste, Alphabetisch)

**Mockup:**
```
[🔍 Search Presets...]   [Filter: All ▼]   [Sort: Most Used ▼]

📚 Study
  - Deep Work Session (25min Pomodoro)
  - Exam Prep (45min Countdown)

💼 Work
  - Meeting Timer (30min Countdown)
  - Sprint Planning (2h Pomodoro)
```

---

### 8. Preset Templates Library (4h)
**Status:** 💡 IDEA

**Features:**
- [ ] 20+ vorgefertigte Preset-Templates
- [ ] "Template verwenden" Button
- [ ] Template Categories (Productivity, Fitness, Cooking, etc.)
- [ ] Community-Presets (opt-in sharing)

**Examples:**
- 🏋️ "7 Minute Workout" (7x 1min intervals)
- 📚 "Study Marathon" (4x 50min Pomodoro)
- 🍳 "Sunday Roast" (3h Cooking Timer)
- 🧘 "Meditation Session" (20min Countdown)

---

### 9. Duplicate Preset Funktion (1h)
**Status:** 💡 IDEA

**Aufgaben:**
- [ ] "Duplizieren" Button in PresetCard
- [ ] Automatisch " (Kopie)" an Name anhängen
- [ ] Neue UUID generieren

---

## 📊 **STATS - Advanced Features**

### 10. Stats Export als CSV/PDF (2h)
**Status:** 💡 IDEA

**Features:**
- [ ] "Download Stats" Button in StatsCard
- [ ] CSV Export mit allen Events
- [ ] PDF Report mit Grafiken
- [ ] Zeitraum-Auswahl (Letzte 7 Tage, 30 Tage, All-Time)

---

### 11. Charts & Visualisierungen (4h)
**Status:** 💡 IDEA

**Features:**
- [ ] Linien-Chart: Sessions pro Tag (letzte 30 Tage)
- [ ] Bar-Chart: Zeit pro Timer-Typ
- [ ] Heatmap: Aktivität nach Wochentag/Stunde
- [ ] Progress Ring: Weekly Goal (z.B. 10h Fokuszeit)

**Library:** Chart.js oder Recharts

---

### 12. Weekly/Monthly Reports (3h)
**Status:** 💡 IDEA

**Features:**
- [ ] Automatische Wochenberichte (jeden Montag)
- [ ] Email/Notification mit Stats Summary
- [ ] "Produktivste Woche" Badge
- [ ] Vergleich: Diese Woche vs. Letzte Woche

---

### 13. Productivity Insights (4h)
**Status:** 💡 IDEA

**Features:**
- [ ] KI-generierte Insights
  - "Du bist am produktivsten Dienstags um 10 Uhr"
  - "Deine Pomodoro Completion Rate ist 85%"
  - "Durchschnittliche Session-Länge: 23 Minuten"
- [ ] Recommendations
  - "Versuche 25min Pomodoros statt 50min"
  - "Mach mehr Pausen zwischen Sessions"

---

## 🔔 **NOTIFICATIONS**

### 14. Browser Notifications (2h)
**Status:** 💡 IDEA

**Features:**
- [ ] Notification Permission Request
- [ ] Timer Complete Notification
- [ ] Streak Reminder (z.B. "3-Tage-Streak! Nutze Stoppclock heute")
- [ ] Custom Notification Settings

---

### 15. Voice Announcements (3h)
**Status:** 💡 IDEA

**Features:**
- [ ] Web Speech API Integration
- [ ] "5 Minuten verbleibend" Ansage
- [ ] "Timer abgeschlossen" Ansage
- [ ] Custom Phrases konfigurieren

---

## 🎨 **CUSTOMIZATION**

### 16. Custom Themes (4h)
**Status:** 💡 IDEA

**Features:**
- [ ] Theme Editor UI
- [ ] 5+ Vorgefertigte Themes (Dark Ocean, Light Mode, Forest, Sunset)
- [ ] Custom Color Picker
- [ ] Theme Preview

---

### 17. Custom Alarm Sounds (3h)
**Status:** 💡 IDEA

**Features:**
- [ ] 10+ Alarm Sounds (Gong, Bell, Chime, Birds, etc.)
- [ ] Upload eigene Sounds (.mp3, .wav)
- [ ] Volume Control
- [ ] Sound Preview

---

## 🌐 **SOCIAL & SHARING**

### 18. Achievement Sharing (3h)
**Status:** 💡 IDEA

**Features:**
- [ ] Share Streak to Twitter/LinkedIn
- [ ] "100 Sessions Complete" Badge
- [ ] "30-Day Streak" Achievement
- [ ] Custom Share Images (Open Graph)

**Example:**
```
🔥 30-Day Streak auf Stoppclock!
127 Sessions | 52h Fokuszeit
Mein Lieblings-Timer: Pomodoro
#productivity #focustime
```

---

### 19. Team Presets & Workspaces (8h)
**Status:** 💡 IDEA - **BIG FEATURE**

**Features:**
- [ ] Team Workspace erstellen
- [ ] Shared Preset Library
- [ ] Team Stats Dashboard
- [ ] Sync über Cloud (Firebase/Supabase)
- [ ] Invite Links für Teams

**Use Case:** Lehrer erstellt Workspace für Klasse, alle Schüler haben Zugriff auf gleiche Presets.

---

### 20. Leaderboard (opt-in) (5h)
**Status:** 💡 IDEA

**Features:**
- [ ] Weekly Leaderboard (meiste Sessions)
- [ ] Anonyme Usernames
- [ ] Opt-in Consent
- [ ] Privacy-first Design

---

## 🔗 **INTEGRATIONS**

### 21. Google Calendar Integration (6h)
**Status:** 💡 IDEA

**Features:**
- [ ] "Session zu Kalender hinzufügen" Button
- [ ] Automatische Event-Erstellung nach Complete
- [ ] OAuth Google Login
- [ ] Calendar Sync

---

### 22. Slack/Discord Webhooks (3h)
**Status:** 💡 IDEA

**Features:**
- [ ] Webhook URL konfigurieren
- [ ] Notifications bei Session Complete
- [ ] Team Notifications ("User hat 10h diese Woche erreicht")

---

### 23. Public API (8h)
**Status:** 💡 IDEA

**Features:**
- [ ] REST API für Timer Control
- [ ] API Key Management
- [ ] Rate Limiting
- [ ] API Documentation

**Use Cases:**
- Home Automation (Start Pomodoro via Button)
- Stream Overlays (OBS Integration)
- Third-party Apps

---

## ⚡ **PERFORMANCE**

### 24. Code Splitting & Lazy Loading (3h)
**Status:** ⏳ TODO - **WICHTIG**

**Problem:** Bundle ist >500KB

**Aufgaben:**
- [ ] React.lazy() für Timer Pages
- [ ] Dynamic Imports für QR Code Library
- [ ] Route-based Code Splitting
- [ ] Lighthouse Score >95 erreichen

---

### 25. Image Optimization (1h)
**Status:** ⏳ TODO

**Aufgaben:**
- [ ] QR Code als WebP speichern
- [ ] Icons optimieren
- [ ] Lazy Loading für Images

---

## ♿ **ACCESSIBILITY**

### 26. WCAG 2.1 AA Compliance (4h)
**Status:** ⏳ TODO

**Aufgaben:**
- [ ] Screen Reader Testing
- [ ] Keyboard Navigation für alle Komponenten
- [ ] ARIA Labels für Presets/Stats
- [ ] Focus Indicators verbessern
- [ ] Color Contrast prüfen

---

### 27. Internationalization (i18n) (6h)
**Status:** 💡 IDEA

**Sprachen:**
- [ ] Englisch (EN)
- [ ] Deutsch (DE) ✅
- [ ] Französisch (FR)
- [ ] Spanisch (ES)
- [ ] Japanisch (JA)

**Library:** react-i18next

---

## 📚 **DOCUMENTATION**

### 28. User Guide erstellen (3h)
**Status:** ⏳ TODO

**Aufgaben:**
- [ ] "How to use Presets" Tutorial
- [ ] "How to Share Timers" Guide
- [ ] "Understanding Your Stats" Explanation
- [ ] FAQ Section
- [ ] Video Tutorials (optional)

---

### 29. Developer Documentation (2h)
**Status:** ⏳ TODO

**Aufgaben:**
- [ ] API Documentation für Presets Utils
- [ ] Component Props Documentation
- [ ] Contributing Guide
- [ ] Architecture Overview

---

## 🐛 **KNOWN ISSUES**

### 30. Bug Fixes
**Status:** ⏳ TODO

**Bekannte Bugs:**
- [ ] StatsCard zeigt "0 Sessions" nach Reset nicht korrekt
- [ ] QR Code auf Safari manchmal nicht sichtbar
- [ ] Preset Modal schließt bei ESC nicht immer

---

## 🚀 **GROWTH & MARKETING**

### 31. SEO Optimierungen (2h)
**Status:** 💡 IDEA

**Aufgaben:**
- [ ] Landing Pages für Use Cases
  - `/for-students` (Timer für Studenten)
  - `/for-teachers` (Classroom Timers)
  - `/for-teams` (Team Productivity)
- [ ] Blog Posts über Produktivität
- [ ] Schema.org Markup für Features

---

### 32. Onboarding Flow (3h)
**Status:** 💡 IDEA

**Features:**
- [ ] Interactive Tutorial für neue User
- [ ] "Create your first Preset" Wizard
- [ ] Feature Discovery Tooltips
- [ ] Skip Option

---

### 33. Referral System (5h)
**Status:** 💡 IDEA

**Features:**
- [ ] "Freund einladen" Link
- [ ] Tracking von Referrals
- [ ] Rewards (z.B. "Unlock Premium Features")

---

## 💎 **PREMIUM FEATURES** (Optional)

### 34. Stoppclock Pro (12h)
**Status:** 💡 IDEA - **MONETIZATION**

**Free Tier:**
- Max 10 Presets
- Basic Stats (30 Tage)
- QR Sharing

**Pro Tier (€3/Monat):**
- [ ] Unlimited Presets
- [ ] Advanced Stats (Lifetime)
- [ ] Custom Themes
- [ ] Cloud Sync
- [ ] Team Workspaces
- [ ] Priority Support
- [ ] Ad-free

---

## 📦 **DEPLOYMENT & INFRASTRUCTURE**

### 35. CI/CD Pipeline (2h)
**Status:** ⏳ TODO

**Aufgaben:**
- [ ] GitHub Actions für Auto-Deploy
- [ ] Automated Tests in CI
- [ ] Build Notifications

---

### 36. Analytics & Monitoring (3h)
**Status:** ⏳ TODO

**Aufgaben:**
- [ ] Error Tracking (Sentry)
- [ ] Usage Analytics (Plausible/Fathom)
- [ ] Performance Monitoring
- [ ] Uptime Monitoring

---

## 🎯 **PRIORITIZATION MATRIX**

| Feature | Impact | Effort | Priority | Status |
|---------|--------|--------|----------|--------|
| Share in alle Timer | HIGH | 3h | 🔥 P0 | TODO |
| Event Tracking alle Timer | HIGH | 2h | 🔥 P0 | TODO |
| SavePreset alle Timer | HIGH | 2h | 🔥 P0 | TODO |
| E2E Tests | MEDIUM | 4h | ⚡ P1 | TODO |
| Code Splitting | HIGH | 3h | ⚡ P1 | TODO |
| Mobile UX | MEDIUM | 3h | ⚡ P1 | TODO |
| Preset Templates | HIGH | 4h | ⚡ P1 | IDEA |
| Charts & Viz | MEDIUM | 4h | 📊 P2 | IDEA |
| Browser Notifications | LOW | 2h | 📊 P2 | IDEA |
| Team Workspaces | HIGH | 8h | 🚀 P3 | IDEA |
| Premium Features | HIGH | 12h | 🚀 P3 | IDEA |

---

## 📅 **ROADMAP**

### **Sprint 1 (Diese Woche) - Feature Parity**
- ✅ Share Button in alle Timer (3h)
- ✅ Event Tracking in alle Timer (2h)
- ✅ SavePreset in alle Timer (2h)
- ✅ E2E Tests (4h)
- **Total: 11h**

### **Sprint 2 (Nächste Woche) - Polish & Performance**
- Code Splitting (3h)
- Mobile UX (3h)
- Bug Fixes (2h)
- User Guide (3h)
- **Total: 11h**

### **Sprint 3 (Woche 3) - Growth Features**
- Preset Templates Library (4h)
- Stats Charts (4h)
- Browser Notifications (2h)
- **Total: 10h**

### **Sprint 4 (Woche 4) - Advanced**
- Team Workspaces (8h)
- Google Calendar Integration (6h)
- **Total: 14h**

---

## 🎉 **NICE-TO-HAVE Ideas**

### Kreative Features:
- [ ] **Soundscapes während Timer** (Regen, Café, Wald)
- [ ] **Animated Backgrounds** (Chill Lofi Style)
- [ ] **Gamification** (Level System, XP für Sessions)
- [ ] **Pomodoro Pets** (Tamagotchi-Style Pet das mit dir arbeitet)
- [ ] **Focus Rooms** (Multiplayer: Gemeinsam fokussieren)
- [ ] **Spotify Integration** (Auto-play Focus Playlist)
- [ ] **Breathing Exercises** (5min Pause = geführte Atmung)
- [ ] **Daily Quote/Mantra** (Motivational Content)

---

## 📝 **NOTES**

**Constitution Compliance:**
Alle Features müssen folgende Prinzipien erfüllen:
- ✅ Privacy First (Opt-in für alle Daten)
- ✅ Performance >90 (Lighthouse Score)
- ✅ Classroom Optimized (Kein Ad-Spam)
- ✅ Progressive Enhancement (Core ohne JS)
- ✅ Accessibility (WCAG 2.1 AA)

**Tech Stack Decisions:**
- Keep it simple (avoid over-engineering)
- Use React ecosystem
- Prefer localStorage over Backend (where possible)
- PWA-first approach

---

**Last Updated:** 2025-12-31
**Maintained by:** Claude Code Agent
