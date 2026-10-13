# Campus Voice Implementation Checklist

## Phase 0: Architecture & Foundation
- [x] 1. Create architecture structure: types/, data/, lib/, components/, views/
- [x] 2. Next.js App Router routes (/login, /forgot-password, /reset-password, /student/*, /faculty/*, /admin/*, /search, not-found, error, loading)
- [x] 3. Global store with localStorage persistence & simulated async API layer (lib/api.ts)
- [x] 4. Remove duplicate public/styles.css, import app/globals.css in layout.tsx, clean styling tokens & Tailwind setup
- [x] 5. Fake auth system with role selection, session store, route guards & Access Denied handling

## Phase 1: Bug Fixes & Core Fixes
- [x] 6. Fix 1: Add Faculty role to role switcher (3-way menu: Student, Faculty, Admin)
- [x] 7. Fix 2: Student Updates tabs (All / Unread / Urgent) filter with correct active state
- [x] 8. Fix 3: Notifications: All/Unread/Urgent filtering, mark as read on click, live bell count & dot, "Mark all as read", empty state
- [x] 9. Fix 4: Universal `read` field: visible unread indicators, mark read/unread buttons, dynamic nav counts (Updates, Saved)
- [x] 10. Fix 5: Date logic: separate postedAt & eventDate, relative posted times, no future dates in Recent
- [x] 11. Fix 6: Student chip visibility: only category & priority (Urgent/Normal), hide internal publishing status
- [x] 12. Fix 7: Dynamic "Needs your attention" hero banner on Home with working "Review now" filtered link
- [x] 13. Fix 8: Remove duplicate tab bar on Home
- [x] 14. Fix 9: Mobile nav "More" bottom sheet and horizontal scrolling tab bars
- [x] 15. Fix 10: Admin approval workflow: Approve/Reject with reason modal, status transitions, audit log recording
- [x] 16. Fix 11: Real chart with axes, tooltips, value labels, and 7/30/90 days date range selector

## Phase 2: Student Features
- [x] 17. Update Details page (/student/updates/[id]): full message, interactive PDF/image viewer, download, publisher, edit history, bookmark, mark read, share, back
- [x] 18. Card click navigation across all student cards to details page
- [x] 19. Audience targeting: match update audience (dept, year, sec) to student profile, profile changes update feed
- [x] 20. Student Updates page: Filter panel, sorting, persisted grid/list view, active filter chips, clear-all, mark all read
- [x] 21. Global search (sidebar ⌘F/Ctrl+F and /search page): live search, highlighted matches, filters, recent searches, empty state
- [x] 22. Urgent alerts: sticky dismissible orange banner for unread urgent updates, arrival toast, dev menu simulator
- [x] 23. Student Calendar: real date engine, Month grid / Week / Agenda views, category color chips, event detail popover, .ics file download
- [x] 24. Saved page: Updates & Documents tabs, search in saved, remove bookmark with undo toast
- [x] 25. Student Profile: validated editing, granular category & channel (email/push/SMS) notifications, account settings, reset defaults dialog
- [x] 26. Collapsible sidebar with icon-only state and localStorage memory

## Phase 3: Faculty Features
- [x] 27. Create Update flow (/faculty/create): stepped form with field validation, autosave drafts with indicator, file upload with preview, audience reach estimator, live preview, submission to Pending
- [x] 28. Faculty My Updates (/faculty/updates): status tabs with live counts, search, filter, sort, row actions (view, edit, duplicate, archive, delete modal), bulk actions, edit flow
- [x] 29. Faculty Home & Analytics (/faculty, /faculty/analytics): store-computed metrics, drilldown page, date range filtering, CSV export

## Phase 4: Admin Features
- [x] 30. Admin Updates (/admin/updates): tabs (Approval queue, Published, Scheduled, Archived, Rejected), bulk approve/reject, search/filter/sort, detail drawer with audit history
- [x] 31. Admin Users (/admin/users): search, role filter, invite user modal with validation, edit, deactivate/reactivate, detail drawer, CSV import preview, pagination, bulk actions
- [x] 32. Admin Setup (/admin/setup): category CRUD (add, rename, recolor, reorder, delete) and department/year/section/course CRUD with in-use delete protection, audience group counts
- [x] 33. Admin Analytics (/admin/analytics): date range, category breakdown, read rates, author activity, CSV export
- [x] 34. Admin Audit Logs & Settings (/admin/logs): filterable/searchable audit logs with update history, notification toggles, editable approval rules, retention period

## Phase 5: Cross-Cutting UX, Animations & Verification
- [x] 35. Accessible UI components: Toast system, confirmation dialogs, modals and drawers (focus trap, ESC, ARIA)
- [x] 36. Loading skeletons, error boundaries with retry, empty states with actions, 404 and Access Denied pages
- [x] 37. Dark mode theme support using DESIGN.md tokens with persistence
- [x] 38. Keyboard shortcuts (⌘K/Ctrl+F, Esc, visible focus rings) & full responsive design (360px–1920px)
- [x] 39. Smooth framer-motion animations (page transition, card entrance, tabs, popovers, reduced-motion support)
- [x] 40. Quality verification: `npm run lint` and `npm run build` with zero errors, browser test audit in PROGRESS.md
