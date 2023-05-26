const SCRIPT_WHITESPACE_RE = /^\n*(?<whiteSpace>\s*)\w/;

function fixLeftSpacing(text, indent = 4) {
  const rootExec = SCRIPT_WHITESPACE_RE.exec(text);
  if (rootExec) {
    let { whiteSpace = '' } = rootExec.groups;
    if (whiteSpace.length) {
      const wsRe = new RegExp(`\n${whiteSpace}`, 'g');
      text = text.replace(wsRe, `\n${indent ? ' '.repeat(indent) : ''}`);
    }
  }
  return indent ? text : text.trim();
}

module.exports = fixLeftSpacing;