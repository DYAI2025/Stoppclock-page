# Wiederholbares Seitenkonzept für Stoppclock
## Architektur-Analyse & Designsystem-Ableitung

---

## 1. Aktuelle Technologie & Architektur

### Tech Stack
- **Framework**: React 18.3.1 mit TypeScript (strict mode)
- **Build Tool**: Vite 5.4.10
- **Styling**: Vanilla CSS mit CSS Custom Properties (Design Tokens)
- **Routing**: Custom Hash-based Routing (`useHashRoute`)
- **State Management**: React useState/useEffect + localStorage Persistierung
- **Icons**: Lucide React
- **Testing**: Playwright für E2E Tests

### Architektur-Muster

#### 1. **Seiten-Struktur** (Beispiel: Countdown, Stopwatch, CustomSessions)
```
src/pages/
├── [Feature]Page.tsx          # Hauptkomponente
├── [Feature]Landing.tsx       # Optional: Landing/Overview Seite
└── types/
    └── [feature]-types.ts     # TypeScript Typen
```

#### 2. **State Management Pattern**
```typescript
// Konsistentes localStorage Pattern
const LS_KEY = "sc.v1.[feature]";

type Persist = {
  version: 1;
  // Feature-spezifische Felder
};

function load(): Persist { /* ... */ }
function save(p: Persist) { /* ... */ }
```

#### 3. **Styling Pattern**
```css
/* Feature-spezifische CSS Datei */
src/styles/[feature].css

/* Import in src/styles.css */
@import './styles/[feature].css';
```

---

## 2. Wiederholbares Seitenkonzept

### A. **Design Token System** (Bereits vorhanden, erweitern)

#### Bestehende Tokens (Landing Page):
```css
:root {
  /* Farben */
  --lp-bg-page: #F5F5F8;
  --lp-bg-surface: #FFFFFF;
  --lp-text-main: #111218;
  --lp-accent-primary: #0EA5E9;
  
  /* Spacing */
  --lp-spacing-xs: 8px;
  --lp-spacing-m: 16px;
  --lp-spacing-xl: 32px;
  
  /* Typography */
  --lp-font-body: 15px;
  --lp-font-h1: 24px;
  
  /* Radius */
  --lp-radius-m: 12px;
  --lp-radius-l: 16px;
}
```

#### **Vorschlag: Globales Design Token System**
```css
/* src/design-tokens-v2.css */
:root {
  /* === FARB-FAMILIEN === */
  /* Neutral */
  --sc-neutral-50: #FAFAFA;
  --sc-neutral-100: #F5F5F5;
  --sc-neutral-200: #E5E5E5;
  --sc-neutral-500: #737373;
  --sc-neutral-900: #171717;
  
  /* Accent (pro Feature anpassbar) */
  --sc-accent-primary: #0EA5E9;
  --sc-accent-secondary: #8B5CF6;
  --sc-accent-success: #22C55E;
  --sc-accent-warning: #F97316;
  --sc-accent-error: #EF4444;
  
  /* === SPACING SCALE (8px Basis) === */
  --sc-space-1: 4px;
  --sc-space-2: 8px;
  --sc-space-3: 12px;
  --sc-space-4: 16px;
  --sc-space-6: 24px;
  --sc-space-8: 32px;
  --sc-space-12: 48px;
  --sc-space-16: 64px;
  
  /* === TYPOGRAPHY SCALE === */
  --sc-text-xs: 0.75rem;    /* 12px */
  --sc-text-sm: 0.875rem;   /* 14px */
  --sc-text-base: 1rem;     /* 16px */
  --sc-text-lg: 1.125rem;   /* 18px */
  --sc-text-xl: 1.25rem;    /* 20px */
  --sc-text-2xl: 1.5rem;    /* 24px */
  --sc-text-3xl: 1.875rem;  /* 30px */
  --sc-text-4xl: 2.25rem;   /* 36px */
  
  /* === BORDER RADIUS === */
  --sc-radius-sm: 6px;
  --sc-radius-md: 8px;
  --sc-radius-lg: 12px;
  --sc-radius-xl: 16px;
  --sc-radius-full: 9999px;
  
  /* === SHADOWS === */
  --sc-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --sc-shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --sc-shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  
  /* === TRANSITIONS === */
  --sc-transition-fast: 150ms ease;
  --sc-transition-base: 200ms ease;
  --sc-transition-slow: 300ms ease;
}
```

