import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { sumArrayAndFormat } from './sum_array_and_format_numbers_number_string';

describe('sumArrayAndFormat', () => {
  test.each([
    { 
      description: 'sum positive integers correctly', 
      numbers: [1, 2, 3], 
      expectedResult: 'La suma total es: 6' 
    },
    { 
      description: 'return zero for an empty array', 
      numbers: [], 
      expectedResult: 'La suma total es: 0' 
    },
    { 
      description: 'handle positive and negative numbers resulting in zero', 
      numbers: [-5, 5], 
      expectedResult: 'La suma total es: 0' 
    },
    { 
      description: 'correctly handle floating point precision for 0.1 and 0.2', 
      numbers: [0.1, 0.2], 
      expectedResult: 'La suma total es: 0.3' 
    },
    { 
      description: 'handle numbers with several decimals within rounding limit', 
      numbers: [1.1234, 2.5678], 
      expectedResult: 'La suma total es: 3.6912' 
    },
  ])('$description', ({ numbers, expectedResult }: { description: string; numbers: number[]; expectedResult: string }) => {
    // Arrange - Input data comes from the dataset

    // Act
    const result = sumArrayAndFormat(numbers);

    // Assert
    expect(result).toBe(expectedResult);
  });

  it('should throw an error when the input is not a valid array', () => {
    // Arrange
    const invalidInput: any = null;

    // Act & Assert
    expect(() => sumArrayAndFormat(invalidInput)).toThrow('La entrada debe ser un array de números.');
  });
});