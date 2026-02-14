---
description: Setup GitHub Actions workflows for automated testing, building, and deployment on git push
allowed-tools: [Write, Bash, Read, Edit]
---

## Context

Manual deployments are slow and error-prone. This skill automates:
1. Tests run automatically on push
2. If tests pass: Auto-build
3. If build succeeds: Auto-deploy to production
4. If deploy succeeds: Activate monitoring

Evidence: stoppclock integration deployed in 5 minutes with zero manual steps via GitHub Actions.

## Your Task

Create GitHub Actions workflows for:
- Automated test execution
- Conditional deployment on success
- Production monitoring activation

### Requirements

- Create `.github/workflows/` directory
- Add `adsense-tests.yml` (test + build workflow)
- Add `deploy-production.yml` (deployment workflow)
- Both workflows trigger automatically on push to main
- Tests must pass before deployment
- Deployment activates monitoring

### Workflow: adsense-tests.yml

**Triggers:**
- Push to main or develop
- Pull request to main

**Jobs:**
1. `test` job:
   - Checkout code
   - Setup Node.js
   - npm install
   - npm run test (or specific test command)
   - Generate coverage reports
   - Upload to Codecov
   - Build for production

2. `deploy` job (only if test passes):
   - Runs after test completes successfully
   - Triggers only on main branch push
   - Builds production bundle
   - Deploys to GitHub Pages
   - Reports success

3. `monitor` job (optional):
   - Runs on main branch
   - Lighthouse CI checks
   - CWV monitoring
   - Compliance checks

### Workflow: deploy-production.yml

**Triggers:**
- When adsense-tests.yml succeeds on main

**Jobs:**
1. Checkout latest main
2. Build production
3. Deploy to hosting (GitHub Pages or custom)
4. Activate AdSense monitoring
5. Create deployment record
6. Send notification

### Implementation

**GitHub Actions YAML Structure:**
```yaml
name: AdSense Integration Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm install
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Guardrails

**DO:**
- Require all tests to pass before deployment
- Only deploy from main branch
- Cache npm dependencies (faster builds)
- Use GitHub Secrets for sensitive data
- Create deployment records for auditing
- Send notifications on deploy

**DON'T:**
- Deploy directly without tests
- Deploy from feature branches
- Commit workflow secrets
- Rebuild unnecessarily (use cache)
- Deploy if tests fail (conditional step)
- Skip monitoring setup

### Testing the Workflow

```bash
# Simulate workflow locally with act (optional)
act push --ref main

# Or just push and check Actions tab:
git push origin main
# Check: https://github.com/[user]/[repo]/actions

# Expected:
# ✅ adsense-tests job passes
# ✅ deploy job triggered automatically
# ✅ Site deployed to Pages or production
```

### Success Criteria

- Workflows appear in Actions tab
- Push to main triggers test job automatically
- All tests pass
- Deployment job triggers after test passes
- Site is live after ~3-5 minutes
- Monitoring is active

---
*Generated from pattern: 12 commits → GitHub Actions → Auto-deploy → Live*
