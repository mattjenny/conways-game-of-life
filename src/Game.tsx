import isEqual from 'lodash.isequal';
import * as React from 'react';
import { BoardState, Cell } from './types';
import { getRandomState, getNextGeneration, getOscillatorState } from './lib';
import { Board } from './Board';

type Props = {
  rows?: number;
  columns?: number;
  oscillatorExample?: boolean;
};

export const Game: React.FC<Props> = (props: Props) => {
  const [ playInterval, setPlayInterval ] = React.useState<number | undefined>(undefined);
  const [ ticks, setTicks ] = React.useState(0);
  const [ numRows, setNumRows ] = React.useState(props.oscillatorExample ? 3 : props.rows || 10);
  const [ numColumns, setNumColumns ] = React.useState(props.oscillatorExample ? 7 : props.columns || 12);
  const [ initialState, setInitialState ] = React.useState<BoardState>(
    props.oscillatorExample ? getOscillatorState() : getRandomState(numRows, numColumns)
  );
  const [ boardState, setBoardState ] = React.useState<BoardState>(initialState);

  // Use a ref to access the current count value in
  // an async callback.
  const ticksRef = React.useRef(ticks);
  const boardStateRef = React.useRef(boardState);
  ticksRef.current = ticks;
  boardStateRef.current = boardState;

  function play() {
    tick();
    setPlayInterval(window.setInterval(() => {
      tick();
    }, 300));
  }

  function pause() {
    if (playInterval) {
      clearInterval(playInterval);
      setPlayInterval(undefined);
    }
  }

  function reset() {
    pause();
    setTicks(0);
    setBoardState(initialState);
  }

  function tick() {
    const nextBoardState = getNextGeneration(boardStateRef.current);
    if (isEqual(boardStateRef.current, nextBoardState)) {
      pause();
      return;
    }
    setTicks(ticksRef.current + 1);
    setBoardState(getNextGeneration(boardStateRef.current));
  }

  function updateInitialState(rows: number, columns: number) {
    const updatedInitialState = getRandomState(rows, columns);
    setInitialState(updatedInitialState);
    setBoardState(updatedInitialState);
  }

  function onRowsChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const updatedNumRows = parseInt(e.currentTarget.value);
    setNumRows(updatedNumRows);
    updateInitialState(updatedNumRows, numColumns);
  }

  function onColumnsChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const updatedNumColumns = parseInt(e.currentTarget.value);
    setNumColumns(updatedNumColumns);
    updateInitialState(numRows, updatedNumColumns);
  }

  function onCellClick(row: number, column: number) {
    const cells: Cell[][] = new Array(initialState.cells.length);
    initialState.cells.forEach((r, rowIdx) => {
      const newRow: Cell[] = new Array(initialState.cells[0].length);
      r.forEach((c, colIdx) => {
        const prevCell = initialState.cells[rowIdx][colIdx];
        if (row === rowIdx && column === colIdx) {
          newRow[colIdx] = { alive: !prevCell.alive }
        } else {
          newRow[colIdx] = prevCell;
        }
      });
      cells[rowIdx] = newRow;
    });
    const updatedInitialState = { cells };
    setInitialState(updatedInitialState);
    setBoardState(updatedInitialState);
  }
  
  return (
    <div className="conway-app">
      <div className="controls">
        <button onClick={reset}>Reset</button>
        <button onClick={tick}>Tick</button>
        <button onClick={play}>Play</button>
        <button onClick={pause}>Pause</button>
        <div className="controls-right">
          <div className="control-num-input">
            <label>Rows:</label>
            <input type="number" onChange={onRowsChanged} value={numRows} />
          </div>
          <div className="control-num-input">
            <label>Columns:</label>
            <input type="number" onChange={onColumnsChanged} value={numColumns} />
          </div>
        </div>
      </div>
      <div className="conway-ticks">
        <label>Ticks:</label> {ticks}
      </div>
      <Board
        boardState={boardState}
        onCellClick={ticks === 0 ? onCellClick : undefined}
      />
      <p>
        Based on the Game of Life simulation by Dr. John Conway (<a href="https://web.stanford.edu/class/sts145/Library/life.pdf">https://web.stanford.edu/class/sts145/Library/life.pdf</a>). RIP, Dr. Conway ❤️
      </p>
    </div>
  );
}
