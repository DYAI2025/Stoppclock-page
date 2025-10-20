# Stoppclock Project Constitution

**Version**: 1.0.0
**Last Updated**: 2025-10-20
**Project**: Stoppclock - Classroom Timer Tools

## Core Principles

### 1. Privacy First
**Non-negotiable**: User privacy and data protection are paramount.

- No tracking without explicit opt-in consent
- All analytics and monetization features require user approval
- Local-first data storage (localStorage, no server-side tracking)
- GDPR and privacy law compliance
- Clear, honest communication about data usage

### 2. Performance & Speed
**Non-negotiable**: Fast load times and responsive UX.

- Lighthouse score must remain >90
- Initial page load under 2 seconds
- No blocking third-party scripts on critical path
- Async loading for all non-essential resources (ads, analytics)
- Service worker network-first strategy for dynamic content

### 3. Classroom Optimized
**Non-negotiable**: Designed for teachers and presenters.

- Fullscreen/projector mode without ad interference
- Keyboard-only navigation support
- Large, readable fonts and high contrast
- Works offline (PWA functionality preserved)
- No interruptions during timer usage

### 4. Progressive Enhancement
**Non-negotiable**: Core functionality works without JavaScript enhancements.

- Timers function without ads loaded
- Graceful degradation when features unavailable
- No breaking changes that prevent basic timer usage
- Offline-first architecture maintained

### 5. Accessibility
**Non-negotiable**: WCAG 2.1 AA compliance.

- High contrast themes (dark/light)
- respects prefers-reduced-motion
- Keyboard navigation
- Screen reader support
- Mobile-responsive design

### 6. Code Quality
**Non-negotiable**: Maintainable, well-tested code.

- TypeScript strict mode
- Comprehensive Playwright E2E tests
- No console errors in production
- Follow existing code patterns
- Document breaking changes

## Monetization Guidelines

### Acceptable Practices
- Opt-in Google AdSense with consent banner
- Non-intrusive ad placement (home page, setup screens, legal pages)
- Ad-free mode option (premium/one-time payment)
- Honest value proposition ("Support free timers")

### Unacceptable Practices
- Forced ads without consent
- Ads during active timer usage
- Tracking without consent
- Pop-ups or interstitials that block timer access
- Auto-playing video/audio ads

## Feature Development Standards

### Specification Phase
- Technology-agnostic requirements
- Measurable success criteria
- User-focused language
- Maximum 3 clarification questions

### Planning Phase
- Validate against all constitution principles
- Document performance impact
- Plan for offline functionality
- Consider accessibility from start

### Implementation Phase
- Test-driven development preferred
- Maintain existing E2E test suite
- Update documentation
- Performance testing required

## Governance

### Amendment Procedure
1. Propose change with rationale
2. Validate against project goals
3. Update version (MAJOR.MINOR.PATCH)
4. Document in git commit

### Version Semantics
- **MAJOR**: Backward incompatible principle changes
- **MINOR**: New principles added
- **PATCH**: Clarifications, typo fixes

### Enforcement
- All `/speckit.plan` outputs must include constitution check
- All `/speckit.analyze` runs validate principle adherence
- Constitution violations are CRITICAL severity issues

## References

- Project README: `/README.md`
- Design System: `/src/styles.css` (design tokens)
- Test Suite: `/tests/e2e/`
- Privacy Policy: See Datenschutz page
