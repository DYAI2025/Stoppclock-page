# Stoppclock Project - QWEN.md

## Project Overview

Stoppclock is a projector-friendly web application that provides various timer and clock utilities. It's built as a React-based Progressive Web App (PWA) using Vite as the build tool, TypeScript for type safety, and follows modern web development practices. The application includes multiple time-related tools such as analog countdown timers, stopwatch, digital clock, world clock, metronome, and chess clock.

The project is designed to be used in educational settings, exam halls, and other scenarios where a clean, high-contrast timer is needed on a projector. It emphasizes offline functionality, privacy-first design, and responsive performance.

### Key Features:
- Analog countdown timer (up to 12 hours)
- Stopwatch with lap functionality
- Digital and world clocks
- Metronome and chess clock
- Fullscreen mode optimized for projectors
- Local state persistence
- Progressive Web App (offline support)
- SEO-optimized with JSON-LD markup
- Privacy-focused (ads disabled by default with consent banner)

## Project Architecture

The project follows a React-based SPA (Single Page Application) architecture with hash-based routing. Key architectural components:

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS with a dark theme
- **State Management**: React hooks with localStorage persistence
- **Routing**: Hash-based routing in main.tsx
- **Service Worker**: Basic offline support
- **Testing**: Playwright for end-to-end tests

## Directory Structure

```
stoppclock-page/
├── index.html              # Main HTML entry point with SEO/JSON-LD
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript configuration
├── playwright.config.ts    # Playwright test configuration
├── public/                 # Static assets (manifest, icons, etc.)
├── src/                    # Source code
│   ├── main.tsx           # App entry point and routing
│   ├── styles.css         # Global styles
│   └── pages/             # Individual timer components
├── scripts/                # Build/deploy scripts
├── .github/workflows/      # CI/CD configuration
└── tests/                  # Test files
```

## Building and Running

### Development
```bash
npm install        # Install dependencies
npm run dev        # Start development server on http://localhost:5173
```

### Production Build
```bash
npm run build      # Builds the app to the 'dist' directory
npm run preview    # Preview the production build locally
```

### Testing
```bash
npm run test:e2e          # Run end-to-end tests
npm run test:e2e:ui       # Run tests in UI mode
```

### Additional Scripts
- `npm run doctor` - Runs security/quality checks on the codebase
- `npm run build` - Builds the app and generates sitemap

## Key Technologies and Dependencies

- **React 18** - Component-based UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and development server
- **Playwright** - End-to-end testing
- **PWA Support** - Offline functionality via service worker
- **CSS** - Styling with support for light/dark modes

## Development Conventions

### Code Style
- TypeScript with strict mode enabled
- React hooks for state management
- Local storage for persistent state
- Responsive design for projector use

### Component Structure
- Each tool is implemented as a separate React component in `/src/pages/`
- Components manage their own state and persistence
- Reusable hooks for common functionality (useRaf, etc.)

### Testing Practices
- End-to-end tests using Playwright
- Tests run in multiple browsers (Chromium, Firefox)
- CI includes smoke tests to verify deployed URLs

### Deployment
- GitHub Pages deployment via GitHub Actions
- Workflow includes doctor guard, build, and smoke testing
- Custom domain support (www.stoppclock.com)

## Special Features

### Accessibility and Projector-Friendly Design
- High contrast dark theme
- Large, readable displays
- Fullscreen mode for projection
- Keyboard shortcuts for common actions

### Privacy and Ads
- Ads are disabled by default
- Consent banner for ad opt-in
- No tracking by default
- Local data persistence

### Performance Optimization
- Canvas-based analog timer for smooth animation
- RequestAnimationFrame for efficient rendering
- Service worker for offline support
- Optimized CSS for fast rendering

## Configuration Files

### Package.json Scripts
- `dev`: Vite development server
- `build`: Production build with sitemap generation
- `preview`: Local preview of production build
- `doctor`: Security/quality checks
- `test:e2e`: End-to-end tests

### Vite Configuration
- React SWC plugin for fast compilation
- Base path set to "/"
- Output directory set to "dist"

### Playwright Configuration
- Tests in Chromium and Firefox
- Built-in web server for preview
- Trace recordings for failed tests

## Browser Support
- Last 2 versions of Chrome/Edge/Firefox/Safari
- iOS 15+

## Security Features
- Content Security Policy (CSP)
- Local storage for user preferences only
- No external tracking by default
- Ad consent mechanism

## Future Development Notes
- Additional timer types (currently placeholders exist for Alarm, Digital Clock, World Clock, etc.)
- Potential for Lighthouse CI integration
- Imprint/Privacy page implementation