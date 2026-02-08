# Features & User Stories

## User Roles

### Player (Standard User)
Any registered user who participates in poker games.

### Game Host
Any player can host a game. Hosts have additional permissions for their games.

### Admin (You)
Special user with elevated permissions for system management.

---

## Core Features

### 1. Authentication & User Management

#### User Registration & Login
- **As a new player**, I want to create an account with username/password so I can start tracking my games.
- **As a returning player**, I want to log in with my credentials to access my data.

#### Password Reset (Admin)
- **As an admin**, I want to reset any player's password from my account so I can help friends who forgot their passwords.
- **Flow**: Admin logs in → navigates to user management → selects user → enters new password → confirms

#### Profile Customization
- **As a player**, I want to set a display name that shows on leaderboards (can differ from my username).
- **As a player**, I want to toggle privacy settings for:
  - Total winnings visibility
  - Game history visibility
  - Individual game results visibility

---

### 2. Game Creation & Management

#### Create a Game
- **As a host**, I want to create a new game with:
  - Game date/time
  - Optional notes (e.g., "Friday night home game")
  - Initial player list (select from dropdown of all users)
  - Auto-generated join code

#### Player Selection Methods
1. **List-based selection**: Host picks players from a list of all users
2. **Join link**: Host shares link/code, players join themselves

#### Join a Game
- **As a player**, I want to join a game by clicking a link or entering a join code.

#### Game Lifecycle
- **As a host**, I want to update game status:
  - UPCOMING → IN_PROGRESS (when game starts)
  - IN_PROGRESS → COMPLETED (when game ends)
  - Cancel a game if needed

---

### 3. Buyin Tracking

#### Record Buyins
- **As a host**, I want to record buyins for any player during the game.
- **As a player**, I want to record my own buyins.
- **Support for multiple buyins per player** (rebuys).

#### Payment Tracking
- **As a host** (especially Filipo), I want to:
  - See who has paid vs who owes money
  - Mark buyins as: UNPAID, PAID, or PENDING
  - View total amount owed by player
  - Filter by payment status

#### Buyin Display
- **As any user**, I want to see all buyins for a game publicly (since hosts rotate).
- Display format:
  ```
  Player Name | Buyin #1 | Buyin #2 | Total | Status
  Gabriel     | $50      | $50      | $100  | PAID
  Filipo      | $50      | -        | $50   | UNPAID
  ```

---

### 4. Game Results

#### Enter Results
- **As a host**, I want to enter final chip counts for any player.
- **As a player**, I want to enter my own final chip count.
- **Backend auto-calculates net winnings** (final amount - total buyins).

#### Result Validation
- System should warn if total winnings don't sum to zero (money leak/gain).
- Example: If total buyins = $500, total cashouts should = $500.

---

### 5. Leaderboard

#### Public Leaderboard
- **As any user** (even non-logged-in), I want to see a leaderboard ranked by total winnings.
- Display:
  - Rank
  - Player name (display name)
  - Total winnings
  - Games played
- **Only shows players with `showTotalWinnings: true`**

#### Leaderboard Filters (Optional)
- All-time (default)
- Last 30 days
- Last 90 days

---

### 6. Personal Dashboard

#### My Stats
- **As a player**, I want to see my private dashboard with:
  - Total winnings (cumulative)
  - Games played
  - Best game (highest net winnings)
  - Worst game (lowest net winnings)
  - Average winnings per game
  - Recent game history

#### Game History
- **As a player**, I want to view my past games with:
  - Game date
  - Host name
  - My buyins
  - My final amount
  - My net winnings
  - Other players (if visible based on their privacy)

---

### 7. Game Details Page

#### Public Game View
- **As any user**, I want to view a completed game's details:
  - Date and host
  - List of players
  - Buyins per player (public info)
  - Results per player (respecting privacy settings)
  - Total pot
  - Winner(s)

#### Live Game View (In Progress)
- Show current buyins
- Show who's playing
- Show payment status
- Host can update in real-time

---

### 8. Admin Features

#### Password Management
- Reset any user's password
- View reset in admin panel

#### User Management (Future)
- View all users
- Activate/deactivate accounts
- View user stats (override privacy for admin troubleshooting)

---

## Nice-to-Have Features (Future)

### Phase 2 Ideas
- **Game statistics**: Average pot size, most frequent players, etc.
- **Player head-to-head**: See your record against specific players
- **Venue tracking**: Track which dorm/location games are at
- **Buy-in presets**: Save common buyin amounts ($20, $50, $100)
- **Notifications**: Remind players about unpaid buyins
- **Game photos**: Upload a photo from the game
- **Trophy system**: Badges for achievements (biggest win, most games, etc.)

### Phase 3 Ideas
- **Venmo/payment integration**: Direct links for payment
- **Mobile app**: Native iOS/Android
- **Real-time updates**: WebSocket for live game updates
- **Advanced analytics**: Charts, trends over time

---

## Feature Priority (MVP)

### Must-Have (MVP)
1. ✅ User auth (register, login)
2. ✅ Create/join games
3. ✅ Record buyins with payment tracking
4. ✅ Record results
5. ✅ Leaderboard
6. ✅ Personal dashboard
7. ✅ Privacy settings
8. ✅ Admin password reset

### Should-Have (Post-MVP)
1. Game history filtering
2. Better mobile responsiveness
3. Email notifications for unpaid buyins
4. Profile pictures

### Could-Have (Future)
1. Advanced stats
2. Game photos
3. Trophy system
4. Payment integration
