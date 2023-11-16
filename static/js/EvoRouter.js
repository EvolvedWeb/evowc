/* eslint-env browser */
//const PART_RE = /^(?<before>[^\:\(\n]+)?(?:(?<key>\:[\w]+)(?<size>[\?\+\*])?)?(?<re>\([^)\n]+\))?(?<after>[^\n]+)?$/;
const PART_RE = /^(?<before>[^\:\(\n]+)?(?:(?<key>\:[\w]+)(?<size>[\?\+\*])?)?(?<re>\([^)\n]+\))?(?<after>[^\n]+)?$/;
const RE_ESCAPE = /[\\\^$.*+?|()[\]{}]/g
const reEscape = str => (str || '').replace(RE_ESCAPE, (key) => `\\${key}`);
const reEscapeCharClasses = char => (['^', '\\', ']', '-'].includes(char)) ? `\\${char}` : char;
let evoStateIndex = 0;
let handlerId = 0n;
const handlers = {}

function processRoute() {
  const { location: {pathname } } = window;
  Object.values(handlers).forEach(handler => {
    const { cb, filter } = handler;
    try {
      let canCallCallback = true;
      if (filter) {
        if (filter instanceof RegExp) {
          canCallCallback = filter.test(pathname);
        }
        else {
          canCallCallback = pathname.startsWith(filter);
        }
      }

      if (canCallCallback) {
        cb();
      }
    }

    catch (ex) {
      console.error('Handler failed.');
    }
  })
}

window.addEventListener("evoPushState", () => {
  processRoute();
});
window.addEventListener("popstate", () => {
  processRoute();
});

// Export the router
export const router = {
  /**
   * @param {string} url - relative url to navigate to via pushState().
   * @param {object} state - An object which is associated with the history entry passed to pushState() or replaceState().
   * @param {boolean} replace - `true` call replaceState() instead of pushState().
   */
  navigate(url, state, replace = false) {
    const newState = { ...(state ?? {}), evoStateIndex };
    evoStateIndex++;
    if (replace) {
      history.replaceState(newState, '', url)
    }
    else {
      history.pushState(newState, '', url);
    }
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('evoPushState'));
    }, 0);
  },
  pathToRegex(path) {
    if (path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    let reIndex = 0;
    const pathParts = path.split('/');
    const pathPartsMax = pathParts.length - 1;
    const parts = pathParts.map((part, index) => {
      part = part.trim();

      if (!part) {
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
      else if (re) {
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
    path = `^${parts.join('')}$`;
    // console.log(path);
    return new RegExp(path);
  },
  oldPathToRegex(path) {
    if (path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    const parts = path.split('/').map(part => {
      part = part.trim();

      if (!part) {
        return '';
      }

      const temp = PART_RE.exec(part);
      if (!temp) {
        throw new Error('Invalid path format!');
      }

      let { before = '', key = '', size = '', re = '', after = '' } = temp.groups;

      if (key) {
        key = key.slice(1);
        key = `(?<${key}>(?:${re || '[^\\/\\n]'}+)?)${size}`;
      }
      else if (re) {
        key = `(?:${re})`;
      }

      return `(?:\\/${before}${key}${after}?)`;
    });

    path = `^${parts.join('')}\\/?$`;
    return new RegExp(path);
  },
  onUpdate(cb, filter = '') {
    if (typeof cb !== 'function') {
      throw new TypeError('The "cb" must be a function');
    }

    const key = `h${handlerId++}`;
    handlers[key] = { cb, filter };
    return () => {
      delete handlers[key];
    }
  }
}
