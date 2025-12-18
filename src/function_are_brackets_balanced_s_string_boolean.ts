export function areBracketsBalanced(s: string): boolean {
  // Input validation: Ensure the input is a string.
  if (typeof s !== 'string') {
    throw new Error("Invalid input: The 's' parameter must be a string.");
  }

  // Use a stack to keep track of opening brackets encountered.
  const stack: string[] = [];

  // Define maps for opening and closing brackets for quick lookup.
  const openingBrackets: Set<string> = new Set(['(', '[', '{']);
  const closingBrackets: Set<string> = new Set([')', ']', '}']);
  const bracketPairs: { [key: string]: string } = {
    '(': ')',
    '[': ']',
    '{': '}',
  };

  // Iterate over each character in the input string.
  for (const char of s) {
    // If the character is an opening bracket, push it onto the stack.
    if (openingBrackets.has(char)) {
      stack.push(char);
    }
    // If the character is a closing bracket.
    else if (closingBrackets.has(char)) {
      // If the stack is empty, it means a closing bracket appeared without a corresponding opening bracket.
      if (stack.length === 0) {
        return false;
      }

      // Pop the last opening bracket from the stack.
      const lastOpenBracket = stack.pop();

      // Check if the popped opening bracket matches the current closing bracket.
      // If not, the brackets are mismatched.
      if (lastOpenBracket && bracketPairs[lastOpenBracket] !== char) {
        return false;
      }
    }
    // Any other character (letters, numbers, spaces, etc.) is ignored.
  }

  // After iterating through the entire string, if the stack is empty,
  // it means all opening brackets have been correctly closed and balanced.
  // If the stack is not empty, it means there are unmatched opening brackets.
  return stack.length === 0;
}

// Ejemplos de uso (NO se ejecutan automáticamente al importar):
/*
const testString1 = "([{}])"; // true
const testString2 = "{[()]}"; // true
const testString3 = "({[)]})"; // false (mismatched)
const testString4 = "((()))"; // true
const testString5 = "(()"; // false (unclosed)
const testString6 = "())"; // false (unopened closing)
const testString7 = ""; // true (empty string is balanced)
const testString8 = "abc(123[def])xyz"; // true (non-bracket characters ignored)
const testString9 = "([)]"; // false
const testString10 = "["; // false
const testString11 = "[]{}()"; // true

console.log(`"${testString1}" is balanced: ${areBracketsBalanced(testString1)}`);
console.log(`"${testString2}" is balanced: ${areBracketsBalanced(testString2)}`);
console.log(`"${testString3}" is balanced: ${areBracketsBalanced(testString3)}`);
console.log(`"${testString4}" is balanced: ${areBracketsBalanced(testString4)}`);
console.log(`"${testString5}" is balanced: ${areBracketsBalanced(testString5)}`);
console.log(`"${testString6}" is balanced: ${areBracketsBalanced(testString6)}`);
console.log(`"${testString7}" is balanced: ${areBracketsBalanced(testString7)}`);
console.log(`"${testString8}" is balanced: ${areBracketsBalanced(testString8)}`);
console.log(`"${testString9}" is balanced: ${areBracketsBalanced(testString9)}`);
console.log(`"${testString10}" is balanced: ${areBracketsBalanced(testString10)}`);
console.log(`"${testString11}" is balanced: ${areBracketsBalanced(testString11)}`);

try {
  areBracketsBalanced(123 as any); // Should throw an error
} catch (e: any) {
  console.error(e.message);
}
*/