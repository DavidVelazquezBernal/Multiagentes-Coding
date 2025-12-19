export function checkBalancedBrackets(s: string): boolean {
  /**
   * Valida si una cadena de texto contiene paréntesis, corchetes y llaves balanceados.
   *
   * @param s La cadena de texto a validar.
   * @returns `true` si todos los paréntesis, corchetes y llaves están correctamente
   *          balanceados y anidados; `false` en caso contrario.
   *          Un string vacío o un string sin caracteres de corchetes se considera balanceado.
   */

  const stack: string[] = []; // Usamos un array como stack LIFO (Last-In, First-Out)
  const bracketMap: { [key: string]: string } = {
    '(': ')',
    '[': ']',
    '{': '}',
  };
  const openingBrackets = new Set<string>(Object.keys(bracketMap));
  const closingBrackets = new Set<string>(Object.values(bracketMap));

  for (const char of s) {
    if (openingBrackets.has(char)) {
      // Si el carácter es un corchete de apertura, lo añadimos al stack
      stack.push(char);
    } else if (closingBrackets.has(char)) {
      // Si el carácter es un corchete de cierre
      if (stack.length === 0) {
        // Si el stack está vacío, significa que hay un corchete de cierre sin su contraparte de apertura
        return false;
      }
      const lastOpenBracket = stack.pop(); // Sacamos el último corchete de apertura del stack

      // Verificamos si el corchete de cierre actual coincide con el último de apertura esperado
      if (lastOpenBracket === undefined || bracketMap[lastOpenBracket] !== char) {
        return false; // Mismatch de tipo o orden de cierre incorrecto
      }
    }
    // Ignoramos cualquier otro carácter que no sea un corchete
  }

  // Al final, si el stack está vacío, significa que todos los corchetes de apertura
  // tuvieron su correspondiente corchete de cierre.
  return stack.length === 0;
}

// Ejemplos de uso (NO se ejecutan automáticamente al importar)
/*
// console.log(`'{[()]}' es balanceado: ${checkBalancedBrackets('{[()]}')}`); // true
// console.log(`'([)]' es balanceado: ${checkBalancedBrackets('([)]')}`);   // false
// console.log(`'{[}' es balanceado: ${checkBalancedBrackets('{[}')}`);     // false
// console.log(`'' es balanceado: ${checkBalancedBrackets('')}`);           // true
// console.log(`'abc' es balanceado: ${checkBalancedBrackets('abc')}`);     // true
// console.log(`'((()' es balanceado: ${checkBalancedBrackets('((()')}`);   // false
// console.log(`']' es balanceado: ${checkBalancedBrackets(']')}`);         // false
// console.log(`'{' es balanceado: ${checkBalancedBrackets('{')}`);         // false
// console.log(`'foo(bar[baz])' es balanceado: ${checkBalancedBrackets('foo(bar[baz])')}`); // true
*/