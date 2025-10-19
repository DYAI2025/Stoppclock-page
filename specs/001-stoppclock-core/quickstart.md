# Quickstart Guide: Stoppclock Development

**Branch**: `001-stoppclock-core` | **Date**: 2025-10-18
**Target Audience**: Developers setting up local development environment

## Prerequisites

Before starting, ensure you have:

- **Node.js**: Version 22 (LTS recommended)
  - Check: `node --version` (should output `v22.x.x`)
  - Install: https://nodejs.org/
- **npm**: Version 10+ (comes with Node.js)
  - Check: `npm --version`
- **Git**: Any recent version
  - Check: `git --version`
- **Modern browser**: Chrome 120+, Firefox 120+, Safari 17+, or Edge 120+

---

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/<username>/stoppclock-page.git
cd stoppclock-page
```

### 2. Install Dependencies

```bash
npm ci
```

**Why `npm ci` instead of `npm install`?**
- Faster and more reliable (uses exact versions from `package-lock.json`)
- Recommended for CI/CD and clean builds

**Expected output**:
```
added 150 packages in 8s
```

### 3. Verify Doctor Guard

```bash
npm run doctor
```

**Expected output**:
```
[doctor] OK
```

**What it does**:
- Scans all source files for forbidden tokens (lovable, dev-agent, tagger, "Loading app")
- Prevents accidental vendor lock-in or debugging artifacts in production

**If it fails**:
- Check error output for file paths containing forbidden tokens
- Remove or replace the forbidden content
- Re-run `npm run doctor`

---

## Development

### Start Dev Server

```bash
npm run dev
```

**Expected output**:
```
  VITE v5.4.10  ready in 342 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Features**:
- **Hot Module Replacement (HMR)**: Changes auto-reload in browser
- **Fast refresh**: React state preserved across code changes
- **TypeScript checking**: Errors shown in terminal and browser console

### Open in Browser

1. Visit http://localhost:5173/
2. You should see the Stoppclock homepage with tool cards
3. Click "Analog Countdown" to test the timer

### Development Workflow

1. **Edit files** in `src/` directory (e.g., `src/pages/AnalogCountdown.tsx`)
2. **Save file** → browser auto-reloads
3. **Check terminal** for TypeScript errors
4. **Check browser console** (F12) for runtime errors
5. **Iterate** until feature complete

---

## Build for Production

### Create Production Build

```bash
npm run build
```

**What it does**:
1. Runs TypeScript compiler (type checking)
2. Bundles and minifies JavaScript/CSS with Vite
3. Outputs to `dist/` directory
4. Runs `scripts/doctor.mjs` (forbidden token check)
5. Runs `scripts/gen-sitemap.mjs` (generates sitemap.xml)

**Expected output**:
```
vite v5.4.10 building for production...
✓ 45 modules transformed.
dist/index.html                   2.34 kB │ gzip:  1.12 kB
dist/assets/index-a3f2b1c.css     3.21 kB │ gzip:  1.45 kB
dist/assets/index-d7e4c8f.js    142.67 kB │ gzip: 48.23 kB
✓ built in 1.82s
[doctor] OK
```

### Preview Production Build Locally

```bash
npm run preview
```

**Expected output**:
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
```

**What it does**:
- Serves the `dist/` directory (production build)
- Tests optimized bundle before deployment
- Does NOT have HMR (this is production mode)

**Use case**: Verify build works before pushing to GitHub (triggers deployment).

---

## Testing

### Manual Testing Checklist

1. **Home page loads**:
   - Visit `http://localhost:5173/`
   - Verify 8 tool cards appear
   - Verify layout is responsive (resize browser window)

2. **Analog Countdown (P1 feature)**:
   - Click "Analog Countdown" card
   - Select 30m preset → verify clock shows 30:00:00
   - Click Start → verify hands move, digital time counts down
   - Click Pause → verify timer stops
   - Click Fullscreen → verify fullscreen mode enters
   - Press F key → verify fullscreen toggles
   - Press Space → verify timer starts/pauses
   - Press R → verify timer resets
   - Arrow Up → verify +10s adjustment
   - Arrow Down → verify -10s adjustment
   - Navigate to Home → navigate back → verify state persisted

