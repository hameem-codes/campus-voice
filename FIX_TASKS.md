# FIX_TASKS.md: Campus Voice Frontend Polish & Judge-Ready Checklist

All items are initialized as `[ ]`. A task is marked `[x]` ONLY after full implementation and verification in the running app with Playwright (clicked, tested, screenshotted).

---

## Phase 1: Data Consistency
- [x] 1.1 Sidebar "Updates" badge equals the unread count for the logged-in student's audience, and Updates page tab counts (All, Unread, Urgent, Saved) agree with the list.
- [x] 1.2 "3 urgent" on Home card, top banner, Urgent tab, and notification bell all share one exact definition of "urgent unread" and agree everywhere.
- [x] 1.3 Admin Analytics: Total views, chart total, enrolled accounts, dashboard user counts, and total notices agree. Derive every figure from the same dataset; KPI cards, chart total, and category table sum to the same numbers.
- [x] 1.4 Saved badge equals the real saved count for the user. Faculty "My Notices" badge equals the real count of items in the relevant statuses.
- [x] 1.5 Remove fake hardcoded "Delivery 99.4%" and similar numbers. Compute from mock data or clearly label as "Sample data".
- [x] 1.6 Add Vitest unit test suite that asserts all counts agree across selectors.
- [x] 1.7 Seed data is generated relative to the current date (now minus 2h, now plus 5d, etc.) so Recent, Urgent, Due soon, and calendar are always realistic. Add a "Reset demo data" action.
- [x] 1.8 Fix the timezone bug: date helper uses local timezone consistently everywhere so Home and Calendar agree on "today".

---

## Phase 2: Visible Bugs
- [x] 2.1 Calendar overflow: rebuild Month grid with CSS grid, 7 equal columns (`minmax(0, 1fr)`), header and cells sharing the same template, no horizontal overflow. Default to Agenda view on mobile. Verified at 360px, 768px, 1280px, 1920px.
- [x] 2.2 Dedicated Admin/Faculty card variant: remove bookmark and "Mark as read"; show clear status chip; for Pending items show inline Approve and Reject buttons (reject opens modal with required reason; writes audit log and updates all counts).
- [x] 2.3 Redundant urgent notice: keep urgent notice in top banner and feed only. Replace student Home attention card with a summary of what needs attention (unread urgent, deadlines due soon) with links to filtered views.
- [x] 2.4 Copy fixes: plural helper implemented ("3 items need attention", etc.); consistent title link styling (no random underlines); thorough microcopy review for grammar and tone.
- [x] 2.5 Card grid alignment: CSS grid with `align-items: stretch`, equal-height cards, footer actions pinned to bottom (`margin-top: auto`), and consistent chip rows.
- [x] 2.6 Font loading: self-host Space Grotesk (`next/font/local` or `@fontsource/space-grotesk`), remove duplicate Google Font `<link>` and preconnects, ensure offline build and render.
- [x] 2.7 Button inside Link fix: update Button component to accept `href` and render Next.js `Link`; remove nested `<Link><Button>...</Button></Link>` across `app/error.tsx`, `app/not-found.tsx`, `app/forgot-password/page.tsx`, and calendar.
- [x] 2.8 Profile page: show all 8 categories in notification preferences with channel toggles. Remove duplicate email and student ID blocks.
- [x] 2.9 Fix layout shifts, text clipping, truncation without tooltips, and focus outlines hidden by overflow.

---

## Phase 3: Design Hierarchy and Polish (DESIGN.md)
- [x] 3.1 Three emphasis tiers applied across all pages: Primary (thick border + hard shadow + color fill), Secondary (2px border, standard shadow/flat), Tertiary (1px border or none). Urgent items visually pop.
- [x] 3.2 Sidebar styling: remove underline from nav labels; active yellow block is the sole emphasis; fix "Design Institute" subtitle wrapping; clear hover and focus states.
- [x] 3.3 Typography: minimum text size 11px, 12px for body/meta; reduce excessive letter-spacing on small uppercase labels; maintain large tight headings.
- [x] 3.4 Color consistency: category colors on chips and calendar events match DESIGN.md; coral/red reserved strictly for urgent/destructive actions; WCAG AA contrast verified.
- [x] 3.5 Login page: add one-line product pitch, flat SVG illustration, 3 role cards with 1-line descriptions, visible "Demo mode" banner, keep one-click login.
- [x] 3.6 Empty states: designed empty states with custom illustrations and helpful actions for every list; fill faculty Create dead space.
- [x] 3.7 Add loading skeletons, error states with retry, 404 page, and Access Denied page in matching Neo-brutalist style.
- [x] 3.8 Framer Motion transitions: smooth page fade/slide, card stagger, tab slide, bookmark pop, bell shake for urgent notices, toasts/modals, respecting `prefers-reduced-motion`.
- [x] 3.9 Responsive QA at 360px, 768px, 1280px, 1920px: no horizontal overflow, tables convert to cards on mobile, bottom nav padding clearance, min 44px touch targets.
- [x] 3.10 Accessibility: skip-to-content link, correct heading order, aria-live for filters and form errors, modal focus trap and return, visible focus rings, accessible names.

