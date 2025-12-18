import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { areBracketsBalanced } from './function_are_brackets_balanced_s_string_boolean';

describe('areBracketsBalanced', () => {
  // Test cases for various bracket combinations, including happy path and edge cases.
  test.each([
    { description: 'should return true for an empty string', s: '', expectedResult: true },
    { description: 'should return true for a string with no brackets', s: 'abcxyz', expectedResult: true },
    { description: 'should return true for a simple balanced string', s: '()', expectedResult: true },
    { description: 'should return true for multiple types of balanced brackets', s: '([]{})', expectedResult: true },
    { description: 'should return true for deeply nested balanced brackets', s: '([{}])', expectedResult: true },
    { description: 'should return true when non-bracket characters are interspersed', s: 'a(b[c]d){e}f', expectedResult: true },
    { description: 'should return true for multiple distinct sets of balanced brackets', s: '[]{}()', expectedResult: true },
    { description: 'should return false for a single unclosed opening bracket', s: '(', expectedResult: false },
    { description: 'should return false for a single unopened closing bracket', s: ')', expectedResult: false },
    { description: 'should return false for mismatched closing bracket type', s: '([)]', expectedResult: false },
    { description: 'should return false for an unclosed bracket set at the end', s: '((()', expectedResult: false },
    { description: 'should return false for an unopened closing bracket set at the start', s: '())', expectedResult: false },
    { description: 'should return false for incorrectly nested brackets', s: '({[)]})', expectedResult: false },
    { description: 'should return false when a closing bracket appears without an opening one first', s: '][', expectedResult: false },
    { description: 'should return false when only opening brackets remain at the end', s: '[{', expectedResult: false },
  ])('$description', ({ s, expectedResult }: { description: string; s: string; expectedResult: boolean }) => {
    // Arrange
    // The test data (s, expectedResult) is provided by test.each.

    // Act
    const result: boolean = areBracketsBalanced(s);

    // Assert
    expect(result).toBe(expectedResult);
  });

  // Test case for error handling when input is not a string.
  it('should throw an error for non-string input', () => {
    // Arrange
    const invalidInput: any = 123; // Use 'any' to deliberately test invalid input types.

    // Act & Assert
    expect(() => areBracketsBalanced(invalidInput)).toThrow("Invalid input: The 's' parameter must be a string.");
  });
});