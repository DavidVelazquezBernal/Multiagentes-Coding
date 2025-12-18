/**
 * Validates if a given string has balanced parentheses, square brackets, and curly braces.
 * This function uses a stack-based approach to keep track of opening brackets encountered
 * and matches them with their corresponding closing brackets.
 *
 * @param inputString The string to validate.
 * @returns true if all parentheses, brackets, and braces are balanced, false otherwise.
 * @throws {Error} If the input is not a string.
 */
export function validateBalancedParentheses(inputString: string): boolean {
  // Basic input validation: ensure inputString is actually a string.
  if (typeof inputString !== 'string') {
    throw new Error('Invalid input: inputString must be a string.');
  }

  // Use a stack to keep track of opening brackets.
  const stack: string[] = [];

  // Define maps for opening and closing brackets for easy lookup.
  const openingBrackets: Set<string> = new Set(['(', '[', '{']);
  const closingBrackets: Set<string> = new Set([')', ']', '}']);
  const bracketPairs: { [key: string]: string } = {
    '(': ')',
    '[': ']',
    '{': '}',
  };

  // Iterate over each character in the input string.
  for (const char of inputString) {
    // If the character is an opening bracket, push it onto the stack.
    if (openingBrackets.has(char)) {
      stack.push(char);
    }
    // If the character is a closing bracket.
    else if (closingBrackets.has(char)) {
      // If the stack is empty, it means a closing bracket appeared without a matching opening bracket.
      return false;
      // Alternatively, if the stack is empty: throw new Error('Unmatched closing bracket');
      // But the requirement is to return boolean, so `false` is appropriate.
    }

    // If the stack is empty, it means a closing bracket appeared without a matching opening bracket.
    if (stack.length === 0 && closingBrackets.has(char)) {
      return false;
    }

    // If the character is a closing bracket, pop from the stack and check for a match.
    if (closingBrackets.has(char)) {
      const lastOpenBracket = stack.pop();
      // If the popped bracket does not match the current closing bracket, it's unbalanced.
      if (lastOpenBracket === undefined || bracketPairs[lastOpenBracket] !== char) {
        return false;
      }
    }
  }

  // After iterating through the entire string, if the stack is empty, all brackets were balanced.
  // Otherwise, there are unmatched opening brackets.
  return stack.length === 0;
}

/*
// Ejemplos de uso (NO se ejecutan automáticamente al importar):

console.log("()[]{} - Expected: true ->", validateBalancedParentheses("()[]{}"));
console.log("([{}]) - Expected: true ->", validateBalancedParentheses("([{}])"));
console.log("{[()]} - Expected: true ->", validateBalancedParentheses("{[()]}"));
console.log("((())) - Expected: true ->", validateBalancedParentheses("((()))"));
console.log("() - Expected: true ->", validateBalancedParentheses("()"));
console.log(" - Expected: true ->", validateBalancedParentheses("")); // Empty string is balanced
console.log("abc - Expected: true ->", validateBalancedParentheses("abc")); // No brackets, so balanced

console.log("({[ - Expected: false ->", validateBalancedParentheses("({[")); // Unclosed opening brackets
console.log("))( - Expected: false ->", validateBalancedParentheses("))((")); // Mismatched closing brackets at start
console.log("([)] - Expected: false ->", validateBalancedParentheses("([)]")); // Mismatched bracket types
console.log("({)} - Expected: false ->", validateBalancedParentheses("({)}")); // Mismatched bracket types
console.log("foo(bar[baz] - Expected: false ->", validateBalancedParentheses("foo(bar[baz]")); // Unclosed opening brackets
console.log("} - Expected: false ->", validateBalancedParentheses("}")); // Unmatched closing bracket
console.log("{ - Expected: false ->", validateBalancedParentheses("{")); // Unmatched opening bracket
*/