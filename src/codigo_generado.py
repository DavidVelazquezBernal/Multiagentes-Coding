import json
import re
from typing import Any, Dict, List, Union

def parse_llm_json_robustly(raw_input: str) -> Union[Dict[str, Any], List[Any]]:
    """
    Parses a string containing JSON, specifically designed to handle common LLM errors:
    - Markdown code blocks (```json ... ```).
    - Leading/trailing conversational text.
    - Truncated output due to token limits (MAX_TOKENS).
    
    Args:
        raw_input (str): The raw string output from the LLM.
        
    Returns:
        Union[Dict[str, Any], List[Any]]: The parsed JSON object or array.
        
    Raises:
        ValueError: If the input is empty or if no valid JSON can be recovered.
    """
    if not raw_input or not isinstance(raw_input, str):
        raise ValueError("Input must be a non-empty string.")

    # 1. Clean Markdown wrappers and whitespace
    content = re.sub(r'```(?:json)?\s*([\s\S]*?)\s*```', r'\1', raw_input).strip()

    # 2. Try standard parsing immediately
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        pass

    # 3. Locate the starting point of the JSON structure
    start_brace = content.find('{')
    start_bracket = content.find('[')
    
    if start_brace == -1 and start_bracket == -1:
        raise ValueError("No JSON structure (Object or Array) found in the input.")
    
    # Determine which starts first
    if start_brace != -1 and (start_bracket == -1 or start_brace < start_bracket):
        start_idx = start_brace
    else:
        start_idx = start_bracket

    candidate = content[start_idx:].strip()

    # 4. Attempt to find a valid JSON sub-string (handles trailing text after JSON)
    # We iterate backwards from the end to find the largest valid JSON block
    for i in range(len(candidate), 0, -1):
        try:
            return json.loads(candidate[:i])
        except json.JSONDecodeError:
            continue

    # 5. Recovery for Truncated JSON (MAX_TOKENS scenario)
    # Attempt to balance open braces/brackets that were never closed
    stack = []
    for char in candidate:
        if char == '{':
            stack.append('}')
        elif char == '[':
            stack.append(']')
        elif char == '}':
            if stack and stack[-1] == '}':
                stack.pop()
        elif char == ']':
            if stack and stack[-1] == ']':
                stack.pop()
    
    if stack:
        # Append missing closing characters in reverse order of opening
        recovered_candidate = candidate + "".join(reversed(stack))
        try:
            return json.loads(recovered_candidate)
        except json.JSONDecodeError:
            pass

    # 6. Final attempt: basic regex extraction for very messy strings
    # Try to find anything between the first { and last } or first [ and last ]
    match = re.search(r'(\{.*\}|\[.*\])', content, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Failed to parse or recover JSON. Original content snippet: {content[:100]}...")