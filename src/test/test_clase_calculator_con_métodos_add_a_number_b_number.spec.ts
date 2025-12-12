import { describe, it, expect, beforeEach } from 'vitest';
import { Calculator } from './clase_calculator_con_métodos_add_a_number_b_number';

describe('Calculator', () => {
  let calculator: Calculator;

  // Configura una nueva instancia de Calculator antes de cada test
  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    // Tests para casos normales (happy path)
    it('should correctly add two positive integers', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    it('should correctly add a positive and a negative integer', () => {
      expect(calculator.add(5, -2)).toBe(3);
    });

    it('should correctly add two negative integers', () => {
      expect(calculator.add(-5, -3)).toBe(-8);
    });

    // Tests para casos límite (edge cases)
    it('should correctly add zero to a number', () => {
      expect(calculator.add(7, 0)).toBe(7);
    });

    it('should correctly add two zeros', () => {
      expect(calculator.add(0, 0)).toBe(0);
    });

    it('should handle floating point addition with precision', () => {
      // 0.1 + 0.2 es 0.30000000000000004 en JS nativo, la clase lo redondea a 0.3
      expect(calculator.add(0.1, 0.2)).toBeCloseTo(0.3, 10);
    });

    it('should handle addition with large numbers', () => {
      expect(calculator.add(999999999999, 1)).toBeCloseTo(1000000000000, 0);
    });

    it('should handle addition with small decimal numbers', () => {
      expect(calculator.add(0.0000000001, 0.0000000002)).toBeCloseTo(0.0000000003, 10);
    });

    // Tests para manejo de errores y excepciones
    it('should throw an error if the first input is not a number', () => {
      expect(() => calculator.add('1' as any, 2)).toThrow('Error: Las entradas para la suma deben ser números.');
    });

    it('should throw an error if the second input is not a number', () => {
      expect(() => calculator.add(1, '2' as any)).toThrow('Error: Las entradas para la suma deben ser números.');
    });

    it('should throw an error if both inputs are not numbers', () => {
      expect(() => calculator.add('a' as any, 'b' as any)).toThrow('Error: Las entradas para la suma deben ser números.');
    });
  });

  describe('subtract', () => {
    // Tests para casos normales (happy path)
    it('should correctly subtract two positive integers', () => {
      expect(calculator.subtract(5, 2)).toBe(3);
    });

    it('should correctly subtract a larger number from a smaller number', () => {
      expect(calculator.subtract(2, 5)).toBe(-3);
    });

    it('should correctly subtract a negative number from a positive number', () => {
      expect(calculator.subtract(5, -2)).toBe(7);
    });

    it('should correctly subtract two negative numbers', () => {
      expect(calculator.subtract(-5, -2)).toBe(-3);
    });

    // Tests para casos límite (edge cases)
    it('should correctly subtract zero from a number', () => {
      expect(calculator.subtract(7, 0)).toBe(7);
    });

    it('should correctly subtract a number from zero', () => {
      expect(calculator.subtract(0, 7)).toBe(-7);
    });

    it('should correctly subtract two identical numbers', () => {
      expect(calculator.subtract(5, 5)).toBe(0);
    });

    it('should handle floating point subtraction with precision', () => {
      expect(calculator.subtract(0.3, 0.1)).toBeCloseTo(0.2, 10);
    });

    it('should handle subtraction with large numbers', () => {
      expect(calculator.subtract(1000000000000, 1)).toBeCloseTo(999999999999, 0);
    });

    // Tests para manejo de errores y excepciones
    it('should throw an error if the first input is not a number', () => {
      expect(() => calculator.subtract('1' as any, 2)).toThrow('Error: Las entradas para la resta deben ser números.');
    });

    it('should throw an error if the second input is not a number', () => {
      expect(() => calculator.subtract(1, '2' as any)).toThrow('Error: Las entradas para la resta deben ser números.');
    });
  });

  describe('multiply', () => {
    // Tests para casos normales (happy path)
    it('should correctly multiply two positive integers', () => {
      expect(calculator.multiply(4, 3)).toBe(12);
    });

    it('should correctly multiply a positive and a negative integer', () => {
      expect(calculator.multiply(4, -3)).toBe(-12);
    });

    it('should correctly multiply two negative integers', () => {
      expect(calculator.multiply(-4, -3)).toBe(12);
    });

    // Tests para casos límite (edge cases)
    it('should correctly multiply by zero', () => {
      expect(calculator.multiply(7, 0)).toBe(0);
    });

    it('should correctly multiply zero by zero', () => {
      expect(calculator.multiply(0, 0)).toBe(0);
    });

    it('should correctly multiply by one', () => {
      expect(calculator.multiply(7, 1)).toBe(7);
    });

    it('should handle floating point multiplication with precision', () => {
      // 0.1 * 0.2 es 0.020000000000000004 en JS nativo, la clase lo redondea a 0.02
      expect(calculator.multiply(0.1, 0.2)).toBeCloseTo(0.02, 10);
    });

    it('should handle multiplication with large numbers', () => {
      expect(calculator.multiply(1e9, 1e9)).toBeCloseTo(1e18, 0);
    });

    it('should handle multiplication with small decimal numbers', () => {
      expect(calculator.multiply(0.00001, 0.00001)).toBeCloseTo(0.0000000001, 10);
    });

    // Tests para manejo de errores y excepciones
    it('should throw an error if the first input is not a number', () => {
      expect(() => calculator.multiply('1' as any, 2)).toThrow('Error: Las entradas para la multiplicación deben ser números.');
    });

    it('should throw an error if the second input is not a number', () => {
      expect(() => calculator.multiply(1, '2' as any)).toThrow('Error: Las entradas para la multiplicación deben ser números.');
    });
  });

  describe('divide', () => {
    // Tests para casos normales (happy path)
    it('should correctly divide two positive integers', () => {
      expect(calculator.divide(10, 2)).toBe(5);
    });

    it('should correctly divide a positive by a negative integer', () => {
      expect(calculator.divide(10, -2)).toBe(-5);
    });

    it('should correctly divide a negative by a positive integer', () => {
      expect(calculator.divide(-10, 2)).toBe(-5);
    });

    it('should correctly divide two negative integers', () => {
      expect(calculator.divide(-10, -2)).toBe(5);
    });

    // Tests para casos límite (edge cases)
    it('should return an error string when dividing by zero', () => {
      expect(calculator.divide(7, 0)).toBe('Error: División por cero');
    });

    it('should correctly divide zero by a non-zero number', () => {
      expect(calculator.divide(0, 5)).toBe(0);
    });

    it('should handle floating point division with precision', () => {
      // 1 / 3 es 0.3333333333333333 en JS nativo, la clase lo redondea a 10 decimales
      expect(calculator.divide(1, 3)).toBeCloseTo(0.3333333333, 10);
    });

    it('should handle division with large numbers', () => {
      expect(calculator.divide(1e18, 1e9)).toBeCloseTo(1e9, 0);
    });

    it('should handle division resulting in a small decimal number', () => {
      expect(calculator.divide(1, 10000000000)).toBeCloseTo(0.0000000001, 10);
    });

    // Tests para manejo de errores y excepciones
    it('should throw an error if the first input is not a number', () => {
      expect(() => calculator.divide('10' as any, 2)).toThrow('Error: Las entradas para la división deben ser números.');
    });

    it('should throw an error if the second input is not a number', () => {
      expect(() => calculator.divide(10, '2' as any)).toThrow('Error: Las entradas para la división deben ser números.');
    });
  });
});