3. **Placeholder tools (P3 features)**:
   - Click any other tool card
   - Verify "Coming soon" placeholder appears
   - Verify Home link works

4. **Consent banner**:
   - Open in Incognito/Private browsing
   - Verify consent banner appears
   - Click "Keep Off" → verify banner disappears, no AdSense loads
   - Reload page → verify banner does not reappear

5. **Offline mode (PWA)**:
   - Visit site once (caches app shell)
   - Open DevTools → Application → Service Workers → verify SW registered
   - Disconnect internet (or throttle to Offline in DevTools)
   - Reload page → verify app still loads
   - Navigate between tools → verify routing works offline

6. **Smoke Tests** (automatically run in CI, but can test manually):
   - Build: `npm run build`
   - Check files exist: `dist/index.html`, `dist/manifest.webmanifest`, `dist/sitemap.xml`
   - Preview: `npm run preview`
   - Visit: http://localhost:4173/, http://localhost:4173/manifest.webmanifest
   - Verify: 200 responses (no 404s)

---

## File Structure Reference

```
stoppclock-page/
├── index.html                # Entry point (SEO meta, JSON-LD, consent gate)
├── vite.config.ts            # Build config
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies & scripts
│
├── src/
│   ├── main.tsx              # React root, routing logic
│   ├── styles.css            # Global styles
│   └── pages/
│       ├── AnalogCountdown.tsx    # Implemented (P1)
│       └── (other tools)          # Placeholders (P3)
│
├── public/
│   ├── manifest.webmanifest       # PWA metadata
│   ├── sw.js                      # Service Worker
│   ├── robots.txt                 # SEO crawl rules
│   ├── ads.txt                    # AdSense publisher (needs ID replacement)
│   ├── 404.html                   # SPA fallback
│   ├── icons/                     # PWA icons (192, 512, 180)
│   └── og/                        # Social sharing image
│
├── scripts/
│   ├── doctor.mjs                 # Forbidden token guard
│   └── gen-sitemap.mjs            # Sitemap generator
│
├── .github/workflows/
│   └── pages.yml                  # CI/CD pipeline
│
└── dist/                          # Build output (generated, gitignored)
```

---

## Configuration Tasks

### Replace AdSense Placeholders

**Files to update**:
1. `index.html` (line ~193): Replace `ca-pub-REPLACE_ME` with your AdSense Client ID
2. `public/ads.txt` (line ~1): Replace `pub-REPLACE_ME` with your AdSense Publisher ID

**How to find your IDs**:
- **Client ID**: AdSense dashboard → Ads → Overview → `ca-pub-XXXXXXXXXXXXXXXX`
- **Publisher ID**: AdSense dashboard → Account → Settings → `pub-XXXXXXXXXXXXXXXX`

**Example**:
```html
<!-- Before -->
const client = "ca-pub-REPLACE_ME";

<!-- After -->
const client = "ca-pub-1234567890123456";
```

```
# Before
google.com, pub-REPLACE_ME, DIRECT, f08c47fec0942fa0

# After
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
```

### Add Brand Assets

**Required files** (not in repo yet):
- `public/icons/icon-192.png` (192×192 px)
- `public/icons/icon-512.png` (512×512 px)
- `public/icons/icon-180.png` (180×180 px, Apple touch icon)
- `public/og/cover-1200x630.png` (1200×630 px, Open Graph image)

