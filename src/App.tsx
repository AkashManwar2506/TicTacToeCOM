import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Player = 'X' | 'O'
type CellValue = Player | null
type Winner = Player | 'Draw' | null
type GameMode = 'Human' | 'CPU'
type AiDifficulty = 'Easy' | 'Medium' | 'Impossible'

const winningLines: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

function calculateWinner(board: CellValue[]): { winner: Winner; line: number[] | null } {
  for (const line of winningLines) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line }
    }
  }
  if (board.every((c) => c !== null)) return { winner: 'Draw', line: null }
  return { winner: null, line: null }
}

export default function App() {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState<boolean>(true)
  const [scores, setScores] = useState<{ X: number; O: number; Draws: number }>({ X: 0, O: 0, Draws: 0 })
  const [gameMode, setGameMode] = useState<GameMode>('CPU')
  const [aiDifficulty, setAiDifficulty] = useState<AiDifficulty>('Medium')
  const [aiPlaysAs, setAiPlaysAs] = useState<Player>('O')

  const { winner, line } = useMemo(() => calculateWinner(board), [board])

  const currentPlayer: Player = isXNext ? 'X' : 'O'
  const canPlay = winner === null
  const isAiTurn = gameMode === 'CPU' && currentPlayer === aiPlaysAs && canPlay
  const canHumanClick = canPlay && (!isAiTurn)

  function handleCellClick(index: number) {
    if (!canHumanClick || board[index]) return
    const next = board.slice()
    next[index] = currentPlayer
    setBoard(next)
    setIsXNext((x) => !x)
  }

  function resetBoard() {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
  }

  function newMatch() {
    resetBoard()
    setScores({ X: 0, O: 0, Draws: 0 })
  }

  // Update scores when game ends
  useEffect(() => {
    if (winner === 'X') setScores((s) => ({ ...s, X: s.X + 1 }))
    else if (winner === 'O') setScores((s) => ({ ...s, O: s.O + 1 }))
    else if (winner === 'Draw') setScores((s) => ({ ...s, Draws: s.Draws + 1 }))
  }, [winner])

  // AI logic
  function computeAIMoveEasy(b: CellValue[], _ai: Player): number {
    const open = b.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1)
    if (open.length === 0) return -1
    const r = Math.floor(Math.random() * open.length)
    return open[r]
  }

  function computeAIMoveMedium(b: CellValue[], ai: Player): number {
    const open = b.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1)
    if (open.length === 0) return -1
    const opponent: Player = ai === 'X' ? 'O' : 'X'
    // Win if possible
    for (const i of open) {
      const t = b.slice()
      t[i] = ai
      if (calculateWinner(t).winner === ai) return i
    }
    // Block opponent win
    for (const i of open) {
      const t = b.slice()
      t[i] = opponent
      if (calculateWinner(t).winner === opponent) return i
    }
    // Prefer center
    if (open.includes(4)) return 4
    // Prefer corners
    const corners = open.filter((i) => [0, 2, 6, 8].includes(i))
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)]
    // Else random
    return open[Math.floor(Math.random() * open.length)]
  }

  function minimax(b: CellValue[], current: Player, ai: Player): { score: number; move: number } {
    const res = calculateWinner(b)
    if (res.winner) {
      if (res.winner === 'Draw') return { score: 0, move: -1 }
      return { score: res.winner === ai ? 1 : -1, move: -1 }
    }
    const opponent: Player = current === 'X' ? 'O' : 'X'
    let bestScore = current === ai ? -Infinity : Infinity
    let bestMove = -1
    for (let i = 0; i < 9; i++) {
      if (b[i] !== null) continue
      const next = b.slice()
      next[i] = current
      const { score } = minimax(next, opponent, ai)
      if (current === ai) {
        if (score > bestScore) {
          bestScore = score
          bestMove = i
        }
      } else {
        if (score < bestScore) {
          bestScore = score
          bestMove = i
        }
      }
    }
    return { score: bestScore, move: bestMove }
  }

  function computeAIMoveImpossible(b: CellValue[], ai: Player): number {
    // If empty board, pick a corner for speed without deep recursion
    if (b.every((c) => c === null)) return 0
    return minimax(b, ai, ai).move
  }

  function computeAIMove(b: CellValue[], ai: Player, difficulty: AiDifficulty): number {
    switch (difficulty) {
      case 'Easy':
        return computeAIMoveEasy(b, ai)
      case 'Medium':
        return computeAIMoveMedium(b, ai)
      case 'Impossible':
        return computeAIMoveImpossible(b, ai)
    }
  }

  // Trigger AI move when it's AI's turn
  useEffect(() => {
    if (!isAiTurn) return
    const id = setTimeout(() => {
      const move = computeAIMove(board, aiPlaysAs, aiDifficulty)
      if (move !== -1 && board[move] === null) {
        const next = board.slice()
        next[move] = aiPlaysAs
        setBoard(next)
        setIsXNext((x) => !x)
      }
    }, 450)
    return () => clearTimeout(id)
  }, [isAiTurn, board, aiPlaysAs, aiDifficulty])

  const statusValue = winner
    ? winner === 'Draw'
      ? 'It’s a draw!'
      : `${winner} wins!`
    : gameMode === 'CPU' && currentPlayer === aiPlaysAs
      ? `Computer is thinking…`
      : `${currentPlayer} to play`

  return (
    <div className="app-shell">
      <header className="header card-panel">
        <div className="brand">
          <div className="brand-badge">TTT</div>
          <div className="title">
            <h1>Tic Tac Toe</h1>
            <span>Play locally or vs computer with smart AI.</span>
          </div>
        </div>
        <div className="controls">
          <div className="pill">Current: <strong>{currentPlayer}</strong></div>
          <div className="pill">
            <label htmlFor="mode-select" style={{ marginRight: 8, color: 'var(--muted)', fontSize: 12 }}>Mode</label>
            <select
              id="mode-select"
              value={gameMode}
              onChange={(e) => { setGameMode(e.target.value as GameMode); resetBoard() }}
            >
              <option value="Human">Two Players</option>
              <option value="CPU">Vs Computer</option>
            </select>
          </div>
          {gameMode === 'CPU' && (
            <>
              <div className="pill">
                <label htmlFor="ai-side" style={{ marginRight: 8, color: 'var(--muted)', fontSize: 12 }}>Computer</label>
                <select
                  id="ai-side"
                  value={aiPlaysAs}
                  onChange={(e) => { setAiPlaysAs(e.target.value as Player); resetBoard() }}
                >
                  <option value="X">Plays as X</option>
                  <option value="O">Plays as O</option>
                </select>
              </div>
              <div className="pill">
                <label htmlFor="ai-difficulty" style={{ marginRight: 8, color: 'var(--muted)', fontSize: 12 }}>Difficulty</label>
                <select
                  id="ai-difficulty"
                  value={aiDifficulty}
                  onChange={(e) => { setAiDifficulty(e.target.value as AiDifficulty); resetBoard() }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Impossible">Impossible</option>
                </select>
              </div>
            </>
          )}
          <button className="btn" onClick={resetBoard}>Reset Round</button>
        </div>
      </header>

      <div className="game-container">
        <section className="board-panel card-panel">
          <div className="board">
            {board.map((cell, idx) => {
              const isWinningCell = line?.includes(idx)
              return (
                <button
                  key={idx}
                  className={`cell ${!canHumanClick || cell ? 'disabled' : ''} ${isWinningCell ? 'win' : ''}`}
                  aria-label={`Cell ${idx + 1}`}
                  onClick={() => handleCellClick(idx)}
                >
                  {cell}
                </button>
              )
            })}
          </div>
        </section>

        <aside className="side-panel card-panel">
          <div className="scoreboard">
            <div className="score">
              <h3>Player X</h3>
              <strong>{scores.X}</strong>
            </div>
            <div className="score">
              <h3>Draws</h3>
              <strong>{scores.Draws}</strong>
            </div>
            <div className="score">
              <h3>Player O</h3>
              <strong>{scores.O}</strong>
            </div>
          </div>

          <div className="status">
            <div className="label">Status</div>
            <div className="value">{statusValue}</div>
          </div>

          <div className="actions">
            <button className="action-secondary" onClick={resetBoard}>Play Again</button>
            <button className="btn" onClick={newMatch}>New Match</button>
          </div>

          <div className="footer">
            {gameMode === 'Human' ? 'Play locally: take turns tapping the board.' : 'You vs Computer. Change difficulty or side anytime.'}
          </div>
        </aside>
      </div>
    </div>
  )
}
