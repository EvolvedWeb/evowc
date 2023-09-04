const PART_RE = /^(?<before>[^\:\(\n]+)?(?:(?<key>\:[\w]+)(?<size>[\?\+\*])?)?(?<re>\([^)\n]+\))?(?<after>[^\n]+)?$/; 

function pathToRegex(path) {
  if (path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  const parts = path.split('/').map(part => {
    part = part.trim();

    if(!part) {
      return '/';
    }

    const temp = PART_RE.exec(part);
    if (!temp) {
      throw new Error('Invalid path format!');
    }

    let { before = '', key = '', size = '', re = '', after = '' } = temp.groups;

    if (key) {
      key = key.slice(1);
      key = `(?:\\/(?<${key}>(?:${re || '[^\\/\\n]'}+)?)${size})`;
    }
    else if(re) {
      key = `(?:\\/(?:${re}))`;
    }

    return `${before}${key}${after}`;
  });

  path = `^${parts.join('')}$`;
  return new RegExp(path);
}

module.exports = pathToRegex;
/*
const re = pathToRegex('/testing/:id*');
console.log(re);
console.log(re.exec('/testing'));
console.log(re.exec('/testing/'));
console.log(re.exec('/testing/one'));
console.log(re.exec('/testing/two'));
console.log(re.exec('/testing/one/a.b'));
console.log(re.exec('/testing/two/a-b'));
/*
 * ** No parameters /some/thing
 * ** Named parameters: /profile/:user
 * ** Regex parameter /thing/(\d{2,4})
 * ** Optional parameters: /:size/:color?
 * ** Zero-or-more segments: /kb/:path*
 * ** One-or-more segments: /kb/:path+
 * ? Sub-named parameter: /image-:size.jpg
 * ? Sub-Regex parameter: /image.(jpg|jpeg)
 * ? Regex named parameter patterns: /image-:size(\d+)px
 */