**Guidelines**:
- **Icons**: Simple logo on dark background (#0b1220), high contrast
- **OG image**: Include app name, tagline, visual timer mockup

### Configure Custom Domain (GitHub Pages)

**Steps**:
1. **DNS**: Add CNAME record for `www` pointing to `<username>.github.io`
2. **DNS**: Add A records for apex pointing to GitHub IPs:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
3. **GitHub**: Repository → Settings → Pages → Custom domain: `www.stoppclock.com`
4. **GitHub**: Wait 10-60 minutes → Enable "Enforce HTTPS"

**Verify**:
- Visit https://www.stoppclock.com
- Check SSL certificate (valid, issued by Let's Encrypt)

---

## Deployment

### Automatic Deployment (GitHub Actions)

**Trigger**: Push to `main` branch

**Workflow** (`.github/workflows/pages.yml`):
1. Checkout code (SHA-pinned action)
2. Setup Node.js 22 (SHA-pinned action)
3. Install dependencies (`npm ci`)
4. Run doctor guard (`npm run doctor`)
5. Build (`npm run build`)
6. Add CNAME & .nojekyll to `dist/`
7. Upload artifact (SHA-pinned action)
8. Deploy to GitHub Pages (SHA-pinned action)
9. Smoke test (verify 200 responses on deployed URLs)

**Monitor deployment**:
- GitHub → Actions tab → Latest workflow run
- Check for green checkmarks on all steps
- If smoke test fails, check logs for 404 errors

### Manual Deployment (if needed)

```bash
# Build locally
npm run build

# Verify dist/ contents
ls -lh dist/

# Push to main (triggers deployment)
git push origin main
```

**Wait for deployment**:
- Check GitHub Actions tab for progress
- Deployment typically takes 3-5 minutes
- Once complete, visit https://www.stoppclock.com

---

## Troubleshooting

### Issue: `npm ci` fails with ENOENT

**Cause**: `package-lock.json` missing or corrupted

**Fix**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors in terminal

**Cause**: Type mismatch or missing type definitions

**Fix**:
1. Read error message carefully (file path + line number)
2. Fix type annotation or logic
3. Save file → error should disappear

**Common errors**:
- `Property 'x' does not exist on type 'Y'` → Add property to interface
- `Type 'A' is not assignable to type 'B'` → Fix type annotation or cast

### Issue: Vite dev server not reloading

**Cause**: File watcher issue (rare)

**Fix**:
1. Stop server (Ctrl+C)
2. Restart: `npm run dev`
3. Hard reload browser (Ctrl+Shift+R)

### Issue: Doctor guard fails in CI

**Cause**: Forbidden token in source code

**Fix**:
1. Check error log for file path
2. Search for forbidden terms: `lovable`, `dev-agent`, `tagger`, `Loading app`
3. Remove or replace
4. Commit and push

### Issue: Smoke test fails (404 on deployed site)

**Cause**: CNAME file missing or wrong path

**Fix**:
1. Verify `dist/CNAME` exists after build
2. Check `dist/CNAME` contents: Should be `www.stoppclock.com`
3. Verify GitHub Pages settings: Source = "GitHub Actions", not "Deploy from branch"

### Issue: AdSense not loading

**Cause**: Placeholder ID not replaced

**Fix**:
1. Check `index.html` for `ca-pub-REPLACE_ME`
2. Replace with real Client ID
3. Rebuild and deploy

---

## Next Steps

After setup is complete:

1. **Verify P1 feature**: Test Analog Countdown thoroughly
2. **Replace placeholders**: Update AdSense IDs, add brand assets
3. **Deploy**: Push to `main`, verify deployment succeeds
4. **Test production**: Visit deployed site, test offline mode
5. **Implement P3 features** (optional): Stopwatch, Digital Clock, etc.

---

## Resources

- **Vite Docs**: https://vitejs.dev/
- **React Docs**: https://react.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/docs/
- **GitHub Pages**: https://docs.github.com/en/pages
- **Service Worker API**: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

---

## Getting Help

**Common questions**:
- Check this Quickstart first
- Review spec: [spec.md](./spec.md)
- Review implementation plan: [plan.md](./plan.md)
- Review research: [research.md](./research.md)

**If stuck**:
- Check browser console (F12) for errors
- Check terminal output for build errors
- Review GitHub Actions logs for CI failures
- Search MDN for Web API documentation
