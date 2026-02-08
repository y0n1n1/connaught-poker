# Implementation Plan

Implementation approach: **Database → Backend → Frontend**

---

## Phase 1: Project Setup & Database

### 1.1 Initialize Project
- [ ] Initialize Next.js project with TypeScript
  ```bash
  npx create-next-app@latest connaught-poker --typescript --tailwind --app
  ```
- [ ] Install dependencies:
  - Prisma + Prisma Client
  - bcrypt (password hashing)
  - jsonwebtoken (JWT auth)
  - zod (validation)
- [ ] Set up project structure:
  ```
  /src
    /app          # Next.js app router
    /lib          # Utility functions
    /components   # React components (later)
  /prisma
    schema.prisma
    /migrations
  /docs           # (Already created)
  ```

### 1.2 Database Setup
- [x] Create `prisma/schema.prisma` based on `DATABASE_SCHEMA.md`
- [ ] Set up Supabase PostgreSQL database
- [ ] Configure `.env` with `DATABASE_URL`
- [ ] Run initial migration:
  ```bash
  npx prisma migrate dev --name init
  ```
- [ ] Create seed script (`prisma/seed.ts`):
  - Admin user (you)
  - ~10 test users
  - 2-3 sample games with buyins and results
- [ ] Run seed: `npx prisma db seed`

### 1.3 Prisma Client Setup
- [ ] Generate Prisma Client: `npx prisma generate`
- [ ] Create `lib/prisma.ts` singleton instance
- [ ] Create helper utilities in `lib/db-utils.ts`:
  - `calculateNetWinnings(gameId, userId)`
  - `getUserTotalWinnings(userId)`
  - `getLeaderboard(limit)`

**Deliverable:** Working database with seed data, queryable via Prisma.

---

## Phase 2: Backend API

### 2.1 Authentication System
- [ ] Create auth utilities in `lib/auth.ts`:
  - `hashPassword(password)`
  - `comparePassword(password, hash)`
  - `generateToken(userId, isAdmin)`
  - `verifyToken(token)`
  - Middleware: `requireAuth`, `requireAdmin`, `requireGameHost`

### 2.2 API Route Structure
Set up Next.js 14 App Router API routes:
```
/src/app/api
  /auth
    /login/route.ts
    /register/route.ts
    /reset-password/route.ts
  /users
    /route.ts (GET all)
    /[userId]/route.ts (GET specific)
    /me/route.ts (GET, PATCH current user)
  /games
    /route.ts (GET, POST)
    /[gameId]/route.ts (GET, PATCH)
    /[gameId]/join/route.ts (POST)
    /[gameId]/buyins/route.ts (GET)
  /buyins
    /route.ts (POST)
    /[buyinId]/route.ts (PATCH)
  /results
    /route.ts (POST)
    /[resultId]/route.ts (PATCH)
  /leaderboard
    /route.ts (GET)
```

### 2.3 Implement Endpoints (Order)
1. **Auth endpoints** (login, register, reset-password)
2. **User endpoints** (CRUD operations)
3. **Game endpoints** (create, list, details, join)
4. **Buyin endpoints** (create, update payment status)
5. **Result endpoints** (create, update, auto-calculate net winnings)
6. **Leaderboard endpoint** (aggregate query)

### 2.4 Validation & Error Handling
- [ ] Use Zod schemas for request validation
- [ ] Standardized error response format
- [ ] Input sanitization
- [ ] Permission checks (host vs player vs admin)

### 2.5 Testing (Optional but Recommended)
- [ ] Test each endpoint with Postman/Insomnia
- [ ] Create test collection
- [ ] Document example requests/responses

**Deliverable:** Fully functional REST API, testable via API client.

---

## Phase 3: Frontend (Next.js + shadcn/ui)

### 3.1 shadcn/ui Setup
- [ ] Install shadcn/ui: `npx shadcn-ui@latest init`
- [ ] Install needed components:
  - Button, Input, Card, Table, Badge
  - Dialog, Select, Checkbox, Label
  - Tabs, Avatar, Toast

### 3.2 Auth Context & Protected Routes
- [ ] Create `contexts/AuthContext.tsx`:
  - Store JWT token in localStorage/cookie
  - `login()`, `logout()`, `register()` functions
  - `user` state (current user info)
- [ ] Create `components/ProtectedRoute.tsx`
- [ ] Create login/register pages

### 3.3 Layout & Navigation
- [ ] Create main layout with nav bar:
  - Logo
  - Links: Home, Leaderboard, My Games, Profile
  - Login/Logout button
- [ ] Responsive design (mobile-first)

