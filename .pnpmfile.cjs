function readPackage(pkg) {
  // Allow esbuild to build native modules
  if (pkg.name === 'esbuild') {
    if (!pkg.pnpm) {
      pkg.pnpm = {};
    }
    pkg.pnpm.allowBuild = true;
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
