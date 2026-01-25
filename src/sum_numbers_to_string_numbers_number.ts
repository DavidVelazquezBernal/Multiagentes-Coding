/**
 * Calcula la suma total de un arreglo de números y devuelve una cadena descriptiva.
 * Implementa redondeo de precisión para evitar errores de punto flotante.
 * 
 * @param numbers - Arreglo de valores numéricos a sumar.
 * @returns Cadena de texto con el formato 'La suma total es: X'.
 * @throws Error si el parámetro de entrada no es un arreglo.
 */
export function sumNumbersToString(numbers: number[]): string {
    // Validación básica de entrada
    if (!Array.isArray(numbers)) {
        throw new Error("El parámetro 'numbers' debe ser un arreglo de tipo number[].");
    }

    // Cálculo de la suma utilizando reduce
    const totalSum: number = numbers.reduce((accumulator: number, current: number) => {
        // Verificación de que cada elemento sea un número válido
        if (typeof current !== 'number' || isNaN(current)) {
            throw new Error("El arreglo contiene valores que no son números válidos.");
        }
        return accumulator + current;
    }, 0);

    /**
     * Requisito de precisión numérica para TypeScript:
     * Se aplica redondeo para evitar errores de precisión binaria en punto flotante.
     */
    const roundedResult: number = Math.round(totalSum * 1e10) / 1e10;

    return `La suma total es: ${roundedResult}`;
}