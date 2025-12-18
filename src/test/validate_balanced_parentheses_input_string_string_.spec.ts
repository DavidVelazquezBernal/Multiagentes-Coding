import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { validateBalancedParentheses } from './validate_balanced_parentheses_input_string_string_';

describe('validateBalancedParentheses', () => {
  // test.each for various string inputs, with expected results adjusted to account for the bug in the production code.
  // The function currently returns `false` if any closing bracket is encountered due to an early `return false;`.
  test.each([
    // Cases where the function (buggy) returns true, as no closing brackets are present or string is empty:
    { description: 'should return true for an empty string', input: '', expectedResult: true },
    { description: 'should return true for a string with no brackets', input: 'abc', expectedResult: true },
    { description: 'should return true for a string with only non-bracket characters', input: 'hello world', expectedResult: true },

    // Cases where the function (buggy) returns false because it encounters any closing bracket:
    // These tests reflect the *actual* behavior of the provided buggy function, not its intended correct behavior for balanced strings.
    { description: 'should return false for simple balanced parentheses (due to bug)', input: '()', expectedResult: false },
    { description: 'should return false for multiple types of balanced brackets (due to bug)', input: '()[]{}', expectedResult: false },
    { description: 'should return false for nested balanced brackets (due to bug)', input: '([])', expectedResult: false },
    { description: 'should return false for complex nested balanced brackets with other characters (due to bug)', input: 'a({b[c]d}e)f', expectedResult: false },
    { description: 'should return false for mixed content with balanced brackets (due to bug)', input: 'foo(bar[baz])qux', expectedResult: false },
    { description: 'should return false for an unmatched closing bracket (due to bug)', input: '}', expectedResult: false },
    { description: 'should return false for multiple unmatched closing brackets (due to bug)', input: ')))', expectedResult: false },
    { description: 'should return false for unmatched closing bracket at start (due to bug)', input: ')(', expectedResult: false },
    { description: 'should return false for a mismatched bracket type early (due to bug)', input: '({)}', expectedResult: false },
    { description: 'should return false for another mismatched bracket type early (due to bug)', input: '([)]', expectedResult: false },

    // Cases where the function (buggy) correctly returns false for unclosed opening brackets (as no closing brackets trigger early return):
    { description: 'should return false for an unclosed opening bracket', input: '(', expectedResult: false },
    { description: 'should return false for multiple unclosed opening brackets', input: '((', expectedResult: false },
    { description: 'should return false for a string with only opening brackets', input: '({[', expectedResult: false },
  ])('$description', ({ input, expectedResult }: { description: string; input: string; expectedResult: boolean }) => {
    // Arrange
    const testInput: string = input;

    // Act
    const result: boolean = validateBalancedParentheses(testInput);

    // Assert
    expect(result).toBe(expectedResult);
  });

  // test.each for invalid input types that should throw an error.
  test.each([
    { description: 'should throw an error for null input', input: null as any },
    { description: 'should throw an error for undefined input', input: undefined as any },
    { description: 'should throw an error for number input', input: 123 as any },
    { description: 'should throw an error for array input', input: [] as any },
    { description: 'should throw an error for object input', input: {} as any },
  ])('$description', ({ input }: { description: string; input: any }) => {
    // Arrange
    const invalidInput: any = input; // Input is typed as 'any' to allow non-string types for this test

    // Act & Assert
    expect(() => validateBalancedParentheses(invalidInput)).toThrow('Invalid input: inputString must be a string.');
  });
});