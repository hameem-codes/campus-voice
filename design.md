# Campus Voice Design System v2

Warm, bold, friendly. Big color blocks, huge headlines, flat illustrations, and small gamified touches.
This file replaces DESIGN.md v1 and is the single source of truth for all UI work.
Values are visual approximations of the reference style. Keep them consistent.

---

## 1. Principles

- **Bold, not busy:** one huge headline per page is the focal point. Everything else supports it.
- **Color as surface:** yellow, purple and cream are used as large blocks, not tiny chips.
- **Human:** flat illustrations with thick outlines, friendly greetings, small delights.
- **Layered:** hero cards overlap the banner edge so the page feels composed, not just assembled.
- **Urgent must scream:** red-orange is reserved for Urgent only. Never use it decoratively.
- **Readable:** long reading areas stay on cream or white. Bright blocks frame the content, they don't hold paragraphs.

---

## 2. Color Tokens

### Base

| Token | Value | Use |
|---|---|---|
| `--bg-canvas` | `#FBF6E9` | App background, sidebar, page |
| `--bg-surface` | `#FFFDF7` | Main content area, modals, inputs |
| `--bg-panel` | `#EDE7D3` | Hero banner, soft section panels |
| `--bg-card` | `#F3EEDD` | Right-rail cards, list cards |
| `--border` | `#E4DDC6` | Dividers, input borders, thin outlines |
| `--ink` | `#16150F` | Headlines, primary text, outlines, primary button |
| `--text-1` | `#16150F` | Titles |
| `--text-2` | `#5E5A4C` | Body, descriptions |
| `--text-3` | `#8E8A7A` | Labels, hints, timestamps |

### Brand blocks

| Token | Value | Use |
|---|---|---|
| `--yellow` | `#FFC21A` | Primary brand block, highlight cards, sidebar promo card |
| `--yellow-soft` | `#FFF1BF` | Yellow tint backgrounds, selected states |
| `--purple` | `#8A63D2` | Secondary brand block, progress fill, active nav icon |
| `--purple-soft` | `#E7DDF7` | Purple tint backgrounds |
| `--cream-card` | `#F5F0DE` | Illustration cards |

### Category colors (one color per category, used as card blocks)

| Category | Block | Illustration idea |
|---|---|---|
| Exams | `--purple` `#8A63D2` | Pencil and paper |
| Fees | `--yellow` `#FFC21A` | Coin or wallet |
| Timetable | `#7FB7E6` (sky) | Clock |
| Placements | `#16150F` (ink, white text) | Briefcase |
| Events | `#F5F0DE` (cream) | Megaphone or party |
| Holidays | `#9BCB8B` (sage) | Sun or palm |
| Scholarships | `#F4A6B8` (pink) | Graduation cap |
| Results | `#FFC21A` with ink outline | Trophy or chart |

### Status and priority (small chips only)

| Meaning | Background | Text |
|---|---|---|
| Urgent | `#FFE0D6` | `#D9411E` |
| Success / Read | `#DDEBD2` | `#4C7A3B` |
| Info / Scheduled | `#DCEAF8` | `#3F73B0` |
| Neutral | `#EDE7D3` | `#5E5A4C` |

`--urgent: #FF5A36` is the solid urgent color for banners and badges. Use it nowhere else.

### Dark mode (optional)

| Token | Value |
|---|---|
| `--bg-canvas` | `#14130E` |
| `--bg-surface` | `#1C1B14` |
| `--bg-panel` | `#26241A` |
| `--ink` / `--text-1` | `#F6F1E0` |
| `--text-2` | `#BDB8A4` |
| Brand blocks | Keep yellow and purple unchanged |

---

## 3. Typography

- **Display and headings:** Inter Tight, Satoshi, or General Sans. Fallback: `Inter, system-ui, sans-serif`.
- **Body:** Inter. Fallback: `system-ui, sans-serif`.
- **Weights:** 400 for body, 500 for UI labels, 600 for headlines. Headlines use tight letter-spacing (-0.02em to -0.03em).

