import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { Calculator } from './clase_calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    // Arrange
    calculator = new Calculator();
  });

  test.each([
    { description: 'adds two positive numbers', num1: 5, num2: 3, expectedResult: 8 },
    { description: 'adds a positive and a negative number', num1: 10, num2: -5, expectedResult: 5 },
    { description: 'adds two negative numbers', num1: -2, num2: -3, expectedResult: -5 },
    { description: 'adds zero to a number', num1: 7, num2: 0, expectedResult: 7 },
    { description: 'adds a number to zero', num1: 0, num2: 12, expectedResult: 12 },
    { description: 'adds two decimal numbers', num1: 0.1, num2: 0.2, expectedResult: 0.3 },
    { description: 'adds numbers resulting in zero', num1: 5, num2: -5, expectedResult: 0 },
    { description: 'adds large numbers', num1: 1000000, num2: 1, expectedResult: 1000001 },
    { description: 'adds numbers with precision', num1: 0.12345, num2: 0.67890, expectedResult: 0.80235 },
  ])('add method: %s', ({ description, num1, num2, expectedResult }: { description: string; num1: number; num2: number; expectedResult: number }) => {
    // Arrange - num1, num2, expectedResult are from the dataset

    // Act
    const result = calculator.add(num1, num2);

    // Assert
    if (Number.isInteger(expectedResult)) {
      expect(result).toBe(expectedResult);
    } else {
      expect(result).toBeCloseTo(expectedResult);
    }
  });

  test.each([
    { description: 'subtracts two positive numbers', num1: 10, num2: 5, expectedResult: 5 },
    { description: 'subtracts a negative from a positive number', num1: 10, num2: -5, expectedResult: 15 },
    { description: 'subtracts a positive from a negative number', num1: -10, num2: 5, expectedResult: -15 },
    { description: 'subtracts two negative numbers', num1: -5, num2: -10, expectedResult: 5 },
    { description: 'subtracts zero from a number', num1: 8, num2: 0, expectedResult: 8 },
    { description: 'subtracts a number from zero', num1: 0, num2: 5, expectedResult: -5 },
    { description: 'subtracts two decimal numbers', num1: 5.5, num2: 2.3, expectedResult: 3.2 },
    { description: 'subtracts numbers resulting in zero', num1: 7, num2: 7, expectedResult: 0 },
    { description: 'subtracts numbers with precision', num1: 0.80235, num2: 0.67890, expectedResult: 0.12345 },
  ])('subtract method: %s', ({ description, num1, num2, expectedResult }: { description: string; num1: number; num2: number; expectedResult: number }) => {
    // Arrange - num1, num2, expectedResult are from the dataset

    // Act
    const result = calculator.subtract(num1, num2);

    // Assert
    if (Number.isInteger(expectedResult)) {
      expect(result).toBe(expectedResult);
    } else {
      expect(result).toBeCloseTo(expectedResult);
    }
  });

  test.each([
    { description: 'multiplies two positive numbers', num1: 4, num2: 5, expectedResult: 20 },
    { description: 'multiplies a positive and a negative number', num1: 6, num2: -3, expectedResult: -18 },
    { description: 'multiplies two negative numbers', num1: -7, num2: -2, expectedResult: 14 },
    { description: 'multiplies by zero', num1: 9, num2: 0, expectedResult: 0 },
    { description: 'multiplies zero by a number', num1: 0, num2: 15, expectedResult: 0 },
    { description: 'multiplies by one', num1: 11, num2: 1, expectedResult: 11 },
    { description: 'multiplies by negative one', num1: 13, num2: -1, expectedResult: -13 },
    { description: 'multiplies two decimal numbers', num1: 2.5, num2: 4, expectedResult: 10 },
    { description: 'multiplies numbers with precision', num1: 0.123, num2: 0.456, expectedResult: 0.05609 },
  ])('multiply method: %s', ({ description, num1, num2, expectedResult }: { description: string; num1: number; num2: number; expectedResult: number }) => {
    // Arrange - num1, num2, expectedResult are from the dataset

    // Act
    const result = calculator.multiply(num1, num2);

    // Assert
    if (Number.isInteger(expectedResult)) {
      expect(result).toBe(expectedResult);
    } else {
      expect(result).toBeCloseTo(expectedResult);
    }
  });

  test.each([
    { description: 'divides two positive numbers', num1: 10, num2: 2, expectedResult: 5 },
    { description: 'divides a positive by a negative number', num1: 15, num2: -3, expectedResult: -5 },
    { description: 'divides a negative by a positive number', num1: -20, num2: 4, expectedResult: -5 },
    { description: 'divides two negative numbers', num1: -25, num2: -5, expectedResult: 5 },
    { description: 'divides zero by a non-zero number', num1: 0, num2: 10, expectedResult: 0 },
    { description: 'divides a number by one', num1: 30, num2: 1, expectedResult: 30 },
    { description: 'divides a number by itself', num1: 35, num2: 35, expectedResult: 1 },
    { description: 'divides two decimal numbers', num1: 10.5, num2: 2.5, expectedResult: 4.2 },
    { description: 'divides numbers resulting in a repeating decimal', num1: 1, num2: 3, expectedResult: 0.33333 },
    { description: 'divides numbers with precision', num1: 0.12345, num2: 0.5, expectedResult: 0.2469 },
  ])('divide method (valid cases): %s', ({ description, num1, num2, expectedResult }: { description: string; num1: number; num2: number; expectedResult: number }) => {
    // Arrange - num1, num2, expectedResult are from the dataset

    // Act
    const result = calculator.divide(num1, num2);

    // Assert
    expect(typeof result).toBe('number'); // Ensure it's a number for valid divisions
    if (typeof result === 'number') {
      if (Number.isInteger(expectedResult)) {
        expect(result).toBe(expectedResult);
      } else {
        expect(result).toBeCloseTo(expectedResult);
      }
    }
  });

  it('divide method: should return an error message when dividing by zero', () => {
    // Arrange
    const num1 = 10;
    const num2 = 0;
    const expectedErrorMessage = 'Error: División por cero';

    // Act
    const result = calculator.divide(num1, num2);

    // Assert
    expect(result).toBe(expectedErrorMessage);
  });
});