# Cat Cafe Rescue

A cozy browser-based Minesweeper game with a cat cafe theme. Clear safe tables, flag the grumpy cats, and keep the cafe calm while you race to win each round.

## Overview

Cat Cafe Rescue is a React + Vite game inspired by classic Minesweeper. The player explores a board of tiles, reveals safe spaces, and uses flags to mark hidden cats. Each difficulty setting changes the board size and mine count, giving the game a progressively more chaotic cafe layout.

## Features

- Three difficulty modes:
  - Cozy Corner (8x8, 10 mines)
  - Busy Brunch (16x16, 40 mines)
  - Full House (16x30, 99 mines)
- Mouse-based tile interaction
  - Left click to reveal
  - Right click to flag
- One-time "Cat Scout" ability to reveal a random safe tile
- Win/lose game states with restart controls
- Responsive board layout and café-themed UI

## How to Play

1. Choose a room difficulty from the selector.
2. Reveal tiles to find safe spots.
3. Right-click tiles to mark suspected grumpy cats.
4. Use the Cat Scout button once per round to reveal a safe tile if you need help.
5. Clear all safe tiles to win the round.

## Tech Stack

- React
- Vite
- JavaScript
- CSS modules/stylesheets

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Project Structure

```bash
src/
  App.jsx
  main.jsx
  utils.js
  components/
    Board.jsx
    Cell.jsx
  styles/
    board.css
    cell.css
    theme.css
```

## Controls

- Left click: reveal a tile
- Right click: place/remove flag
- New game: reset the current board
- Cat Scout: reveal one random safe tile

## Notes

This project is a playful twist on Minesweeper and is intended as a lightweight front-end game demo. It is built entirely in the browser and does not require a backend.
