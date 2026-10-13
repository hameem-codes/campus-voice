# Campus Voice

A modern, accessible, and responsive campus communication portal built with Next.js App Router, React 19, Framer Motion, and Recharts. Campus Voice delivers targeted notices, academic milestones, and transparent approval workflows with zero friction.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhameem-codes%2Fcampus-voice)

---

## Features

### 🎓 Student Workspace
- **Personalized Feed & Targeting**: Feed filtered automatically by student cohort (Department, Year, Section).
- **Urgent Attention Alerts**: Sticky dismissible urgent banners and incoming alert simulator with toast notifications.
- **Notice Details**: Rich notice reader with interactive in-page PDF/image attachment viewer, real file downloads, publisher credentials, and edit history.
- **Interactive Calendar**: 35-cell Month grid, Week view, and Agenda list with category color coding, popovers, and `.ics` event file export.
- **Saved Shelf**: Pin updates and documents for offline reference with search filtering and bookmark undo toasts.
- **Granular Preferences**: Toggle category subscriptions and delivery channels (Email, Push, SMS), account settings, theme switcher, and defaults reset.

### 👩‍🏫 Faculty Portal
- **Stepped Notice Creation**: 6-step creation flow with required validation, autosaved drafts, drag-and-drop file upload, live audience reach estimation, and full preview before submission.
- **Notice Management**: Filter by status (All, Draft, Pending, Published, Scheduled, Rejected), row action menus (edit, duplicate, archive, delete), and bulk operations.
- **Engagement Analytics**: Track verified views and reach percentage per notice with 7/30/90 days filtering and CSV export.

### 🛡️ Admin Operations
- **Approval Queue**: Review submissions with instant approval or rejection modal requiring an explicit rationale for audit compliance.
- **User Management**: Role filtering, invite user modal, role adjustments, account deactivation/reactivation, CSV import preview, and pagination.
- **Taxonomies & Academic Setup**: CRUD management for Categories, Departments, Academic Years, Sections, and Courses with foreign-key usage protection against accidental deletion.
- **Interactive Analytics**: Real Recharts bar chart with tooltips, delivery metrics, and CSV export.
- **Audit Logs & Governance**: Real-time compliance activity log capturing every system action with relative timestamps, plus configurable delivery rules and retention periods.

### ⚡ Cross-Cutting UX
- **3-Way Instant Role Switcher**: Seamlessly switch between Student, Faculty, and Admin contexts from the sidebar or login portal.
- **Accessible Design System**: WCAG AA contrast, min 11px typography, focus trapping, Escape dismissal on modals and drawers, and reduced motion support.
- **Dark Mode**: Persistent dark theme adhering to warm gray design tokens.
- **Responsive Layout**: Fluid experience from 360px mobile screens (with bottom sheet navigation) up to 1920px wide displays.

---

## Getting Started

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm, pnpm, or yarn

### Installation
```bash
git clone https://github.com/hameem-codes/campus-voice.git
cd campus-voice
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production
```bash
npm run build
npm start
```

### Lint & Type Check
```bash
npm run lint
```

---

## Deploy to Vercel

This repository is optimized for deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Keep default settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build` (or default `npm run build`)
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
4. Deploy!

---

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI & Components**: React 19, Vanilla CSS Design System with Tailwind v4 PostCSS
- **Animations**: Framer Motion
- **Visualizations**: Recharts
- **Icons**: Lucide React
