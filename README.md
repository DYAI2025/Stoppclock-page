# Stoppclock 🕐

<div align="center">
  <p><strong>Projector-friendly timers & clocks for classrooms, exams, and seminars.</strong></p>
  <p>
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
    <img src="https://img.shields.io/badge/Status-Stable-brightgreen.svg" alt="Status">
    <img src="https://img.shields.io/badge/PWA-Ready-blue.svg" alt="PWA">
  </p>
</div>

<p align="center">
  <img src="https://placehold.co/800x400/0b1220/ffffff?text=Stoppclock+Preview" alt="Stoppclock Preview" style="border-radius: 8px;">
</p>

## 🌟 Features

### Core Functionality
- **8 Specialized Timers** - Analog countdown, stopwatch, digital countdown, world clock, alarm, metronome, chess clock, and cooking timer
- **Projector-Optimized** - High contrast, large displays perfect for classroom presentations
- **Offline-Ready** - Fully functional as a Progressive Web App (PWA) without internet connection
- **Privacy-First** - No tracking by default, ads only enabled with explicit user consent
- **State Persistence** - All timers maintain their state when navigating between tools
- **Keyboard Shortcuts** - Space (start/pause), R (reset), F (fullscreen), arrow keys for adjustment
- **Cross-Platform** - Works on all modern browsers and devices

### Home Page Design (NEW)
- **Professional Design System** - Swiss/Bauhaus inspired with Sage Green & Charcoal palette
- **Dark/Light Mode Toggle** - User can switch between dark and light themes with persistent preference
- **Golden Ratio Layout** - Mathematically proportioned spacing and typography
- **Responsive Grid** - 3-column timer card layout with proper alignment and spacing
- **Educational Content** - "Space for Time" pillar section with curated learning resources

## 🛠️ Technologies Used

- **React 18** - Component-based UI with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Playwright** - End-to-end testing
- **Canvas API** - Smooth 60 FPS animations for analog timer
- **Web Audio API** - Sound generation for alerts
- **Service Worker** - Offline functionality
- **localStorage** - Local state persistence

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd stoppclock

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
# Build the application
npm run build

# Preview production build locally
npm run preview
```

### Run Tests
```bash
# Run end-to-end tests
npm run test:e2e

# Run tests in UI mode
npm run test:e2e:ui
```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:e2e:ui` | Run tests in UI mode |
| `npm run doctor` | Run security/quality checks |

## 📱 Tools Overview

### Analog Countdown ⏱️
- Canvas-based analog clock visualization
- Up to 12 hours timer duration
- Presets from 5 minutes to 12 hours
- Warning alerts with sound and flash
- Fullscreen mode for projection

### Stopwatch 🕒
- Start/pause/reset functionality
- Lap time recording with differences
- Fullscreen display
- Keyboard controls: Space, R, L, F

### Digital Countdown ⏳
- HH:MM:SS format with input fields
- Start/pause/reset controls
- Warning system with configurable intervals
- Time adjustment buttons

### Digital Clock 🕐
- Real-time clock display
- 12/24 hour format toggle
- Date display
- Fullscreen mode

### World Clock 🌍
- Multiple timezones display
- Add/remove timezone functionality
- Real-time updates

### Alarm 🔔
- Multiple alarm management
- Time and label configuration
- Repeat options

### Metronome 🥁
- BPM control (40-240 range)
- Accent on first beat
- Visual and audio feedback
- Beat indicators

### Chess Clock ♟️
- Dual timer for chess games
- Player switching mechanism
- Time controls for different game types

## 🎨 Design Principles

### Visual Design System (Home Page)
**Swiss/Bauhaus Inspired** - Professional, minimalist aesthetic
- **Color Palette**: Sage Green (#9CAF88) + Charcoal (#2C3E50)
- **Typography**: Segoe UI, modern sans-serif
- **Golden Ratio**: Proportional spacing (φ = 1.618)
- **Borders**: Minimalist 1px with subtle shadows
- **Spacing**: Calculated with golden ratio (61.8px, 78.4px, 47.4px gaps)

### Dark/Light Mode Toggle
- **Dark Mode** (Default): Dark gradient (#1a2332 → #0f1419) with light text
- **Light Mode**: Light gradient (#f8f9fa → #f0f1f5) with dark text
- **Persistent**: User preference saved to localStorage
- **Toggle Button**: Fixed position with moon/sun icons
- **Implementation**: CSS-based with `html[data-theme]` attribute

### Home Page Layout
- **Section Separation**: Clear visual distinction between Timer section and Pillar/Blog section
- **Timer Cards**: Uniform 180px height, responsive grid layout
- **Hero Section**: "Space for Time" pillar with educational content
- **Typography**: Large, readable headlines with proper hierarchy
- **Accessibility**: High contrast, keyboard navigable

### Accessibility
- High contrast color scheme (WCAG 2.1 AA compliant)
- Large, readable displays
- Keyboard navigation support
- Screen reader compatibility
- Dark/Light mode for visual preference

### Performance
- 60 FPS animations using requestAnimationFrame
- Efficient state management
- Minimal bundle size
- Optimized canvas rendering
- CSS-based theming (no JavaScript reflows)

### Privacy
- No external tracking
- Local-only data storage
- Opt-in advertising with consent banner
- GDPR compliant

## 🧪 Testing

Stoppclock uses Playwright for comprehensive end-to-end testing:

- **44+ E2E Tests** covering all timer tools
- **Cross-browser** compatibility (Chrome, Firefox, Safari)
- **State persistence** verification
- **Keyboard shortcut** functionality tests
- **Fullscreen** mode validation

## 📱 Progressive Web App

Stoppclock is built as a PWA with:

- **Offline functionality** via service worker
- **Installable** on all platforms
- **Fast loading** with app shell architecture
- **Responsive design** for all screen sizes

## 🔧 Configuration

### Environment Variables
The application uses several configuration points:

- `public/sw.js` - Service worker for offline functionality
- `public/manifest.webmanifest` - PWA configuration
- `src/styles.css` - Global styling and dark theme

### AdSense Integration
- Disabled by default
- Enabled through user consent banner
- Configured in `index.html`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Run `npm run doctor` to check for issues
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

- Check the [Issues](../../issues) page for existing problems
- Create a new issue with detailed information
- Include your browser, OS, and steps to reproduce

## 🙏 Acknowledgments

- Built with React, TypeScript, and Vite
- Inspired by the need for projector-friendly classroom tools
- Designed with privacy and accessibility in mind

---

<div align="center">
  <p><strong>Stoppclock</strong> - Making time management simple and accessible</p>
  <p>⭐ Star this repo if you find it useful!</p>
</div>