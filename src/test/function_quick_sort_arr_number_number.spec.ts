import { describe, it, test, expect, vi } from 'vitest';
import { quickSort } from './function_quick_sort_arr_number_number';

describe('quickSort', () => {
  it('should throw TypeError for non-array input', () => {
    // Arrange
    const invalidInputs: any[] = [null, undefined, {}, 'not an array', 123];

    // Act & Assert
    invalidInputs.forEach((input) => {
      expect(() => quickSort(input)).toThrow(TypeError);
      expect(() => quickSort(input)).toThrow('La entrada debe ser un array.');
    });
  });

  it('should throw TypeError for array with non-numeric elements', () => {
    // Arrange
    const invalidArrays: any[][] = [
      [1, '2', 3],
      [1, null, 3],
      [1, undefined, 3],
      [1, {}, 3],
      [1, true, 3],
    ];

    // Act & Assert
    invalidArrays.forEach((arr) => {
      expect(() => quickSort(arr)).toThrow(TypeError);
      expect(() => quickSort(arr)).toThrow('Todos los elementos del array deben ser números.');
    });
  });

  test.each([
    {
      description: 'sorts an empty array',
      arr: [],
      expectedResult: [],
    },
    {
      description: 'sorts an array with a single element',
      arr: [5],
      expectedResult: [5],
    },
    {
      description: 'sorts an array of positive numbers',
      arr: [3, 1, 4, 1, 5, 9, 2, 6],
      expectedResult: [1, 1, 2, 3, 4, 5, 6, 9],
    },
    {
      description: 'sorts an array of negative numbers',
      arr: [-5, -1, -3],
      expectedResult: [-5, -3, -1],
    },
    {
      description: 'sorts an array with mixed positive, negative, and zero numbers',
      arr: [3, 0, -2, 1, -5],
      expectedResult: [-5, -2, 0, 1, 3],
    },
    {
      description: 'sorts an array with duplicate numbers',
      arr: [5, 2, 8, 2, 5],
      expectedResult: [2, 2, 5, 5, 8],
    },
    {
      description: 'sorts an already sorted array',
      arr: [1, 2, 3, 4, 5],
      expectedResult: [1, 2, 3, 4, 5],
    },
    {
      description: 'sorts a reverse sorted array',
      arr: [5, 4, 3, 2, 1],
      expectedResult: [1, 2, 3, 4, 5],
    },
    {
      description: 'sorts an array with all identical numbers',
      arr: [7, 7, 7, 7],
      expectedResult: [7, 7, 7, 7],
    },
    {
      description: 'sorts an array with large numbers',
      arr: [9999999, 1000000, 5000000],
      expectedResult: [1000000, 5000000, 9999999],
    },
  ])('$description', ({ arr, expectedResult }: { description: string; arr: number[]; expectedResult: number[] }) => {
    // Arrange - data comes from the dataset

    // Act
    const result = quickSort(arr);

    // Assert
    expect(result).toEqual(expectedResult);
  });
});