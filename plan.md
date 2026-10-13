# Campus Voice Implementation Plan

## Scope
Build a responsive, mock-data-only Campus Voice frontend for students, faculty/staff, and admins. The prototype is intentionally frontend-only: role switching, navigation, filters, bookmarks, notification panel, calendar modes, update creation steps, and admin tables are interactive in local state with no backend.

## Implementation approach
- **Framework:** Next.js App Router + TypeScript with Tailwind configured for the supplied token set.
- **Architecture:** one client dashboard route with reusable primitives in the page layer for this prototype; mock data is centralized at the top of the route and role-aware navigation drives the content view.
- **State:** React state for role, active navigation item, search, category/status filters, grid/list mode, notifications, bookmarks, read state, calendar mode, and faculty create-step progress.
- **Accessibility:** semantic landmarks, labelled buttons, visible focus states, keyboard-friendly controls, table headers, live-like status copy, and responsive layouts.
- **Serving:** Next dev server on port 3000 bound to `0.0.0.0`; `/manus-routes.json` declares the root route.

## Design direction
- **Design movement:** calm editorial dashboard / soft brutalist utility UI.
- **Core principles:** quiet hierarchy, thin framed surfaces, generous 4px-grid spacing, and color reserved for status.
- **Color philosophy:** warm gray canvas reduces glare; white panels create focus; near-black text keeps the system grounded; orange/green/blue status chips carry urgency without turning the interface into a colorful admin template.
- **Layout paradigm:** fixed utility rail plus a large framed workspace, with information arranged in airy bands and bordered cards rather than dense dashboards.
- **Signature elements:** the Campus Voice four-dot mark, underline tabs, and status chips paired with quiet meta labels.
- **Interaction philosophy:** interactions are direct and reversible: role switching updates the workspace, filters narrow content in place, bookmarks and read states respond immediately, and focus rings keep controls discoverable.
- **Animation:** restrained 160–200ms transitions on hover/focus, subtle panel entry only where it helps orientation, no decorative motion.
- **Typography system:** Inter/Geist-like geometric sans via system fallback; display 36/44, heading 18/24, body 14/20, caption 12/16, micro 10/12; regular weight with 500 for emphasis.
- **Brand essence:** one clear campus signal for every academic community; calm, organized, reassuring. Personality: **clear, considerate, dependable**.
- **Brand voice:** concise and human, never bureaucratic. Example lines: “Your campus, in one clear view.” and “Three updates need your attention today.”
- **Wordmark & logo:** a rounded square containing four offset voice-wave dots, followed by the Campus Voice wordmark.
- **Signature brand color:** `#3F7CE0` blue, used only in the compact project mark and info/scheduled accents.

## Project structure
- `app/page.tsx` — interactive role-aware dashboard, shared primitives, mock data.
- `app/globals.css` — design tokens and responsive component styling.
- `app/layout.tsx` — document shell and metadata.
- `public/manus-routes.json` — route manifest for the root experience.
- `tailwind.config.ts`, `postcss.config.mjs` — token-aware styling setup.
- `app.config.ts` — project metadata hook.

## Material constraints
Use only DESIGN.md colors, radii, spacing, typography sizes, and flat elevation. No backend, authentication provider, database, external images, or feature additions beyond the supplied Campus Voice brief.
