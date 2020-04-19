import * as React from 'react';
import { BoardState } from './types';
import { BoardCell } from './BoardCell';

type Props = {
  boardState: BoardState;
  onCellClick: ((row: number, column: number) => void) | undefined;
};

export const Board: React.FC<Props> = (props: Props) => {
  return (
    <div className="conway-board">
      {props.boardState.cells.map((row, rowIdx) => (
        <div key={`row-${rowIdx}`} className="board-row">
          {row.map((cell, cellIdx) => (
            <BoardCell
              row={rowIdx}
              column={cellIdx}
              key={`row-${rowIdx}-cell-${cellIdx}`}
              cell={cell}
              onClick={props.onCellClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
