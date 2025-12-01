/**
 * Backtracking Pattern
 *
 * Summary: Explore all possibilities with pruning.
 * Use: Permutations, combinations, subsets, puzzles.
 */

// Generate all permutations
export function permutations<T>(arr: T[]): T[][] {
  const result: T[][] = [];

  function backtrack(current: T[], remaining: T[]): void {
    if (remaining.length === 0) {
      result.push([...current]);
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);
      const newRemaining = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
      backtrack(current, newRemaining);
      current.pop();
    }
  }

  backtrack([], arr);
  return result;
}

// Generate all combinations of size k
export function combinations<T>(arr: T[], k: number): T[][] {
  const result: T[][] = [];

  function backtrack(start: number, current: T[]): void {
    if (current.length === k) {
      result.push([...current]);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);
  return result;
}

// Generate all subsets
export function subsets<T>(arr: T[]): T[][] {
  const result: T[][] = [];

  function backtrack(start: number, current: T[]): void {
    result.push([...current]);

    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);
  return result;
}

// N-Queens Problem
export function solveNQueens(n: number): string[][] {
  const result: string[][] = [];
  const board: number[] = new Array(n).fill(-1); // board[row] = column

  function isValid(row: number, col: number): boolean {
    for (let prevRow = 0; prevRow < row; prevRow++) {
      const prevCol = board[prevRow];
      // Check column and diagonals
      if (prevCol === col || Math.abs(prevCol - col) === Math.abs(prevRow - row)) {
        return false;
      }
    }
    return true;
  }

  function backtrack(row: number): void {
    if (row === n) {
      const solution = board.map((col) => {
        return '.'.repeat(col) + 'Q' + '.'.repeat(n - col - 1);
      });
      result.push(solution);
      return;
    }

    for (let col = 0; col < n; col++) {
      if (isValid(row, col)) {
        board[row] = col;
        backtrack(row + 1);
        board[row] = -1;
      }
    }
  }

  backtrack(0);
  return result;
}

// Sudoku Solver
export function solveSudoku(board: string[][]): boolean {
  function isValid(row: number, col: number, num: string): boolean {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (board[row][c] === num) return false;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (board[r][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (board[r][c] === num) return false;
      }
    }

    return true;
  }

  function solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === '.') {
          for (let num = 1; num <= 9; num++) {
            const numStr = num.toString();
            if (isValid(row, col, numStr)) {
              board[row][col] = numStr;
              if (solve()) return true;
              board[row][col] = '.';
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  return solve();
}

// Word Search in Grid
export function wordSearch(board: string[][], word: string): boolean {
  const rows = board.length;
  const cols = board[0].length;
  const visited: boolean[][] = Array.from({ length: rows }, () =>
    new Array(cols).fill(false)
  );

  function backtrack(row: number, col: number, index: number): boolean {
    if (index === word.length) return true;

    if (
      row < 0 ||
      row >= rows ||
      col < 0 ||
      col >= cols ||
      visited[row][col] ||
      board[row][col] !== word[index]
    ) {
      return false;
    }

    visited[row][col] = true;

    const found =
      backtrack(row + 1, col, index + 1) ||
      backtrack(row - 1, col, index + 1) ||
      backtrack(row, col + 1, index + 1) ||
      backtrack(row, col - 1, index + 1);

    visited[row][col] = false;
    return found;
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (backtrack(row, col, 0)) return true;
    }
  }

  return false;
}

export function demo(): string {
  console.log('Backtracking Demo');
  console.log('=================');

  const arr = [1, 2, 3];
  console.log('Array:', arr);
  console.log('Permutations:', permutations(arr));
  console.log('Combinations (k=2):', combinations(arr, 2));
  console.log('Subsets:', subsets(arr));

  console.log('\nN-Queens (4x4):');
  const queens = solveNQueens(4);
  console.log(`Found ${queens.length} solutions`);
  if (queens.length > 0) {
    console.log('First solution:');
    queens[0].forEach((row) => console.log('  ' + row));
  }

  const board = [
    ['A', 'B', 'C', 'E'],
    ['S', 'F', 'C', 'S'],
    ['A', 'D', 'E', 'E'],
  ];
  console.log('\nWord search in grid:');
  console.log('  "ABCCED":', wordSearch(board, 'ABCCED'));
  console.log('  "SEE":', wordSearch(board, 'SEE'));
  console.log('  "ABCB":', wordSearch(board, 'ABCB'));

  return `Permutations of [1,2,3]: ${permutations(arr).length}`;
}
