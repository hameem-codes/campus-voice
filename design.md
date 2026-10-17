# Campus Voice Design System (Neo-brutalism)

The single source of truth for all styling, typography, component geometry, tokens, and motion in Campus Voice.
Every component and page must conform strictly to this specification.

---

## 1. Design Philosophy: Neo-brutalism with Purpose

Campus Voice uses a bold, hyper-readable Neo-brutalism aesthetic designed for fast information intake in high-stress campus environments (exams, deadlines, emergencies):
- **Raw Geometries**: Razor-sharp zero-radius corners (`border-radius: 0px`) for panels, cards, and buttons.
- **High-Contrast Outlines**: Heavy solid black borders (`#000000`, or `#FFFFFF` in dark mode) ranging from 2px to 4px.
- **Hard Cast Shadows**: Crisp, zero-blur drop shadows (`box-shadow: Xpx Ypx 0 0 #000000`) providing physical tactility.
- **Color Discipline**:
  - **Coral / Hot Red (`#FF6B6B`)** is strictly reserved for **Urgent notices**, destructive actions, and active unread markers. It is never used decoratively.
  - **Vivid Yellow (`#FFD93D`)** is the primary brand accent (active states, hero blocks, interactive highlights, primary non-urgent CTAs).
  - **Soft Violet (`#C4B5FD`)**, **Sky Blue (`#7FB7E6`)**, and **Sage Green (`#9BCB8B`)** designate categories and status tags.
- **Visual Hierarchy**: Not everything can be loud. We enforce three clear emphasis tiers across every screen.

---

## 2. Color Tokens

### 2.1 Base Tokens

| Token | Light Value | Dark Value | Purpose |
|---|---|---|---|
| `--bg-canvas` | `#FFFDF5` | `#0F0F12` | App background, page canvas with subtle 32px grid |
| `--bg-surface` | `#FFFFFF` | `#1A1A20` | Cards, main panels, modals, dropdowns |
| `--bg-muted` | `#FFF9E6` | `#26262E` | Secondary panels, subtle table row hovers, date strip |
| `--border` | `#000000` | `#FFFFFF` | Structural borders, outlines, dividers |
| `--ink` | `#000000` | `#FFFFFF` | Primary ink color |
| `--text-1` | `#000000` | `#FFFFFF` | Primary text, titles, headings, strong emphasis |
| `--text-2` | `#1A1915` | `#E4E4E7` | Body text, descriptions, secondary copy |
| `--text-3` | `#525048` | `#A1A1AA` | Metadata, timestamps, helper labels |

### 2.2 Brand & Urgency Accents

| Token | Value | Semantic Role |
|---|---|---|
| `--neo-accent` | `#FF6B6B` | **URGENT ONLY**, destructive buttons, emergency alert dot/banner |
| `--neo-secondary` | `#FFD93D` | Primary brand accent, active navigation, primary action buttons |
| `--neo-muted` | `#C4B5FD` | Soft violet, Timetable & Academics category |
| `--accent-green` | `#9BCB8B` | Sage green, Published / Active status, positive stats |
| `--accent-blue` | `#7FB7E6` | Sky blue, Placements & Information notices |
| `--accent-orange` | `#FFA048` | Warm amber, Deadlines due soon |

### 2.3 Category Color Mapping (Consistent Everywhere)

Chips, calendar event pills, and detail views must share identical category color assignments:

| Category | Background Token / Hex | Text Color |
|---|---|---|
| **Exams** | `#C4B5FD` (Soft Violet) | `#000000` |
| **Fees** | `#FFD93D` (Vivid Yellow) | `#000000` |
| **Timetable** | `#7FB7E6` (Sky Blue) | `#000000` |
| **Placements** | `#FFE066` (Sun Gold) | `#000000` |
| **Events** | `#FFF9E6` (Warm Sand) | `#000000` |
| **Holidays** | `#9BCB8B` (Sage Green) | `#000000` |
| **Scholarships** | `#D8B4FE` (Lilac) | `#000000` |
| **Results** | `#FED7AA` (Peach Amber) | `#000000` |

---

## 3. Visual Hierarchy: Three Emphasis Tiers

To eliminate equal loudness across the interface, all UI elements fall strictly into one of three tiers:

### Tier 1: Primary (Loudest)
- **Visuals**: Thick 3px or 4px solid border + hard shadow (`--shadow-md` or `--shadow-lg`) + vivid solid fill (`--neo-secondary` for CTAs, `--neo-accent` for Urgent items).
- **Usage**:
  - Main call-to-action buttons (`.btn.primary`)
  - Top urgent announcement banner (`.sticky-urgent-banner`)
  - Urgent priority cards & badges (`.urgent-card`, `.urgent-badge`)
  - Active modal dialogue containers (`.modal-container`)

### Tier 2: Secondary (Structural)
- **Visuals**: 2px or 2.5px solid border, subtle hard shadow (`--shadow-sm` = `3px 3px 0 0 #000`) or flat outline, white or canvas surface.
- **Usage**:
  - Standard update cards (`.update-card`)
  - Form input controls, selects, textareas (`.field input`)
  - Secondary buttons (`.btn.secondary`), icon buttons (`.icon-button`)
  - Standard status chips and category filters (`.chip`)

