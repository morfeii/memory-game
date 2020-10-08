import React from 'react';
import * as Cell from '../components/Cell';
import * as Board from '../components/Board';

export default function Layout() {
  let cellOpen = { symbol: 'A', status: Cell.Status.Open };
  let cellClosed1 = { symbol: 'B1', status: Cell.Status.Closed };
  let cellClosed2 = { symbol: 'B1', status: Cell.Status.Closed };
  let cellClosed3 = { symbol: 'B2', status: Cell.Status.Closed };
  let cellFailed = { symbol: 'C', status: Cell.Status.Failed };
  let cellDone = { symbol: 'D', status: Cell.Status.Done };

  let board = [cellOpen, cellClosed1, cellClosed2, cellClosed3, cellFailed, cellDone];

  return (
    <div>
      <Board.View board={board} onClickAt={() => null} />
    </div>
  );
}
