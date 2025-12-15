import { describe, it, expect, beforeEach } from 'vitest';
import { Calculator } from './calculator';

describe('Calculator', () => {
    let calc: Calculator;

    beforeEach(() => {
        calc = new Calculator();
    });

    describe('add', () => {
        it('should add two positive numbers', () => {
            expect(calc.add(5, 3)).toBe(8);
        });

        it('should add negative numbers', () => {
            expect(calc.add(-5, -3)).toBe(-8);
        });
    });

    describe('subtract', () => {
        it('should subtract two numbers', () => {
            expect(calc.subtract(5, 3)).toBe(2);
        });
    });

    describe('multiply', () => {
        it('should multiply two numbers', () => {
            expect(calc.multiply(5, 3)).toBe(15);
        });
    });

    describe('divide', () => {
        it('should divide two numbers', () => {
            expect(calc.divide(6, 3)).toBe(2);
        });

        it('should throw error when dividing by zero', () => {
            expect(() => calc.divide(5, 0)).toThrow('División por cero no permitida');
        });
    });
});