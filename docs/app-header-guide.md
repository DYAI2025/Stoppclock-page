# AppHeader Component Guide

## Overview

The **AppHeader** is a unified header system that provides consistent navigation and actions across all pages in StoppClock. It replaces the previous fragmented approach of individual HomeButton, ShareButton, and separate theme toggles.

## Features

✨ **Unified Design System**
- Consistent header across landing pages and timer pages
- Frosted glass effect with backdrop blur
- Sticky positioning with smooth transitions
- Dark/light mode support

🎯 **Flexible Configuration**
- Breadcrumb navigation
- Customizable action toolbar
- Variant modes (landing vs timer)
- Show/hide individual actions

🎨 **Enhanced Branding**
- Animated logo with rotating clock hand
- Gradient wordmark
- Responsive icon-only mode on mobile

📱 **Mobile Optimized**
- Auto-collapse breadcrumbs
- Compact action buttons
- Touch-friendly hit areas
- Responsive layout

## Components

### 1. AppHeader (Main Component)

The primary header component with full configuration options.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Current page/timer name |
| `breadcrumbs` | `BreadcrumbItem[]` | - | Navigation breadcrumb items |
| `showBack` | `boolean` | `false` | Show back button instead of logo |
| `onBack` | `() => void` | - | Back button click handler |
| `actions` | `ActionConfig` | `{}` | Action toolbar configuration |
| `variant` | `'landing' \| 'timer'` | `'timer'` | Header variant |
| `className` | `string` | `''` | Custom CSS class |

#### ActionConfig

```typescript
interface ActionConfig {
  showShare?: boolean;
  onShare?: () => void;
  showFullscreen?: boolean;
  onFullscreen?: () => void;
  showTheme?: boolean;         // Default: true
  showLanguage?: boolean;
  showSettings?: boolean;       // Default: true
  showHome?: boolean;           // Default: true for timer pages
}
```

#### BreadcrumbItem

```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;  // Optional - if not provided, rendered as current page
}
```

### 2. Logo Component

Enhanced logo with animated clock icon.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'full' \| 'icon-only'` | `'full'` | Show text or icon only |
| `clickable` | `boolean` | `true` | Navigate to home on click |
| `className` | `string` | `''` | Custom CSS class |

#### Features
- ⏰ Animated second hand rotation (60s loop)
- 🌈 Gradient wordmark (Aurora theme)
- 📱 Auto icon-only on mobile for timer pages

### 3. HeaderActions Component

Action toolbar with common header buttons.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showShare` | `boolean` | `false` | Show share button |
| `onShare` | `() => void` | - | Share click handler |
| `showFullscreen` | `boolean` | `false` | Show fullscreen button |
| `onFullscreen` | `() => void` | - | Fullscreen handler (default provided) |
| `showTheme` | `boolean` | `true` | Show theme toggle |
| `showLanguage` | `boolean` | `false` | Show language toggle |
| `showSettings` | `boolean` | `true` | Show settings button |
| `showHome` | `boolean` | `false` | Show home button |
| `className` | `string` | `''` | Custom CSS class |

## Usage Examples

### Landing Page

```tsx
import { AppHeader } from '../components/AppHeader';

function LandingPage() {
  return (
    <div className="landing-page">
      <AppHeader 
        variant="landing"
        actions={{
          showTheme: true,
          showLanguage: true,
          showSettings: true
        }}
      />
      {/* Page content */}
    </div>
  );
}
```

### Timer Page with Breadcrumb

```tsx
import { AppHeader } from '../components/AppHeader';

function ChessClock() {
  const handleShare = () => {
    // Custom share logic
  };

  const handleFullscreen = () => {
    document.documentElement.requestFullscreen();
  };

  return (
    <div className="timer-page">
      <AppHeader
        title="Chess Clock"
        breadcrumbs={[
          { label: 'Home', href: '#/' },
          { label: 'Chess Clock' }
        ]}
        actions={{
          showShare: true,
          onShare: handleShare,
          showFullscreen: true,
          onFullscreen: handleFullscreen,
          showTheme: true,
          showSettings: true,
          showHome: true
        }}
        variant="timer"
      />
      {/* Timer content */}
    </div>
  );
}
```

### Simple Timer Page

```tsx
import { AppHeader } from '../components/AppHeader';

function Stopwatch() {
  return (
    <div className="timer-page">
      <AppHeader
        title="Stopwatch"
        actions={{
          showFullscreen: true,
          showHome: true
        }}
      />
      {/* Timer content */}
    </div>
  );
}
```

### With Back Button

```tsx
import { AppHeader } from '../components/AppHeader';

function SessionBuilder() {
  const handleBack = () => {
    window.location.hash = '#/custom-sessions';
  };

  return (
    <div className="page">
      <AppHeader
        title="Session Builder"
        showBack
        onBack={handleBack}
        actions={{
          showHome: true
        }}
      />
      {/* Page content */}
    </div>
  );
}
```

## Standalone Components

### Logo Only

