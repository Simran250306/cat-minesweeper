import React, { useCallback, useEffect, useState } from 'react';
import Cell from './Cell';

const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

const Board = ({ rows, cols, mines, onGameEnd, setMinesLeft, onScoutReady }) => {
  const [board, setBoard] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [flagsUsed, setFlagsUsed] = useState(0);
  const [scoutUsed, setScoutUsed] = useState(false);

  useEffect(() => {
    const newBoard = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ hasMine: false, flagged: false, minesAround: 0 })));
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const column = Math.floor(Math.random() * cols);
      if (!newBoard[row][column].hasMine) { newBoard[row][column].hasMine = true; minesPlaced += 1; }
    }
    newBoard.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => {
      if (cell.hasMine) return;
      cell.minesAround = directions.reduce((count, [rowOffset, columnOffset]) => count + Number(newBoard[rowIndex + rowOffset]?.[columnIndex + columnOffset]?.hasMine ?? false), 0);
    }));
    setBoard(newBoard);
    setRevealed(Array.from({ length: rows }, () => Array(cols).fill(false)));
    setFlagsUsed(0); setScoutUsed(false); setMinesLeft(mines); setGameOver(false);
  }, [rows, cols, mines, setMinesLeft]);

  const revealEmptyCells = useCallback((row, column, nextRevealed) => {
    const tilesToCheck = [[row, column]];
    while (tilesToCheck.length) {
      const [currentRow, currentColumn] = tilesToCheck.pop();
      if (!board[currentRow]?.[currentColumn] || nextRevealed[currentRow][currentColumn] || board[currentRow][currentColumn].hasMine || board[currentRow][currentColumn].flagged) continue;
      nextRevealed[currentRow][currentColumn] = true;
      if (board[currentRow][currentColumn].minesAround === 0) directions.forEach(([rowOffset, columnOffset]) => tilesToCheck.push([currentRow + rowOffset, currentColumn + columnOffset]));
    }
  }, [board]);

  const checkForWin = useCallback((nextRevealed) => {
    const hasHiddenSafeTile = board.some((row, rowIndex) => row.some((cell, columnIndex) => !cell.hasMine && !nextRevealed[rowIndex][columnIndex]));
    if (!hasHiddenSafeTile) { setGameOver(true); onGameEnd('won'); }
  }, [board, onGameEnd]);

  const useScout = useCallback(() => {
    if (gameOver || scoutUsed || !board.length) return;
    const safeTiles = board.flatMap((row, rowIndex) => row.map((cell, columnIndex) => ({ cell, rowIndex, columnIndex }))).filter(({ cell, rowIndex, columnIndex }) => !cell.hasMine && !cell.flagged && !revealed[rowIndex][columnIndex]);
    if (!safeTiles.length) return;
    const tile = safeTiles[Math.floor(Math.random() * safeTiles.length)];
    const nextRevealed = revealed.map((row) => [...row]);
    if (tile.cell.minesAround === 0) revealEmptyCells(tile.rowIndex, tile.columnIndex, nextRevealed);
    else nextRevealed[tile.rowIndex][tile.columnIndex] = true;
    setRevealed(nextRevealed); setScoutUsed(true); checkForWin(nextRevealed);
  }, [board, checkForWin, gameOver, revealed, revealEmptyCells, scoutUsed]);

  useEffect(() => { onScoutReady(() => useScout); }, [onScoutReady, useScout]);

  const handleRightClick = (event, row, column) => {
    event.preventDefault();
    if (gameOver || revealed[row][column]) return;
    const nextBoard = board.map((boardRow) => boardRow.map((cell) => ({ ...cell })));
    const cell = nextBoard[row][column];
    if (cell.flagged) { cell.flagged = false; setFlagsUsed((previous) => previous - 1); setMinesLeft((previous) => previous + 1); }
    else if (flagsUsed < mines) { cell.flagged = true; setFlagsUsed((previous) => previous + 1); setMinesLeft((previous) => previous - 1); }
    setBoard(nextBoard);
  };

  const handleCellClick = (row, column) => {
    if (gameOver || board[row][column].flagged) return;
    const nextRevealed = revealed.map((revealedRow) => [...revealedRow]);

    if (revealed[row][column]) {
      if (board[row][column].minesAround === 0) return;
      const flaggedNeighbors = directions.reduce((count, [rowOffset, columnOffset]) => count + Number(board[row + rowOffset]?.[column + columnOffset]?.flagged ?? false), 0);
      if (flaggedNeighbors !== board[row][column].minesAround) return;

      let hitMine = false;
      directions.forEach(([rowOffset, columnOffset]) => {
        const neighborRow = row + rowOffset;
        const neighborColumn = column + columnOffset;
        const neighbor = board[neighborRow]?.[neighborColumn];
        if (!neighbor || neighbor.flagged || nextRevealed[neighborRow][neighborColumn]) return;
        if (neighbor.hasMine) { hitMine = true; return; }
        if (neighbor.minesAround === 0) revealEmptyCells(neighborRow, neighborColumn, nextRevealed);
        else nextRevealed[neighborRow][neighborColumn] = true;
      });

      if (hitMine) {
        board.forEach((boardRow, boardRowIndex) => boardRow.forEach((cell, columnIndex) => {
          if (cell.hasMine) nextRevealed[boardRowIndex][columnIndex] = true;
        }));
        setGameOver(true);
        onGameEnd('lost');
      } else {
        checkForWin(nextRevealed);
      }
      setRevealed(nextRevealed);
      return;
    }

    if (board[row][column].hasMine) {
      board.forEach((boardRow, boardRowIndex) => boardRow.forEach((cell, columnIndex) => {
        if (cell.hasMine) nextRevealed[boardRowIndex][columnIndex] = true;
      }));
      setRevealed(nextRevealed);
      setGameOver(true);
      onGameEnd('lost');
      return;
    }
    if (board[row][column].minesAround === 0) revealEmptyCells(row, column, nextRevealed); else nextRevealed[row][column] = true;
    setRevealed(nextRevealed); checkForWin(nextRevealed);
  };

  return <div className="board-frame"><div className="board-scroll"><div className="board" style={{ '--columns': cols, '--cell-size': `clamp(24px, calc((100vw - 72px) / ${cols}), 42px)` }}>{board.map((row, rowIndex) => row.map((cell, columnIndex) => <Cell key={`${rowIndex}-${columnIndex}`} value={cell.hasMine ? 'M' : cell.minesAround} hasMine={cell.hasMine} isRevealed={revealed[rowIndex][columnIndex]} isFlagged={cell.flagged} onClick={() => handleCellClick(rowIndex, columnIndex)} onRightClick={(event) => handleRightClick(event, rowIndex, columnIndex)} />))}</div></div></div>;
};

export default Board;
