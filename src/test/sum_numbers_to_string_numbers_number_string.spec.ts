import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { sumNumbersToString } from './sum_numbers_to_string_numbers_number_string';

describe('sumNumbersToString', () => {
  test.each([
    { description: 'handle empty array as zero', numbers: [], expectedResult: 'La suma total es: 0' },
    { description: 'sum positive integers correctly', numbers: [1, 2, 3], expectedResult: 'La suma total es: 6' },
    { description: 'handle floating point precision (0.1 + 0.2)', numbers: [0.1, 0.2], expectedResult: 'La suma total es: 0.3' }
  ])('$description', ({ numbers, expectedResult }: { description: string; numbers: number[]; expectedResult: string }) => {
    // Arrange
    const input: number[] = numbers;

    // Act
    const result: string = sumNumbersToString(input);

    // Assert
    expect(result).toBe(expectedResult);
  });

  test.each([
    { description: 'throw error for non-array input', input: null as any, expectedResult: 'La entrada debe ser un arreglo de números (number[]).' },
    { description: 'throw error for non-numeric elements', input: [1, '2'] as any, expectedResult: 'Todos los elementos del arreglo deben ser números válidos.' },
    { description: 'throw error for NaN values', input: [1, NaN], expectedResult: 'Todos los elementos del arreglo deben ser números válidos.' }
  ])('$description', ({ input, expectedResult }: { description: string; input: any; expectedResult: string }) => {
    // Arrange
    const data: any = input;

    // Act & Assert
    expect(() => sumNumbersToString(data)).toThrow(expectedResult);
  });
});