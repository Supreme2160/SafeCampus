# Safety Quiz Challenge Game

An interactive quiz game designed to test students' knowledge of emergency preparedness and disaster safety protocols.

## Features

### 🎯 Multiple Quiz Categories
- **Earthquake Safety Quiz** - 5 questions about earthquake preparedness
- **Flood Safety Basics** - 5 questions about flood response
- **Fire Safety Knowledge** - 5 questions about fire prevention and evacuation

### ⏱️ Timed Challenge
- 30 seconds per question
- Countdown timer with visual alerts when time is running low
- Auto-advance if time runs out

### 📊 Instant Feedback
- Immediate visual feedback on correct/incorrect answers
- Color-coded answer options (green for correct, red for incorrect)
- Explanations for educational value
- Grade-based results (A+, A, B, C, D)

### 🎮 Game Mechanics
- **Score System**: +10 points for correct answers
- **Progress Tracking**: Visual progress bar shows completion
- **Result Statistics**: Detailed breakdown of performance
- **Score Persistence**: Saves scores to database via API

## File Structure

```
quiz/
├── page.tsx                    # Main game component with state management
├── types.ts                    # TypeScript interfaces
├── components/
│   ├── QuizMenuScreen.tsx     # Quiz selection screen
│   ├── QuizGameScreen.tsx     # Active quiz gameplay screen
│   └── QuizResultsScreen.tsx  # Final results and scoring screen
└── README.md                   # This file
```

## How It Works

1. **Menu Screen**: Players select from available quizzes
2. **Game Screen**: Players answer timed multiple-choice questions
3. **Results Screen**: Shows final score, grade, and performance breakdown

## Database Integration

The quiz data is seeded in `prisma/seed.ts` with the following themes:
- EARTHQUAKE
- FLOOD
- FOREST_FIRE
- TSUNAMI
- VOLCANO

Game scores are saved via the `/api/games/save-score` endpoint with:
- Game name based on quiz theme
- Game type: QUIZ
- Final score

## Usage

Navigate to `/games/quiz` to access the quiz game. Players can:
- Choose any available quiz
- Answer questions within the time limit
- Review their performance
- Retry quizzes to improve scores
- Return to menu to select different quizzes

## Technologies

- **Next.js 14** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Prisma** - Database ORM
- **React Hooks** - State management (useState, useEffect, useRef)

## Future Enhancements

- [ ] Fetch quiz data from database instead of hardcoded
- [ ] Add difficulty levels
- [ ] Implement leaderboards
- [ ] Add more quiz categories
- [ ] Include images/videos in questions
- [ ] Add hint system
- [ ] Implement streak bonuses
