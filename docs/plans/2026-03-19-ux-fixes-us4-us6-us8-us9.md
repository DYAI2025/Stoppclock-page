# UX Fixes: Navigation, Orphan Routes, Zombie Imports, Touch Targets

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix navigation dead-ends on all subpages, make orphan routes discoverable, remove zombie imports, and fix undersized mobile touch targets.

**Architecture:** Add a global footer in `main.tsx`'s `App()` component (not AppShell — which is unused by any page). Link orphan routes from the LandingPage timer grid and About page. Remove dead lazy-imports from main.tsx. Increase mobile toggle sizes to 44px WCAG minimum.

**Tech Stack:** React 18, TypeScript, CSS (no Tailwind), Vite, Playwright E2E

---

### Task 1: Global Footer Component

**Problem:** AppShell.tsx has a footer but NO page imports AppShell. All subpages (timer, blog, facts, legal) are navigation dead-ends — the only way out is the HomeButton.

**Files:**
- Create: `src/components/GlobalFooter.tsx`
- Modify: `src/main.tsx:94-158` (add GlobalFooter inside App)
- Modify: `src/styles.css:293-311` (update footer styles)
- Modify: `src/components/layout/AppShell.tsx` (remove unused footer)

**Step 1: Create GlobalFooter component**

Create `src/components/GlobalFooter.tsx`:

```tsx
import { useEffect, useState } from 'react';

/**
 * GlobalFooter — rendered in App() for ALL routes except landing page.
 * LandingPage has its own footer with keyboard shortcuts hint.
 */
export function GlobalFooter() {
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash || '#/';
    return hash.replace(/^#/, '') || '/';
  });

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash || '#/';
      setRoute(hash.replace(/^#/, '') || '/');
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  // LandingPage has its own footer
  if (route === '/') return null;

  return (
    <footer className="global-footer">
      <nav className="global-footer-nav" aria-label="Footer Navigation">
        <a href="#/">Home</a>
        <span className="global-footer-sep" aria-hidden="true">·</span>
        <a href="#/blog">Blog</a>
        <span className="global-footer-sep" aria-hidden="true">·</span>
        <a href="#/timers">Timer Worlds</a>
        <span className="global-footer-sep" aria-hidden="true">·</span>
        <a href="#/about">About</a>
      </nav>
      <nav className="global-footer-legal" aria-label="Legal">
        <a href="#/impressum">Impressum</a>
        <span className="global-footer-sep" aria-hidden="true">·</span>
        <a href="#/datenschutz">Datenschutz</a>
      </nav>
    </footer>
  );
}
```

**Step 2: Add CSS for GlobalFooter**

Replace the `.app-shell-footer` block in `src/styles.css:293-311` with:

```css
.global-footer {
  text-align: center;
  padding: 2rem 1rem 1rem;
  font-size: 0.8rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.global-footer:hover {
  opacity: 0.8;
}

.global-footer-nav,
.global-footer-legal {
  display: inline;
}

.global-footer-legal {
  display: block;
  margin-top: 0.3rem;
}

.global-footer a {
  color: var(--fg);
  text-decoration: none;
}

.global-footer a:hover {
  text-decoration: underline;
}

.global-footer-sep {
  margin: 0 0.4rem;
}
```

**Step 3: Wire GlobalFooter into App()**

In `src/main.tsx`, add import at top:
```tsx
import { GlobalFooter } from './components/GlobalFooter';
```

Then add `<GlobalFooter />` after the `</Suspense>` and before `<AnchorAdSlot />`:

```tsx
      </Suspense>

      {/* Global footer with cross-navigation (hidden on LandingPage) */}
      <GlobalFooter />

      {/* Global Anchor Ad */}
      <AnchorAdSlot />
```

**Step 4: Remove dead footer from AppShell**

In `src/components/layout/AppShell.tsx`, remove lines 39-44 (the footer block), reverting to:

```tsx
      <main id="main" className="app-main">
        {children}
      </main>
    </>
  );
}
```

**Step 5: Build and verify**

Run: `npm run build`
Expected: Clean build, no errors.

**Step 6: Commit**

```bash
git add src/components/GlobalFooter.tsx src/main.tsx src/styles.css src/components/layout/AppShell.tsx
git commit -m "feat(nav): add global footer with cross-navigation on all subpages

Fixes US-4: all timer, blog, facts, and legal pages now have footer links
to Home, Blog, Timer Worlds, About, Impressum, and Datenschutz.
LandingPage excluded (has its own footer)."
```

---

### Task 2: Make Orphan Routes Discoverable

**Problem:** `/pillar`, `/time-philosophy`, `/timelab` exist as fully implemented pages but have zero inbound links. Users can never discover them.

**Files:**
- Modify: `src/pages/LandingPage.tsx` (TIMERS array, ~line 30-100)
- Modify: `src/pages/About.tsx` (add links)

**Step 1: Read the TIMERS array in LandingPage.tsx**

Read `src/pages/LandingPage.tsx:29-100` to find the TIMERS array. Add `timelab` entry after the existing timer definitions:

```tsx
{
    id: 'timelab',
    route: '#/timelab',
    label: 'Time Lab',
    tagline: 'Since & until markers',
    icon: Clock4,
    gradient: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
    color: '#6366F1',
    lsKey: 'sc.v1.timelab'
},
```

Note: `Clock4` is already imported. Find the correct insertion point after the last timer in the array.

**Step 2: Add /time-philosophy and /pillar links in About page**