### Tier 3: Tertiary (Quiet)
- **Visuals**: 1px or 1.5px solid border, zero box shadow, neutral or transparent background.
- **Usage**:
  - Table inner rows and cells (`.data-table td`)
  - Metadata lines, timestamps, author attribution (`.card-meta-line`)
  - Inline detail links and footnotes
  - Nested list items inside panels

---

## 4. Typography Scale

Font Family: `Space Grotesk`, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif.
All headings are rendered in tight tracking and high-contrast uppercase styling.

| Level | Size / Line Height | Weight | Case / Tracking | Target Elements |
|---|---|---|---|---|
| **Display / Hero** | 36px / 42px (mobile 28px/34px) | 900 | UPPERCASE, -0.03em | Page main titles (`.page-title`), Hero headlines |
| **Section Head** | 24px / 30px (mobile 20px/26px) | 900 | UPPERCASE, -0.02em | Section headers (`.section-heading h2`) |
| **Card Title** | 16px / 22px | 900 | Normal or UPPERCASE, -0.01em | Update card title (`.update-card h3`), Modal titles |
| **Body Primary** | 14px / 20px | 500 | Normal sentence case | Notice content, excerpts, descriptive paragraphs |
| **UI Action** | 13px / 18px | 700 or 900 | UPPERCASE, +0.05em | Button labels (`.btn`), Navigation items (`.nav-item`) |
| **Meta / Label** | 12px / 16px | 700 | UPPERCASE, +0.04em | Breadcrumbs, author role, date labels |
| **Micro / Tag** | 11px / 14px | 700 or 900 | UPPERCASE, +0.06em | Status chips, badges, keyboard shortcuts |

*Strict Rule: No font size anywhere in the application may be smaller than 11px.*

---

## 5. Border Widths & Corner Radii

### Border Tokens
- **Heavy (3px - 4px solid var(--border))**: App shell, sidebar outer frame, main panel container, modal containers, hero cards.
- **Medium (2.5px solid var(--border))**: Action buttons, search inputs, form fields, table head separators.
- **Light (1.5px - 2px solid var(--border))**: Chips, status badges, secondary dividers, icon buttons.
- **Hairline (1px solid var(--border))**: Inner table row dividers, subtle audit lines.

### Radii Tokens
- `--radius-panel`: `0px` (Strict sharp edges)
- `--radius-card`: `0px`
- `--radius-control`: `0px`
- `--radius-chip`: `9999px` (Fully rounded pills reserved exclusively for status/category tags and notification count dots)
- `--radius-avatar`: `50%` (Circular user and department avatars)

---

## 6. Hard Shadows & Interactive Depths

Shadows are rendered without blur radius to create solid Neo-brutalism projection:

| Token | Shadow Value | Purpose |
|---|---|---|
| `--shadow-sm` | `3px 3px 0px 0px #000000` | Buttons, standard chips, inputs, small cards |
| `--shadow-md` | `5px 5px 0px 0px #000000` | Sidebar, hero card, toast notifications |
| `--shadow-lg` | `8px 8px 0px 0px #000000` | Main panel, dropdown menus, popovers |
| `--shadow-xl` | `12px 12px 0px 0px #000000` | Modal containers, login card |

### Interactive Micro-Motion
- **Hover**: `transform: translate(-1px, -1px); box-shadow: 4px 4px 0 0 #000000;`
- **Active / Pressed**: `transform: translate(2px, 2px); box-shadow: 0 0 0 0 #000000;`
- **Focus Rings**: `:focus-visible { outline: 3px solid #000000 !important; outline-offset: 2px; }`

---

## 7. Component Guidelines

### Buttons
- Height: Standard 40px (Small: 32px, Large: 48px).
- Font: 13px, weight 700/900, uppercase, letter-spacing 0.05em.
- Support both `<button>` and `<Link>` semantics natively through `href` prop.
- Variants:
  - `primary`: Yellow background (`--neo-secondary`), black text, 2.5px border, hard shadow.
  - `secondary`: White background, black text, 2.5px border, hard shadow, hover yellow.
  - `danger`: Red background (`--neo-accent`), black text, 2.5px border, hard shadow.
  - `ghost`: Transparent background, no border by default, borders and pops on hover.

### Cards
- Standard cards use CSS grid with `align-items: stretch` and equal row heights.
- Card footers pin to the bottom with `margin-top: auto`.
- Dedicated variants:
  - **Student Card**: Includes bookmark toggle, unread dot, mark-as-read button, and detail link.
  - **Faculty / Admin Card**: Strips bookmark and mark-as-read; displays full publishing status chip, audience cohort, and inline Approve/Reject action buttons when status is Pending.

### Chips & Badges
- Height: 26px (standard) or 30px (filter chips).
- Border: 2px solid #000.
- Radius: 9999px.
- Text: 11px uppercase font-weight 700.

---

## 8. Motion & Transitions

- Transition duration: 100ms - 180ms ease.
- Animations powered by `framer-motion`:
  - Modals & dialogs scale from 0.96 with fade.
  - Toast notifications slide up 12px.
  - Urgent alerts shake the notification bell icon with `@keyframes bellShake`.
  - Respects `@media (prefers-reduced-motion: reduce)`: disable transforms and translations if preferred.