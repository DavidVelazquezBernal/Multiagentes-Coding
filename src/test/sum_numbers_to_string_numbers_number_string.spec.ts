import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { sumNumbersToString } from './sum_numbers_to_string_numbers_number_string';

describe('sumNumbersToString', () => {
  test.each([
    {
      description: 'calculates the sum of positive integers',
      numbers: [1, 2, 3],
      expectedResult: 'The total sum is 6'
    },
    {
      description: 'handles negative numbers and zero',
      numbers: [10, -5, 0],
      expectedResult: 'The total sum is 5'
    },
    {
      description: 'returns zero string for an empty array',
      numbers: [],
      expectedResult: 'The total sum is 0'
    },
    {
      description: 'handles floating point precision correctly',
      numbers: [0.1, 0.2],
      expectedResult: 'The total sum is 0.3'
    },
  ])('$description', ({ numbers, expectedResult }: { description: string; numbers: number[]; expectedResult: string }) => {
    // Arrange - data provided by the dataset

    // Act
    const result = sumNumbersToString(numbers);

    // Assert
    expect(result).toBe(expectedResult);
  });

  it('should throw an error when the input is not a valid array', () => {
    // Arrange
    const input: any = "not an array";

    // Act & Assert
    expect(() => sumNumbersToString(input)).toThrow('Invalid input: Expected an array of numbers.');
  });

  it('should throw an error when array elements are not valid numbers', () => {
    // Arrange
    const input: any[] = [1, 2, NaN];

    // Act & Assert
    expect(() => sumNumbersToString(input as number[])).toThrow('Invalid input: Array must contain only valid numbers.');
  });
});