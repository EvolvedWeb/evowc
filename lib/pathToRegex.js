const PART_RE = /^(?<before>[^\:\(\n]+)?(?:(?<key>\:[\w]+)(?<size>[\?\+\*])?)?(?<re>\([^)\n]+\))?(?<after>[^\n]+)?$/; 


const RE_ESCAPE = /[\\\^$.*+?|()[\]{}]/g
const reEscape = str => (str||'').replace(RE_ESCAPE, (key) => `\\${key}`);
const reEscapeCharClasses = char => (['^','\\',']','-'].includes(char)) ? `\\${char}` : char;

function pathToRegex(path) {
  if (path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  let reIndex = 0;
  const pathParts = path.split('/');
  const pathPartsMax = pathParts.length-1;
  const parts = pathParts.map((part, index) => {
    part = part.trim();

    if(!part) {
      return '/';
    }

    const temp = PART_RE.exec(part);
    if (!temp) {
      throw new Error('Invalid path format!');
    }

    // console.log('\n----------');
    // console.log(temp);
    let { before = '', key = '', size = '', re = '', after = '' } = temp.groups;

    // console.log({ before, key, size, re, after });

    if (re) {
      re = `(?:${re.slice(1, -1).trim()})`;
    }
    // console.log(re);

    // console.log({ index, pathPartsMax, before, key, size, re, after });
    if (key) {
      key = key.slice(1);
      const lastOne = (index >= pathPartsMax) && !after;
      if (size) {
        if (!(before || after)) {
          key = `/?(?<${key}>(?${re ? `<re${++reIndex}>${re}` : `:[^\\/\\n${after ? reEscapeCharClasses(after[0]) : ''}]+`}/?)${size})`;
        }
        else {
          key = `(?<${key}>(?${re ? `<re${++reIndex}>${re}` : `:[^\\/\\n${after ? reEscapeCharClasses(after[0]) : ''}]+`})${size})`;
        }
      }
      else {
        key = `(?<${key}>(?${re ? `<re${++reIndex}>${re}` : `:[^\\/\\n${after ? reEscapeCharClasses(after[0]) : ''}]+`})${lastOne ? '?' : ''})`;
      }

      // if (lastOne && !(before || after)) {
      //   key += '/?';
      // }
    }
    else if(re) {
      key = `(?<re${++reIndex}>${re})`;
    }

    before = reEscape(before);
    after = reEscape(after);
    if (index > 1 && !size) {
      before = `/${before}`;
    }

    return `${before}${key}${after}`;
  });

  // console.log(parts);
  path = `^${parts.join('')}\/?$`;
  // console.log(path);
  return new RegExp(path);
}

module.exports = pathToRegex;
