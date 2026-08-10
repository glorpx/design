#!/usr/bin/env node

/**
 * Semantic version bump helper
 * Usage: node scripts/bump-version.js [major|minor|patch]
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/bump-version.js [major|minor|patch]');
  process.exit(1);
}

const bumpType = args[0];
if (!['major', 'minor', 'patch'].includes(bumpType)) {
  console.error(`Invalid bump type: ${bumpType}. Use major, minor, or patch.`);
  process.exit(1);
}

const pkgPath = path.join(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const [major, minor, patch] = pkg.version.split('.').map(Number);
let newVersion;

switch (bumpType) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`✅ Bumped version: ${pkg.version} → ${newVersion}`);
console.log(`📝 Next: git add package.json && git commit -m "chore: release v${newVersion}" && git tag v${newVersion} && git push origin main --tags`);
