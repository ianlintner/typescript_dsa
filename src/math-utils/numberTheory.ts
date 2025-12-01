/**
 * Number Theory Utilities
 *
 * Common mathematical algorithms for competitive programming.
 */

// Greatest Common Divisor (Euclidean algorithm)
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

// Least Common Multiple
export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

// Extended Euclidean Algorithm: returns [gcd, x, y] where ax + by = gcd
export function extendedGcd(a: number, b: number): [number, number, number] {
  if (b === 0) {
    return [a, 1, 0];
  }
  const [g, x1, y1] = extendedGcd(b, a % b);
  const x = y1;
  const y = x1 - Math.floor(a / b) * y1;
  return [g, x, y];
}

// Modular inverse: a^(-1) mod m (exists if gcd(a, m) = 1)
export function modInverse(a: number, m: number): number | null {
  const [g, x] = extendedGcd(a, m);
  if (g !== 1) return null;
  return ((x % m) + m) % m;
}

// Modular exponentiation: (base^exp) mod m
export function modPow(base: number, exp: number, m: number): number {
  let result = 1;
  base = base % m;

  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % m;
    }
    exp = Math.floor(exp / 2);
    base = (base * base) % m;
  }

  return result;
}

// Sieve of Eratosthenes: find all primes up to n
export function sieve(n: number): number[] {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;

  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }

  const primes: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i);
  }

  return primes;
}

// Check if number is prime
export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }

  return true;
}

// Prime factorization
export function primeFactors(n: number): Map<number, number> {
  const factors = new Map<number, number>();

  // Handle 2 separately
  while (n % 2 === 0) {
    factors.set(2, (factors.get(2) || 0) + 1);
    n = Math.floor(n / 2);
  }

  // Check odd factors
  for (let i = 3; i * i <= n; i += 2) {
    while (n % i === 0) {
      factors.set(i, (factors.get(i) || 0) + 1);
      n = Math.floor(n / i);
    }
  }

  // If n is still greater than 1, it's a prime factor
  if (n > 1) {
    factors.set(n, (factors.get(n) || 0) + 1);
  }

  return factors;
}

// Count divisors
export function countDivisors(n: number): number {
  let count = 0;
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      count++;
      if (i !== n / i) count++;
    }
  }
  return count;
}

// Sum of divisors
export function sumDivisors(n: number): number {
  let sum = 0;
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      sum += i;
      if (i !== n / i) sum += n / i;
    }
  }
  return sum;
}

// Euler's totient function: count numbers up to n that are coprime with n
export function eulerTotient(n: number): number {
  let result = n;

  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      while (n % i === 0) {
        n = Math.floor(n / i);
      }
      result -= Math.floor(result / i);
    }
  }

  if (n > 1) {
    result -= Math.floor(result / n);
  }

  return result;
}

// Binomial coefficient C(n, k)
export function binomial(n: number, k: number): number {
  if (k > n || k < 0) return 0;
  if (k === 0 || k === n) return 1;

  k = Math.min(k, n - k); // Optimization
  let result = 1;

  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1);
  }

  return Math.round(result);
}

// Modular binomial coefficient
export function binomialMod(n: number, k: number, m: number): number {
  if (k > n || k < 0) return 0;
  if (k === 0 || k === n) return 1;

  // Precompute factorials and inverse factorials
  const fact = new Array(n + 1);
  const invFact = new Array(n + 1);
  fact[0] = 1;

  for (let i = 1; i <= n; i++) {
    fact[i] = (fact[i - 1] * i) % m;
  }

  invFact[n] = modPow(fact[n], m - 2, m);
  for (let i = n - 1; i >= 0; i--) {
    invFact[i] = (invFact[i + 1] * (i + 1)) % m;
  }

  return (((fact[n] * invFact[k]) % m) * invFact[n - k]) % m;
}

// Fibonacci using matrix exponentiation
export function fibonacciMod(n: number, m: number): number {
  if (n <= 1) return n;

  type Matrix = number[][];

  const multiply = (a: Matrix, b: Matrix): Matrix => {
    return [
      [
        ((a[0][0] * b[0][0]) % m + (a[0][1] * b[1][0]) % m) % m,
        ((a[0][0] * b[0][1]) % m + (a[0][1] * b[1][1]) % m) % m,
      ],
      [
        ((a[1][0] * b[0][0]) % m + (a[1][1] * b[1][0]) % m) % m,
        ((a[1][0] * b[0][1]) % m + (a[1][1] * b[1][1]) % m) % m,
      ],
    ];
  };

  const matrixPow = (mat: Matrix, power: number): Matrix => {
    let result: Matrix = [
      [1, 0],
      [0, 1],
    ];
    let base = mat;

    while (power > 0) {
      if (power % 2 === 1) {
        result = multiply(result, base);
      }
      base = multiply(base, base);
      power = Math.floor(power / 2);
    }

    return result;
  };

  const base: Matrix = [
    [1, 1],
    [1, 0],
  ];

  const result = matrixPow(base, n);
  return result[0][1];
}

// Check if number is a perfect square
export function isPerfectSquare(n: number): boolean {
  if (n < 0) return false;
  const sqrt = Math.sqrt(n);
  return sqrt === Math.floor(sqrt);
}

// Integer square root
export function intSqrt(n: number): number {
  if (n < 0) throw new Error('Cannot compute square root of negative number');
  if (n === 0) return 0;

  let x = n;
  let y = Math.floor((x + 1) / 2);

  while (y < x) {
    x = y;
    y = Math.floor((x + Math.floor(n / x)) / 2);
  }

  return x;
}

export function demo(): string {
  console.log('Number Theory Demo');
  console.log('==================');

  console.log('GCD(48, 18):', gcd(48, 18));
  console.log('LCM(48, 18):', lcm(48, 18));
  console.log('Extended GCD(35, 15):', extendedGcd(35, 15));

  console.log('\nModular arithmetic:');
  console.log('Mod inverse of 3 mod 11:', modInverse(3, 11));
  console.log('2^10 mod 1000:', modPow(2, 10, 1000));

  console.log('\nPrimes:');
  console.log('Primes up to 30:', sieve(30));
  console.log('Is 97 prime:', isPrime(97));
  console.log('Prime factors of 84:', Object.fromEntries(primeFactors(84)));

  console.log('\nDivisors:');
  console.log('Count divisors of 36:', countDivisors(36));
  console.log('Sum divisors of 36:', sumDivisors(36));

  console.log('\nEuler totient of 12:', eulerTotient(12));
  console.log('C(10, 3):', binomial(10, 3));

  console.log('\nFibonacci(50) mod 10^9+7:', fibonacciMod(50, 1000000007));

  return `GCD(48, 18) = ${gcd(48, 18)}`;
}
