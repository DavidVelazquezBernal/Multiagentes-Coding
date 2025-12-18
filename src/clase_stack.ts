export class Stack<T> {
  /**
   * Almacenamiento interno para los elementos de la pila.
   * Utiliza un array para simular el comportamiento LIFO.
   */
  private items: T[] = [];

  /**
   * Añade un elemento a la parte superior de la pila.
   * @param element El elemento de cualquier tipo a añadir a la pila.
   */
  public push(element: T): void {
    this.items.push(element);
  }

  /**
   * Remueve y devuelve el elemento superior de la pila.
   * Lanza un error si la pila está vacía.
   * @returns El elemento removido de la parte superior de la pila.
   * @throws Error Si la pila está vacía.
   */
  public pop(): T {
    if (this.isEmpty()) {
      throw new Error("Stack is empty. Cannot pop from an empty stack.");
    }
    // pop() en arrays de TypeScript/JavaScript devuelve `undefined` si el array está vacío,
    // pero nuestra comprobación `isEmpty()` lo previene, por lo que `as T` es seguro.
    return this.items.pop() as T;
  }

  /**
   * Devuelve el elemento superior de la pila sin removerlo.
   * Lanza un error si la pila está vacía.
   * @returns El elemento superior de la pila.
   * @throws Error Si la pila está vacía.
   */
  public peek(): T {
    if (this.isEmpty()) {
      throw new Error("Stack is empty. Cannot peek an empty stack.");
    }
    return this.items[this.items.length - 1];
  }

  /**
   * Verifica si la pila está vacía.
   * @returns `true` si la pila no contiene elementos, `false` en caso contrario.
   */
  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Devuelve el número actual de elementos en la pila.
   * @returns Un número entero que representa la cantidad de elementos en la pila.
   */
  public size(): number {
    return this.items.length;
  }
}

// Ejemplos de uso (NO se ejecutan automáticamente al importar):
/*
// Ejemplo 1: Pila de números
const numberStack = new Stack<number>();
console.log("Is stack empty?", numberStack.isEmpty()); // true
numberStack.push(10);
numberStack.push(20);
console.log("Stack size:", numberStack.size()); // 2
console.log("Peek:", numberStack.peek()); // 20
console.log("Pop:", numberStack.pop()); // 20
console.log("Stack size after pop:", numberStack.size()); // 1
console.log("Peek:", numberStack.peek()); // 10
numberStack.push(30);
console.log("Stack after push 30:", numberStack); // Stack { items: [ 10, 30 ] }
console.log("Pop:", numberStack.pop()); // 30
console.log("Pop:", numberStack.pop()); // 10
console.log("Is stack empty?", numberStack.isEmpty()); // true

try {
  numberStack.pop(); // Intentar pop en una pila vacía
} catch (error: any) {
  console.error("Error al hacer pop en pila vacía:", error.message); // Stack is empty. Cannot pop from an empty stack.
}

// Ejemplo 2: Pila de cadenas
const stringStack = new Stack<string>();
stringStack.push("Hola");
stringStack.push("Mundo");
console.log("String stack size:", stringStack.size()); // 2
console.log("String stack peek:", stringStack.peek()); // Mundo
console.log("String stack pop:", stringStack.pop()); // Mundo
*/