# Game Score Database Integration

## Overview
Added functionality to automatically save game scores to the database when students complete games.

## Changes Made

### 1. API Endpoint Created
**File:** `/app/api/games/save-score/route.ts`

- **POST** endpoint that accepts game completion data
- **Parameters:**
  - `gameName`: Name of the game (string)
  - `gameType`: Type/category of game (string)
  - `score`: Final score achieved (number)

- **Functionality:**
  - Validates user authentication (must be signed in)
  - Retrieves student record from session
  - Creates `GameScore` entry in database
  - Increments student's `gamesPlayed` counter
  - Returns success/error response

### 2. Backpack Hero Game Integration
**File:** `/app/games/backpack-hero/page.tsx`

- Added `saveGameScore()` function
- Calls API when game finishes (after completing all 5 scenarios)
- Saves with:
  - `gameName: "BACKPACK_HERO"`
  - `gameType: "ADVENTURE"`
  - Final score from all scenarios

### 3. Earthquake Escape Game Integration
**File:** `/app/games/earthquake/page.tsx`

- Added `saveGameScore()` function
- Calls API when all 3 levels are completed (victory)
- Saves with:
  - `gameName: "EARTHQUAKE_ESCAPE"`
  - `gameType: "ADVENTURE"`
  - Final score including level completion bonus

### 4. CPR Rhythm Master Game Integration
**File:** `/app/games/cpr-rhythm/page.tsx`

- Added `saveGameScore()` function with duplicate prevention
- Calls API when 30 compressions are completed
- Saves with:
  - `gameName: "CPR_RHYTHM_MASTER"`
  - `gameType: "RHYTHM"`
  - Final score based on accuracy
- Uses `useCallback` for optimization
- Includes `scoreSubmittedRef` to prevent duplicate submissions

## Database Schema
The `GameScore` table stores:
- `id`: Auto-generated ID
- `studentId`: Reference to student who played
- `score`: Final score achieved
- `gameName`: Name of the game
- `gameType`: Category of the game
- `playedAt`: Timestamp of when game was completed

## Testing
To test the integration:

1. Sign in as a student (e.g., `student1@safecampus.test`)
2. Play any of the three games to completion:
   - **Backpack Hero**: Complete all 5 disaster scenarios
   - **Earthquake Escape**: Reach safe zones in all 3 levels
   - **CPR Rhythm Master**: Successfully complete 30 compressions
3. Check the student dashboard - `gamesPlayed` count should increment
4. Verify database entries in the `GameScore` table

## Benefits
- ✅ Automatic score tracking
- ✅ Player progress monitoring
- ✅ Dashboard statistics automatically updated
- ✅ Historical game performance data
- ✅ No manual intervention required

## Next Steps (Optional)
- Add leaderboard functionality using GameScore data
- Display recent scores on student dashboard
- Show average score trends
- Add achievements based on score thresholds
- Export game score reports for teachers/admins
