# UI Design Guide - Connaught Poker

## Design Philosophy

**Dark Poker Theme** - Inspired by real poker tables with a personal, intimate feel. Mobile-first responsive design optimized for quick, on-the-go game tracking.

---

## Color Palette

### Primary Colors
```css
--background: #0f1419         /* Deep dark background */
--card-bg: #1a1f26            /* Card/component background */
--card-border: #2d3748        /* Subtle borders */
```

### Accent Colors
```css
--poker-green: #0d5f3e        /* Poker table green (dark) */
--poker-green-light: #10b981  /* Poker table green (light) */
--poker-gold: #fbbf24          /* Winners, highlights */
--poker-red: #ef4444           /* Losses, errors */
```

### Text Colors
```css
--foreground: #e8eaed          /* Primary text (white-ish) */
text-gray-400                  /* Secondary text */
text-gray-500                  /* Tertiary text */
```

---

## Typography

### Font Stack
```css
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif
```

### Hierarchy
- **Page Titles**: `text-2xl sm:text-3xl font-bold text-white`
- **Section Headers**: `text-xl font-bold text-white`
- **Card Titles**: `text-lg font-semibold text-white`
- **Body Text**: `text-sm sm:text-base text-gray-400`
- **Helper Text**: `text-xs text-gray-500`

---

## Components

### Poker Card (`.poker-card`)
Base container for all major UI sections.

