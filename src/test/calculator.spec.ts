import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { Calculator } from './calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    // Arrange: Initialize a new Calculator instance before each test
    calculator = new Calculator();
  });

  test.each([
    { description: 'should add two positive integers', a: 5, b: 3, expectedResult: 8 },
    { description: 'should add a positive and a negative integer', a: 5, b: -3, expectedResult: 2 },
    { description: 'should add two negative integers', a: -5, b: -3, expectedResult: -8 },
    { description: 'should add zero to a number', a: 5, b: 0, expectedResult: 5 },
    { description: 'should add a number to zero', a: 0, b: 5, expectedResult: 5 },
    { description: 'should add two decimal numbers with precision (0.1 + 0.2)', a: 0.1, b: 0.2, expectedResult: 0.3 },
    { description: 'should add numbers resulting in zero', a: 5, b: -5, expectedResult: 0 },
  ])('add: %s', ({ description, a, b, expectedResult }: { description: string; a: number; b: number; expectedResult: number }) => {
    // Act
    const result = calculator.add(a, b);

    // Assert
    if (expectedResult === 0) {
      expect(result).toBeCloseTo(0);
    } else if (Number.isInteger(expectedResult)) {
      expect(result).toBe(expectedResult);
    } else {
      expect(result).toBeCloseTo(expectedResult);
    }
  });

  test.each([
    { description: 'should subtract a positive number from a larger positive', a: 10, b: 4, expectedResult: 6 },
    { description: 'should subtract a positive number from a smaller positive', a: 4, b: 10, expectedResult: -6 },
    { description: 'should subtract a negative number from a positive', a: 5, b: -3, expectedResult: 8 },
    { description: 'should subtract a positive number from a negative', a: -5, b: 3, expectedResult: -8 },
    { description: 'should subtract zero from a number', a: 5, b: 0, expectedResult: 5 },
    { description: 'should subtract two identical numbers, resulting in zero', a: 7, b: 7, expectedResult: 0 },
    { description: 'should subtract two decimal numbers with precision', a: 0.3, b: 0.1, expectedResult: 0.2 },
  ])('subtract: %s', ({ description, a, b, expectedResult }: { description: string; a: number; b: number; expectedResult: number }) => {
    // Act
    const result = calculator.subtract(a, b);

    // Assert
    if (expectedResult === 0) {
      expect(result).toBeCloseTo(0);
    } else if (Number.isInteger(expectedResult)) {
      expect(result).toBe(expectedResult);
    } else {
      expect(result).toBeCloseTo(expectedResult);
    }
  });

  test.each([
    { description: 'should multiply two positive integers', a: 5, b: 3, expectedResult: 15 },
    { description: 'should multiply a positive by a negative integer', a: 5, b: -3, expectedResult: -15 },
    { description: 'should multiply two negative integers', a: -5, b: -3, expectedResult: 15 },
    { description: 'should multiply by zero (positive number)', a: 5, b: 0, expectedResult: 0 },
    { description: 'should multiply zero by a positive number', a: 0, b: 5, expectedResult: 0 },
    { description: 'should multiply by zero (negative number)', a: -5, b: 0, expectedResult: 0 },
    { description: 'should multiply two decimal numbers with precision', a: 0.1, b: 0.2, expectedResult: 0.02 },
  ])('multiply: %s', ({ description, a, b, expectedResult }: { description: string; a: number; b: number; expectedResult: number }) => {
    // Act
    const result = calculator.multiply(a, b);

    // Assert
    if (expectedResult === 0) {
      expect(result).toBeCloseTo(0);
    } else if (Number.isInteger(expectedResult)) {
      expect(result).toBe(expectedResult);
    } else {
      expect(result).toBeCloseTo(expectedResult);
    }
  });

  test.each([
    { description: 'should divide two positive integers', a: 10, b: 2, expectedResult: 5 },
    { description: 'should divide a positive by a negative integer', a: 10, b: -2, expectedResult: -5 },
    { description: 'should divide a negative by a positive integer', a: -10, b: 2, expectedResult: -5 },
    { description: 'should divide two negative integers', a: -10, b: -2, expectedResult: 5 },
    { description: 'should divide zero by a non-zero number, resulting in zero', a: 0, b: 5, expectedResult: 0 },
    { description: 'should divide with decimal result and precision (1/3)', a: 1, b: 3, expectedResult: 0.33333 },
    { description: 'should divide with decimal result and precision (10/3)', a: 10, b: 3, expectedResult: 3.33333 },
    { description: 'should divide with exact decimal result', a: 0.5, b: 2, expectedResult: 0.25 },
  ])('divide (non-zero divisor): %s', ({ description, a, b, expectedResult }: { description: string; a: number; b: number; expectedResult: number }) => {
    // Act
    const result = calculator.divide(a, b);

    // Assert
    expect(result).not.toBeNull(); // Ensure it's not null before checking value
    if (result !== null) { // Type guard
      if (expectedResult === 0) {
        expect(result).toBeCloseTo(0);
      } else if (Number.isInteger(expectedResult)) {
        expect(result).toBe(expectedResult);
      } else {
        expect(result).toBeCloseTo(expectedResult);
      }
    }
  });

  it('divide: should return null when dividing by zero', () => {
    // Arrange
    const a = 10;
    const b = 0; // Divisor is zero

    // Act
    const result = calculator.divide(a, b);

    // Assert
    expect(result).toBeNull();
  });
});