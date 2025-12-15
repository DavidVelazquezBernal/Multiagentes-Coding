/**
 * Clase Calculator que implementa las operaciones aritméticas básicas.
 * Proporciona métodos para sumar, restar, multiplicar y dividir números,
 * gestionando la precisión de los números de punto flotante y la división por cero.
 */
export class Calculator {
  /**
   * Realiza la suma de dos números.
   * @param num1 El primer número.
   * @param num2 El segundo número.
   * @returns La suma de num1 y num2, redondeada para evitar errores de precisión binaria.
   */
  add(num1: number, num2: number): number {
    const result = num1 + num2;
    // Redondea el resultado para evitar errores de precisión binaria con números de punto flotante.
    return Math.round(result * 1e10) / 1e10;
  }

  /**
   * Realiza la resta de dos números.
   * @param num1 El primer número (minuendo).
   * @param num2 El segundo número (sustraendo).
   * @returns La resta de num1 y num2, redondeada para evitar errores de precisión binaria.
   */
  subtract(num1: number, num2: number): number {
    const result = num1 - num2;
    // Redondea el resultado para evitar errores de precisión binaria con números de punto flotante.
    return Math.round(result * 1e10) / 1e10;
  }

  /**
   * Realiza la multiplicación de dos números.
   * @param num1 El primer número.
   * @param num2 El segundo número.
   * @returns El producto de num1 y num2, redondeado para evitar errores de precisión binaria.
   */
  multiply(num1: number, num2: number): number {
    const result = num1 * num2;
    // Redondea el resultado para evitar errores de precisión binaria con números de punto flotante.
    return Math.round(result * 1e10) / 1e10;
  }

  /**
   * Realiza la división de dos números.
   * Maneja la división por cero retornando un mensaje de error específico.
   * @param num1 El dividendo.
   * @param num2 El divisor.
   * @returns El cociente de num1 y num2 si num2 no es cero (redondeado para precisión),
   *          o una cadena de texto con un mensaje de error si num2 es cero.
   */
  divide(num1: number, num2: number): number | string {
    if (num2 === 0) {
      return 'Error: División por cero';
    }
    const result = num1 / num2;
    // Redondea el resultado para evitar errores de precisión binaria con números de punto flotante.
    return Math.round(result * 1e10) / 1e10;
  }
}

// Ejemplos de uso (NO deben ejecutarse automáticamente al importar el código)
/*
const calculator = new Calculator();

// Ejemplos de suma
console.log('Suma (10 + 5):', calculator.add(10, 5)); // Salida esperada: 15
console.log('Suma (0.1 + 0.2):', calculator.add(0.1, 0.2)); // Salida esperada: 0.3 (precisión manejada)

// Ejemplos de resta
console.log('Resta (10 - 5):', calculator.subtract(10, 5)); // Salida esperada: 5
console.log('Resta (5.5 - 2.3):', calculator.subtract(5.5, 2.3)); // Salida esperada: 3.2 (precisión manejada)

// Ejemplos de multiplicación
console.log('Multiplicación (10 * 5):', calculator.multiply(10, 5)); // Salida esperada: 50
console.log('Multiplicación (2.5 * 4):', calculator.multiply(2.5, 4)); // Salida esperada: 10

// Ejemplos de división
console.log('División (10 / 2):', calculator.divide(10, 2)); // Salida esperada: 5
console.log('División (1 / 3):', calculator.divide(1, 3)); // Salida esperada: 0.3333333333 (precisión manejada)
console.log('División por cero (10 / 0):', calculator.divide(10, 0)); // Salida esperada: 'Error: División por cero'
*/