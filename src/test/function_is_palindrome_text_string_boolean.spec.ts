import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { isPalindrome } from './function_is_palindrome_text_string_boolean';

describe('isPalindrome', () => {
  test.each([
    { description: 'identifies a simple palindrome correctly', text: 'radar', expectedResult: true },
    { description: 'ignores case and multiple spaces in sentences', text: 'Anita lava la tina', expectedResult: true },
    { description: 'handles long palindromic sentences', text: 'A man a plan a canal Panama', expectedResult: true },
    { description: 'returns true for empty strings or only whitespace', text: '   ', expectedResult: true },
    { description: 'returns false for strings that are not palindromes', text: 'typescript', expectedResult: false },
  ])('$description', ({ text, expectedResult }: { description: string; text: string; expectedResult: boolean }) => {
    // Arrange
    const input: string = text;

    // Act
    const result: boolean = isPalindrome(input);

    // Assert
    expect(result).toBe(expectedResult);
  });

  it('should throw an error if the input provided is not a string', () => {
    // Arrange
    const invalidInput: any = 12345;

    // Act & Assert
    expect(() => isPalindrome(invalidInput)).toThrow('La entrada debe ser una cadena de texto válida.');
  });
});