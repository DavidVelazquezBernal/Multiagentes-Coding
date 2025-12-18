import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest'
import { Calculator } from './calculator'

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  // 1. Tests for add method (happy path, decimals, zeros)
  test.each([
    { description: 'adds two positive numbers', a: 2, b: 3, expectedResult: 5 },
    { description: 'adds negative numbers', a: -2, b: -3, expectedResult: -5 },
    { description: 'adds a positive and a negative number', a: 5, b: -3, expectedResult: 2 },
    { description: 'adds a negative and a positive number', a: -5, b: 3, expectedResult: -2 },
    { description: 'adds zero to a positive number', a: 5, b: 0, expectedResult: 5 },
    { description: 'adds zero to a negative number', a: -5, b: 0, expectedResult: -5 },
    { description: 'adds two zeros', a: 0, b: 0, expectedResult: 0 },
    { description: 'adds decimal numbers (0.1 + 0.2)', a: 0.1, b: 0.2, expectedResult: 0.3 },
    { description: 'adds decimal numbers (0.3 - 0.1)', a: 0.3, b: -0.1, expectedResult: 0.2 },
    { description: 'adds large numbers', a: 1000000, b: 1, expectedResult: 1000001 },
    { description: 'adds small negative decimal numbers', a: -0, b: -0, expectedResult: -0 },
  ])('add: should correctly handle $description', ({ a, b, expectedResult }: { description: string; a: number; b: number; expectedResult: number }) => {
    // Arrange
    // Data is provided by the test.each dataset

    // Act
    const result = calculator.add(a, b);

    // Assert
    // Use toBe for exact integer results, toBeCloseTo for decimals given the 1e10 rounding precision.
    if (Number.isInteger(expectedResult) && Number.isInteger(a) && Number.isInteger(b)) {
      expect(result).toBe(expectedResult);
    } else {
      expect(result).toBeCloseTo(expectedResult);
    }
  });

  // 2. Tests for subtract method (happy path, decimals, zeros)
  test.each([
    { description: 'subtracts two positive numbers', a: 5, b: 3, expectedResult: 2 },
    { description: 'subtracts a larger positive from a smaller positive', a: 3, b: 5, expectedResult: -2 },
    { description: 'subtracts a negative number from a positive', a: 5, b: -3, expectedResult: 8 },
    { description: 'subtracts a positive number from a negative', a: -5, b: 3, expectedResult: -8 },
    { description: 'subtracts a negative number from a negative', a: -5, b: -3, expectedResult: -2 },
    { description: 'subtracts zero from a positive number', a: 5, b: 0, expectedResult: 5 },
    { description: 'subtracts zero from a negative number', a: -5, b: 0, expectedResult: -5 },
    { description: 'subtracts a positive number from zero', a: 0, b: 5, expectedResult: -5 },
    { description: 'subtracts two zeros', a: 0, b: 0, expectedResult: 0 },
    { description: 'subtracts decimal numbers (5.3 - 2.1)', a: 5.3, b: 2.1, expectedResult: 3.2 },
    { description: 'subtracts decimal numbers (0.1 - 0.2)', a: 0.1, b: 0.2, expectedResult: -0.1 },
    { description: 'subtracts large numbers', a: 1000000, b: 1, expectedResult: 999999 },
    { description: 'subtracts small negative decimal numbers', a: -0, b: 0, expectedResult: -0 },
  ])('subtract: should correctly handle $description', ({ a, b, expectedResult }: { description: string; a: number; b: number; expectedResult: number }) => {
    // Arrange
    // Data is provided by the test.each dataset

    // Act
    const result = calculator.subtract(a, b);

    // Assert
    // Use toBe for exact integer results, toBeCloseTo for decimals given the 1e10 rounding precision.
    if (Number.isInteger(expectedResult) && Number.isInteger(a) && Number.isInteger(b)) {
      expect(result).toBe(expectedResult);
    } else {
      expect(result).toBeCloseTo(expectedResult);
    }
  });

  // 3. Tests for multiply method (happy path, decimals, zeros)
  test.each([
    { description: 'multiplies two positive numbers', a: 2, b: 3, expectedResult: 6 },
    { description: 'multiplies two negative numbers', a: -2, b: -3, expectedResult: 6 },
    { description: 'multiplies a positive and a negative number', a: 5, b: -3, expectedResult: -15 },
    { description: 'multiplies by zero (first operand)', a: 0, b: 5, expectedResult: 0 },
    { description: 'multiplies by zero (second operand)', a: 5, b: 0, expectedResult: 0 },
    { description: 'multiplies by one', a: 7, b: 1, expectedResult: 7 },
    { description: 'multiplies decimals (2.5 * 4)', a: 2.5, b: 4, expectedResult: 10 },
    { description: 'multiplies decimals (0.1 * 0.3)', a: 0.1, b: 0.3, expectedResult: 0.03 },
    { description: 'multiplies decimals (0.001 * 0.001)', a: 0.001, b: 0.001, expectedResult: 0 },
    { description: 'multiplies large numbers', a: 1000000, b: 2, expectedResult: 2000000 },
  ])('multiply: should correctly handle $description', ({ a, b, expectedResult }: { description: string; a: number; b: number; expectedResult: number }) => {
    // Arrange
    // Data is provided by the test.each dataset

    // Act
    const result = calculator.multiply(a, b);

    // Assert
    // Use toBe for exact integer results, toBeCloseTo for decimals given the 1e10 rounding precision.
    if (Number.isInteger(expectedResult) && Number.isInteger(a) && Number.isInteger(b)) {
      expect(result).toBe(expectedResult);
    } else {
      expect(result).toBeCloseTo(expectedResult);
    }
  });

  // 4. Tests for divide method (happy path, decimals, zero dividend)
  test.each([
    { description: 'divides two positive numbers', a: 6, b: 3, expectedResult: 2 },
    { description: 'divides two negative numbers', a: -6, b: -3, expectedResult: 2 },
    { description: 'divides a positive by a negative number', a: 6, b: -3, expectedResult: -2 },
    { description: 'divides a negative by a positive number', a: -6, b: 3, expectedResult: -2 },
    { description: 'divides zero by a non-zero number', a: 0, b: 5, expectedResult: 0 },
    { description: 'divides by one', a: 7, b: 1, expectedResult: 7 },
    { description: 'divides by self', a: 5, b: 5, expectedResult: 1 },
    { description: 'divides decimals (10 / 3)', a: 10, b: 3, expectedResult: 3.33333 }, // Example from problem statement
    { description: 'divides decimals (0.5 / 0.2)', a: 0.5, b: 0.2, expectedResult: 2.5 },
    { description: 'divides decimals with small results', a: 0.0001, b: 100, expectedResult: 0 },
  ])('divide: should correctly handle $description', ({ a, b, expectedResult }: { description: string; a: number; b: number; expectedResult: number }) => {
    // Arrange
    // Data is provided by the test.each dataset

    // Act
    const result = calculator.divide(a, b);

    // Assert
    // `divide` returns `number | null`, here we expect a number.
    expect(result).not.toBeNull();
    if (Number.isInteger(expectedResult) && Number.isInteger(a) && Number.isInteger(b)) {
      expect(result).toBe(expectedResult);
    } else {
      expect(result).toBeCloseTo(expectedResult);
    }
  });

  // 5. Tests for divide method (division by zero)
  it('divide: should return null when dividing by zero', () => {
    // Arrange
    const a = 10;
    const b = 0;

    // Act
    const result = calculator.divide(a, b);

    // Assert
    expect(result).toBeNull();
  });

  // 6. Tests for all methods throwing error on invalid input (non-number arguments)
  test.each([
    { description: 'add with first argument not a number', method: 'add', a: '10' as any, b: 5, errorMessage: 'Invalid input: Both arguments must be numbers.' },
    { description: 'add with second argument not a number', method: 'add', a: 10, b: '5' as any, errorMessage: 'Invalid input: Both arguments must be numbers.' },
    { description: 'subtract with first argument not a number', method: 'subtract', a: null as any, b: 5, errorMessage: 'Invalid input: Both arguments must be numbers.' },
    { description: 'subtract with second argument not a number', method: 'subtract', a: 10, b: undefined as any, errorMessage: 'Invalid input: Both arguments must be numbers.' },
    { description: 'multiply with first argument not a number', method: 'multiply', a: {} as any, b: 5, errorMessage: 'Invalid input: Both arguments must be numbers.' },
    { description: 'multiply with second argument not a number', method: 'multiply', a: 10, b: [] as any, errorMessage: 'Invalid input: Both arguments must be numbers.' },
    { description: 'divide with first argument not a number', method: 'divide', a: 'abc' as any, b: 5, errorMessage: 'Invalid input: Both arguments must be numbers.' },
    { description: 'divide with second argument not a number', method: 'divide', a: 10, b: 'def' as any, errorMessage: 'Invalid input: Both arguments must be numbers.' },
  ])('should throw error for invalid input on %s method', ({ method, a, b, errorMessage }) => {
    // Arrange
    // Data is provided by the test.each dataset

    // Act & Assert
    // Dynamically call the method and assert that it throws an error
    expect(() => (calculator[method as keyof Calculator] as Function)(a, b)).toThrow(errorMessage);
  });
});