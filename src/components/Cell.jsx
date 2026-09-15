import React from 'react';

const Cell = ({ value, isRevealed, isFlagged, onClick, onRightClick, hasMine }) => {
  const display = isFlagged && !isRevealed ? '⚑' : isRevealed && hasMine ? '🐈' : isRevealed ? value || '' : '';
  const valueClass = isRevealed && !hasMine && value ? `value-${value}` : '';
  return <button type="button" className={`cell ${isRevealed ? 'revealed' : ''} ${isFlagged ? 'flagged' : ''} ${hasMine && isRevealed ? 'mine' : ''} ${valueClass}`} onClick={onClick} onContextMenu={onRightClick} aria-label={isRevealed ? (hasMine ? 'Grumpy cat' : `${value} cats nearby`) : isFlagged ? 'Marked as a grumpy cat' : 'Hidden table'}>{display}</button>;
};

export default Cell;
