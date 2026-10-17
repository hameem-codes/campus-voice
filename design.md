# Campus Voice Design System (Modern University Platform)

The single source of truth for all styling, typography, component geometry, tokens, and motion in Campus Voice.
Inspired by Linear, Notion, and Apple Calendar: sleek, mature, distraction-free, and high-clarity.

---

## 1. Design Philosophy: Quiet Clarity & Modern University UX

Campus Voice uses a sleek, mature, modern university platform aesthetic designed for effortless readability and focus:
- **Refined Geometries**: Modern soft rounded corners (`--radius-card: 10px`, `--radius-panel: 12px`, `--radius-control: 8px`, `--radius-chip: 6px`).
- **Subtle, Sleek Borders**: Crisp 1px slate borders (`#E2E8F0` light, `#2D3748` dark) replacing harsh solid black borders.
- **Layered Soft Shadows**: Elegant ambient depth (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`, etc.) eliminating harsh cartoon drop-shadows.
- **Color Discipline & Tone-on-Tone Badges**:
  - Distraction-free neutral slate canvas (`#F8FAFC`).
  - Obsidian black (`#0F172A`) for primary actions.
  - Tone-on-tone semantic category chips (soft backgrounds paired with deep readable foreground ink).
  - Urgent priority uses subtle tinted containers (`#FEF2F2`) with deep crimson text (`#991B1B`).
- **Visual Hierarchy**: High clarity with calm contrast, avoiding shouting uppercase everywhere.

---

## 2. Color Tokens

### 2.1 Base Tokens

| Token | Light Value | Dark Value | Purpose |
|---|---|---|---|
| `--bg-canvas` | `#F8FAFC` | `#090D16` | App background, crisp light slate canvas |
| `--bg-surface` | `#FFFFFF` | `#111827` | Cards, main panels, modals, dropdowns |
| `--bg-muted` | `#F1F5F9` | `#1F2937` | Secondary panels, table headers, hover backgrounds |
| `--border` | `#E2E8F0` | `#2D3748` | Sleek 1px structural borders |
| `--border-strong` | `#CBD5E1` | `#4A5568` | Stronger 1px border for active/focused elements |
| `--text-1` | `#0F172A` | `#F8FAFC` | Deep slate primary headings & titles |
| `--text-2` | `#334155` | `#CBD5E1` | Body text, descriptions, secondary copy |
| `--text-3` | `#64748b` | `#94A3B8` | Metadata, timestamps, helper labels |

### 2.2 Semantic Tone-on-Tone Category Badges

| Role / Category | Background (`--chip-*-bg`) | Foreground (`--chip-*-fg`) | Border (`--chip-*-border`) |
|---|---|---|---|
| **Neutral** | `#F1F5F9` | `#334155` | `#E2E8F0` |
| **Urgent** | `#FEF2F2` | `#991B1B` | `#FECACA` |
| **Accent (Exams/Academic)** | `#EFF6FF` | `#1D4ED8` | `#BFDBFE` |
| **Green (Results/Success)** | `#ECFDF5` | `#065F46` | `#A7F3D0` |

### 2.3 Primary Action

| Token | Light Value | Dark Value | Purpose |
|---|---|---|---|
| `--action` | `#0F172A` | `#FFFFFF` | Obsidian primary button fill |
| `--action-hover` | `#1E293B` | `#F1F5F9` | Primary button hover fill |
| `--action-fg` | `#FFFFFF` | `#0F172A` | Text on primary button |

---

## 3. Typography Scale

Clean, modern typography scale:
- Font Family: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
- Natural sentence/title casing instead of uppercase shouting.

| Level | Size / Line Height | Weight | Tracking | Target Elements |
|---|---|---|---|---|
| **Display / Hero** | 28px / 34px | 700 | -0.02em | Page main titles (`.page-title`), Hero headlines |
| **Section Head** | 18px / 24px | 700 | -0.01em | Section headers (`.section-heading h2`) |
| **Card Title** | 15px / 21px | 600 | -0.01em | Update card title (`.update-card h3`), Modal titles |
| **Body Primary** | 14px / 20px | 400 | Normal | Notice content, excerpts, descriptive paragraphs |
| **UI Action** | 13px / 18px | 500 or 600 | Normal | Button labels (`.btn`), Navigation items (`.nav-item`) |
| **Meta / Label** | 11px - 12px / 16px | 500 or 600 | 0.04em | Breadcrumbs, author role, date labels |
| **Micro / Tag** | 11px / 14px | 500 | Normal | Status chips, category badges |

---

## 4. Radii & Shadows

### Radii Tokens
- `--radius-panel`: `12px` (Sidebar, main panel, modal containers)
- `--radius-card`: `10px` (Update cards, statistic cards, hero cards)
- `--radius-control`: `8px` (Buttons, inputs, selects, segmented controls)
- `--radius-chip`: `6px` (Category chips, status tags, badges)

### Soft Shadows
- `--shadow-sm`: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- `--shadow-md`: `0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)`
- `--shadow-lg`: `0 10px 15px -3px rgb(0 0 0 / 0.08)`
- `--shadow-xl`: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`

---

## 5. Component Guidelines

### Buttons (`.btn`)
- Rounded corners (`--radius-control`), height 38px (sm: 30px).
- Primary: Obsidian slate (`var(--action)`), text `#fff`, subtle hover shift.
- Secondary: Clean white card surface with 1px border.
- Ghost: Transparent background, subtle muted hover.

### Update Cards (`.update-card`)
- 1px border, 10px radius, soft shadow (`--shadow-sm`).
- Hover: Gentle lift with `transform: translateY(-1px)` and `--shadow-md`.
- Unread notices: Sleek left accent indicator (`border-left: 3px solid #3B82F6`) with light slate wash (`#FAFCFF`).

### Deadlines & Calendar (Apple Calendar Inspired)
- Clean month/day date block (`.deadline-date-box`) with uppercase red month text and bold slate day number.
- Event pills with tone-on-tone tinting and smooth micro-interactions.