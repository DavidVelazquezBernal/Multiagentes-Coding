/**
 * Determina si una cadena de texto es un palíndromo, ignorando diferencias entre
 * mayúsculas y minúsculas y omitiendo los espacios en blanco.
 * 
 * @param text - La cadena de caracteres a evaluar.
 * @returns true si la cadena procesada es un palíndromo, false en caso contrario.
 * @throws Error si la entrada no es de tipo string.
 */
export function isPalindrome(text: string): boolean {
    // Verificación de tipo en tiempo de ejecución para mayor robustez
    if (typeof text !== 'string') {
        throw new Error("La entrada debe ser una cadena de texto válida.");
    }

    // Normalización: 
    // 1. Eliminar espacios en blanco usando una expresión regular global.
    // 2. Convertir a minúsculas para ignorar case sensitivity.
    const normalizedText = text.replace(/\s+/g, '').toLowerCase();

    // Si la cadena está vacía después de limpiar espacios, se considera palíndromo trivial 
    // o se puede ajustar según reglas de negocio específicas. Aquí retornamos true.
    if (normalizedText.length === 0) {
        return true;
    }

    // Comparación eficiente mediante el uso de dos punteros
    let left = 0;
    let right = normalizedText.length - 1;

    while (left < right) {
        if (normalizedText[left] !== normalizedText[right]) {
            return false;
        }
        left++;
        right--;
    }

    return true;
}