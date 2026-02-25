# Development Guide

This guide outlines the development setup and best practices for this project.

## Prerequisites

- **Bun** (v1.3.6+) - [Install Bun](https://bun.sh)
- **Git** v2.9+ - For commit hooks

## Setup

1. **Install dependencies**
   ```bash
   bun install
   ```

2. **Initialize git hooks** (for pre-commit checks)
   ```bash
   husky install
   ```

## Available Commands

### Development

- `bun dev` - Start development server with hot reloading on port 3000
- `bun start` - Start production server
- `bun run build` - Build the project for production

### Code Quality

- `bun run check` - Run Biome checks (linting, formatting, and import sorting)
- `bun run lint` - Run Biome linter with auto-fix
- `bun run format` - Format code with Biome
- `bun run type-check` - Check TypeScript types without emitting
- `bun run type-check:watch` - Watch mode for TypeScript type checking

## Code Quality Tools

### Biome

This project uses **[Biome](https://biomejs.dev)** for code linting and formatting.

**Why Biome?**
- Single tool: Replaces ESLint, Prettier, and import sorting tools
- Fast: Written in Rust, significantly faster than Node.js equivalents
- TypeScript/React ready: Built-in support for modern JavaScript
- Zero config: Works out of the box with sensible defaults

**Configuration:** See [biome.json](biome.json)

### Git Hooks

**Husky** + **Lint-staged** automatically run code quality checks before commits.

**What happens on commit:**
1. Staged files are checked with Biome
2. Code is automatically formatted if issues are found
3. Commit fails if there are linting errors that can't be auto-fixed

**To bypass hooks (not recommended):**
```bash
git commit --no-verify
```

### TypeScript

TypeScript checking is configured in [tsconfig.json](tsconfig.json) with strict mode enabled.

Run type checking:
```bash
bun run type-check        # Check once
bun run type-check:watch  # Watch mode
```

## Editor Setup

### VS Code

The project includes VS Code configuration in `.vscode/settings.json` that:
- Sets Biome as the default formatter
- Enables format-on-save
- Configures auto imports organizer
- Sets proper indentation and line width

**Recommended Extensions:**
- [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
- [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

Install them via:
```bash
code --install-extension biomejs.biome
```

### EditorConfig

The [.editorconfig](.editorconfig) file ensures consistent formatting across different editors.

## CI/CD

GitHub Actions workflows run automatically on:
- Every push to `main` or `react` branches
- Every pull request

**Checks performed:**
- Biome code checks (lint + format)
- TypeScript type checking
- Build verification

See [.github/workflows/ci.yml](.github/workflows/ci.yml) for details.

## Project Structure

```
src/
  components/       # React components
  lib/             # Utilities and helpers
  styles/          # CSS files
  index.ts         # Entry point
  frontend.tsx     # React app entry
server.ts          # Backend server
build.ts           # Build script
```

## Common Tasks

### Add a new dependency

```bash
# Production dependency
bun add package-name

# Development dependency
bun add -d package-name
```

### Check what changed

```bash
git diff                 # Changes not staged
git diff --staged        # Staged changes
git status              # Overall status
```

### Fix all linting issues automatically

```bash
bun run check     # Runs Biome check (format + lint + imports)
```

### Fix only formatting

```bash
bun run format    # Format with Biome
```

## Troubleshooting

### "command not found: tsc"
Use `bunx tsc` instead of `tsc`. TypeScript is not added to PATH by Bun.

### Biome isn't formatting on save in VS Code
1. Check that Biome extension is installed
2. Verify `.vscode/settings.json` has Biome configured
3. Reload VS Code window: `Ctrl+Shift+P` → "Reload Window"

### Pre-commit hook not running
1. Ensure husky is installed: `husky install`
2. Check `.husky/pre-commit` exists and is executable: `ls -la .husky/`
3. Verify git hooks are enabled

### Type checking passes locally but fails in CI
1. Run `bun run type-check` locally to reproduce
2. Clear node_modules and reinstall: `rm -rf node_modules && bun install`
3. Check that all required `@types/*` packages are in devDependencies

## Best Practices

1. **Always run `bun run check` before pushing**
   - Even better: let the pre-commit hook do it automatically

2. **Keep commits atomic**
   - One feature/fix per commit
   - Clear, descriptive messages

3. **Test TypeScript types**
   - Use strict mode (already enabled)
   - Avoid `any` types when possible

4. **Format as you code**
   - Enable "Format on Save" in your editor
   - Trust Biome for formatting decisions

5. **Review CI logs**
   - Pay attention to action failures
   - Fix type errors and linting issues before merge

## Resources

- [Biome Documentation](https://biomejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Bun Documentation](https://bun.sh/docs)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Lint-staged Documentation](https://github.com/okonet/lint-staged)
