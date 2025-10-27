# Session Context - Stoppclock Development

**Last Updated:** 2025-10-23 16:45 CET
**Current Branch:** `main`
**Feature Branch:** `feature/mobile-responsive`
**Working Directory:** `/home/dyai/Dokumente/DYAI_home/Web/stoppclock-page`

---

## 🎯 Current Project State

### Recent Accomplishments (Today)

1. ✅ **Mobile Responsive Redesign**
   - Feature branch: `feature/mobile-responsive` (merged to main)
   - Fixed digital timer overflow issues with JavaScript auto-fit (`useAutoFitText` hook)
   - All timer pages fully responsive (Countdown, Stopwatch, CycleTimer, Analog, WorldClock)
   - Commit: `af63a97` merged via PR #8

2. ✅ **Deep Ocean Aurora Color Scheme** (by Kombai AI)
   - Replaced grayscale Minimalist theme with vibrant ocean palette
   - Colors: Ocean depths (#0A1628 → #6B9BD1), Aurora accents (Cyan #00D9FF, Purple #7B2CBF)
   - 18.13:1 contrast ratio (WCAG AAA)
   - Commit: `a08b692`

3. ✅ **Build Fixes**
   - Fixed duplicate `currentTime` variable in Stopwatch.tsx (main branch)
   - Commit: `7420df4`, `7644231` (empty commit to trigger CI)

4. ✅ **Home Page Title Redesign**
   - Changed from "STOPPCLOCK" to "Stopp Clock" (two words)
   - Responsive: Desktop (one line), Mobile (two lines)
   - Commit: `77e5116`

5. ✅ **Home Page Analog Clock**
   - Added elegant analog clock between "Stopp" and "Clock"
   - Carbon-black face (#0A1628), golden hands (#D4AF37)
   - Size: 120x120px (desktop), 80x80px (mobile)
   - 60 FPS animation via Canvas + requestAnimationFrame
   - Commits: `fb61a35`, `1fa5340` (refinement)

---

## 🎨 User's Design Preferences (IMPORTANT - Remember!)

### "Deep Ocean Aurora" Theme
```css
Ocean Depths (Backgrounds):
- Deep: #0A1628 (deepest ocean, 18.13:1 contrast)
- Dark: #1A2942
- Mid: #2D4263
- Light: #4A6FA5
- Bright: #6B9BD1

Aurora Accents (Vibrant highlights):
- Cyan: #00D9FF (primary actions, 10.68:1 contrast)
- Purple: #7B2CBF (secondary actions)
- Lavender: #C77DFF (tertiary accents)
- Pink: #E0AAFF (subtle highlights)

Semantic:
- Success: #10B981 (Emerald green)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Red)
```

### Design Philosophy
- ✅ **Vibrant, nicht langweilig** - Cyan/Purple statt Grau
- ✅ **Premium SaaS aesthetic** - Modern dashboard-style
- ✅ **Glass-morphism** - rgba overlays, soft borders
- ✅ **Glow effects** - Aurora-inspired shadows
- ✅ **High contrast** - Accessibility-first (18:1)
- ✅ **Soft gradients** - Mesh, radial, multi-layer
- ✅ **Breathing room** - 32px gaps, 64px padding
- ✅ **Smooth transitions** - 200-300ms cubic-bezier

### Branding
- 🤫 **"Whisper brand"** - DYAI very subtle
- Position: Footer, 10px italic, 40% opacity
- Text: "Powered by DYAI"
- Philosophy: Quality speaks for itself

### What User DOESN'T Like
- ❌ Grayscale/Monochrome (boring)
- ❌ Harsh white backgrounds
- ❌ Amateur-looking (too simple)
- ❌ "Nackte" Schrift (too thin, no character)
- ❌ Harte Schatten (too aggressive)
- ❌ Zu prominente Branding

---

## 📁 Key Files & Architecture

### Main Files
```
src/
├── main.tsx                    # App entry, routing, Home page
├── styles.css                  # Global styles, imports
├── design-tokens.css           # Deep Ocean Aurora tokens
├── styles/
│   ├── home-swiss.css         # Home page styles
│   ├── countdown-swiss.css    # Countdown timer
│   ├── stopwatch-swiss.css    # Stopwatch
│   └── ...
├── pages/
│   ├── AnalogCountdown.tsx    # Canvas-based analog timer
│   ├── Countdown.tsx          # Digital countdown
│   ├── Stopwatch.tsx          # Stopwatch with laps
│   ├── CycleTimer.tsx         # Auto-restart timer
│   └── ...
├── hooks/
│   ├── useAutoFitText.ts      # Dynamic text sizing
│   └── useKeyboardShortcuts.ts
└── components/
    ├── HomeButton.tsx
    ├── ConsentBanner.tsx
    └── AdSenseScript.tsx
```

### Critical Code Patterns

**useAutoFitText Hook** (Fixed overflow issues):
```typescript
// Dynamically adjusts font-size to fit text in container
const [textRef, autoFontSize] = useAutoFitText(fmt(currentTime), 8, 1.5);
// Returns: ref for text element, calculated font-size in rem
```

**Home Analog Clock** (Canvas component):
```typescript
// Located in main.tsx, lines 28-121
// 120x120px, carbon-black face, golden hands
// requestAnimationFrame for 60 FPS
```

---

## 🐛 Known Issues & Solutions

### Stopwatch.tsx `currentTime` Duplicate
- **Problem:** Variable declared twice (line 79 and 146)
- **Solution:** Remove line 146 declaration
- **Status:** Fixed in main branch (commit `7420df4`)

### Mobile Timer Overflow
- **Problem:** Digital timers overflow on narrow screens
- **Solution:** `useAutoFitText` hook with dynamic sizing
- **Status:** Fixed (commit `af63a97`)

---

## 🔧 Development Commands

```bash
# Development
npm run dev          # Port 5173 (or 5174 with PORT=5174)
npm run build        # Production build + sitemap
npm run preview      # Preview production build

# Testing
npm run test:e2e     # All Playwright tests (44+)
npm run doctor       # Security check (forbidden tokens)

# Git Workflows
git worktree add .worktrees/feature-name -b feature-name
cd .worktrees/feature-name
```

---

## 📊 Recent Commits

```
1fa5340 - refactor: Integrate smaller clock between "Stopp" and "Clock"
fb61a35 - feat: Add elegant analog clock to home page
77e5116 - design: Split title into "Stopp Clock" with responsive layout
7644231 - chore: trigger new GitHub Actions build after Stopwatch fix
7420df4 - fix: Remove duplicate currentTime variable in Stopwatch (main)
a08b692 - design: Deep Ocean Aurora color scheme by Kombai AI
d1be71e - Merge pull request #8 from DYAI2025/feature/mobile-responsive
af63a97 - feat: complete mobile responsive redesign with JavaScript auto-fit
c93f6be - fix: Remove duplicate currentTime variable in Stopwatch
2aef5f7 - fix: Equal-sized cards + improved typography on home page
a34072a - design: Premium SaaS home page redesign - clean, professional UX
```

---

## 🎯 Pending Features & Ideas

### Timer Navigation Feature (Deferred)
- **Idea:** Swipe/slider between timers (left/right)
- **Visual:** Preview of next timer when swiping
- **Status:** Nice-to-have, deferred for now
- **Reason:** Too complex for current sprint

### Smart "Recently Used" Timers (Deferred)
- **Idea:** Show recently used timers at top of home page
- **Status:** Deferred to v2
- **Current:** Equal-access grid (all timers same weight)

---

## 🚀 Deployment

- **Platform:** GitHub Pages
- **Workflow:** `.github/workflows/deploy.yml`
- **Branch:** `main` auto-deploys
- **URL:** https://stoppclock.com (via CNAME)
- **Build:** Vite → dist/ → GitHub Actions → gh-pages

---

## 💡 Next Session - Quick Start

1. **Check build status:** https://github.com/DYAI2025/Stoppclock-page/actions
2. **Pull latest:** `git pull origin main`
3. **Start dev server:** `npm run dev`
4. **Test responsive:** Check mobile breakpoints (640px, 480px)

---

## 📝 Important Context for Claude

### User's Communication Style
- Deutsch/English mixed (responds in both)
- Direct, wants to see results quickly ("ich muss es sehen")
- Appreciates technical explanations but values visual confirmation
- Iterative workflow: Try → See → Refine

### Workflow Preferences
- **Fast iteration:** Commits frequently, pushes immediately
- **Visual-first:** Wants to see changes in browser (localhost)
- **Quality-focused:** "sieht amateur aus" → premium design required
- **Design-conscious:** Used Kombai AI for color scheme refinement

### Key Decisions Made
1. **JavaScript over CSS** for text sizing (after CSS failures)
2. **Deep Ocean Aurora** over grayscale (user preference)
3. **"Stopp Clock"** two-word branding (not "STOPPCLOCK")
4. **Clock between words** (not separate section)
5. **Whisper branding** for DYAI (minimal presence)

---

## 🔍 Technical Constraints

- **Max localStorage:** ~5MB browser limit
- **60 FPS target:** Canvas animations via requestAnimationFrame
- **Offline-capable:** Service Worker for PWA
- **No external dependencies:** Core timer logic vanilla JS/TS
- **Privacy-first:** No tracking without consent

---

## 📚 Documentation References

- **CLAUDE.md:** Project overview, commands, architecture
- **README.md:** User-facing documentation
- **specs/:** Feature specifications (Speckit framework)
- **.specify/:** Feature planning and constitution

---

**End of Context Document**

*This file is auto-updated at session boundaries to maintain continuity.*
