import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { sumArray } from './function_sum_array_numbers_number_string';

describe('sumArray', () => {
  test.each([
    { description: 'sums positive integers correctly', input: [10, 20, 30], expectedResult: 'La suma total es: 60' },
    { description: 'handles empty arrays as zero', input: [], expectedResult: 'La suma total es: 0' },
    { description: 'manages negative numbers and decimals', input: [-5.5, 2.25, -1], expectedResult: 'La suma total es: -4.25' },
    { description: 'resolves floating point precision issues', input: [0.1, 0.2], expectedResult: 'La suma total es: 0.3' },
    { description: 'handles large valid numbers within precision limits', input: [1000000, 0.0001], expectedResult: 'La suma total es: 1000000.0001' },
  ])('$description', ({ input, expectedResult }: { description: string; input: number[]; expectedResult: string }) => {
    // Arrange - input defined in dataset
    const numbers: number[] = input;

    // Act
    const result = sumArray(numbers);

    // Assert
    expect(result).toBe(expectedResult);
  });

  it('should throw error when input is not an array', () => {
    // Arrange
    const invalidInput = null as unknown as number[];

    // Act & Assert
    expect(() => sumArray(invalidInput)).toThrow('La entrada debe ser un array de números.');
  });

  it('should throw error when array contains NaN or non-numeric types', () => {
    // Arrange
    const arrayWithNaN = [1, NaN, 3];
    const arrayWithInvalidType = [1, '2' as unknown as number, 3];

    // Act & Assert
    expect(() => sumArray(arrayWithNaN)).toThrow('Todos los elementos del array deben ser números válidos.');
    expect(() => sumArray(arrayWithInvalidType)).toThrow('Todos los elementos del array deben ser números válidos.');
  });
});