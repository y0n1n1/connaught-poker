# Database Schema

## Overview
PostgreSQL database with 4 main tables to track users, games, buyins, and results.

## Tables

### `users`
Stores player accounts and privacy preferences.

```prisma
model User {
  id                String    @id @default(cuid())
  username          String    @unique
  passwordHash      String
  displayName       String
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  isAdmin           Boolean   @default(false)

  // Privacy settings
  showTotalWinnings Boolean   @default(true)
  showGameHistory   Boolean   @default(true)
  showIndividualResults Boolean @default(true)

  // Relations
  hostedGames       Game[]    @relation("GameHost")
  buyins            Buyin[]
  gameResults       GameResult[]
}
```

**Notes:**
- `isAdmin`: Special flag for you to have password reset + admin capabilities
- Privacy toggles default to public (true) but users can hide their stats
- `displayName`: What shows on leaderboards/profiles (can differ from username)

---

### `games`
Stores individual poker game sessions.

```prisma
model Game {
  id              String    @id @default(cuid())
  createdAt       DateTime  @default(now())
  gameDate        DateTime  // When the game was/will be played
  hostId          String
  host            User      @relation("GameHost", fields: [hostId], references: [id])
  status          GameStatus @default(UPCOMING)
  joinCode        String?   @unique // For shareable join links
  notes           String?   // Optional notes about the game

  // Relations
  buyins          Buyin[]
  gameResults     GameResult[]
}

enum GameStatus {
  UPCOMING    // Game scheduled but not started
  IN_PROGRESS // Currently being played
  COMPLETED   // Game finished, results entered
  CANCELLED   // Game was cancelled
}
```

**Notes:**
- `joinCode`: Generated UUID/short code for join links
- `gameDate`: Separate from `createdAt` so hosts can schedule future games
- `status`: Tracks game lifecycle

---

### `buyins`
Tracks individual buyin transactions (players can buyin multiple times per game).

```prisma
model Buyin {
  id              String    @id @default(cuid())
  gameId          String
  game            Game      @relation(fields: [gameId], references: [id], onDelete: Cascade)
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  amount          Float     // Buyin amount in dollars
  paidStatus      PaymentStatus @default(UNPAID)
  timestamp       DateTime  @default(now())
  enteredBy       String    // userId of who entered this record (host or self)

  @@index([gameId, userId])
}

enum PaymentStatus {
  UNPAID      // Player owes money
  PAID        // Player has paid
  PENDING     // Payment sent but not confirmed
}
```

**Notes:**
- Allows multiple buyins per player per game (rebuys)
- `enteredBy`: Tracks who entered the data for accountability
- `paidStatus`: Critical for Filipo to track who owes money
- Cascade delete: If game is deleted, all buyins are deleted

---

### `game_results`
Final results for each player in each game (net winnings/losses).

```prisma
model GameResult {
  id              String    @id @default(cuid())
  gameId          String
  game            Game      @relation(fields: [gameId], references: [id], onDelete: Cascade)
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  finalAmount     Float     // Final chip count in dollars
  netWinnings     Float     // finalAmount - totalBuyins for this game
  timestamp       DateTime  @default(now())
  enteredBy       String    // userId of who entered this record

  @@unique([gameId, userId]) // Each player can only have one result per game
  @@index([userId])
}
```

**Notes:**
- One result per player per game (enforced by unique constraint)
- `netWinnings`: Calculated field but stored for query performance
- `finalAmount`: What they cashed out with
- Example: Player buyins $100 total, cashes out $150, netWinnings = +$50

---

## Relationships

```
User (1) ----< (many) Game [as host]
User (1) ----< (many) Buyin
User (1) ----< (many) GameResult

Game (1) ----< (many) Buyin
Game (1) ----< (many) GameResult
```

---

## Indexes
- `buyins`: Index on `(gameId, userId)` for fast lookups of player buyins per game
- `game_results`: Index on `userId` for fast user stats queries

---

## Calculated Views / Queries

### User Total Winnings
```sql
SELECT userId, SUM(netWinnings) as totalWinnings
FROM game_results
GROUP BY userId
ORDER BY totalWinnings DESC
```

### Game Summary
For a given game, calculate:
- Total pot (sum of all buyins)
- Player count (distinct users in buyins)
- Payment status summary (count of unpaid buyins)

---

## Migration Strategy
1. Initial schema creation with Prisma
2. Seed admin user (you) with `isAdmin: true`
3. Seed ~20 user accounts for testing
4. Add sample games for development
