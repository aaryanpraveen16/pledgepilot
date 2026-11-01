# PledgePilot UI Revamp & Design System Plan

## 1. Design System & Tokens (`src/index.css` & `tailwind.config.js`) [COMPLETED]
Configured design tokens and Tailwind foundations:
- **Palette**: Slate-950 (`#020617`) deep dark base, Slate-900 (`#0f172a`) card surfaces with glassmorphism (`backdrop-blur-md`, subtle border `rgba(51, 65, 85, 0.6)`), and Emerald-500 (`#10b981`) for funding milestones and success indicators.
- **Accents**: Indigo-500 (`#6366f1`) for backer XP progress and tier badges (`.badge-xp`, `.progress-fill-xp`), Amber-500 (`#f59e0b`) for reward tokens and perks (`.badge-reward`).
- **Typography**: Plus Jakarta Sans and Inter loaded with default `tracking-tight` (`-0.025em`) on headings (`-0.035em` on `h1`) and clean body text.
- **Utility Classes**: `.glass-card`, `.glass-card-interactive`, `.glass-nav`, `.badge-xp`, `.badge-reward`, `.badge-funding`, `.progress-track-dark`, `.progress-fill-emerald`, `.btn-emerald`, `.btn-glass-secondary`.

## 2. Component Migration Checklist
- [ ] **Navbar & Header**: Sticky blurred backdrop (`backdrop-blur-md`), instant campaign search bar, user dropdown with Backer Tier badge.
- [ ] **Campaign Discovery Grid (`/discover`)**: 
  - Hero carousel for featured/trending campaigns.
  - Smooth horizontal scrolling category pills.
  - Redesigned campaign cards with overlapping creator avatars and animated progress bars.
- [ ] **Campaign Detail Page (`/campaigns/:id`)**:
  - Kickstarter-style split layout.
  - Left column: Rich tabbed interface (*Campaign Story*, *FAQ*, *Updates / CKEditor Feed*, *Community Board*).
  - Right column: **Sticky Side-Rail Checkout** with live funding goal meter and interactive reward tier cards.