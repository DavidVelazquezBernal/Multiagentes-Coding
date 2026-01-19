/**
 * Calcula la suma de todos los elementos de un arreglo numérico y retorna el resultado
 * dentro de una cadena de texto descriptiva, manejando la precisión de punto flotante.
 * 
 * @param numbers - Un arreglo de números (number[]).
 * @returns Una cadena de texto con el formato "La suma total es: [resultado]".
 * @throws Error si el parámetro proporcionado no es un arreglo.
 */
export function sumNumbersToString(numbers: number[]): string {
  // Validación de entrada para asegurar que el parámetro es un arreglo
  if (!Array.isArray(numbers)) {
    throw new Error("La entrada debe ser un arreglo de números (number[]).");
  }

  // Si el arreglo está vacío, la suma es 0 por defecto según el valor inicial del reduce
  const total: number = numbers.reduce((accumulator: number, current: number) => {
    // Verificación de tipo individual para robustez en tiempo de ejecución
    if (typeof current !== 'number' || isNaN(current)) {
      throw new Error("Todos los elementos del arreglo deben ser números válidos.");
    }
    return accumulator + current;
  }, 0);

  /**
   * Manejo de precisión numérica:
   * Se aplica el redondeo solicitado para evitar errores de precisión binaria en 
   * operaciones de punto flotante (ej. 0.1 + 0.2).
   */
  const roundedTotal: number = Math.round(total * 1e10) / 1e10;

  return `La suma total es: ${roundedTotal}`;
}