---

### B. **Komponenten-Template System**

#### **Template 1: Feature Landing Page**
Verwendung: Übersichtsseiten wie CustomSessionsLanding, zukünftige Timer-Übersichten

```typescript
// src/pages/templates/FeatureLandingTemplate.tsx
interface FeatureLandingProps {
  title: string;
  description?: string;
  items: Array<{
    id: string;
    name: string;
    metadata: Record<string, any>;
  }>;
  presets?: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
  }>;
  actions: {
    onNew: () => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onExport: (id: string) => void;
    onImport: (file: File) => void;
  };
  renderItemCard: (item: any) => React.ReactNode;
  renderPresetCard?: (preset: any) => React.ReactNode;
}

export function FeatureLandingTemplate({ ... }: FeatureLandingProps) {
  return (
    <div className="sc-feature-landing">
      <header className="sc-header">
        <h1>{title}</h1>
        <HomeButton />
      </header>
      
      <div className="sc-container">
        {/* Actions Bar */}
        <div className="sc-actions">
          <button onClick={onNew} className="sc-btn-primary">
            <Plus /> New
          </button>
          <label className="sc-btn-secondary">
            <Upload /> Import
            <input type="file" onChange={...} />
          </label>
        </div>
        
        {/* Items Grid */}
        <section className="sc-section">
          <h2>Your Items ({items.length})</h2>
          <div className="sc-grid">
            {items.map(item => renderItemCard(item))}
          </div>
        </section>
        
        {/* Presets Grid (optional) */}
        {presets && (
          <section className="sc-section">
            <h2>Templates</h2>
            <div className="sc-grid">
              {presets.map(preset => renderPresetCard?.(preset))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
```

#### **Template 2: Timer/Tool Page**
Verwendung: Countdown, Stopwatch, Pomodoro, etc.

```typescript
// src/pages/templates/TimerPageTemplate.tsx
interface TimerPageProps {
  title: string;
  displayComponent: React.ReactNode;  // Große Zeit-Anzeige
  controls: React.ReactNode;          // Start/Pause/Reset Buttons
  settings?: React.ReactNode;         // Optionale Einstellungen
  guide?: React.ReactNode;            // Optionaler Guide/Info
  fullscreenRef: React.RefObject<HTMLDivElement>;
}

export function TimerPageTemplate({ ... }: TimerPageProps) {
  return (
    <div className="sc-timer-page" ref={fullscreenRef}>
      <header className="sc-timer-header">
        <h1>{title}</h1>
        <HomeButton />
      </header>
      
      <div className="sc-timer-display">
        {displayComponent}
      </div>
      
      <div className="sc-timer-controls">
        {controls}
      </div>
      
      {settings && (
        <div className="sc-timer-settings">
          {settings}
        </div>
      )}
      
      {guide && (
        <div className="sc-timer-guide">
          {guide}
        </div>
      )}
    </div>
  );
}
```

---

### C. **Wiedererkennungswert durch konsistente Elemente**

#### 1. **Header Pattern**
```tsx
// Konsistent über alle Seiten
<header className="sc-header">
  <h1 className="sc-title">{pageName}</h1>
  <HomeButton />
</header>
```

#### 2. **Card Pattern**
```css
/* Wiederverwendbare Card-Komponente */
.sc-card {
  background: var(--sc-neutral-50);
  border: 1px solid var(--sc-neutral-200);
  border-radius: var(--sc-radius-lg);
  padding: var(--sc-space-6);
  transition: all var(--sc-transition-base);
}

.sc-card:hover {
  box-shadow: var(--sc-shadow-md);
  transform: translateY(-2px);
}

.sc-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--sc-space-4);
}

.sc-card-title {
  font-size: var(--sc-text-xl);
  font-weight: 600;
  color: var(--sc-neutral-900);
}

.sc-card-actions {
  display: flex;
  gap: var(--sc-space-2);
}
```

