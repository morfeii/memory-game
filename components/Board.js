import * as R from 'rambda';
import * as L from '../lib';
import React from 'react';
import * as Cell from './Cell';

// LOGIC
// let cell1 = ...
// let board = [cell1, cell2, ..., celln];

export const getStatusAt = R.curry((i, board) => {
  return R.set(R.lensPath(`${i}.status`), board);
});

export const setStatusAt = R.curry((i, status, board) => {
  return R.set(R.lensPath(`${i}.status`), status, board);
});

export const setStatusesBy = R.curry((predFn, status, board) => {
  return R.map((cell) => (predFn(cell) ? { ...cell, status } : cell), board);
});

export const getStatusesBy = R.curry((predFn, board) => {
  return R.chain((cell) => (predFn(cell) ? [cell.status] : []), board);
});

export const getSymbolsBy = R.curry((predFn, board) => {
  // let passedSymbols = R.filter(predFn, board)
  // return R.map(cell => cell.symbol, passedSymbols)  ---> R.pluck("symbol", passedSymbols)

  return R.chain((cell) => (predFn(cell) ? [cell.symbol] : []), board);
});

export const canOpenAt = R.curry((i, board) => {
  return (
    i < board.length && Cell.isClosed(board(i)) && getStatusesBy(Cell.isBlocking, board).length < 2
  );
});

export const areOpensEquel = (board) => {
  const openSymbols = getSymbolsBy(Cell.isOpen, board);

  return openSymbols.length >= 2 && L.allEquals(openSymbols);
};

export const areOpensDifferent = (board) => {
  const openSymbols = getSymbolsBy(Cell.isOpen, board);

  return openSymbols.length >= 2 && !L.allEquals(openSymbols);
};

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
