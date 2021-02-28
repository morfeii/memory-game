import * as R from 'rambda';
import * as L from '../lib';
import React from 'react';
import * as Cell from './Cell';

// LOGIC
// let cell1 = ...
// let board = [cell1, cell2, ..., celln];

export const getStatusAt = R.curry((i, board) => {
  return R.view(R.lensPath(`${i}.status`), board);
});

export const setStatusAt = R.curry((i, status, board) => {
  return R.set(R.lensPath(`${i}.status`), status, board);
});

export const setStatusesBy = R.curry((predFn, status, board) => {
  return R.map((cell) => (predFn(cell) ? { ...cell, status } : cell), board);
});

export const getStatusesBy = R.curry((predFn, board) => {
  // flatMap
  return R.chain((cell) => (predFn(cell) ? [cell.status] : []), board);
});

export const getSymbolsBy = R.curry((predFn, board) => {
  // let passedSymbols = R.filter(predFn, board)
  // return R.map(cell => cell.symbol, passedSymbols)  ---> R.pluck("symbol", passedSymbols)

  return R.chain((cell) => (predFn(cell) ? [cell.symbol] : []), board);
});

export const canOpenAt = R.curry((i, board) => {
  return (
    // eslint-disable-next-line prettier/prettier
    i < board.length 
      && Cell.isClosed(board[i]) 
      && getStatusesBy(Cell.isBlocking, board).length < 2
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

let charCodeA = 'A'.charCodeAt(0);

export const makeRandom = (m, n) => {
  if ((m * n) / 2 > 26) throw new Error('too big');
  if ((m * n) % 2) throw new Error('must be even');

  // ['A', 'B', 'A', 'B', 'C', 'C']

  // ['A', 'B', 'C']
  // ['A', 'A', 'B', 'B', 'C', 'C']
  // [{symbol: 'A', status: 'closed'}, ...]

  return R.pipe(
    () => R.range(0, (m * n) / 2), // ['A', 'B', 'C']
    R.map((i) => String.fromCharCode(i + charCodeA)),
    R.chain((x) => [x, x]),
    L.shuffle,
    R.map((symbol) => ({ symbol, status: Cell.Status.Closed }))
  )();
};

// VIEW
export function BoardView({ board, onClickAt }) {
  return (
    <div className="board">
      {board.map((cell, i) => (
        <Cell.View key={i} cell={cell} onClick={() => onClickAt(i)} />
      ))}
    </div>
  );
}

export function ScreenView({ className, children }) {
  return <div className={`screen ${className}`}>{children}</div>;
}
