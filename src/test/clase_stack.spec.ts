import { describe, it, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { Stack } from './clase_stack';

describe('Stack', () => {
  let stack: Stack<any>; // Using 'any' to allow testing with various data types

  // Arrange: Create a new stack instance before each test
  beforeEach(() => {
    stack = new Stack<any>();
  });

  // Test 1: Verify the initial state of an empty stack
  it('should initialize as an empty stack and verify its state', () => {
    // Arrange: Stack is initialized in beforeEach

    // Act
    const isEmptyResult = stack.isEmpty();
    const sizeResult = stack.size();

    // Assert
    expect(isEmptyResult).toBe(true);
    expect(sizeResult).toBe(0);
  });

  // Test 2: Push and Peek operations, covering various data types and checking stack state
  test.each([
    {
      description: 'push a number and verify its state',
      elementsToPush: [10],
      expectedSize: 1,
      expectedIsEmpty: false,
      expectedPeek: 10,
    },
    {
      description: 'push a string and verify its state',
      elementsToPush: ['hello'],
      expectedSize: 1,
      expectedIsEmpty: false,
      expectedPeek: 'hello',
    },
    {
      description: 'push an object and verify its state',
      elementsToPush: [{ id: 1, value: 'test' }],
      expectedSize: 1,
      expectedIsEmpty: false,
      expectedPeek: { id: 1, value: 'test' },
    },
    {
      description: 'push multiple elements and verify the top element and size',
      elementsToPush: [1, 2, 3],
      expectedSize: 3,
      expectedIsEmpty: false,
      expectedPeek: 3,
    },
    {
      description: 'push mixed types and verify the top element and size',
      elementsToPush: [1, 'two', { three: 3 }],
      expectedSize: 3,
      expectedIsEmpty: false,
      expectedPeek: { three: 3 },
    },
    {
      description: 'push null and verify its state',
      elementsToPush: [null],
      expectedSize: 1,
      expectedIsEmpty: false,
      expectedPeek: null,
    },
    {
      description: 'push undefined and verify its state',
      elementsToPush: [undefined],
      expectedSize: 1,
      expectedIsEmpty: false,
      expectedPeek: undefined,
    },
    {
      description: 'push 0 and verify its state (not -0/+0)',
      elementsToPush: [0],
      expectedSize: 1,
      expectedIsEmpty: false,
      expectedPeek: 0,
    },
  ])('$description', ({ elementsToPush, expectedSize, expectedIsEmpty, expectedPeek }: { description: string; elementsToPush: any[]; expectedSize: number; expectedIsEmpty: boolean; expectedPeek: any }) => {
    // Arrange: Stack is initialized in beforeEach

    // Act
    elementsToPush.forEach((element: any) => stack.push(element));
    const sizeResult = stack.size();
    const isEmptyResult = stack.isEmpty();
    const peekResult = stack.peek();

    // Assert
    expect(sizeResult).toBe(expectedSize);
    expect(isEmptyResult).toBe(expectedIsEmpty);
    expect(peekResult).toEqual(expectedPeek); // Use toEqual for deep comparison of objects
  });

  // Test 3: Pop operations, demonstrating LIFO behavior and state updates
  it('should pop elements in LIFO order and update stack state correctly', () => {
    // Arrange
    stack.push(10);
    stack.push(20);
    stack.push(30); // Current stack: [10, 20, 30]

    // Act & Assert: Pop the first element (30)
    expect(stack.size()).toBe(3);
    expect(stack.peek()).toBe(30);
    const popped1 = stack.pop();
    expect(popped1).toBe(30);
    expect(stack.size()).toBe(2);
    expect(stack.isEmpty()).toBe(false);
    expect(stack.peek()).toBe(20);

    // Act & Assert: Pop the second element (20)
    const popped2 = stack.pop();
    expect(popped2).toBe(20);
    expect(stack.size()).toBe(1);
    expect(stack.isEmpty()).toBe(false);
    expect(stack.peek()).toBe(10);

    // Act & Assert: Pop the last element (10)
    const popped3 = stack.pop();
    expect(popped3).toBe(10);
    expect(stack.size()).toBe(0);
    expect(stack.isEmpty()).toBe(true);
  });

  // Test 4: Error handling when attempting to pop from an empty stack
  it('should throw an error when popping from an empty stack', () => {
    // Arrange: Stack is empty from beforeEach

    // Act & Assert
    expect(() => stack.pop()).toThrow('Stack is empty. Cannot pop from an empty stack.');
  });

  // Test 5: Error handling when attempting to peek an empty stack
  it('should throw an error when peeking an empty stack', () => {
    // Arrange: Stack is empty from beforeEach

    // Act & Assert
    expect(() => stack.peek()).toThrow('Stack is empty. Cannot peek an empty stack.');
  });
});