---

## Phase 4: Features to ADD
- [x] 4.1 Live cross-role demo: BroadcastChannel with storage fallback so Faculty submit -> Admin approve -> Student instant banner/bell/toast/badge updates across tabs. "Demo tools" drawer with role switcher, simulate urgent alert, reset data, and date jump.
- [x] 4.2 Landing page at "/" before login: problem statement, 3 roles, 6 key features, 3-step workflow, "Try the demo" CTA. Authenticated users still route directly to their dashboard.
- [x] 4.3 Browser notifications: "Turn on alerts" requests Notification permission and fires system notification on urgent notice. Feature detection and status display in Profile.
- [x] 4.4 Calendar export: "Add to calendar" downloads valid .ics file on notices and events; "Export all" for visible month.
- [x] 4.5 Student Home additions: "Since you last visited" summary (new, urgent, due soon), weekly read streak with goal ("5 of 7 read this week"), "All caught up" state with illustration.
- [x] 4.6 Faculty Create enhancements: live "Student preview" panel beside form, estimated reach calculation from selected cohort, notice templates (Exam, Fee, Event, Holiday), unsaved changes guard, undo toast on archive/delete.
- [x] 4.7 Admin Dashboard additions: compact chart (notices per day / read rate), approval queue with inline Approve/Reject, stat cards linked to filtered views.
- [x] 4.8 AI Summary (demo): "Summarize" button on long notices revealing a 3-bullet summary with "AI summary (demo)" tag, mock data pre-populated, clean `api.ts` method.
- [x] 4.9 Language toggle: next-intl / i18n scaffolding with English and Hindi for navigation, page titles, buttons, and key labels; switcher in header and profile, persisted in session.
- [x] 4.10 PWA basics: web manifest, app icons, theme color, installable shell, offline indicator banner.
- [x] 4.11 Metadata & SEO: per-route titles ("Updates · Campus Voice"), favicon, Open Graph meta tags.

---

## Phase 5: Features and Content to REMOVE or Relabel
- [x] 5.1 Remove SMS toggle in Profile or label as "Planned".
- [x] 5.2 Remove or relabel fake statistics not derived from dataset; label sample figures clearly.
- [x] 5.3 Remove bookmark and mark-as-read controls from admin and faculty views.
- [x] 5.4 Remove duplicate urgent cards on Student Home and duplicate profile blocks.
- [x] 5.5 Remove unused imports, dead CSS, duplicate styles, unused Tailwind config, and non-functional controls.

---

## Phase 6: Full Route Audit with Playwright
- [x] 6.1 Audit `/student/saved` at 1440px and 390px.
- [x] 6.2 Audit `/search` at 1440px and 390px.
- [x] 6.3 Audit `/student/updates/[id]` at 1440px and 390px.
- [x] 6.4 Audit `/faculty` at 1440px and 390px.
- [x] 6.5 Audit `/faculty/updates` at 1440px and 390px.
- [x] 6.6 Audit `/faculty/analytics` at 1440px and 390px.
- [x] 6.7 Audit `/admin/updates` at 1440px and 390px.
- [x] 6.8 Audit `/admin/create` at 1440px and 390px.
- [x] 6.9 Audit `/admin/users` at 1440px and 390px.
- [x] 6.10 Audit `/admin/setup` at 1440px and 390px.
- [x] 6.11 Audit `/admin/logs` at 1440px and 390px.
- [x] 6.12 Audit `/forgot-password` and `/reset-password` at 1440px and 390px.
- [x] 6.13 Audit 404 (`/_not-found`) and Access Denied states at 1440px and 390px.

---

## Phase 7: Tests and CI
- [x] 7.1 Vitest unit tests: date helpers, plural helper, audience targeting, count selectors, reach estimator.
- [x] 7.2 Playwright smoke tests: cross-role workflow (faculty creates -> admin approves -> student receives real-time alert).
- [x] 7.3 GitHub Actions CI workflow: lint, typecheck, unit test, build.
- [x] 7.4 Documentation cleanup: rewrite README.md to match true Neo-brutalism app; remove obsolete TASKS.md and PROGRESS.md.
