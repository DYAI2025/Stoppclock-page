Hier ist dein finaler Pages-Workflow (SHA-gepinnt) + schlanker Post-Deploy-Smoke und Doctor-Guard, sowie 8 FAQ (Q&A) als JSON-LD (LLM-freundlich). Copy-paste, commit auf main, Pages auf GitHub Actions stellen, Custom Domain www.stoppclock.com.

Plan (pseudocode)

Pin Actions → build → doctor guard → vite build → CNAME/.nojekyll → upload → deploy.

Postcheck testet Pages-URL + Custom Domain (ohne Playwright).

FAQ JSON-LD + WebApp JSON-LD in <head> einbinden.

# ======================================================================

# FILE: .github/workflows/pages.yml

# ======================================================================

name: Deploy Stoppclock to GitHub Pages

on:
push:
branches: [ "main" ]
workflow_dispatch:

permissions:
contents: read
pages: write
id-token: write

concurrency:
group: "pages"
cancel-in-progress: true

env:
NODE_VERSION: 22
CUSTOM_DOMAIN: www.stoppclock.com
CANONICAL_URL: https://www.stoppclock.com/

jobs:
build:
runs-on: ubuntu-latest
steps: - name: Checkout (pinned)
uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8

      - name: Setup Node (pinned)
        uses: actions/setup-node@2028fbc5c25fe9cf00d9f06a71cc4710d4507903
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm

      - name: Install
        run: npm ci

      - name: Doctor guard (forbidden tokens)
        run: node scripts/doctor.mjs

      - name: Build
        run: npm run build

      - name: Add CNAME & .nojekyll
        run: |
          mkdir -p dist
          echo "${{ env.CUSTOM_DOMAIN }}" > dist/CNAME
          touch dist/.nojekyll

      - name: Upload Pages artifact (pinned)
        uses: actions/upload-pages-artifact@7b1f4a764d45c48632c6b24a0339c27f5614fb0b
        with:
          path: ./dist

deploy:
needs: build
runs-on: ubuntu-latest
outputs:
page_url: ${{ steps.deployment.outputs.page_url }}
environment:
name: github-pages
url: ${{ steps.deployment.outputs.page_url }}
steps: - id: deployment
name: Deploy to GitHub Pages (pinned)
uses: actions/deploy-pages@d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e

postcheck:
needs: deploy
runs-on: ubuntu-latest
steps: - name: Checkout (pinned)
uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8

      - name: Setup Node (pinned)
        uses: actions/setup-node@2028fbc5c25fe9cf00d9f06a71cc4710d4507903
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Write tiny smoke (no browser)
        run: |
          cat > smoke.mjs <<'EOF'
          import https from 'node:https'; import http from 'node:http'; import { URL } from 'node:url';

          const targets = [
            (process.env.PAGES_URL || '').trim(),
            (process.env.CANONICAL_URL || '').trim()
          ].filter(Boolean).map(u => u.replace(/\/+$/,''));

          const paths = ['/', '/manifest.webmanifest', '/sw.js', '/imprint.html'];

          function get(u) {
            return new Promise((res) => {
              const H = u.startsWith('https') ? https : http;
              const req = H.get(u, { timeout: 12000, headers: { 'User-Agent': 'stoppclock-smoke' } }, (r) => {
                res({ status: r.statusCode ?? 0, url: u });
              });
              req.on('error', () => res({ status: 0, url: u }));
              req.setTimeout(12000, () => { req.destroy(); res({ status: 0, url: u }); });
            });
          }

          (async () => {
            let allOk = true;
            for (const base of targets) {
              const host = new URL(base).host;
              console.log(`[SMOKE] Base: ${base}`);
              for (const p of paths) {
                const url = base + p;
                const { status } = await get(url);
                console.log(`  ${status} ${url}`);
                if (status !== 200) allOk = false;
              }
            }
            if (!allOk) {
              console.error('[SMOKE] Fail: non-200 responses detected.');
              process.exit(2);
            }
            console.log('[SMOKE] OK');
          })();
          EOF

      - name: Run smoke
        env:
          PAGES_URL: ${{ needs.deploy.outputs.page_url }}
          CANONICAL_URL: ${{ env.CANONICAL_URL }}
        run: node smoke.mjs

