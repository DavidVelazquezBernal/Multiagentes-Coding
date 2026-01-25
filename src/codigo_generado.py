import json
import re
from typing import Dict, Any

def handle_api_parsing_error(raw_error_message: str) -> Dict[str, Any]:
    """
    Analiza y extrae información estructurada de un error de parsing de API,
    específicamente diseñado para manejar fallos 503 (Servicio no disponible)
    cuando el LLM devuelve un error de red o sobrecarga en lugar de un JSON válido.

    Args:
        raw_error_message (str): El mensaje de error o traceback recibido del sistema.

    Returns:
        Dict[str, Any]: Diccionario con el código de error, mensaje y estado normalizado.

    Raises:
        ValueError: Si la entrada no es válida para ser procesada.
    """
    if not isinstance(raw_error_message, str) or not raw_error_message.strip():
        raise ValueError("La entrada debe ser una cadena de texto no vacía.")

    # Estructura de respuesta por defecto para errores de sistema
    parsed_response = {
        "success": False,
        "error_code": 500,
        "message": "Error de procesamiento desconocido",
        "status": "INTERNAL_ERROR"
    }

    try:
        # Intentar extraer el bloque de datos JSON/Dict que suele venir al final del traceback
        # Se normalizan los saltos de línea y se busca contenido entre llaves
        normalized_str = raw_error_message.replace('\n', ' ')
        json_match = re.search(r'(\{.*\})', normalized_str)

        if json_match:
            # Las APIs a veces devuelven repr() de Python (comillas simples) en lugar de JSON puro
            raw_content = json_match.group(1).replace("'", '"')
            data = json.loads(raw_content)

            # Si el contenido está envuelto en una clave 'error' (estándar Google/OpenAI)
            if isinstance(data, dict) and "error" in data:
                err_detail = data["error"]
                parsed_response.update({
                    "error_code": err_detail.get("code", 503),
                    "message": err_detail.get("message", "Servicio sobrecargado"),
                    "status": err_detail.get("status", "UNAVAILABLE")
                })
            else:
                parsed_response.update(data)
        else:
            # Fallback: Búsqueda de códigos HTTP conocidos si no hay JSON
            if "503" in raw_error_message or "UNAVAILABLE" in raw_error_message:
                parsed_response.update({
                    "error_code": 503,
                    "message": "El modelo está sobrecargado. Inténtelo de nuevo más tarde.",
                    "status": "UNAVAILABLE"
                })
            elif "500" in raw_error_message:
                parsed_response.update({
                    "error_code": 500,
                    "message": "Error interno del servidor de la API.",
                    "status": "INTERNAL_SERVER_ERROR"
                })

    except (json.JSONDecodeError, KeyError, Exception) as e:
        # En caso de fallo en la extracción, se preserva el error original de forma segura
        parsed_response["message"] = f"Error al parsear respuesta original: {str(e)}"
        parsed_response["status"] = "PARSING_FAILURE"

    return parsed_response