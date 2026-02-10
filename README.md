# LetterChain

A fast-paced word game where you create chains of words in Spanish. Each word must start with the last two letters of the previous word. How long can you keep the chain going?

## 🎮 How to Play

1. **Start with a word** - You'll be given an initial Spanish word
2. **Continue the chain** - Type a word that starts with the last two letters of the previous word
3. **Race against time** - You have 60 seconds to build the longest chain possible
4. **Score points** - Longer words and longer chains earn more points

### Scoring System

- **Base points**: 10 points per valid word
- **Length bonus**: +2 points for each character over 3 letters
- **Chain bonus**: +5 points for each consecutive word in your chain
- **Speed bonus**: Bonus points for playing quickly in the first half of the game

## 🚀 Features

- **Real-time gameplay** with 60-second timer
- **Spanish dictionary validation** - only valid Spanish words are accepted
- **Leaderboard system** to compete with other players
- **Responsive design** - works on desktop and mobile devices
- **Dark/Light theme** support
- **Score tracking** with detailed statistics

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Radix UI primitives
- **State Management**: React hooks, SWR for data fetching

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd letter-chain
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase credentials in `.env.local`

4. Run the development server:

   ```bash
   pnpm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🗄️ Database Setup

The app uses Supabase for backend services. You'll need to:

1. Create a new Supabase project
2. Set up the following tables:
   - `game_sessions` - stores individual game sessions
   - `leaderboard` - stores high scores and player rankings
3. Configure environment variables with your Supabase URL and anon key

## 📂 Project Structure

```
letter-chain/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── game/          # Game-related endpoints
│   │   └── leaderboard/  # Leaderboard endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── game/              # Game-specific components
│   └── ui/                # Reusable UI components (shadcn/ui)
├── lib/
│   ├── dictionary/        # Word dictionaries
│   ├── game/              # Game logic and types
│   ├── supabase/          # Database client setup
│   └── utils.ts           # Utility functions
├── hooks/                 # Custom React hooks
└── public/                # Static assets
```

## 🎯 Game Components

- **GameBoard**: Main game interface with different states
- **Timer**: Countdown timer display
- **WordInput**: Input field with validation
- **ScoreDisplay**: Real-time score and statistics
- **Leaderboard**: High scores display
- **WordHistory**: Visual representation of your word chain

## 🧩 Game Logic

The game uses a unique "last two letters" mechanic where each word must start with the final two letters of the previous word, making it more challenging than traditional word chain games. The scoring algorithm rewards:

- Longer words (encouraging vocabulary expansion)
- Longer chains (rewarding continuity)
- Quick thinking (speed bonus in early game)

## 🔧 Development

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Fix linting issues
- `pnpm run format` - Format code with Prettier
- `pnpm run format:check` - Check code formatting

### Code Quality

The project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

## 🌐 Deployment

This app is designed to be deployed on Vercel (recommended for Next.js apps) or any platform that supports Node.js.

## 📱 Mobile Support

The game is fully responsive and works great on mobile devices. Touch controls are optimized for the best mobile gaming experience.

## 🏆 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎮 Play Now

Ready to test your Spanish vocabulary skills? Start building your word chain and see how high you can score!

Made with ❤️ using Next.js and Tailwind CSS
