import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest'
import { checkBalancedBrackets } from './function_check_balanced_brackets_s_string_boolean'

describe('checkBalancedBrackets', () => {
  test.each([
    // Happy Path - Balanced cases (expectedResult: true)
    { description: 'should return true for an empty string', input: '', expectedResult: true },
    { description: 'should return true for a string with no brackets', input: 'abc', expectedResult: true },
    { description: 'should return true for simple balanced parentheses', input: '()', expectedResult: true },
    { description: 'should return true for multiple sets of balanced brackets', input: '()[]{}', expectedResult: true },
    { description: 'should return true for nested balanced brackets', input: '([{}])', expectedResult: true },
    { description: 'should return true for complex mixed balanced brackets with text', input: 'foo(bar[baz]{qux})', expectedResult: true },
    { description: 'should return true for deeply nested balanced brackets', input: '{[({})]}', expectedResult: true },
    { description: 'should return true for multiple nested sets', input: '({}[()])', expectedResult: true },
    { description: 'should return true for balanced brackets with numbers and symbols', input: '((1+2)*{3-[4/5]})', expectedResult: true },

    // Edge Cases - Unbalanced cases (expectedResult: false)
    { description: 'should return false for an unmatched closing parenthesis', input: ')', expectedResult: false },
    { description: 'should return false for an unmatched opening bracket', input: '{', expectedResult: false },
    { description: 'should return false for only opening brackets', input: '((({', expectedResult: false },
    { description: 'should return false for only closing brackets', input: ')))', expectedResult: false },
    { description: 'should return false for mismatched bracket types at closing', input: '([)]', expectedResult: false },
    { description: 'should return false for another mismatched bracket type', input: '{[}]', expectedResult: false },
    { description: 'should return false for incorrect nesting order', input: '[(])', expectedResult: false },
    { description: 'should return false for an initial closing bracket', input: '}abc', expectedResult: false },
    { description: 'should return false for more opening than closing', input: '((()', expectedResult: false },
    { description: 'should return false for more closing than opening', input: '())', expectedResult: false },
    { description: 'should return false for complex unbalanced brackets', input: '({[})]', expectedResult: false },
    { description: 'should return false for deeply nested unbalanced brackets', input: '((({}))', expectedResult: false },
    { description: 'should return false for an unmatched opening bracket in the middle', input: 'foo[bar)', expectedResult: false },
    { description: 'should return false for an opening bracket without a closing pair', input: '[abc', expectedResult: false },
    { description: 'should return false for a closing bracket without an opening pair', input: 'abc]', expectedResult: false },
  ])('$description', ({ input, expectedResult }: { description: string; input: string; expectedResult: boolean }) => {
    // Arrange
    const s: string = input;

    // Act
    const result: boolean = checkBalancedBrackets(s);

    // Assert
    expect(result).toBe(expectedResult);
  });
});