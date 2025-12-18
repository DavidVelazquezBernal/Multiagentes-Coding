export function quickSort(arr: number[]): number[] {
  // Manejo de errores básicos: Verificar si la entrada es realmente un array.
  if (!Array.isArray(arr)) {
    throw new TypeError("La entrada debe ser un array.");
  }

  // Manejo de errores básicos: Verificar si todos los elementos del array son números.
  // `some` comprueba si al menos un elemento no es de tipo 'number'.
  if (arr.some(item => typeof item !== 'number')) {
    throw new TypeError("Todos los elementos del array deben ser números.");
  }

  // Caso base: Un array con 0 o 1 elemento ya está ordenado.
  if (arr.length <= 1) {
    return arr;
  }

  // Seleccionar un pivote: Se elige el elemento del medio para una eficiencia promedio.
  // Esto ayuda a evitar los peores escenarios en arrays ya ordenados o inversamente ordenados.
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr[pivotIndex];

  // Crear dos sub-arrays: uno para elementos estrictamente menores que el pivote,
  // y otro para elementos mayores o iguales que el pivote.
  const left: number[] = [];
  const right: number[] = [];

  // Particionar el array: Iterar a través del array original.
  for (let i = 0; i < arr.length; i++) {
    // Saltarse el elemento pivote en la partición actual para evitar añadirlo a left/right.
    if (i === pivotIndex) {
      continue;
    }

    if (arr[i] < pivot) {
      left.push(arr[i]); // Elementos menores que el pivote van a la izquierda.
    } else {
      right.push(arr[i]); // Elementos mayores o iguales que el pivote van a la derecha.
    }
  }

  // Recursivamente ordenar los sub-arrays izquierdo y derecho,
  // y luego combinarlos con el pivote en el medio.
  // El operador spread '...' se utiliza para concatenar los arrays.
  return [...quickSort(left), pivot, ...quickSort(right)];
}