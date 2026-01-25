/**
 * Calculates the sum of all elements in a numeric array and returns a 
 * descriptive string with the total result.
 * 
 * @param numbers - An array of numbers to be summed.
 * @returns A string formatted as "The total sum is {total}".
 * @throws Error if the input is not a valid array.
 */
export function sumNumbersToString(numbers: number[]): string {
  // Basic validation to ensure the input is an array
  if (!Array.isArray(numbers)) {
    throw new Error("Invalid input: Expected an array of numbers.");
  }

  // Calculate the sum using reduce, starting from 0
  const total: number = numbers.reduce((accumulator, current) => {
    // Basic type check for array elements
    if (typeof current !== 'number' || isNaN(current)) {
      throw new Error("Invalid input: Array must contain only valid numbers.");
    }
    return accumulator + current;
  }, 0);

  /**
   * Handle floating point precision errors as per requirements.
   * Multiplies by 10^10, rounds, and divides by 10^10 to ensure 
   * accuracy in decimal operations.
   */
  const roundedTotal: number = Math.round(total * 1e10) / 1e10;

  return `The total sum is ${roundedTotal}`;
}