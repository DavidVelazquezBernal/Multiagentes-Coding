/**
 * Suma todos los elementos de un arreglo numérico y retorna una cadena de texto descriptiva.
 * 
 * @param numbers - Un arreglo de números (number[]).
 * @returns Una cadena de texto con el formato 'The total sum is [valor]'.
 * @throws Error si la entrada no es un arreglo o contiene elementos que no son números.
 */
export function sumNumbersToString(numbers: number[]): string {
  // Validación de entrada para asegurar que sea un arreglo
  if (!Array.isArray(numbers)) {
    throw new Error("Input must be an array of numbers.");
  }

  // Cálculo de la suma utilizando reduce
  const total: number = numbers.reduce((accumulator: number, current: number) => {
    // Validación básica de tipo para cada elemento del arreglo
    if (typeof current !== 'number' || isNaN(current)) {
      throw new Error("All elements in the array must be valid numbers.");
    }
    return accumulator + current;
  }, 0);

  // Manejo de precisión numérica para evitar errores de punto flotante
  // Se aplica el redondeo solicitado: Math.round(resultado * 1e10) / 1e10
  const correctedTotal: number = Math.round(total * 1e10) / 1e10;

  // Retorno de la cadena con el formato especificado
  return `The total sum is ${correctedTotal}`;
}