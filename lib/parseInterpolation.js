export const EXP = 'EXP';
export const TXT = 'TXT';

const UNESCAPE_RE = /\\([{}\\])/g;
const unescape = str => str.replace(UNESCAPE_RE, "$1");
export function parseInterpolation(inputStr, treatAsCPA = true) {
  const parsedResult = {
    original: inputStr,
    parts: []
  };

  // Function to split the string based on non-escaped curly braces
  function splitString(str) {
    let braceLevel = 0;
    let currentPart = '';
    let i = 0;

    while (i < str.length) {
      const char = str[i];

      if (char === "\\" && i + 1 < str.length && "{}\\".includes(str[i + 1])) {
        currentPart += str[i + 1]; // Add the escaped character without the escape backslash
        i += 2; // Skip the escaped character
        continue;
      }

      if (char === '{') {
        // Throw error if braceLevel > 0
        if (braceLevel === 0 && currentPart.length > 0) {
          parsedResult.parts.push({ type: TXT, value: currentPart });
          currentPart = '';
        }
        braceLevel++;
        i++;
        continue;
      }

      if (char === '}') {
        braceLevel--;
        if (braceLevel === 0 && currentPart.length > 0) {
          parsedResult.parts.push({ type: EXP, value: currentPart });
          currentPart = '';
        }
        i++;
        continue
      }

      currentPart += char;
      i++;
    }

    // Add remaining part
    if (currentPart.length > 0) {
      // Throw error if braceLevel > 0
      const type = braceLevel > 0 ? EXP : TXT;
      parsedResult.parts.push({ type, value: currentPart });
    }
  }

  // Check if the string contains non-escaped curly braces
  const containsNonEscapedBraces = /(?<!\\)\{.*?(?<!\\)\}/.test(inputStr);

  if (!containsNonEscapedBraces) {
    if (treatAsCPA) {
      parsedResult.parts.push({ type: EXP, value: unescape(inputStr) });
    }
    else {
      parsedResult.parts.push({ type: TXT, value: unescape(inputStr) });
    }

    return parsedResult;
  }

  splitString(inputStr);
  return parsedResult;
}