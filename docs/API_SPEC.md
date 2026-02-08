# API Specification

REST API endpoints for Connaught Poker. All endpoints return JSON.

## Authentication

### Auth Flow
- Login returns JWT token
- Token included in `Authorization: Bearer <token>` header for protected routes
- Token contains userId and isAdmin flag

---

## Endpoints

### Authentication

#### `POST /api/auth/login`
Login with username and password.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "string (JWT)",
  "user": {
    "id": "string",
    "username": "string",
    "displayName": "string",
    "isAdmin": "boolean"
  }
}
```

#### `POST /api/auth/register`
Create new user account.

**Request:**
```json
{
  "username": "string",
  "password": "string",
  "displayName": "string"
}
```

**Response (201):**
```json
{
  "token": "string (JWT)",
  "user": {
    "id": "string",
    "username": "string",
    "displayName": "string"
  }
}
```

#### `POST /api/auth/reset-password` 🔒 Admin Only
Admin can reset any user's password.

**Request:**
```json
{
  "userId": "string",
  "newPassword": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### Users

#### `GET /api/users` 🔒
Get all users (for game creation dropdowns).

**Response (200):**
```json
{
  "users": [
    {
      "id": "string",
      "username": "string",
      "displayName": "string"
    }
  ]
}
```

#### `GET /api/users/:userId`
Get user profile (respects privacy settings).

**Response (200):**
```json
{
  "id": "string",
  "username": "string",
  "displayName": "string",
  "totalWinnings": "number | null (if privacy hidden)",
  "gamesPlayed": "number | null",
  "gameHistory": "array | null (if privacy hidden)"
}
```

#### `GET /api/users/me` 🔒
Get current user's full profile.

**Response (200):**
```json
{
  "id": "string",
  "username": "string",
  "displayName": "string",
  "totalWinnings": "number",
  "gamesPlayed": "number",
  "showTotalWinnings": "boolean",
  "showGameHistory": "boolean",
  "showIndividualResults": "boolean"
}
```

#### `PATCH /api/users/me` 🔒
Update current user's profile and privacy settings.

**Request:**
```json
{
  "displayName": "string (optional)",
  "showTotalWinnings": "boolean (optional)",
  "showGameHistory": "boolean (optional)",
  "showIndividualResults": "boolean (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": { /* updated user object */ }
}
```

---

### Games

#### `POST /api/games` 🔒
Create a new game.

**Request:**
```json
{
  "gameDate": "ISO 8601 datetime",
  "playerIds": "string[] (optional, initial players)",
  "generateJoinCode": "boolean (default: true)",
  "notes": "string (optional)"
}
```

**Response (201):**
```json
{
  "id": "string",
  "gameDate": "datetime",
  "hostId": "string",
  "joinCode": "string (if generated)",
  "status": "UPCOMING"
}
```

#### `GET /api/games`
Get all games (with filters).

**Query params:**
- `status`: Filter by status (UPCOMING, IN_PROGRESS, COMPLETED, CANCELLED)
- `userId`: Filter games where user participated
- `limit`: Pagination limit (default 50)
- `offset`: Pagination offset

**Response (200):**
```json
{
  "games": [
    {
      "id": "string",
      "gameDate": "datetime",
      "host": {
        "id": "string",
        "displayName": "string"
      },
      "status": "string",
      "playerCount": "number",
      "totalPot": "number"
    }
  ],
  "total": "number"
}
```

#### `GET /api/games/:gameId`
Get game details.

**Response (200):**
```json
{
  "id": "string",
  "gameDate": "datetime",
  "host": { "id": "string", "displayName": "string" },
  "status": "string",
  "joinCode": "string (if exists)",
  "notes": "string",
  "buyins": [
    {
      "id": "string",
      "user": { "id": "string", "displayName": "string" },
      "amount": "number",
      "paidStatus": "string",
      "timestamp": "datetime"
    }
  ],
  "results": [
    {
      "user": { "id": "string", "displayName": "string" },
      "finalAmount": "number",
      "netWinnings": "number"
    }
  ]
}
```

#### `POST /api/games/:gameId/join` 🔒
Join a game using join code.

**Request:**
```json
{
  "joinCode": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Joined game successfully"
}
```

#### `PATCH /api/games/:gameId` 🔒 Host Only
Update game details.

**Request:**
```json
{
  "gameDate": "datetime (optional)",
  "status": "string (optional)",
  "notes": "string (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "game": { /* updated game object */ }
}
```

---

### Buyins

#### `POST /api/buyins` 🔒
Record a buyin for a game.

**Permissions:**
- Game host can add for any player
- Player can add for themselves only

**Request:**
```json
{
  "gameId": "string",
  "userId": "string",
  "amount": "number",
  "paidStatus": "UNPAID | PAID | PENDING (default: UNPAID)"
}
```

**Response (201):**
```json
{
  "id": "string",
  "gameId": "string",
  "userId": "string",
  "amount": "number",
  "paidStatus": "string",
  "timestamp": "datetime",
  "enteredBy": "string"
}
```

#### `PATCH /api/buyins/:buyinId` 🔒 Host Only
Update buyin (typically payment status).

**Request:**
```json
{
  "paidStatus": "UNPAID | PAID | PENDING",
  "amount": "number (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "buyin": { /* updated buyin object */ }
}
```

#### `GET /api/games/:gameId/buyins`
Get all buyins for a game.

**Response (200):**
```json
{
  "buyins": [
    {
      "id": "string",
      "user": { "id": "string", "displayName": "string" },
      "amount": "number",
      "paidStatus": "string",
      "timestamp": "datetime"
    }
  ]
}
```

---

### Game Results

#### `POST /api/results` 🔒
Record game result.

**Permissions:**
- Game host can add for any player
- Player can add for themselves only

**Request:**
```json
{
  "gameId": "string",
  "userId": "string",
  "finalAmount": "number"
}
```

**Response (201):**
```json
{
  "id": "string",
  "gameId": "string",
  "userId": "string",
  "finalAmount": "number",
  "netWinnings": "number (auto-calculated)",
  "timestamp": "datetime"
}
```

**Note:** Backend auto-calculates `netWinnings` by subtracting total buyins for that user in that game.

#### `PATCH /api/results/:resultId` 🔒
Update game result.

**Permissions:** Same as POST (host or self)

**Request:**
```json
{
  "finalAmount": "number"
}
```

**Response (200):**
```json
{
  "success": true,
  "result": { /* updated result object */ }
}
```

---

### Leaderboard

#### `GET /api/leaderboard`
Get leaderboard of players by total winnings.

**Query params:**
- `limit`: Number of players (default 20)
- `showAll`: Include players with hidden winnings (default false)

**Response (200):**
```json
{
  "leaderboard": [
    {
      "rank": "number",
      "user": {
        "id": "string",
        "displayName": "string"
      },
      "totalWinnings": "number",
      "gamesPlayed": "number"
    }
  ]
}
```

**Note:** Only includes users with `showTotalWinnings: true`

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE (optional)"
}
```

Common status codes:
- `400`: Bad request (validation error)
- `401`: Unauthorized (not logged in)
- `403`: Forbidden (insufficient permissions)
- `404`: Resource not found
- `500`: Internal server error

---

## Notes

- 🔒 = Requires authentication
- **Host Only** = Only game host can perform action
- **Admin Only** = Only admin users can perform action
- All datetime fields use ISO 8601 format
- All monetary amounts are in dollars (Float)
