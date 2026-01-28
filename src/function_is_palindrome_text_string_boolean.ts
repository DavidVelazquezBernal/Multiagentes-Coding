/**
 * Determina si una cadena de texto es un palíndromo, ignorando diferencias 
 * entre mayúsculas y minúsculas, así como espacios en blanco.
 * 
 * @param text - La cadena a evaluar.
 * @returns true si el texto es un palíndromo, false en caso contrario.
 * @throws Error si la entrada no es una cadena de texto válida.
 */
export function isPalindrome(text: string): boolean {
  // Validación de entrada
  if (typeof text !== 'string') {
    throw new Error("La entrada debe ser una cadena de texto válida.");
  }

  // Normalización: convertir a minúsculas y eliminar todos los espacios en blanco
  // Usamos una expresión regular con el flag 'g' para eliminar todos los espacios (\s)
  const normalizedText = text.toLowerCase().replace(/\s+/g, '');

  // Si la cadena está vacía después de normalizar, se considera palíndromo por definición técnica
  if (normalizedText.length === 0) {
    return true;
  }

  // Generar la versión invertida de la cadena normalizada
  // 1. split('') convierte el string en array de caracteres
  // 2. reverse() invierte el orden del array
  // 3. join('') vuelve a unir los caracteres en un string
  const reversedText = normalizedText.split('').reverse().join('');

  // Comparar la cadena original normalizada con su versión invertida
  return normalizedText === reversedText;
}