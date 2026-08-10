# Contributing to @glorpx/design

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development

### Setup

```bash
pnpm install
```

### Commands

- `pnpm build` — Build ESM and CommonJS outputs
- `pnpm test` — Run test suite
- `pnpm test:watch` — Run tests in watch mode
- `pnpm typecheck` — Type check with TypeScript
- `pnpm lint` — Run ESLint

### Making Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Run tests and linting (`pnpm test && pnpm lint`)
5. Commit with a clear message
6. Push to your fork
7. Open a Pull Request

## Code Style

- Use TypeScript with strict mode
- Follow ESLint rules (run `pnpm lint`)
- Write tests for new functionality
- Maintain 80%+ test coverage

## Testing

All changes must be tested. Run `pnpm test` before submitting a PR.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
