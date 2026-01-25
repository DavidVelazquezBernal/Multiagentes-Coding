/**
 * Suma los elementos de un array de números y devuelve una cadena descriptiva con el resultado.
 * Implementa redondeo para evitar errores de precisión binaria en punto flotante.
 * 
 * @param numbers - Un array de números a sumar.
 * @returns Una cadena con el formato 'La suma total es: [resultado]'.
 * @throws Error si la entrada no es un array válido.
 */
export function sumArrayAndFormat(numbers: number[]): string {
    // Validación básica de entrada
    if (!Array.isArray(numbers)) {
        throw new Error("La entrada debe ser un array de números.");
    }

    // Cálculo de la suma aritmética. Si el array está vacío, el valor inicial es 0.
    const rawSum: number = numbers.reduce((accumulator: number, current: number) => {
        return accumulator + current;
    }, 0);

    /**
     * Manejo de precisión numérica según requerimiento:
     * Se redondea a 10 decimales para evitar errores comunes de punto flotante (e.g., 0.1 + 0.2).
     */
    const result: number = Math.round(rawSum * 1e10) / 1e10;

    // Retorno del string formateado con el resultado final
    return `La suma total es: ${result}`;
}