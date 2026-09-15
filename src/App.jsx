import React, { useState } from 'react';
import Board from './components/Board';
import './styles/board.css';
import './styles/theme.css';
import './styles/cell.css';

const difficultySettings = {
  beginner: { rows: 8, cols: 8, mines: 10, label: 'Cozy Corner' },
  intermediate: { rows: 16, cols: 16, mines: 40, label: 'Busy Brunch' },
  expert: { rows: 16, cols: 30, mines: 99, label: 'Full House' }
};

const App = () => {
  const [gameKey, setGameKey] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [minesLeft, setMinesLeft] = useState(10);
  const [difficulty, setDifficulty] = useState('beginner');
  const [scout, setScout] = useState(() => () => {});
  const { rows, cols, mines } = difficultySettings[difficulty];

  const handleRestart = () => {
    setGameKey((previous) => previous + 1);
    setGameStatus('playing');
    setMinesLeft(mines);
  };

  const handleDifficultyChange = (event) => {
    const nextDifficulty = event.target.value;
    setDifficulty(nextDifficulty);
    setGameKey((previous) => previous + 1);
    setGameStatus('playing');
    setMinesLeft(difficultySettings[nextDifficulty].mines);
  };

  return (
    <main className="app-container">
      <section className="game-shell" aria-label="Cat Cafe Rescue Minesweeper">
        <header className="game-header">
          <div>
            <p className="eyebrow">CAT CAFE RESCUE</p>
            <h1 className="title">Find the cozy spots.</h1>
            <p className="subtitle">Clear safe tiles, mark the grumpy cats, and keep the cafe calm.</p>
          </div>
          <div className="cat-mark" aria-hidden="true">🐾</div>
        </header>

        <div className="control-bar">
          <label className="difficulty-selector" htmlFor="difficulty">
            <span>Room</span>
            <select id="difficulty" value={difficulty} onChange={handleDifficultyChange}>
              {Object.entries(difficultySettings).map(([value, setting]) => (
                <option key={value} value={value}>{setting.label}</option>
              ))}
            </select>
          </label>
          <div className="stat-card"><span className="stat-label">Cats to mark</span><strong>{String(minesLeft).padStart(2, '0')}</strong></div>
          <button type="button" className="scout-btn" onClick={scout} disabled={gameStatus !== 'playing'}><span aria-hidden="true">✦</span>Cat Scout</button>
          <button type="button" onClick={handleRestart} className="restart-btn" aria-label="Start a new game">↻ New game</button>
        </div>

        <div className="board-heading"><span>{rows} × {cols} table</span><span>Click to check · Right-click to mark</span></div>
        <Board key={gameKey} rows={rows} cols={cols} mines={mines} onGameEnd={setGameStatus} setMinesLeft={setMinesLeft} onScoutReady={setScout} />

        <footer className="game-footer">
          <span className="legend"><i className="safe-dot" /> clear table</span>
          <span className="legend"><i className="cat-dot" /> grumpy cat</span>
          <span className="scout-note">Cat Scout reveals one safe tile per game.</span>
        </footer>
        {gameStatus !== 'playing' && <div className={`result ${gameStatus}`} role="status"><span>{gameStatus === 'won' ? '☕' : '🐈'}</span>{gameStatus === 'won' ? 'Cafe saved — every cozy spot is clear!' : 'A grumpy cat claimed this table.'}</div>}
      </section>
    </main>
  );
};

export default App;
