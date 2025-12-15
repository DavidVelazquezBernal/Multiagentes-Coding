/**
 * Clase Calculator con operaciones aritméticas básicas.
 * Incluye manejo de división por cero.
 */
export class Calculator {
    /**
     * Suma dos números.
     * @param a - Primer número
     * @param b - Segundo número
     * @returns La suma de a y b
     */
    add(a: number, b: number): number {
        return a + b;
    }

    /**
     * Resta dos números.
     * @param a - Primer número
     * @param b - Segundo número
     * @returns La resta de a menos b
     */
    subtract(a: number, b: number): number {
        return a - b;
    }

    /**
     * Multiplica dos números.
     * @param a - Primer número
     * @param b - Segundo número
     * @returns El producto de a y b
     */
    multiply(a: number, b: number): number {
        return a * b;
    }

    /**
     * Divide dos números.
     * @param a - Dividendo
     * @param b - Divisor
     * @returns El cociente de a dividido por b
     * @throws Error si b es cero
     */
    divide(a: number, b: number): number {
        if (b === 0) {
            throw new Error('División por cero no permitida');
        }
        return a / b;
    }
}