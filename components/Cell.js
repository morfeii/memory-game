import React from 'react';

//LOGIC
export let Status = {
  Open: 'Open',
  Closed: 'Closed',
  Done: 'Done',
  Failed: 'Failed'
};

export let isOpen = (cell) => cell.status === Status.Open;
export let isClosed = (cell) => cell.status === Status.Closed;
export let isDone = (cell) => cell.status === Status.Done;
export let isFailed = (cell) => cell.status === Status.Failed;

//VIEW
export function View({ cell, onClick }) {
  let { status, symbol } = cell;

  return (
    <div className={`cell ${classByStatus(status)}`} onClick={onClick}>
      {status === Status.Closed ? '' : symbol}
    </div>
  );
}

export function classByStatus(status) {
  switch (status) {
    case Status.Failed: return 'failed';
    case Status.Done: return 'done';
    case Status.Open: return 'open';
    case Status.Closed: return 'closed';
  }
}
