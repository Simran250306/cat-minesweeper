// utils.js

/**
 * Creates the game board:
 *  - places `mines` number of bombs randomly,
 *  - computes adjacent‑mine counts,
 *  - returns both the board and a matching "revealed" matrix.
 *
 * @param {number} rows
 * @param {number} cols
 * @param {number} mines
 * @returns {{ board: (string|number)[][], revealStatus: boolean[][] }}
 */
export function createBoard(rows, cols, mines) {
    // 1) init empty board (0)
    const board = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => 0)
    );
  
    // 2) place mines
    let placed = 0;
    while (placed < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (board[r][c] !== '💣') {
        board[r][c] = '💣';
        placed++;
      }
    }
  
    // 3) calculate neighbor counts
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === '💣') continue;
  
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (
              nr >= 0 && nr < rows &&
              nc >= 0 && nc < cols &&
              board[nr][nc] === '💣'
            ) {
              count++;
            }
          }
        }
        // use empty string for zero so revealed empty cells look blank
        board[r][c] = count > 0 ? count : '';
      }
    }
  
    // 4) init revealStatus (all false)
    const revealStatus = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => false)
    );
  
    return { board, revealStatus };
  }
  
  
  /**
   * Reveals the cell at (row,col). If it's an empty cell (''), flood‑fills
   * to reveal all connected empty cells + their border numbers.
   *
   * @param {(string|number)[][]} board
   * @param {boolean[][]} revealed
   * @param {number} row
   * @param {number} col
   * @returns {boolean[][]} new revealed matrix
   */
  export function revealCells(board, revealed, row, col) {
    const rows = board.length;
    const cols = board[0].length;
    // deep clone the revealed matrix
    const newRevealed = revealed.map(r => [...r]);
  
    function dfs(r, c) {
      if (
        r < 0 || r >= rows ||
        c < 0 || c >= cols ||
        newRevealed[r][c]
      ) return;
  
      newRevealed[r][c] = true;
  
      // if this cell is empty (no adjacent mines), expand outward
      if (board[r][c] === '') {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) {
              dfs(r + dr, c + dc);
            }
          }
        }
      }
    }
  
    dfs(row, col);
    return newRevealed;
  }
  