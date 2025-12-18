/**
 * Clase Calculator que proporciona métodos para las operaciones aritméticas básicas.
 */
export class Calculator {

  /**
   * Redondea un número de punto flotante para evitar errores de precisión binaria.
   * @param value El número a redondear.
   * @returns El número redondeado con una precisión de 10 decimales.
   */
  private round(value: number): number {
    return Math.round(value * 1e10) / 1e10;
  }

  /**
   * Realiza la operación de suma de dos números.
   * @param a El primer número.
   * @param b El segundo número.
   * @returns La suma de a y b, redondeada para precisión.
   * @throws {Error} Si alguno de los argumentos no es de tipo number.
   */
  public add(a: number, b: number): number {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error("Invalid input: Both arguments must be numbers.");
    }
    return this.round(a + b);
  }

  /**
   * Realiza la operación de resta de dos números.
   * @param a El primer número (minuendo).
   * @param b El segundo número (sustraendo).
   * @returns La diferencia de a menos b, redondeada para precisión.
   * @throws {Error} Si alguno de los argumentos no es de tipo number.
   */
  public subtract(a: number, b: number): number {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error("Invalid input: Both arguments must be numbers.");
    }
    return this.round(a - b);
  }

  /**
   * Realiza la operación de multiplicación de dos números.
   * @param a El primer número.
   * @param b El segundo número.
   * @returns El producto de a y b, redondeado para precisión.
   * @throws {Error} Si alguno de los argumentos no es de tipo number.
   */
  public multiply(a: number, b: number): number {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error("Invalid input: Both arguments must be numbers.");
    }
    return this.round(a * b);
  }

  /**
   * Realiza la operación de división de dos números.
   * Maneja la división por cero retornando null.
   * @param a El dividendo.
   * @param b El divisor.
   * @returns El cociente de a dividido por b, redondeado para precisión, o null si el divisor es cero.
   * @throws {Error} Si alguno de los argumentos no es de tipo number.
   */
  public divide(a: number, b: number): number | null {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error("Invalid input: Both arguments must be numbers.");
    }
    if (b === 0) {
      // Retorna null según el requisito formal para división por cero.
      return null;
    }
    return this.round(a / b);
  }
}

// --- Ejemplos de uso (NO deben ejecutarse automáticamente al importar) ---
/*
// Crear una instancia de la calculadora
const calculator = new Calculator();

// Ejemplo de suma
const sumResult = calculator.add(0.1, 0.2);
console.log(`0.1 + 0.2 = ${sumResult}`); // Esperado: 0.3

// Ejemplo de resta
const subtractResult = calculator.subtract(5.3, 2.1);
console.log(`5.3 - 2.1 = ${subtractResult}`); // Esperado: 3.2

// Ejemplo de multiplicación
const multiplyResult = calculator.multiply(2.5, 4);
console.log(`2.5 * 4 = ${multiplyResult}`); // Esperado: 10

// Ejemplo de división
const divideResult = calculator.divide(10, 3);
console.log(`10 / 3 = ${divideResult}`); // Esperado: 3.3333333333

// Ejemplo de división por cero
const divideByZeroResult = calculator.divide(10, 0);
console.log(`10 / 0 = ${divideByZeroResult}`); // Esperado: null

// Ejemplo de manejo de errores (input inválido)
try {
  calculator.add(10, "abc" as any); // Forzamos un tipo incorrecto para el ejemplo
} catch (error: any) {
  console.error(`Error en la suma: ${error.message}`);
}
*/