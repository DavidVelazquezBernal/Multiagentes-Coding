/**
 * Clase Calculator que implementa las operaciones aritméticas básicas.
 * Maneja la precisión de punto flotante para los resultados y la división por cero.
 */
export class Calculator {

  /**
   * Redondea un número para mitigar errores de precisión de punto flotante.
   * Utiliza una precisión de 10 decimales.
   * @param value El número a redondear.
   * @returns El número redondeado.
   */
  private roundResult(value: number): number {
    return Math.round(value * 1e10) / 1e10;
  }

  /**
   * Realiza la suma de dos números.
   * @param a El primer sumando.
   * @param b El segundo sumando.
   * @returns El resultado de la suma, redondeado para precisión.
   * @throws {Error} Si alguna de las entradas no es un número.
   */
  public add(a: number, b: number): number {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Error: Las entradas para la suma deben ser números.');
    }
    const result = a + b;
    return this.roundResult(result);
  }

  /**
   * Realiza la resta de dos números.
   * @param a El minuendo.
   * @param b El sustraendo.
   * @returns El resultado de la resta, redondeado para precisión.
   * @throws {Error} Si alguna de las entradas no es un número.
   */
  public subtract(a: number, b: number): number {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Error: Las entradas para la resta deben ser números.');
    }
    const result = a - b;
    return this.roundResult(result);
  }

  /**
   * Realiza la multiplicación de dos números.
   * @param a El primer factor.
   * @param b El segundo factor.
   * @returns El resultado de la multiplicación, redondeado para precisión.
   * @throws {Error} Si alguna de las entradas no es un número.
   */
  public multiply(a: number, b: number): number {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Error: Las entradas para la multiplicación deben ser números.');
    }
    const result = a * b;
    return this.roundResult(result);
  }

  /**
   * Realiza la división de dos números.
   * @param a El dividendo.
   * @param b El divisor.
   * @returns El resultado de la división, redondeado para precisión, o una cadena de error si el divisor es cero.
   * @throws {Error} Si alguna de las entradas no es un número.
   */
  public divide(a: number, b: number): number | string {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Error: Las entradas para la división deben ser números.');
    }
    if (b === 0) {
      return 'Error: División por cero';
    }
    const result = a / b;
    return this.roundResult(result);
  }
}

// Ejemplos de uso (NO deben ejecutarse automáticamente al importar el código):
/*
const calculator = new Calculator();

// Suma
console.log('Suma (2 + 3):', calculator.add(2, 3)); // Esperado: 5
console.log('Suma (0.1 + 0.2):', calculator.add(0.1, 0.2)); // Esperado: 0.3

// Resta
console.log('Resta (5 - 2):', calculator.subtract(5, 2)); // Esperado: 3
console.log('Resta (0.3 - 0.1):', calculator.subtract(0.3, 0.1)); // Esperado: 0.2

// Multiplicación
console.log('Multiplicación (4 * 3):', calculator.multiply(4, 3)); // Esperado: 12
console.log('Multiplicación (0.1 * 0.2):', calculator.multiply(0.1, 0.2)); // Esperado: 0.02

// División
console.log('División (10 / 2):', calculator.divide(10, 2)); // Esperado: 5
console.log('División (7 / 0):', calculator.divide(7, 0)); // Esperado: 'Error: División por cero'
console.log('División (1 / 3):', calculator.divide(1, 3)); // Esperado: 0.3333333333

// Manejo de errores para entradas no numéricas
try {
  calculator.add(1, 'a' as any);
} catch (e: any) {
  console.error(e.message); // Esperado: Error: Las entradas para la suma deben ser números.
}
*/