#### 3. **Button System**
```css
/* Primäre Buttons */
.sc-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--sc-space-2);
  padding: var(--sc-space-3) var(--sc-space-6);
  border-radius: var(--sc-radius-md);
  font-weight: 500;
  transition: all var(--sc-transition-fast);
  cursor: pointer;
  border: none;
}

.sc-btn-primary {
  background: var(--sc-accent-primary);
  color: white;
}

.sc-btn-primary:hover {
  background: var(--sc-accent-primary-dark);
  transform: translateY(-1px);
}

.sc-btn-secondary {
  background: var(--sc-neutral-100);
  color: var(--sc-neutral-900);
  border: 1px solid var(--sc-neutral-200);
}

.sc-btn-ghost {
  background: transparent;
  color: var(--sc-neutral-700);
}
```

---

## 3. Verbesserungsvorschläge

### A. **Architektur-Verbesserungen**

#### 1. **Shared Component Library**
```
src/components/shared/
├── Button.tsx              # Wiederverwendbare Button-Komponente
├── Card.tsx                # Card-Komponente
├── Header.tsx              # Page Header
├── Grid.tsx                # Responsive Grid
├── Modal.tsx               # Modal/Dialog
└── EmptyState.tsx          # Empty State Placeholder
```

#### 2. **Custom Hooks Library**
```
src/hooks/
├── useLocalStorage.ts      # Generic localStorage hook
├── useTimer.ts             # Wiederverwendbare Timer-Logik
├── useKeyboardShortcuts.ts # Bereits vorhanden ✓
├── useAutoFitText.ts       # Bereits vorhanden ✓
└── useMediaQuery.ts        # Responsive breakpoints
```

Beispiel `useLocalStorage`:
```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    try {
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch {
      // Silent fail
    }
  };

  return [value, setStoredValue] as const;
}
```

#### 3. **Utility Functions Consolidation**
```
src/utils/
├── time.ts                 # formatTime, parseTime, etc.
├── storage.ts              # localStorage helpers
├── validation.ts           # Input validation
└── sound.ts                # beep, flash (bereits vorhanden)
```

---

### B. **Design-System Verbesserungen**

#### 1. **Farbpalette pro Feature**
Jedes Feature bekommt eine Akzentfarbe aus einer definierten Palette:

```css
/* Feature-spezifische Farben */
.feature-countdown { --feature-accent: #7B2CBF; }
.feature-stopwatch { --feature-accent: #0EA5E9; }
.feature-pomodoro { --feature-accent: #10B981; }
.feature-custom-session { --feature-accent: #A855F7; }

/* Verwendung */
.feature-card {
  border-left: 4px solid var(--feature-accent);
}
```

#### 2. **Responsive Typography System**
```css
/* Fluid Typography mit clamp() */
:root {
  --sc-text-display: clamp(2rem, 5vw, 3.5rem);
  --sc-text-h1: clamp(1.5rem, 4vw, 2.5rem);
  --sc-text-h2: clamp(1.25rem, 3vw, 1.875rem);
}
```

#### 3. **Dark Mode Support**
```css
/* Systematischer Dark Mode */
[data-theme="dark"] {
  --sc-neutral-50: #18181B;
  --sc-neutral-100: #27272A;
  --sc-neutral-900: #FAFAFA;
  --sc-bg-page: var(--sc-neutral-50);
  --sc-text-main: var(--sc-neutral-900);
}
```

---

### C. **UX-Verbesserungen**

#### 1. **Konsistente Keyboard Shortcuts**
```typescript
// Globale Shortcuts über alle Timer
const GLOBAL_SHORTCUTS = {
  'Space': 'Start/Pause',
  'r': 'Reset',
  'f': 'Fullscreen',
  'Escape': 'Exit Fullscreen',
  '?': 'Show Help'
};

// Feature-spezifische Shortcuts
const FEATURE_SHORTCUTS = {
  countdown: { '+': 'Add 1 min', '-': 'Subtract 1 min' },
  stopwatch: { 'l': 'Lap' },
  customSession: { 'n': 'Next Phase', 'p': 'Previous Phase' }
};
```

#### 2. **Loading States & Skeletons**
```tsx
// Wiederverwendbare Skeleton-Komponente
<div className="sc-skeleton">
  <div className="sc-skeleton-header" />
  <div className="sc-skeleton-text" />
  <div className="sc-skeleton-text short" />
</div>
```

#### 3. **Toast Notifications System**
```typescript
// src/components/Toast.tsx
interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

// Verwendung
showToast({ type: 'success', message: 'Session saved!' });
```

