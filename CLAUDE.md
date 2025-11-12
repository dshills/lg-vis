# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React 19 + TypeScript + Vite frontend application using modern ES2022 features and strict TypeScript configuration.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Type check and build for production
npm run build

# Lint TypeScript/TSX files
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Technology Stack
- **React 19.2**: Latest React with modern hooks and StrictMode
- **TypeScript 5.9**: Strict mode enabled with bundler module resolution
- **Vite 7**: Build tool with Fast Refresh via `@vitejs/plugin-react`
- **ESLint 9**: Flat config with React Hooks and React Refresh plugins

### Entry Points
- `index.html` - Application root with `<div id="root">`
- `src/main.tsx` - React application bootstrap with StrictMode
- `src/App.tsx` - Main application component

### TypeScript Configuration
- **Target**: ES2022 with DOM APIs
- **JSX**: react-jsx (automatic runtime)
- **Module Resolution**: bundler mode (Vite-optimized)
- **Strict Mode**: Enabled with unused locals/parameters checks
- **Build Info**: Cached in `./node_modules/.tmp/`

### ESLint Configuration
- Uses flat config format (`eslint.config.js`)
- Extends: `@eslint/js`, `typescript-eslint`, `react-hooks`, `react-refresh`
- Configured for browser globals and ES2020
- Ignores: `dist/` directory

## Development Notes

### Type Checking
TypeScript is configured with `noEmit: true` - type checking happens via `tsc -b` before build. The build process runs type checking first, then Vite build.

### Module System
Uses `verbatimModuleSyntax` and `allowImportingTsExtensions` for strict import/export validation. All imports must use explicit `.tsx` extensions internally.

### Hot Module Replacement
Vite provides Fast Refresh for React components. Changes to `.tsx` files automatically update in the browser without full page reload.
