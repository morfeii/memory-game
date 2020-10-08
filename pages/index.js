import React, { useState } from 'react';
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

let startGame = (state) => ({ status: Status.Running });

function GameView() {
  let [state, setState] = useState({ status: Status.Stopped });

  let { status } = state;

  let cellOpen = { symbol: 'A', status: Cell.Status.Open };
  let cellClosed1 = { symbol: 'B1', status: Cell.Status.Closed };
  let cellClosed2 = { symbol: 'B1', status: Cell.Status.Closed };
  let cellClosed3 = { symbol: 'B2', status: Cell.Status.Closed };
  let cellFailed = { symbol: 'C', status: Cell.Status.Failed };
  let cellDone = { symbol: 'D', status: Cell.Status.Done };

  let board = [cellOpen, cellClosed1, cellClosed2, cellClosed3, cellFailed, cellDone];

  function handleStartingClick(i) {
    if (status != Status.Running) {
      setState(startGame);
    }
  }

  return (
    <div onClick={handleStartingClick}>
      <ScreenBoxView status={status} board={board} />
    </div>
  );
}

function ScreenBoxView({ status, board }) {
  switch (status) {
    case Status.Running:
      return <Board.BoardView board={board} onClickAt={() => null} />;

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