---

### D. **Performance-Verbesserungen**

#### 1. **Code Splitting**
```typescript
// Lazy Loading für große Features
const CustomSessionBuilder = lazy(() => import('./pages/SessionBuilder'));
const SessionRunner = lazy(() => import('./pages/SessionRunner'));

// In App.tsx
<Suspense fallback={<LoadingSpinner />}>
  {isCustomSessions && <CustomSessionsLanding />}
</Suspense>
```

#### 2. **Memoization**
```typescript
// Teure Berechnungen memoizen
const totalDuration = useMemo(
  () => elements.reduce((sum, el) => sum + el.durationMs, 0),
  [elements]
);
```

#### 3. **Virtual Scrolling** (für lange Listen)
```typescript
// Bei >100 Items in Listen
import { useVirtualizer } from '@tanstack/react-virtual';
```

---

## 4. Implementierungsplan

### Phase 1: Foundation (1-2 Wochen)
- [ ] Globales Design Token System erstellen (`design-tokens-v2.css`)
- [ ] Shared Component Library aufbauen
- [ ] Custom Hooks konsolidieren
- [ ] Utility Functions zentralisieren

### Phase 2: Templates (1 Woche)
- [ ] `FeatureLandingTemplate` erstellen
- [ ] `TimerPageTemplate` erstellen
- [ ] Bestehende Seiten auf Templates migrieren (optional)

### Phase 3: Improvements (2 Wochen)
- [ ] Dark Mode System implementieren
- [ ] Toast Notification System
- [ ] Keyboard Shortcuts vereinheitlichen
- [ ] Loading States & Skeletons

### Phase 4: Polish (1 Woche)
- [ ] Performance Optimierungen
- [ ] Accessibility Audit
- [ ] Mobile Optimierungen
- [ ] Dokumentation aktualisieren

---

## 5. Beispiel: Neue Feature-Seite erstellen

### Schritt-für-Schritt mit dem neuen System:

```typescript
// 1. Types definieren
// src/types/workout-timer-types.ts
export interface WorkoutExercise {
  id: string;
  name: string;
  durationMs: number;
  sets: number;
}

// 2. Seite erstellen mit Template
// src/pages/WorkoutTimer.tsx
import { FeatureLandingTemplate } from './templates/FeatureLandingTemplate';

export default function WorkoutTimer() {
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('sc.v1.workouts', []);
  
  return (
    <FeatureLandingTemplate
      title="Workout Timer"
      items={workouts}
      presets={DEFAULT_WORKOUT_PRESETS}
      actions={{
        onNew: () => navigate('#/workout/builder'),
        onEdit: (id) => navigate(`#/workout/builder?id=${id}`),
        // ...
      }}
      renderItemCard={(workout) => (
        <WorkoutCard workout={workout} />
      )}
    />
  );
}

// 3. Styling mit Design Tokens
// src/styles/workout-timer.css
.workout-timer {
  --feature-accent: var(--sc-accent-success);
}

.workout-card {
  background: var(--sc-neutral-50);
  border-radius: var(--sc-radius-lg);
  padding: var(--sc-space-6);
}

// 4. In main.tsx registrieren
import WorkoutTimer from './pages/WorkoutTimer';

// In App():
{route === "/workout" && <WorkoutTimer />}
```

---

## 6. Zusammenfassung

### Wiedererkennungswert durch:
1. **Konsistente Design Tokens** (Farben, Spacing, Typography)
2. **Einheitliche Komponenten** (Header, Cards, Buttons)
3. **Standardisierte Layouts** (Templates)
4. **Gleiche Interaktionsmuster** (Keyboard Shortcuts, Hover States)

### Flexibilität durch:
1. **Template System** (Wiederverwendbare Seitenstrukturen)
2. **Feature-spezifische Akzentfarben**
3. **Modulare Komponenten**
4. **Custom Hooks für gemeinsame Logik**

### Qualität durch:
1. **TypeScript Strict Mode**
2. **Design Token System**
3. **Accessibility Standards**
4. **Performance Best Practices**

---

**Nächste Schritte**: 
1. Design Token System v2 implementieren
2. Erste Template-Komponente erstellen
3. Eine bestehende Seite als Proof-of-Concept migrieren
4. Feedback einholen und iterieren