```tsx
import { Logo } from '../components/Logo';

function CustomHeader() {
  return (
    <header>
      <Logo variant="full" />
      {/* Custom header content */}
    </header>
  );
}
```

### Actions Toolbar Only

```tsx
import { HeaderActions } from '../components/HeaderActions';

function CustomHeader() {
  return (
    <header>
      <div className="left-section">...</div>
      <HeaderActions
        showShare
        showFullscreen
        showHome
      />
    </header>
  );
}
```

## Styling

### CSS Variables

The header uses these CSS variables (defined in `app-header.css`):

```css
--header-height: 60px;
--header-bg: rgba(255, 255, 255, 0.92);
--header-bg-dark: rgba(26, 31, 46, 0.92);
--header-border: rgba(228, 229, 231, 0.8);
--header-border-dark: rgba(42, 49, 66, 0.8);
--header-text: #111218;
--header-text-dark: #e8eaed;
--header-text-muted: #6B6E76;
--header-text-muted-dark: #9ca0a8;
```

### Custom Styling

Override styles by targeting specific classes:

```css
/* Custom logo color */
.app-logo .logo-icon {
  background: linear-gradient(135deg, #FF6B9D 0%, #C77DFF 100%);
}

/* Custom header height */
.app-header {
  height: 72px;
}

/* Hide actions on mobile */
@media (max-width: 480px) {
  .header-actions .header-action-btn:not(.header-home-btn) {
    display: none;
  }
}
```

## Dark Mode

The header automatically adapts to dark mode through the `html[data-theme="dark"]` selector:

- Background becomes semi-transparent dark
- Text switches to light color
- Borders adjust to dark theme
- Logo gradient updates for better contrast

## Accessibility

The header includes proper accessibility features:

- ✅ Semantic HTML (`<header>`, `<nav>`, `<h1>`)
- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader friendly breadcrumbs
- ✅ Proper heading hierarchy

## Migration Guide

### From HomeButton

**Before:**
```tsx
<HomeButton />
```

**After:**
```tsx
<AppHeader
  title="Timer Name"
  actions={{ showHome: true }}
/>
```

### From Multiple Components

**Before:**
```tsx
<div className="header">
  <HomeButton />
  <h1>Chess Clock</h1>
  <ShareButton {...} />
  <DarkModeToggle />
  <SettingsModal />
</div>
```

**After:**
```tsx
<AppHeader
  title="Chess Clock"
  breadcrumbs={[
    { label: 'Home', href: '#/' },
    { label: 'Chess Clock' }
  ]}
  actions={{
    showShare: true,
    onShare: handleShare,
    showTheme: true,
    showSettings: true,
    showHome: true
  }}
/>
```

## Best Practices

### ✅ Do

- Use breadcrumbs for deep navigation hierarchy
- Provide custom handlers for share/fullscreen when needed
- Keep titles concise (max 2-3 words)
- Use `variant="landing"` for marketing pages
- Hide unnecessary actions on simple pages

### ❌ Don't

- Don't nest AppHeader inside another header
- Don't modify global header CSS variables locally
- Don't use both `title` and `breadcrumbs` (breadcrumbs take precedence)
- Don't forget to hide original share/save buttons when integrating

## Keyboard Shortcuts

The header respects global keyboard shortcuts:

- **F** - Toggle fullscreen (when `showFullscreen` is enabled)
- **/** - Focus search (if implemented)
- **Esc** - Close modals (settings)

## Performance

The header is optimized for performance:

- **Sticky positioning** uses GPU-accelerated transforms
- **Backdrop blur** cached for smooth scrolling
- **Icons** are SVG for crisp rendering
- **Transitions** use hardware acceleration
- **Minimal re-renders** through proper React memoization

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari 14+, Chrome Android 90+)

**Fallbacks:**
- Backdrop blur falls back to solid background
- Sticky positioning supported universally
- CSS variables have sensible defaults

## Troubleshooting

### Header not sticky

Ensure parent elements don't have `overflow: hidden`:

```css
/* Fix */
.page-wrapper {
  overflow: visible; /* or overflow-y: auto */
}
```

### Actions not showing

Check that CSS is imported in main styles:

```css
@import './styles/app-header.css';
```

### Logo animation not working

Ensure browser supports CSS animations:

```css
@supports (animation: rotate-hand 60s linear infinite) {
  .logo-icon-hand {
    animation: rotate-hand 60s linear infinite;
  }
}
```

### Dark mode not applying

Verify `data-theme` attribute on `<html>`:

```typescript
document.documentElement.dataset.theme = 'dark';
```

## Future Enhancements

Planned improvements:

- 🔄 Auto-hide on scroll down, show on scroll up
- 🔍 Integrated search bar (landing variant)
- 📱 Bottom navigation for mobile timers
- 🎨 Customizable themes per timer
- ⌨️ Command palette integration
- 📊 Progress indicator for running timers

## Support

For issues or questions:
- 📝 Check [AGENTS.md](../AGENTS.md) for project guidelines
- 🐛 Report bugs with browser/OS details
- 💡 Suggest improvements via GitHub issues
