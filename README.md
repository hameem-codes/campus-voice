# Campus Voice · Judge-Ready Neo-Brutalist Frontend

> **Campus Voice** is a modern, high-contrast, Neo-Brutalist campus communication and governance web portal. Built with **Next.js 16 (App Router)** and **React 19**, it delivers authentic cross-role workflows for **Students**, **Faculty**, and **Administrators** with 100% mathematical count consistency, offline self-hosted typography, and real-time cross-tab synchronization.

[![CI](https://github.com/hameem-codes/campus-voice/actions/workflows/ci.yml/badge.svg)](https://github.com/hameem-codes/campus-voice/actions)

---

## ⚡ Key Highlights for Judges

- **Zero Count Discrepancies**: Every badge, counter, tab number, and chart total is computed from a centralized single source of truth (`lib/selectors.ts`). Home urgent counters, sidebar badges, and feed tabs agree with mathematical precision.
- **Offline Self-Hosted Typography**: Self-hosts `@fontsource/space-grotesk` with zero runtime reliance on Google Fonts CDN. Builds and renders completely offline.
- **Live Cross-Role Synchronization**: Features a `BroadcastChannel` event bus with `localStorage` fallback. When Faculty submits or Admin approves a notice, student windows instantly receive the banner, toast alert, and notification badge without reloading.
- **Pre-Login Landing Page (`/`)**: Neo-brutalist public showcase explaining the problem of scattered announcements, the 3-role solution, interactive feature cards, and 1-click demo entry.
- **Clean English UI & Accessible Typography**: Accessible Neo-brutalist layouts, high contrast typography, and unified labels across navigation and action buttons.
- **Calendar Export**: Generates and downloads RFC-compliant `.ics` files for individual notices and entire monthly schedules.
- **PWA Ready**: Web app manifest (`public/manifest.json`), touch icons, and theme color tags.

---

## 🎭 Roles & Capabilities

### 🎓 Student Experience (`/student`)
- **Cohort-Targeted Feed**: Notices filtered strictly by student department (School of Design), academic year (Year 2), and studio section (D2), alongside universal campus announcements.
- **Executive Needs Attention Box**: Compact summary highlighting urgent notices and deadlines with direct deep links.
- **Interactive Calendar**: 7-column CSS grid month view with zero horizontal overflow, mobile-first agenda list, and `.ics` export.
- **Notice Reader**: Attached PDF preview, download simulation, edit history timeline, and AI executive summary.
- **Personalized Shelf & Preferences**: Saved items bookmarking, reading streak tracker, and 8-category granular notification toggles.

### 👩‍🏫 Faculty Portal (`/faculty`)
- **6-Step Notice Creator**: Validated title, summary, content, category, and cohort selection.
- **Live Student Preview**: Interactive side-by-side card preview updating in real-time as content is typed.
- **Audience Reach Estimator**: Live mathematical calculation derived from the 2,412 enrolled account base.
- **Quick Templates**: 1-click presets for Exam Schedules, Fee Reminders, Symposia, and Holidays.
- **Management Table**: Bulk archive, duplicate, delete, and rejection feedback reviewer.

### 🛡️ Administrative Operations (`/admin`)
- **Approval Queue**: Dedicated review card variant with prominent status chips, inline Approve button, and modal Reject with required audit rationale.
- **Audit Logging**: Immutable record capturing timestamps, user roles, and action details for every approval, deletion, and system event.
- **System-Wide Analytics**: Recharts bar graph displaying verified views and reads with 100% agreement between KPI summary cards, graph totals, and category breakdown tables.
- **Taxonomies & User Management**: Manage Categories, Departments, Academic Years, Sections, and Courses with deletion guards.

---

## 🛠️ Project Structure

```
campusvoice/
├── app/                  # Next.js App Router routes & layouts
│   ├── page.tsx          # Public landing page (Problem, Roles, 1-Click Demo)
│   ├── layout.tsx        # Self-hosted font imports & global metadata
│   ├── error.tsx         # Neo-brutalist runtime error boundary
│   └── not-found.tsx     # 404 page with return actions
├── components/
│   ├── cards/            # UpdateCard & dedicated AdminUpdateCard
│   ├── charts/           # RealChart (Recharts with mathematical agreement)
│   ├── layout/           # AppShell, Sidebar, Header, MobileBar, RouteGuard
│   └── ui/               # Button (Next Link support), Modal, StatusChip, ConfirmDialog
├── data/
│   └── mockData.ts       # Seed notices with dynamic relative date math
├── lib/
│   ├── api.ts            # Mock service layer isolating frontend from backend
│   ├── date.ts           # Unified local-timezone date helpers & .ics generator
│   ├── i18n.ts           # Centralized string and label translations dictionary
│   ├── notifications.ts  # Browser Notification API integration
│   ├── selectors.ts      # Single source of truth for all counts and filters
│   └── store.tsx         # Unified Zustand/Context store with cross-tab broadcast
├── tests/
│   └── selectors.test.ts # Vitest unit tests verifying count & date consistency
└── DESIGN.md             # The definitive Neo-Brutalism design system specifications
```

---

## 🚀 Running the Project

### Prerequisites
- Node.js 20+
- npm 9+

### Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts local Next.js dev server on `http://localhost:3000` |
| **Production Build** | `npm run build` | Compiles and optimizes production bundle (Turbopack) |
| **Start Production** | `npm run start` | Runs production server |
| **Type Check** | `npm run typecheck` | Validates TypeScript types (`tsc --noEmit`) with 0 errors |
| **Linting** | `npm run lint` | ESLint 9 flat config verification |
| **Unit Tests** | `npm run test` | Runs Vitest unit test suite |

---

## 🧪 Testing & Verification

Run the complete test suite:
```bash
npm run test
```

Asserts that:
1. Updates badge equals unread count for student audience.
2. Urgent unread definition is strictly unified across banner, card, and tabs.
3. Total views, KPI cards, and category table sum to the exact same numbers.
4. Audience targeting logic correctly matches cohort parameters.
5. Reach estimator calculates cohort reach from 2,412 base.
6. Date helpers operate in local timezone with dynamic relative offsets.

---

## 🎨 Design System (Neo-Brutalism)

See [DESIGN.md](file:///c:/Users/matee/OneDrive/Desktop/campusvoice/DESIGN.md) for full design guidelines:
- **Tiers**: Primary (`3px solid #000`, `4px 4px 0 0 #000` shadow), Secondary (`2.5px solid #000`), Tertiary (`1.5px solid #000`).
- **Palette**: `#FFD93D` (Canary Yellow accent), `#4D96FF` (Cyan), `#6BCB77` (Lime), `#FF6B6B` (Coral Urgent / Destructive), `#000000` (Pitch Black).
- **Typography**: Space Grotesk across all headings and body copy, minimum body text 12px.
- **Accessibility**: All color pairings conform to WCAG AA contrast standards.