| Style | Size / Line | Weight | Use |
|---|---|---|---|
| Hero | 56 / 56 (mobile 36 / 38) | 600 | Hero headline |
| Display | 40 / 44 (mobile 28 / 32) | 600 | Page titles |
| Heading | 24 / 30 | 600 | Section titles |
| Title | 18 / 24 | 500 | Card titles |
| Body | 15 / 22 | 400 | Paragraphs, descriptions |
| UI | 14 / 20 | 500 | Buttons, nav, tabs |
| Caption | 12 / 16 | 400 | Meta, timestamps, labels |
| Micro | 11 / 14 | 500 | Chips, badges (never below 11px) |

---

## 4. Spacing, Radius, Elevation

- **Spacing scale (4px base):** 4, 8, 12, 16, 24, 32, 48, 64
- **Card padding:** 20 to 24
- **Grid gap:** 16
- **Page padding:** 32 desktop, 16 mobile
- **Section gap:** 40 to 48

| Element | Radius |
|---|---|
| Hero banner, large panels | 20 |
| Cards | 16 |
| Illustration cards | 16 |
| Buttons, inputs | 12 |
| Chips, badges | 8 (pill chips: 999) |
| Avatars | full circle |

- **Elevation:** flat. No drop shadows. Depth comes from color blocks, 1px borders, and overlap.
- **Outlines:** illustrations and key icon tiles use a 1.5px `--ink` outline.
- **Layout:** fixed sidebar 220px, fluid main area, optional right rail 320px on screens 1280px and wider.
- **Grid:** 3 columns for update cards on desktop, 2 on tablet, 1 on mobile.

---

## 5. Iconography and Illustration

- Outline icons (lucide-react), 1.5px stroke, 18px in navigation, 20px in buttons.
- Active nav icon uses `--purple`.
- Illustrations: flat vector, thick ink outlines, limited palette (yellow, purple, cream, ink). One per category. Use unDraw, Open Peeps, or custom SVG. No photos and no gradients.
- Avatars: initials on `--yellow-soft` or `--purple-soft`, or illustrated faces, 32 to 40px.

---

## 6. Components

### Sidebar
- Cream (`--bg-canvas`), 220px, brand wordmark on top (large, 600 weight).
- Nav item: icon + label, 40px tall, 12px radius. Active item has a `--purple-soft` background, `--ink` text and a purple icon.
- Unread count badge: small pill, `--ink` background with white text.
- Bottom promo card: solid `--yellow` block with an ink icon in a circle, bold two-line headline (for example "Never miss a deadline"), and a white button ("Turn on alerts").

### Top bar
- Search field (cream, rounded, with ⌘K hint).
- Right side: streak badge ("5 day streak"), "read this week" badge, notification bell with dot, avatar.
- Badges: `--bg-panel` background, 8px radius, icon in a colored circle.

### Hero banner
- `--bg-panel` background, 20px radius, 32 to 48px padding.
- Left: small greeting line, then a Hero headline (for example "You have 3 updates that need you today"), then a dark primary button with an arrow ("View updates").
- Right: three tall illustration cards (about 150 x 280), each in a category color with a number (01, 02, 03), title and illustration. They overlap and slightly overflow the banner's right edge.
- Mobile: cards become a horizontal scroll row under the headline.

### Buttons
- **Primary:** `--ink` background, white text, trailing arrow icon, 12px radius, 44px tall.
- **Secondary:** transparent, 1px `--ink` border, `--ink` text.
- **Accent:** `--yellow` background, ink text (used on promo cards).
- **Ghost:** text only with an underline on hover.
- Hover: 2px upward lift and a slight color shift. Active: scale 0.98. Focus: 2px `--purple` outline with 2px offset.

### Update card
- Solid category color block (see table) or cream card with an illustration.
- Top: category label (Micro), unread dot, bookmark icon.
- Title (Title style, up to 2 lines), one-line excerpt.
- Footer: posted time (relative), event or deadline date, publisher.
- Urgent cards add a solid `--urgent` left bar and an "Urgent" chip.
- Read cards are slightly desaturated (opacity 0.85).

### Urgent banner
- Full-width, solid `--urgent` background, white text, alert icon in a circle, one-line message, white "Read now" button, dismiss icon. Sticky at the top of the content area.

### Module list / timeline
- Vertical list with icon tiles (outlined squares) connected by a thin line. Checked items get a yellow circle with a check.
- Right side: short description in `--text-2`.

### Progress
- Track `--border`, 8px tall, rounded. Fill `--purple`. Percentage label at the right.
- Used for "updates read this week" and form step progress.

