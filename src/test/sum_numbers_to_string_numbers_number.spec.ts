import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { sumNumbersToString } from './sum_numbers_to_string_numbers_number';

describe('sumNumbersToString', () => {
  test.each([
    { description: 'calculate the sum of positive integers', numbers: [1, 2, 3], expectedResult: 'The total sum is 6' },
    { description: 'calculate the sum of mixed positive and negative numbers', numbers: [10, -5, 2], expectedResult: 'The total sum is 7' },
    { description: 'return zero for an empty array', numbers: [], expectedResult: 'The total sum is 0' },
    { description: 'handle floating point precision for standard decimals', numbers: [0.1, 0.2], expectedResult: 'The total sum is 0.3' },
    { description: 'handle decimals with multiple digits', numbers: [1.1111, 2.2222], expectedResult: 'The total sum is 3.3333' }
  ])('$description', ({ numbers, expectedResult }: { description: string; numbers: number[]; expectedResult: string }) => {
    // Arrange - data prepared in the dataset
    const input = numbers;

    // Act
    const result = sumNumbersToString(input);

    // Assert
    expect(result).toBe(expectedResult);
  });

  it('should throw an error if the input is not an array', () => {
    // Arrange
    const input: any = 'invalid-input';

    // Act & Assert
    expect(() => sumNumbersToString(input)).toThrow('Input must be an array of numbers.');
  });

  it.each([
    { reason: 'contains NaN', input: [1, NaN, 3] },
    { reason: 'contains strings', input: [1, '2' as any, 3] },
    { reason: 'contains null values', input: [1, null as any, 3] },
    { reason: 'contains undefined values', input: [1, undefined as any, 3] }
  ])('should throw an error if the array $reason', ({ input }: { input: number[] }) => {
    // Arrange & Act & Assert
    expect(() => sumNumbersToString(input)).toThrow('All elements in the array must be valid numbers.');
  });
});