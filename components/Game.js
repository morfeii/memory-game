import * as R from 'rambda';
import React, { useEffect, useState } from 'react';
import * as Cell from './Cell';
import * as Board from './Board';

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

const startGame = () => ({
  board: initialBoard,
  secondLeft: 60,
  status: Status.Running
});

// (i) => (state)
const openCell = R.curry((i, state) => ({
  ...state,
  board: Board.setStatusAt(i, Cell.Status.Open, state.board)
}));

const canOpenCell = R.curry((i, state) => {
  return Board.canOpenAt(i, state.board);
});

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

let hasWinningCond = (state) => {
  return R.filter(Cell.isDone, state.board).length === state.board.length;
};

let hasLosingCond = (state) => !state.secondLeft;

const setStatus = R.curry((status, state) => ({ ...state, status }));

// VIEW
export function View() {
  let [state, setState] = useState({
    ...startGame(),
    status: Status.Stopped
  });

  let { board, status, secondLeft } = state;

  function handleStartingClick() {
    if (status != Status.Running) {
      setState(startGame);
    }
  }

  function handleRunningClick(i) {
    if (status === Status.Running && canOpenCell(i, state)) {
      setState(openCell(i));
    }
  }

  // WIN/LOSE LOGIC
  useEffect(
    (_) => {
      if (status === Status.Running) {
        if (hasWinningCond(state)) {
          console.log('win!!!');
          return setState(setStatus(Status.Won));
        } else if (hasLosingCond(state)) {
          return setState(setStatus(Status.Lost));
        }
      }
    },
    [state]
  );

  useEffect(() => {
    if (Board.areOpensEquel(board)) {
      setState(succeedStep);
    } else if (Board.areOpensDifferent(board)) {
      setState(failStep1);
      setTimeout((_) => {
        setState(failStep2);
      }, 500);
    }
  }, [board]);

  return (
    <div onClick={handleStartingClick}>
      <StatusLineView status={status} secondLeft={secondLeft} />
      <ScreenBoxView status={status} board={board} onClickAt={handleRunningClick} />
    </div>
  );
}

function StatusLineView({ status, secondLeft }) {
  return (
    <div className="status-line">
      <div>{status == Status.Running ? ':)' : 'Lets go!'}</div>
      <div className="timer">{status == Status.Running && `Second  left: ${secondLeft}`}</div>
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
