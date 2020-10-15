import * as R from 'rambda';
import React, { useEffect, useState } from 'react';
import * as Cell from '../components/Cell';
import * as Board from '../components/Board';

export default function Layout() {
  return <GameView />;
}

// LOGIC
let Status = {
  Stopped: 'Stopped',
  Running: 'Running',
  Won: 'Won',
  Lost: 'Lost'
};

let initialBoard = [
  { symbol: 'A', status: Cell.Status.Closed },
  { symbol: 'A', status: Cell.Status.Closed },
  { symbol: 'B', status: Cell.Status.Closed },
  { symbol: 'B', status: Cell.Status.Closed },
  { symbol: 'C', status: Cell.Status.Closed },
  { symbol: 'C', status: Cell.Status.Closed }
];

const startGame = (state) => ({
  board: initialBoard,
  status: Status.Running
});

const openCell = R.curry((i, state) => ({
  ...state,
  board: Board.setStatusAt(i, Cell.Status.Open, state.board)
}));

const succeedStep = (state) => ({
  ...state,
  board: Board.setStatusesBy(Cell.isOpen, Cell.Status.Done, state.board)
});

const failStep1 = (state) => ({
  ...state,
  board: Board.setStatusesBy(Cell.isOpen, Cell.Status.Failed, state.board)
});

const failStep2 = (state) => ({
  ...state,
  board: Board.setStatusesBy(Cell.isFailed, Cell.Status.Closed, state.board)
});

function GameView() {
  let [state, setState] = useState({
    board: initialBoard,
    status: Status.Stopped
  });

  let { board, status } = state;

  function handleStartingClick(i) {
    if (status != Status.Running) {
      setState(startGame);
    }
  }

  function handleRunningClick(i) {
    if (status === Status.Running) {
      setState(openCell(i));
    }
  }

  useEffect(
    (_) => {
      if (Board.areOpensEquel(board)) {
        setState(succeedStep);
      } else if (Board.areOpensDifferent(board)) {
        setState(failStep1);
        setTimeout((_) => {
          setState(failStep2);
        }, 500);
      }
    },
    [board]
  );

  return (
    <div onClick={handleStartingClick}>
      <ScreenBoxView status={status} board={board} onClickAt={handleRunningClick} />
    </div>
  );
}

function ScreenBoxView({ status, board, onClickAt }) {
  switch (status) {
    case Status.Running:
      return <Board.BoardView board={board} onClickAt={onClickAt} />;

    case Status.Stopped:
      return (
        <Board.ScreenView className="gray">
          <div style={{ textAlign: 'center' }}>
            <h1>Memory Game</h1>
            <p>Click anywhere to start!</p>
          </div>
        </Board.ScreenView>
      );

    case Status.Won:
      return (
        <Board.ScreenView className="green">
          <div style={{ textAlign: 'center' }}>
            <h1>Victory!</h1>
            <p>Click anywhere to try again!</p>
          </div>
        </Board.ScreenView>
      );

    case Status.Lost:
      return (
        <Board.ScreenView className="red">
          <div style={{ textAlign: 'center' }}>
            <h1>Defeat!</h1>
            <p>Click anywhere to try again!</p>
          </div>
        </Board.ScreenView>
      );
  }
}
