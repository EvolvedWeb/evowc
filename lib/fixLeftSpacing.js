const SCRIPT_WHITESPACE_RE = /^\n*(?<whiteSpace>\s*)\w/;

export function fixLeftSpacing(text, indent = 4) {
  const rootExec = SCRIPT_WHITESPACE_RE.exec(text);
  /* istanbul ignore else*/
  if (rootExec) {
    let { whiteSpace = '' } = rootExec.groups;
    if (whiteSpace.length) {
      const wsRe = new RegExp(`(\n+)${whiteSpace}`, 'g');
      text = text.replace(wsRe, `$1${indent ? ' '.repeat(indent) : ''}`);
    }
  }
  return indent ? text : text.trim();
}
