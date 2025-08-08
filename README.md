## Tic Tac Toe (React + TypeScript)

A beautifully crafted Tic‑Tac‑Toe game you can play locally with a friend or against a smart computer opponent. It features a glassy dark UI, subtle animations, a scoreboard, winning‑line highlights, and multiple AI difficulties.

### Features
- **Polished UI**: Modern glassmorphism design, responsive layout, Inter/Poppins fonts.
- **Two Modes**: Two‑player local play or **Vs Computer**.
- **AI Difficulty**: Easy (random), Medium (win/block + heuristics), Impossible (unbeatable minimax).
- **Flexible Sides**: Choose whether the computer plays as X or O.
- **Scoreboard**: Tracks X wins, O wins, and draws across rounds.
- **Quality of Life**: Winning-line highlight, round reset, and new match.

### Quick Start
Prerequisites: Node.js 18+ recommended.

1) Install dependencies
```bash
npm install
```

2) Start the dev server
```bash
npm run dev
```
Then open `http://localhost:5173`.

3) Build for production
```bash
npm run build
```

4) Preview the production build
```bash
npm run preview
```

### How to Play
- **Two Players**: Choose “Two Players” mode. X and O take turns clicking cells.
- **Vs Computer**: Choose “Vs Computer” mode, select the **Computer** side (X or O) and **Difficulty**. The computer plays automatically with a short delay. Human clicks are disabled during the computer’s turn.
- **Reset Round**: Clears the board while keeping scores.
- **New Match**: Resets both the board and the scoreboard.

### Tech Stack
- **React 19** with **TypeScript**
- **Vite 7** for lightning-fast dev/build
- **ESLint** for code quality
- **CSS** with custom properties and responsive grid
- **Google Fonts**: Inter and Poppins

### Project Structure
```
CurserTest/
  index.html            # Document head + font imports
  src/
    main.tsx            # App bootstrap
    App.tsx             # Game UI, logic, AI
    index.css           # Global theme & layout
    App.css             # Minimal component styles
```

### Customization
- Tweak colors, shadows, and theme in `src/index.css` under the `:root` custom properties.
- Update text/labels in `src/App.tsx`.

### Scripts
- **dev**: Start the Vite dev server
- **build**: Type-check and build for production
- **preview**: Preview the production build
- **lint**: Run ESLint

Enjoy the game! 🎮
