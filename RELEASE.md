# Release Process

Automated npm package release for `@glorpx/design`.

## Prerequisites

- [ ] Ensure all commits are pushed to `main`
- [ ] CI/CD pipeline is passing (green on GitHub Actions)
- [ ] `NPM_TOKEN` GitHub secret is configured (with publish access)
- [ ] No uncommitted changes locally

## Releasing a New Version

### Step 1: Bump Version

Choose the appropriate bump type:

```bash
# For bug fixes (0.1.0 → 0.1.1)
pnpm version:patch

# For new features (0.1.0 → 0.2.0)
pnpm version:minor

# For breaking changes (0.1.0 → 1.0.0)
pnpm version:major
```

This script will:
- Update `package.json` version
- Print the next git commands to run

### Step 2: Create Git Tag and Push

After version bump script completes, copy and run the suggested command:

```bash
git add package.json
git commit -m "chore: release v0.2.0"
git tag v0.2.0
git push origin main --tags
```

### Step 3: Wait for Release Action

The GitHub Actions `Release` workflow will:
1. ✅ Checkout code
2. ✅ Install dependencies
3. ✅ Run typecheck, lint, tests
4. ✅ Build ESM + CJS + types
5. ✅ Verify build artifacts
6. ✅ Publish to npm registry (`@glorpx/design@X.Y.Z`)
7. ✅ Create GitHub Release with links

Monitor the release at: `https://github.com/glorpx/design/actions/workflows/release.yml`

## Verification

After release completes, verify:

```bash
# Check npm registry
npm info @glorpx/design version

# Should return the new version, e.g., "0.2.0"

# Check the dist files are published
npm pack @glorpx/design --dry-run

# View release on GitHub
# https://github.com/glorpx/design/releases
```

## Troubleshooting

### Release workflow fails at "Publish to npm"

**Cause:** `NPM_TOKEN` secret missing or expired
**Fix:** 
1. Generate new token at `https://www.npmjs.com/settings/~/tokens`
2. Add as GitHub secret: Settings → Secrets → `NPM_TOKEN`
3. Retry the workflow

### Build artifacts missing

**Cause:** Build step failed silently
**Fix:**
1. Check GitHub Actions logs for error details
2. Run locally: `pnpm build`
3. Fix the issue in source code
4. Retag and repush: `git tag -d vX.Y.Z && git push origin :vX.Y.Z` then re-tag

### NPM publish succeeded but GitHub Release missing

**Cause:** Release creation step failed
**Fix:**
1. Manually create release at `https://github.com/glorpx/design/releases/new`
2. Tag: `vX.Y.Z`
3. Copy release body from npm package link

## Manual Release (Emergency)

If automated release fails critically:

```bash
# Locally build and publish (requires ~/.npmrc configured)
pnpm install --no-frozen-lockfile
pnpm build
npm publish --access public

# Create tag and push
git tag vX.Y.Z
git push origin main --tags

# Create release manually on GitHub
# https://github.com/glorpx/design/releases/new
```

## CI/CD Pipeline

```
Git Push (main branch)
    ↓
CI Tests (Node 20 + 24) ✅
    ↓
[Create Git Tag] ← Manual step
    ↓
Release Workflow Triggers
    ├─ Tests & Build ✅
    ├─ npm publish ✅
    └─ GitHub Release ✅
```

See `.github/workflows/release.yml` for full workflow definition.
