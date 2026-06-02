---
description: Instructs on how to write react code and wha tools to use
---

# Frontend Development Guide

## Website (`apps/ui`)

The UI is a **Next.js static site** (exported to GitHub Pages). Keep pages lightweight, content-focused, and statically server-rendered by default.

### Rendering

- Pages are statically rendered at build time — avoid patterns that require a server
- Do **not** add `"use client"` unless the component genuinely needs browser APIs, user interaction state, or React hooks that can't run on the server (e.g. `useState`, `useEffect`, `ResizeObserver`)
- Prefer React Server Components; push `"use client"` as far down the tree as possible to keep the static boundary high

### Styles

- All styles live in **CSS or SCSS files** — never inline `style={{}}` props or `styled-components`
- Co-locate styles with the component using **CSS Modules** (e.g. `MyComponent.module.css` next to `MyComponent.tsx`)
- Use the global CSS custom properties defined in the app for colors, typography, and spacing rather than hardcoding values

### Pages

- Pages (`app/**/page.tsx`) should be thin: fetch/resolve data, then delegate rendering to components
- Keep copy in a scholarly, neutral historian voice; cite sources where facts are stated
- Accommodate both mobile and desktop — design mobile-first, then expand

---

## Charting (`packages/plural-family-chart`)

The chart library is developed in isolation via **Storybook** and tested with **Vitest**.

### Component design

- Keep components **small and descriptive** — a component that renders 10–20 lines of JSX is fine and preferable to a large monolith
- Each chart type (histogram, scatter, pie, etc.) is its own file
- Styles that apply to chart layout/wrappers belong in **CSS Modules**

### Storybook

- Every new chart component gets a `.stories.tsx` file alongside it
- Stories should cover the default state and any meaningful data variations (empty, single data point, large dataset)

### Testing

- Write **Vitest unit tests** for a high degree of coverage, such as:
    - Hooks (`useTooltip`, `useAggregateData`, etc.)
    - Data computation functions (`computeAggregateData` and its helpers)
    - Utility functions and non-trivial logic
    - Core components that have meaningful rendering behavior
- Use `renderHook` from `@testing-library/react` for hooks
- Use `render` + DOM queries for component behavior; avoid snapshot tests
- Test files live next to the file they test (e.g. `useTooltip.test.ts` beside `useTooltip.ts`)
