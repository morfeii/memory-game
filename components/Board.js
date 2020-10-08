import * as R from 'rambda';
import React from 'react';
import * as Cell from './Cell';

// LOGIC
// let cell1 = ...
// let board = [cell1, cell2, ..., celln];

// VIEW
export function BoardView({ board, onClickAt }) {
  return (
    <div className="board">
      {board.map((cell, i) => (
        <Cell.View key={i} cell={cell} onClick={(_) => onClickAt(i)} />
      ))}
    </div>
  );
}

export function ScreenView({ className, children }) {
  return <div className={`screen ${className}`}>{children}</div>;
}