### Right rail ("Coming up")
- Header "Coming up" with a "See all" link.
- Sections "Today" and "Tomorrow", each a list of `--bg-card` cards with title, time, and a dot-tag chip (Exam, Fee, Event).
- Cards with an imminent time show "Starts in 3 min" style helper text.

### Tabs
- Text tabs with a 2px `--ink` underline that slides between tabs. Inactive in `--text-2`.

### Chips
- Filter chips: pill, 1px border, 36px tall. Active chip fills with `--ink` and white text.
- Status chips: see status table, 8px radius, Micro text.

### Tables
- Cream header row, 1px row dividers, 56px row height, hover row `--bg-card`. On mobile, rows become stacked cards.

### Forms
- Inputs: `--bg-surface`, 1px `--border`, 12px radius, 48px tall. Focus border `--purple` plus a soft purple ring.
- Error: `--urgent` border and a small message under the field.
- Stepper: numbered circles, active = `--ink`, done = `--yellow` with a check.

### Modals, drawers, toasts
- Modal and drawer on `--bg-surface`, 20px radius, scrim `rgba(22,21,15,0.4)`.
- Toast: `--ink` background, white text, 12px radius, bottom center.

---

## 7. Motion

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`. Durations: 150 to 250ms for UI, 400ms for page and hero entrance.
- Page transition: fade plus 8px slide up.
- Hero cards: staggered entrance (80ms apart) and a subtle lift on hover.
- Cards: stagger on list load, lift 2px on hover.
- Tab underline slides, progress bars fill on mount, bookmark pops (scale 1.2 then 1).
- New urgent notification: bell shakes once, toast slides in.
- Skeleton loaders use a soft shimmer.
- Respect `prefers-reduced-motion`: disable transforms and keep only fades.

---

## 8. Campus Voice Mapping

| Campus Voice element | Pattern |
|---|---|
| Student Home hero | Hero banner with greeting, headline and three category cards (top three updates) |
| Update feed | Category-colored update cards in a 3-column grid |
| Upcoming deadlines | Right rail "Coming up" with Today and Tomorrow |
| Updates read this week | Progress bar plus streak badge in the top bar |
| Urgent notices | Sticky urgent banner plus urgent card treatment |
| Saved | Update cards with a filled bookmark |
| Faculty Create steps | Stepper plus form card |
| Admin approvals | Table with approve and reject actions |
| Analytics | Stat cards on `--bg-panel` with purple and yellow charts |
| Sidebar promo card | "Never miss a deadline: turn on alerts" |

---

## 9. CSS Variables

```css
:root {
  --bg-canvas: #FBF6E9;
  --bg-surface: #FFFDF7;
  --bg-panel: #EDE7D3;
  --bg-card: #F3EEDD;
  --border: #E4DDC6;
  --ink: #16150F;
  --text-1: #16150F;
  --text-2: #5E5A4C;
  --text-3: #8E8A7A;

  --yellow: #FFC21A;
  --yellow-soft: #FFF1BF;
  --purple: #8A63D2;
  --purple-soft: #E7DDF7;
  --sky: #7FB7E6;
  --sage: #9BCB8B;
  --pink: #F4A6B8;
  --urgent: #FF5A36;

  --chip-urgent-bg: #FFE0D6;  --chip-urgent-fg: #D9411E;
  --chip-success-bg: #DDEBD2; --chip-success-fg: #4C7A3B;
  --chip-info-bg: #DCEAF8;    --chip-info-fg: #3F73B0;
  --chip-neutral-bg: #EDE7D3; --chip-neutral-fg: #5E5A4C;

  --radius-xl: 20px;
  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 8px;

  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;

  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}
```

---

## 10. Rules for Implementation

- Use only the tokens above. No new colors, shadows, or font sizes.
- Keep spacing on the 4px scale.
- Use `--urgent` only for Urgent items.
- Keep body text on `--bg-canvas`, `--bg-surface` or `--bg-card`. Never put paragraphs on yellow or purple.
- Check WCAG AA contrast: ink text on yellow passes, white text on purple passes at 14px and above, and chip text must be checked.
- Every interactive element needs visible hover, focus, active, and disabled states.
- Mobile-first: sidebar becomes a bottom bar with a "More" sheet, hero cards scroll horizontally, right rail moves below the main content.
- Illustrations must be SVG, inline or local. No external image URLs.