/**
 * Fibonacci Sequence
 *
 * Summary: DP/memoization yields O(n) time vs exponential recursion.
 * Time: O(n), Space: O(1) if iterative; O(n) with memo recursion stack.
 */

// Naive recursive (exponential time - for demonstration)
export function fibNaive(n: number): number {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// Memoized recursive
export function fibMemo(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;

  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

// Iterative (bottom-up DP) - O(n) time, O(1) space
export function fibIterative(n: number): number {
  if (n <= 1) return n;

  let prev2 = 0;
  let prev1 = 1;

  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// Matrix exponentiation - O(log n) time
export function fibMatrix(n: number): number {
  if (n <= 1) return n;

  type Matrix = [[number, number], [number, number]];

  const multiply = (a: Matrix, b: Matrix): Matrix => {
    return [
      [
        a[0][0] * b[0][0] + a[0][1] * b[1][0],
        a[0][0] * b[0][1] + a[0][1] * b[1][1],
      ],
      [
        a[1][0] * b[0][0] + a[1][1] * b[1][0],
        a[1][0] * b[0][1] + a[1][1] * b[1][1],
      ],
    ];
  };

  const matrixPow = (m: Matrix, power: number): Matrix => {
    if (power === 1) return m;

    if (power % 2 === 0) {
      const half = matrixPow(m, power / 2);
      return multiply(half, half);
    } else {
      return multiply(m, matrixPow(m, power - 1));
    }
  };

  const base: Matrix = [
    [1, 1],
    [1, 0],
  ];

  const result = matrixPow(base, n);
  return result[0][1];
}

// Generate first n Fibonacci numbers
export function fibSequence(n: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [0];

  const sequence = [0, 1];
  for (let i = 2; i < n; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
  return sequence;
}

// Check if a number is Fibonacci
export function isFibonacci(n: number): boolean {
  // A number is Fibonacci if one of (5*n^2 + 4) or (5*n^2 - 4) is a perfect square
  const isPerfectSquare = (x: number) => {
    const sqrt = Math.sqrt(x);
    return sqrt === Math.floor(sqrt);
  };

  return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4);
}

export function demo(): string {
  console.log('Fibonacci Demo');
  console.log('==============');

  console.log('First 15 Fibonacci numbers:', fibSequence(15));
  console.log('fib(10) iterative:', fibIterative(10));
  console.log('fib(10) matrix:', fibMatrix(10));
  console.log('fib(40) matrix:', fibMatrix(40));
  console.log('Is 21 Fibonacci?', isFibonacci(21));
  console.log('Is 22 Fibonacci?', isFibonacci(22));

  return `fib(10) = ${fibIterative(10)}`;
}
