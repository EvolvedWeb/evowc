// Import the WcRouteElement component code
//import "./components/WcRouteElement.js";
// Import the WcLinkElement component code
//import "./components/WcLinkElement.js;"

const PART_RE = /^(?<before>[^\:\(\n]+)?(?:(?<key>\:[\w]+)(?<size>[\?\+\*])?)?(?<re>\([^)\n]+\))?(?<after>[^\n]+)?$/;
let evoStateIndex = 0;
let handlerId = 0;
const handlers = {}

function processRoute() {
  Object.values(handlers).forEach(handler => {
    try {
      handler();
    }

    catch(ex) {
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
      console.log(location);
    }
    else {
      history.pushState(newState, '', url);
      console.log(location);
    }
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('evoPushState'));
    }, 0);
  },
  pathToRegex(path) {
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

      return `(?:\\/${before}${key}${after})`;
    });

    path = `^${parts.join('')}$`;
    return new RegExp(path);
  },
  onUpdate(eventHandler) {
    if(typeof eventHandler !== 'function') {
      throw new TypeError('The "eventHandler" must be a function');
    }

    const key = `h${handlerId++}`;
    handlers[key] = eventHandler;
    return () => {
      delete handlers[key];
    }
  }
}
