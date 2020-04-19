import classNames from 'classnames';
import * as React from 'react';
import { Cell } from './types';

type Props = {
  row: number;
  column: number;
  cell: Cell;
  onClick: ((row: number, column: number) => void) | undefined;
};

export const BoardCell: React.FC<Props> = (props: Props) => {
  function handleClick() {
    if (props.onClick) {
      props.onClick(props.row, props.column);
    }
  }

  return (
    <div
      className={classNames("board-cell", {
        alive: props.cell.alive,
        dead: !props.cell.alive,
        clickable: !!props.onClick
      })}
      onClick={handleClick}
    />
  );
}
