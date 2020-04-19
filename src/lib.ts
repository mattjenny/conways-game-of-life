import { BoardState, Cell } from "./types";

// Custom mod function since % operator doesn't work for negatives
// https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
function mod(n: number, modulo: number) {
  return ((n % modulo) + modulo) % modulo;
}

function getNeighborCount(state: BoardState, row: number, column: number) {
  const rowAbove = mod(( row - 1 ), state.cells.length); // rows wrap
  const rowBelow = mod(( row + 1 ), state.cells.length);
  const cellLeft = mod(( column - 1 ), state.cells[0].length);
  const cellRight = mod(( column + 1 ), state.cells[0].length);
  
  let count = 0;
  for (const rowIdx of [rowAbove, row, rowBelow]) {
    for (const colIdx of [cellLeft, column, cellRight]) {
      if (rowIdx === row && colIdx === column) {
        continue;
      }
      const cell = state.cells[rowIdx][colIdx];
      if (cell.alive) {
        count += 1;
      }
    }
  }

  return count;
}

function getNextCellState(state: BoardState, row: number, column: number): Cell {
  const neighbors = getNeighborCount(state, row, column);
  const cell = state.cells[row][column];
  if (cell.alive) {
    if (neighbors === 2 || neighbors === 3) {
      // survival
      return { alive: true };
    } else {
      // death
      return { alive: false };
    }
  } else if (neighbors === 3) {
    // birth
    return { alive: true };
  }
  // remains empty
  return { alive: false };
}

export function getNextGeneration(state: BoardState): BoardState {
  const rowCount = state.cells.length;
  const columnCount = state.cells[0].length;
  const nextCells: Cell[][] = new Array<Cell[]>(rowCount);
  state.cells.forEach((row, rowIdx) => {
    const newRow = new Array<Cell>(columnCount);
    row.forEach((_column, columnIdx) => {
      newRow[columnIdx] = getNextCellState(state, rowIdx, columnIdx);
    });
    nextCells[rowIdx] = newRow;
  });
  return { cells: nextCells };
}

export function getRandomState(rows: number, columns: number) {
  const cells: Cell[][] = new Array(rows);
  for (let i = 0; i < rows; i++) {
    const row: Cell[] = new Array(columns);
    for (let j = 0; j < columns; j++) {
      const alive = Math.random() > 1;
      row[j] = { alive };
    }
    cells[i] = row;
  }
  return { cells };
}
