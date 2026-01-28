import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { isPalindrome } from './is_palindrome_text_string_boolean';

describe('isPalindrome', () => {
  test.each([
    { description: 'identifies a simple palindrome', text: 'racecar', expectedResult: true },
    { description: 'identifies a non-palindrome', text: 'engineer', expectedResult: false },
    { description: 'ignores case sensitivity and white spaces', text: 'Anita lava la tina', expectedResult: true },
    { description: 'handles empty strings or strings with only spaces as true', text: '   ', expectedResult: true },
    { description: 'handles single character strings', text: 'a', expectedResult: true },
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
    const input: any = 12345;

    // Act & Assert
    expect(() => isPalindrome(input)).toThrow('La entrada debe ser una cadena de texto válida.');
  });
});