### 3.4 Core Pages (Implementation Order)

#### 3.4.1 Authentication Pages
- [ ] `/login` - Login form
- [ ] `/register` - Registration form

#### 3.4.2 Home/Dashboard
- [ ] `/` - Landing page with:
  - Leaderboard preview (top 10)
  - Recent games
  - Quick actions (Create Game, Join Game)

#### 3.4.3 Leaderboard
- [ ] `/leaderboard` - Full leaderboard table

#### 3.4.4 Profile Pages
- [ ] `/profile/[userId]` - Public profile view
  - Display name
  - Stats (respecting privacy)
  - Game history (if visible)
- [ ] `/profile/me` - Personal dashboard
  - Edit display name
  - Privacy toggle switches
  - Full stats
  - Full game history table

#### 3.4.5 Game Pages
- [ ] `/games` - List all games (with filters)
- [ ] `/games/new` - Create game form:
  - Date picker
  - Player multi-select dropdown
  - Generate join code toggle
  - Notes textarea
- [ ] `/games/[gameId]` - Game details page:
  - Game info header
  - Tabs: Buyins | Results | Summary
  - **Buyins tab**:
    - Table of buyins with payment status
    - "Add Buyin" button (host or self)
    - Update payment status (host only)
  - **Results tab**:
    - Table of final results
    - "Add Result" button (host or self)
  - **Summary tab**:
    - Total pot
    - Winners/losers
    - Payment summary (who owes)

#### 3.4.6 Admin Pages
- [ ] `/admin` - Admin dashboard (admin only):
  - User list
  - Password reset form

### 3.5 Components Library
Create reusable components:
- [ ] `PlayerSelect` - Multi-select dropdown for players
- [ ] `BuyinRow` - Buyin table row with edit capabilities
- [ ] `ResultRow` - Result table row
- [ ] `StatCard` - Card displaying a stat (winnings, games, etc.)
- [ ] `GameCard` - Card for game list view
- [ ] `PrivacyToggle` - Toggle switch for privacy settings

### 3.6 State Management
- [ ] Use React Context for global state (auth user)
- [ ] Use SWR or React Query for data fetching/caching
- [ ] Optimistic updates for better UX

### 3.7 Polish
- [ ] Loading states (skeletons)
- [ ] Error states (toast notifications)
- [ ] Empty states (no games, no results)
- [ ] Form validation with error messages
- [ ] Mobile responsive design
- [ ] Dark mode support (optional)

**Deliverable:** Fully functional web app with UI.

---

## Phase 4: Deployment

### 4.1 Database (Supabase)
- [ ] Supabase database already set up (same DB used for dev and prod)
- [ ] Migrations already applied
- [ ] (Optional) Seed with initial admin user

### 4.2 Application Deployment (Vercel)
- [ ] Connect GitHub repo to Vercel
- [ ] Configure environment variables:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `NODE_ENV=production`
- [ ] Deploy to production
- [ ] Test all features on production URL

### 4.3 Post-Deployment
- [ ] Create admin account (you)
- [ ] Create accounts for all ~20 players
- [ ] Share login credentials with friends
- [ ] Monitor initial usage
- [ ] Fix bugs as they arise

**Deliverable:** Live application accessible to all players.

---

## Phase 5: Iteration (Post-Launch)

### 5.1 Gather Feedback
- [ ] Use app with friends for 1-2 weeks
- [ ] Collect feedback on UX, missing features, bugs

### 5.2 Prioritize Improvements
Based on feedback, add:
- Game history filtering
- Better mobile UX
- Notification system
- Additional stats

---

## Development Workflow

### Daily Workflow
1. Pick a task from current phase
2. Create feature branch: `git checkout -b feature/task-name`
3. Implement feature
4. Test locally
5. Commit with clear message
6. Push and create PR (or merge to main if solo)
7. Deploy to staging/production

### Git Branching Strategy
- `main` - production branch (deployed to Vercel)
- `feature/*` - feature branches
- Keep commits small and atomic

---

## Estimated Timeline

**Phase 1 (Database):** 1-2 days
**Phase 2 (Backend API):** 3-5 days
**Phase 3 (Frontend):** 5-7 days
**Phase 4 (Deployment):** 1 day
**Phase 5 (Iteration):** Ongoing

**Total MVP:** ~2 weeks of focused work

---

## Notes
- Start simple, iterate based on real usage
- Don't over-engineer early features
- Focus on core loop: Create game → Track buyins → Enter results → View leaderboard
- Mobile UX is important (players will check on phones)
- Keep it fun and easy to use