Read `src/pages/About.tsx` to find where content links exist. Add a "More from Stoppclock" section before the closing `</div>`:

```tsx
<section style={{ marginTop: '48px', borderTop: '1px solid var(--subtle-border)', paddingTop: '32px' }}>
  <h2>Mehr entdecken</h2>
  <ul style={{ listStyle: 'none', padding: 0 }}>
    <li style={{ marginBottom: '12px' }}>
      <a href="#/time-philosophy" style={{ color: 'var(--accent-primary)' }}>Raum für Zeit</a> — Philosophische Gedanken über Zeit
    </li>
    <li style={{ marginBottom: '12px' }}>
      <a href="#/pillar" style={{ color: 'var(--accent-primary)' }}>Stoppclock Pillar</a> — Technische Übersicht und Features
    </li>
    <li style={{ marginBottom: '12px' }}>
      <a href="#/timelab" style={{ color: 'var(--accent-primary)' }}>Time Lab</a> — Historische Zeitmarker und Countdowns
    </li>
  </ul>
</section>
```

**Step 3: Build and verify**

Run: `npm run build`
Expected: Clean build.

**Step 4: Commit**

```bash
git add src/pages/LandingPage.tsx src/pages/About.tsx
git commit -m "feat(nav): make orphan routes discoverable

- Add TimeLab to LandingPage timer grid
- Add links to /time-philosophy, /pillar, /timelab in About page
Fixes US-6"
```

---

### Task 3: Remove Zombie Blog Imports

**Problem:** `PomodoroTimerOnline` and `PomodoroVsCountdown` are lazy-imported in main.tsx (lines 42-43) but never rendered — `DynamicBlogRouter` handles all `/blog/*` routes first at line 132-134.

**Files:**
- Modify: `src/main.tsx:42-43` (remove lazy imports)

**Step 1: Remove the two zombie imports**

In `src/main.tsx`, delete lines 42-43:

```tsx
// DELETE these two lines:
const PomodoroTimerOnline = lazy(() => import("./pages/blog/PomodoroTimerOnline"));
const PomodoroVsCountdown = lazy(() => import("./pages/blog/PomodoroVsCountdown"));
```

**Step 2: Check for any remaining references**

Grep `src/main.tsx` for `PomodoroTimerOnline` and `PomodoroVsCountdown`. The route match at line 141 (`/blog/countdown-timer-guide`) references `CountdownGuide`, not these — so no route matches need removal.

Verify: The only other reference is in the Not-Found exclude array (line 150) which has `/blog/pomodoro-timer-online` — this can stay since DynamicBlogRouter handles it and it prevents a flash of Not Found.

**Step 3: Build and verify**

Run: `npm run build`
Expected: Clean build, slightly smaller main chunk (two fewer lazy chunks generated).

**Step 4: Commit**

```bash
git add src/main.tsx
git commit -m "refactor: remove zombie blog page imports from main.tsx

PomodoroTimerOnline and PomodoroVsCountdown were lazy-imported but
never rendered — DynamicBlogRouter handles all /blog/* routes.
Fixes US-8"
```

---

### Task 4: Fix Mobile Touch Target Sizes

**Problem:** Dark mode toggle on mobile is 36x36px, below WCAG 2.2 minimum of 44x44px for touch targets.

**Files:**
- Modify: `src/styles/home-swiss.css:146-160` (mobile media query)

**Step 1: Update mobile toggle sizes**

In `src/styles/home-swiss.css`, find the `@media (max-width: 640px)` block around line 146. Change the `.dark-mode-toggle` dimensions:

Replace:
```css
  .dark-mode-toggle {
    top: 12px;
    right: 60px;
    padding: 6px 8px;
    width: 36px;
    height: 36px;
  }
```

With:
```css
  .dark-mode-toggle {
    top: 12px;
    right: 60px;
    padding: 6px 8px;
    width: 44px;
    height: 44px;
  }
```

**Step 2: Check lang-toggle in same media query**

In the same `@media (max-width: 640px)` block, the `.lang-toggle` has `padding: 6px 10px` but no explicit width/height. Check if its computed size is >= 44px. If not, add `min-height: 44px; min-width: 44px;` to the `.lang-toggle` rule in this media query:

```css
  .lang-toggle {
    top: 12px;
    right: 12px;
    padding: 6px 10px;
    min-height: 44px;
    min-width: 44px;
  }
```

**Step 3: Build and verify**

Run: `npm run build`
Expected: Clean build.

**Step 4: Commit**

```bash
git add src/styles/home-swiss.css
git commit -m "fix(a11y): increase mobile toggle touch targets to 44px WCAG minimum

Dark mode toggle was 36x36px on mobile, below WCAG 2.2 recommended
44x44px minimum for touch targets.
Fixes US-9"
```

---

## Execution Order

1. **Task 3** (Zombie Imports) — smallest, zero risk, quick win
2. **Task 4** (Touch Targets) — CSS-only, isolated change
3. **Task 1** (Global Footer) — biggest change, new component
4. **Task 2** (Orphan Routes) — depends on verifying Task 1's footer works

## Verification After All Tasks

```bash
npm run build          # Must pass
npm run doctor         # Must pass (no forbidden tokens)

# E2E (start preview first):
npx vite preview --port 4173 &
npx playwright test tests/e2e/12-seo-meta-tags.spec.ts   # SEO still works
npx playwright test tests/e2e/11-adsense-policy.spec.ts   # Ads still compliant
```