**Features:**
- Gradient background (#1a1f26 → #242b36)
- Subtle border
- Hover effect (lift + shadow)
- Rounded corners (12px desktop, 8px mobile)

**Usage:**
```jsx
<div className="poker-card p-6">
  {/* Content */}
</div>
```

---

### Buttons

#### Primary Button (`.btn-primary`)
```jsx
<button className="btn-primary">
  Create Game
</button>
```
- Green gradient background
- Shadow glow effect
- Hover lift animation
- Use for: Main actions, CTAs, form submissions

#### Secondary Button (`.btn-secondary`)
```jsx
<button className="btn-secondary">
  Cancel
</button>
```
- Card background with border
- Subtle hover effect
- Use for: Cancel actions, secondary options

---

### Form Inputs

**Styling:**
- Dark background with subtle border
- Green focus state with glow
- 16px font size on mobile (prevents iOS zoom)
- Full width by default

**Usage:**
```jsx
<input
  type="email"
  placeholder="your@email.com"
  className="w-full" // Pre-styled via globals.css
/>
```

---

### Stat Cards (`.stat-card`)

Display numerical stats with visual flair.

**Features:**
- Poker chip-inspired design
- Animated pulse background
- Color-coded values:
  - `.stat-value` - Gold gradient (default)
  - `.stat-value.positive` - Green gradient (gains)
  - `.stat-value.negative` - Red gradient (losses)

**Usage:**
```jsx
<div className="stat-card">
  <div className="stat-value positive">$250.00</div>
  <div className="text-sm text-gray-400 mt-2">Total Winnings</div>
</div>
```

---

### Rank Badges

For leaderboard rankings.

**Usage:**
```jsx
🥇 {/* 1st place */}
🥈 {/* 2nd place */}
🥉 {/* 3rd place */}
<span className="text-gray-500 font-mono">#4</span> {/* 4th+ */}
```

---

## Layout Patterns

### Page Structure
```jsx
<div className="min-h-screen">
  <Navbar />
  <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    {/* Page content */}
  </main>
</div>
```

### Card Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  <div className="poker-card">...</div>
  <div className="poker-card">...</div>
  <div className="poker-card">...</div>
</div>
```

---

## Responsive Design

### Breakpoints
```
sm: 640px   (tablet)
md: 768px   (desktop)
lg: 1024px  (large desktop)
```

### Mobile-First Rules

1. **Touch Targets**: Minimum 44x44px tap areas
2. **Font Sizes**: 16px minimum to prevent iOS zoom
3. **Spacing**: Generous padding (p-4 mobile, p-6 desktop)
4. **Navigation**: Hamburger menu below md breakpoint
5. **Tables**: Card-style layout on mobile, table on desktop

### Example
```jsx
<div className="p-4 sm:p-6 lg:p-8">
  <h1 className="text-2xl sm:text-3xl">Title</h1>
</div>
```

---

## Color Usage Guidelines

### Money Values
```jsx
{value > 0 && <span className="text-green-400">${value}</span>}
{value < 0 && <span className="text-red-400">${value}</span>}
{value === 0 && <span className="text-gray-400">${value}</span>}
```

### Status Indicators
- **Success/Paid**: `bg-green-900/20 border-green-500/50 text-green-400`
- **Error/Unpaid**: `bg-red-900/20 border-red-500/50 text-red-400`
- **Warning/Pending**: `bg-yellow-900/20 border-yellow-500/50 text-yellow-400`
- **Info**: `bg-blue-900/20 border-blue-500/50 text-blue-400`

---

## Iconography

### Emoji Icons
Use emoji for quick visual recognition (mobile-friendly):

- 🃏 - Create game
- 🏆 - Leaderboard / winner
- 🎮 - Games list
- 👤 - Profile
- ⚙️ - Settings / admin
- 📊 - Stats
- 💰 - Money / buyins
- 🎲 - Gambling / random
- ♠️♥️♦️♣️ - Poker suits (branding)

### Size Guidelines
- Nav icons: `text-xl`
- Section headers: `text-2xl` or `text-3xl`
- Cards: `text-4xl`
- Large empty states: `text-5xl` or `text-6xl`

---

## Animations

### Hover Effects
```css
/* Cards */
.poker-card:hover {
  transform: translateY(-2px);
  /* Already included in global CSS */
}

/* Icon Scale */
.group-hover:scale-110 transition-transform
```

### Loading States
```jsx
<div className="text-gray-400">Loading...</div>
```

### Transitions
- Default: `transition-all duration-200`
- Use for: colors, shadows, transforms

---

## Accessibility

### Color Contrast
- All text meets WCAG AA standards
- Minimum 4.5:1 contrast ratio for body text
- Minimum 3:1 for large text (18px+)

### Focus States
- Green glow on focused inputs
- Visible focus rings on interactive elements

### Mobile Considerations
- Touch targets ≥44px
- No hover-only interactions
- Font size ≥16px to prevent zoom

---

## Empty States

### Pattern
```jsx
<div className="p-8 text-center">
  <div className="text-5xl mb-4">🎲</div>
  <p className="text-gray-400 mb-2">No data yet</p>
  <p className="text-sm text-gray-500">
    Get started by creating a game!
  </p>
</div>
```

---

## Tables

### Mobile
Use card-style layout:
```jsx
<div className="block sm:hidden">
  {items.map(item => (
    <div key={item.id} className="p-4 border-b">
      {/* Stacked content */}
    </div>
  ))}
</div>
```

### Desktop
Use traditional table:
```jsx
<table className="hidden sm:table min-w-full">
  <thead className="bg-[#1a1f26]">
    {/* Headers */}
  </thead>
  <tbody>
    {/* Rows */}
  </tbody>
</table>
```

---

## Examples

### Quick Action Card
```jsx
<Link href="/games/new" className="poker-card p-6 text-center group">
  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
    🃏
  </div>
  <h3 className="text-lg font-semibold text-white mb-1">
    Create Game
  </h3>
  <p className="text-sm text-gray-400">
    Host a new poker game
  </p>
</Link>
```

### Form Field
```jsx
<div>
  <label className="block text-sm font-medium text-gray-300 mb-2">
    Email address
  </label>
  <input
    type="email"
    placeholder="your@email.com"
    required
  />
</div>
```

### Error Message
```jsx
<div className="rounded-lg bg-red-900/20 border border-red-500/50 p-4">
  <p className="text-sm text-red-400">{error}</p>
</div>
```

---

## Best Practices

1. **Consistency**: Use pre-defined classes (`.poker-card`, `.btn-primary`, etc.)
2. **Mobile First**: Design for mobile, enhance for desktop
3. **Spacing**: Use Tailwind's spacing scale (p-4, p-6, p-8)
4. **Typography**: Follow the hierarchy (h1 → h2 → h3 → p)
5. **Colors**: Use semantic colors (green=success, red=error, gold=highlight)
6. **Icons**: Emoji for personality, keep them consistent
7. **Loading**: Always show loading states
8. **Empty States**: Make them friendly and actionable
9. **Feedback**: Visual feedback on all interactions
10. **Accessibility**: Test with keyboard navigation

---

## Don'ts

❌ Don't use light backgrounds
❌ Don't use colors outside the palette
❌ Don't create custom button styles
❌ Don't use < 16px font size on mobile inputs
❌ Don't rely on hover-only interactions
❌ Don't nest poker-cards
❌ Don't use tables for mobile layout
❌ Don't skip loading/error states
❌ Don't use inline styles (use Tailwind)
❌ Don't mix emoji styles (keep it consistent)
