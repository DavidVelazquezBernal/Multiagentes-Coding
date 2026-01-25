/**
 * Suma un array de números y devuelve una cadena descriptiva con el resultado.
 * Maneja la precisión de punto flotante y valida que la entrada sea correcta.
 * 
 * @param numbers - Array de números (number[]).
 * @returns String con formato 'La suma total es: [suma]'.
 * @throws Error si el parámetro de entrada no es un array o contiene valores no numéricos.
 */
export function sumArray(numbers: number[]): string {
  // Validación de entrada
  if (!Array.isArray(numbers)) {
    throw new Error("La entrada debe ser un array de números.");
  }

  // Realizar la suma con validación de elementos
  const total = numbers.reduce((accumulator, current) => {
    if (typeof current !== 'number' || isNaN(current)) {
      throw new Error("Todos los elementos del array deben ser números válidos.");
    }
    return accumulator + current;
  }, 0);

  /**
   * REQUISITO CRÍTICO - Manejo de precisión numérica:
   * Se aplica el redondeo para evitar errores de precisión binaria en punto flotante.
   */
  const roundedTotal = Math.round(total * 1e10) / 1e10;

  return `La suma total es: ${roundedTotal}`;
}