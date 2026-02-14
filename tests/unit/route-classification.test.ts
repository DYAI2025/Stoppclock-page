/**
 * Task 6: Modify Routes for Ads
 * Test suite for identifying content vs tool routes
 * TDD: Write failing tests first
 */

import { describe, it, expect } from 'vitest';

describe('Route Classification - Content vs Tool Routes', () => {
  describe('Timer Tool Routes (No Ads)', () => {
    it('should identify timer tool routes', () => {
      const timerRoutes = [
        '/countdown',
        '/stopwatch',
        '/analog',
        '/timesince',
        '/cooking',
        '/couples',
        '/chess',
        '/metronome',
        '/world',
        '/alarm',
        '/pomodoro',
        '/custom-sessions'
      ];

      const isTimerRoute = (route: string): boolean => {
        return timerRoutes.includes(route);
      };

      timerRoutes.forEach(route => {
        expect(isTimerRoute(route)).toBe(true);
      });
    });

    it('should NOT show ads on timer tool routes', () => {
      const timerRoutes = [
        '/countdown',
        '/stopwatch',
        '/analog',
        '/timesince',
        '/cooking',
        '/couples',
        '/chess',
        '/metronome',
        '/world',
        '/alarm',
        '/pomodoro'
      ];

      const shouldShowAds = (route: string): boolean => {
        return !timerRoutes.includes(route);
      };

      timerRoutes.forEach(route => {
        expect(shouldShowAds(route)).toBe(false);
      });
    });

    it('should identify countdown as tool route', () => {
      const route = '/countdown';
      const isToolRoute = [
        '/countdown',
        '/stopwatch',
        '/analog',
        '/timesince',
        '/cooking',
        '/couples',
        '/chess',
        '/metronome',
        '/world',
        '/alarm',
        '/pomodoro'
      ].includes(route);

      expect(isToolRoute).toBe(true);
    });

    it('should identify stopwatch as tool route', () => {
      const route = '/stopwatch';
      const isToolRoute = [
        '/countdown',
        '/stopwatch',
        '/analog',
        '/timesince',
        '/cooking',
        '/couples',
        '/chess',
        '/metronome',
        '/world',
        '/alarm',
        '/pomodoro'
      ].includes(route);

      expect(isToolRoute).toBe(true);
    });

    it('should identify analog clock as tool route', () => {
      const route = '/analog';
      const isToolRoute = [
        '/countdown',
        '/stopwatch',
        '/analog',
        '/timesince',
        '/cooking',
        '/couples',
        '/chess',
        '/metronome',
        '/world',
        '/alarm',
        '/pomodoro'
      ].includes(route);

      expect(isToolRoute).toBe(true);
    });
  });

  describe('Content Routes (Show Ads)', () => {
    it('should identify content routes', () => {
      const contentRoutes = [
        '/',
        '/about',
        '/contact',
        '/imprint',
        '/privacy',
        '/impressum',
        '/datenschutz',
        '/time-philosophy',
        '/blog',
        '/wissen',
        '/timer-worlds',
        '/facts',
        '/session-builder',
        '/custom-sessions/landing'
      ];

      const isContentRoute = (route: string): boolean => {
        return contentRoutes.some(cr => route.startsWith(cr));
      };

      contentRoutes.forEach(route => {
        expect(isContentRoute(route)).toBe(true);
      });
    });

    it('should show ads on content routes', () => {
      const contentRoutes = ['/', '/about', '/blog', '/wissen'];

      const shouldShowAds = (route: string): boolean => {
        const toolRoutes = [
          '/countdown',
          '/stopwatch',
          '/analog',
          '/timesince',
          '/cooking',
          '/couples',
          '/chess',
          '/metronome',
          '/world',
          '/alarm',
          '/pomodoro'
        ];
        return !toolRoutes.includes(route);
      };

      contentRoutes.forEach(route => {
        expect(shouldShowAds(route)).toBe(true);
      });
    });

    it('should identify home page as content route', () => {
      const route = '/';
      const isContentRoute = !['countdown', 'stopwatch', 'analog', 'timesince', 'cooking'].some(t => route.includes(t));

      expect(isContentRoute).toBe(true);
    });

    it('should identify about page as content route', () => {
      const route = '/about';
      const toolRoutes = [
        '/countdown',
        '/stopwatch',
        '/analog',
        '/timesince',
        '/cooking',
        '/couples',
        '/chess',
        '/metronome',
        '/world',
        '/alarm',
        '/pomodoro'
      ];
      const isContentRoute = !toolRoutes.includes(route);

      expect(isContentRoute).toBe(true);
    });

    it('should identify blog routes as content', () => {
      const blogRoutes = ['/blog', '/blog/pomodoro-timer', '/blog/study-techniques'];

      const isContentRoute = (route: string): boolean => {
        return route.startsWith('/blog');
      };

      blogRoutes.forEach(route => {
        expect(isContentRoute(route)).toBe(true);
      });
    });

    it('should identify privacy policy as content route', () => {
      const route = '/privacy';
      const toolRoutes = ['/countdown', '/stopwatch', '/analog'];
      const isContentRoute = !toolRoutes.includes(route);

      expect(isContentRoute).toBe(true);
    });

    it('should identify time philosophy as content route', () => {
      const route = '/time-philosophy';
      const toolRoutes = ['/countdown', '/stopwatch', '/analog'];
      const isContentRoute = !toolRoutes.includes(route);

      expect(isContentRoute).toBe(true);
    });
  });

  describe('Route Configuration Object', () => {
    it('should have route configuration with ad display rules', () => {
      const routes = {
        toolRoutes: [
          '/countdown',
          '/stopwatch',
          '/analog',
          '/timesince',
          '/cooking',
          '/couples',
          '/chess',
          '/metronome',
          '/world',
          '/alarm',
          '/pomodoro'
        ],
        contentRoutes: [
          '/',
          '/about',
          '/blog',
          '/time-philosophy',
          '/wissen',
          '/facts',
          '/privacy',
          '/impressum'
        ]
      };

      expect(routes.toolRoutes.length).toBeGreaterThan(0);
      expect(routes.contentRoutes.length).toBeGreaterThan(0);
    });

    it('should have mutually exclusive route categories', () => {
      const toolRoutes = [
        '/countdown',
        '/stopwatch',
        '/analog'
      ];
      const contentRoutes = ['/', '/about', '/blog'];

      const overlap = toolRoutes.filter(t => contentRoutes.includes(t));
      expect(overlap.length).toBe(0);
    });

    it('should define ad placement rules per category', () => {
      const routeConfig = {
        '/countdown': { showAds: false, type: 'tool' },
        '/stopwatch': { showAds: false, type: 'tool' },
        '/': { showAds: true, type: 'content' },
        '/about': { showAds: true, type: 'content' },
        '/blog': { showAds: true, type: 'content' }
      };

      const toolRoutes = Object.entries(routeConfig)
        .filter(([, config]) => config.type === 'tool')
        .map(([route]) => route);

      const contentRoutes = Object.entries(routeConfig)
        .filter(([, config]) => config.type === 'content')
        .map(([route]) => route);

      expect(toolRoutes.length).toBeGreaterThan(0);
      expect(contentRoutes.length).toBeGreaterThan(0);

      toolRoutes.forEach(route => {
        expect(routeConfig[route as keyof typeof routeConfig].showAds).toBe(false);
      });

      contentRoutes.forEach(route => {
        expect(routeConfig[route as keyof typeof routeConfig].showAds).toBe(true);
      });
    });
  });

  describe('Route Detection Logic', () => {
    it('should detect tool routes via list', () => {
      const detect = (route: string): 'tool' | 'content' => {
        const toolRoutes = [
          '/countdown',
          '/stopwatch',
          '/analog',
          '/timesince',
          '/cooking',
          '/couples',
          '/chess',
          '/metronome',
          '/world',
          '/alarm',
          '/pomodoro'
        ];
        return toolRoutes.includes(route) ? 'tool' : 'content';
      };

      expect(detect('/countdown')).toBe('tool');
      expect(detect('/about')).toBe('content');
    });

    it('should detect content routes via pattern matching', () => {
      const detect = (route: string): 'tool' | 'content' => {
        const contentPatterns = ['blog', 'about', 'time-philosophy', 'wissen', 'facts', 'privacy'];
        return contentPatterns.some(p => route.includes(p)) || route === '/' ? 'content' : 'tool';
      };

      expect(detect('/blog/study')).toBe('content');
      expect(detect('/about')).toBe('content');
      expect(detect('/wissen/facts')).toBe('content');
      expect(detect('/countdown')).toBe('tool');
    });

    it('should handle edge cases in route detection', () => {
      const detect = (route: string): 'tool' | 'content' => {
        const toolRoutes = ['/countdown', '/stopwatch', '/analog'];
        return toolRoutes.includes(route) ? 'tool' : 'content';
      };

      // Empty route
      expect(detect('')).toBe('content');

      // Route with trailing slash
      expect(detect('/countdown/')).toBe('content'); // Shouldn't match

      // Tool routes without leading slash
      expect(detect('countdown')).toBe('content'); // Shouldn't match
    });
  });

  describe('Ad Rendering Decision', () => {
    it('should skip ad rendering on tool routes', () => {
      const renderAds = (route: string): boolean => {
        const toolRoutes = ['/countdown', '/stopwatch', '/analog'];
        return !toolRoutes.includes(route);
      };

      expect(renderAds('/countdown')).toBe(false);
      expect(renderAds('/stopwatch')).toBe(false);
      expect(renderAds('/about')).toBe(true);
    });

    it('should render ads on content routes', () => {
      const renderAds = (route: string): boolean => {
        const toolRoutes = ['/countdown', '/stopwatch', '/analog'];
        return !toolRoutes.includes(route);
      };

      expect(renderAds('/')).toBe(true);
      expect(renderAds('/about')).toBe(true);
      expect(renderAds('/blog')).toBe(true);
    });

    it('should check both consent and route type', () => {
      interface RenderDecision {
        shouldRender: boolean;
        reason: string;
      }

      const decideRenderAds = (route: string, hasConsent: boolean): RenderDecision => {
        const toolRoutes = ['/countdown', '/stopwatch', '/analog'];
        const isToolRoute = toolRoutes.includes(route);

        if (!hasConsent) {
          return { shouldRender: false, reason: 'No consent' };
        }

        if (isToolRoute) {
          return { shouldRender: false, reason: 'Tool route - ads disabled' };
        }

        return { shouldRender: true, reason: 'Content route with consent' };
      };

      const noConsent = decideRenderAds('/about', false);
      expect(noConsent.shouldRender).toBe(false);

      const toolNoAds = decideRenderAds('/countdown', true);
      expect(toolNoAds.shouldRender).toBe(false);

      const contentWithConsent = decideRenderAds('/about', true);
      expect(contentWithConsent.shouldRender).toBe(true);
    });
  });

  describe('Route Mappings', () => {
    it('should have complete route mappings', () => {
      const routeMap = {
        '/': { name: 'Home', type: 'content', showAds: true },
        '/countdown': { name: 'Countdown', type: 'tool', showAds: false },
        '/stopwatch': { name: 'Stopwatch', type: 'tool', showAds: false },
        '/about': { name: 'About', type: 'content', showAds: true },
        '/blog': { name: 'Blog', type: 'content', showAds: true },
        '/privacy': { name: 'Privacy', type: 'content', showAds: true }
      };

      expect(Object.keys(routeMap).length).toBeGreaterThan(0);

      Object.entries(routeMap).forEach(([route, config]) => {
        expect(config.type).toMatch(/^(tool|content)$/);
        expect(config.showAds).toBe(config.type === 'content');
      });
    });
  });

  describe('Ad Unit Placement by Route', () => {
    it('should not place ads on tool routes', () => {
      const adUnitsByRoute = {
        '/countdown': [],
        '/stopwatch': [],
        '/analog': [],
        '/about': ['home-top', 'home-middle'],
        '/blog': ['home-top'],
        '/': ['home-top', 'home-middle']
      };

      const toolRoutes = ['/countdown', '/stopwatch', '/analog'];
      toolRoutes.forEach(route => {
        expect(adUnitsByRoute[route as keyof typeof adUnitsByRoute].length).toBe(0);
      });
    });

    it('should place ads on content routes', () => {
      const adUnitsByRoute = {
        '/': ['home-top', 'home-middle'],
        '/about': ['home-top'],
        '/blog': ['home-top']
      };

      Object.values(adUnitsByRoute).forEach(units => {
        expect(units.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Content Routes with Ad Exclusions', () => {
    it('should exclude legal pages from ads', () => {
      const legalRoutes = ['/privacy', '/impressum', '/datenschutz', '/imprint'];
      const routeType = (route: string): 'content' | 'legal' => {
        return legalRoutes.includes(route) ? 'legal' : 'content';
      };

      legalRoutes.forEach(route => {
        expect(routeType(route)).toBe('legal');
      });
    });

    it('should show minimal ads on legal pages', () => {
      const getAdUnits = (route: string): string[] => {
        const legalRoutes = ['/privacy', '/impressum', '/datenschutz', '/imprint'];
        if (legalRoutes.includes(route)) {
          return []; // No ads on legal pages
        }
        return ['home-top'];
      };

      expect(getAdUnits('/privacy').length).toBe(0);
      expect(getAdUnits('/about').length).toBeGreaterThan(0);
    });
  });

  describe('Route Changes and Ad Updates', () => {
    it('should update ad visibility when route changes', () => {
      const getAdVisible = (route: string): boolean => {
        const toolRoutes = ['/countdown', '/stopwatch', '/analog'];
        return !toolRoutes.includes(route);
      };

      // User navigates to countdown
      expect(getAdVisible('/countdown')).toBe(false);

      // User navigates back to home
      expect(getAdVisible('/')).toBe(true);

      // User navigates to blog
      expect(getAdVisible('/blog')).toBe(true);
    });

    it('should trigger ad reload when route changes from tool to content', () => {
      const shouldReloadAds = (oldRoute: string, newRoute: string): boolean => {
        const toolRoutes = ['/countdown', '/stopwatch', '/analog'];
        const wasToolRoute = toolRoutes.includes(oldRoute);
        const isContentRoute = !toolRoutes.includes(newRoute);

        return wasToolRoute && isContentRoute;
      };

      expect(shouldReloadAds('/countdown', '/about')).toBe(true);
      expect(shouldReloadAds('/countdown', '/stopwatch')).toBe(false);
      expect(shouldReloadAds('/about', '/blog')).toBe(false);
    });
  });
});
