import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { sumNumbersToString } from './sum_numbers_to_string_numbers_number';

describe('sumNumbersToString', () => {
  test.each([
    { 
      description: 'should sum positive integers correctly', 
      numbers: [10, 20, 30], 
      expectedResult: 'La suma total es: 60' 
    },
    { 
      description: 'should handle negative numbers and zero', 
      numbers: [-5, -10, 0], 
      expectedResult: 'La suma total es: -15' 
    },
    { 
      description: 'should handle floating point precision correctly', 
      numbers: [0.1, 0.2], 
      expectedResult: 'La suma total es: 0.3' 
    },
    { 
      description: 'should return zero when the input array is empty', 
      numbers: [], 
      expectedResult: 'La suma total es: 0' 
    },
  ])('$description', ({ numbers, expectedResult }: { description: string; numbers: number[]; expectedResult: string }) => {
    // Arrange - Data provided by the dataset
    
    // Act
    const result = sumNumbersToString(numbers);
    
    // Assert
    expect(result).toBe(expectedResult);
  });

  it('should throw an error if the input parameter is not an array', () => {
    // Arrange
    const invalidInput: any = "not an array";

    // Act & Assert
    expect(() => sumNumbersToString(invalidInput)).toThrow("El parámetro 'numbers' debe ser un arreglo de tipo number[].");
  });

  it('should throw an error if the array contains NaN or non-number types', () => {
    // Arrange
    const inputWithNaN = [1, NaN, 3];
    const inputWithString: any = [1, "2", 3];

    // Act & Assert
    expect(() => sumNumbersToString(inputWithNaN)).toThrow("El arreglo contiene valores que no son números válidos.");
    expect(() => sumNumbersToString(inputWithString)).toThrow("El arreglo contiene valores que no son números válidos.");
  });
});