# ======================================================================

# FILE: scripts/doctor.mjs

# ======================================================================

import fs from "fs/promises";
import path from "path";
const ROOT = process.cwd();
const FORBID = /(lovable|dev-?\s?agent|tagger|Loading app)/i;
const SKIP = new Set([".git","node_modules","dist",".next",".cache"]);
async function* walk(dir){ for (const e of await fs.readdir(dir,{withFileTypes:true})) {
if (SKIP.has(e.name)) continue; const p=path.join(dir,e.name);
if (e.isDirectory()) yield* walk(p); else if (e.isFile()) yield p;
}}
const bad=[];
for await (const f of walk(ROOT)) {
const t = await fs.readFile(f, "utf8").catch(()=>null); if (!t) continue;
if (FORBID.test(t)) bad.push(f);
}
if (bad.length){ console.error("[doctor] Forbidden tokens in:\n" + bad.map(x=>" - "+x).join("\n")); process.exit(2); }
console.log("[doctor] OK");

# ======================================================================

# FILE: public/robots.txt (optional but recommended)

# ======================================================================

User-agent: \*
Allow: /

Sitemap: https://www.stoppclock.com/sitemap.xml

<!-- ===================================================================
PASTE INTO: index.html <head> (AI-SEO & FAQ JSON-LD)
=================================================================== -->

<!-- WebApplication JSON-LD -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Stoppclock",
  "applicationCategory": "Utility",
  "operatingSystem": "Web",
  "url": "https://www.stoppclock.com/",
  "description": "Projector-friendly timers and clocks. Analog countdown up to 12 hours, stopwatch, interval, world clock, and more.",
  "offers": { "@type": "Offer", "price": "0" },
  "featureList": [
    "Analog countdown up to 12 hours",
    "Stopwatch with laps",
    "Interval / rounds timer",
    "World clock",
    "Metronome",
    "Chess clock",
    "Offline PWA"
  ]
}
</script>

<!-- FAQPage JSON-LD (8 Q&A) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I set a 90-minute exam timer with the analog countdown?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Open Analog Countdown, choose the 90m preset or set 01:30:00, press Start, then press Fullscreen (or hit F) to project it."
      }
    },
    {
      "@type": "Question",
      "name": "Will my timer keep running if I return to the home page?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Stoppclock persists each tool's state locally. Timers continue and resume exactly when you navigate back."
      }
    },
    {
      "@type": "Question",
      "name": "Does Stoppclock work offline and on low-connectivity venues?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. It is a Progressive Web App. Once loaded, the shell and tools work offline with an app-like experience."
      }
    },
    {
      "@type": "Question",
      "name": "How can I use Stoppclock on a projector or beamer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use the Fullscreen control (or press F) for a clean, high-contrast view optimized for classrooms, exams, and seminars."
      }
    },
    {
      "@type": "Question",
      "name": "How precise are the timers and stopwatch?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "They use high-resolution timekeeping with visual updates around 60 FPS and logical time based on wall-clock deltas to minimize drift."
      }
    },
    {
      "@type": "Question",
      "name": "Can I save common durations and settings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Presets and the last used configuration are stored locally, so your setup reappears the next time you open a tool."
      }
    },
    {
      "@type": "Question",
      "name": "Can I share a timer with another device?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Current versions store state locally per device. For shared setups, project the timer or mirror your screen."
      }
    },
    {
      "@type": "Question",
      "name": "Is Stoppclock free and privacy-friendly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Stoppclock is free to use and avoids trackers or invasive analytics. Your timer data stays on your device."
      }
    }
  ]
}
</script>

Hinweise

Pages-Settings → Source: GitHub Actions, Domain: www.stoppclock.com, Enforce HTTPS.

Canonical auf www festlegen (in <link rel="canonical" href="https://www.stoppclock.com/">).

scripts/doctor.mjs blockt jeden „Lovable“-Rückfall.

Der Smoke ist leichtgewichtig (kein Playwright), prüft Status-Codes auf Pages-URL und Custom-Domain.
