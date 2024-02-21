/* eslint-env browser */
//const PART_RE = /^(?<before>[^\:\(\n]+)?(?:(?<key>\:[\w]+)(?<size>[\?\+\*])?)?(?<re>\([^)\n]+\))?(?<after>[^\n]+)?$/;
const PART_RE = /^(?<before>[^\:\(\n]+)?(?:(?<key>\:[\w]+)(?<size>[\?\+\*])?)?(?<re>\([^)\n]+\))?(?<after>[^\n]+)?$/;
const RE_ESCAPE = /[\\\^$.*+?|()[\]{}]/g
const reEscape = str => (str || '').replace(RE_ESCAPE, (key) => `\\${key}`);
const reEscapeCharClasses = char => (['^', '\\', ']', '-'].includes(char)) ? `\\${char}` : char;
let evoStateIndex = 0;
let handlerId = 0n;
const handlers = {}

/**
 * Convert the query parameters string into an object
 * @param {string} qs - Query Parameters in string format "page=1&search=testing"
 * @returns {object}
 */
export function parseQueryParams(qs = '') {
  if (typeof qs !== 'string' || qs.length === 0) {
    return {};
  }

  const params = {};
  qs = qs[0] === '?' ? qs.substring(1) : qs;

  qs.split('&').forEach(pair => {
    /** @type {string} */ let key;
    /** @type {string|boolean|number} */ let value;
    ([key, value] = pair.split('='));

    key = decodeURIComponent(key.replace(/\+/g, ' ')).trim();
    value = decodeURIComponent(value.replace(/\+/g, ' '));

    const valueLc = value.toLowerCase()
    if (['true', 'false'].includes(valueLc)) {
      value = valueLc === 'true';
    }
    // @ts-ignore
    else if (!isNaN(value)) {
      // If the string starts with a '0' and not '0x', '0b', '0o', '0e', or '0.' then treat it like a string
      if (value[0] !== '0' || 'xXbBoOeE.'.includes(value[1])) {
        const num = Number(value);
        if (num <= Number.MAX_VALUE) {
          value = num;
        }
      }
    }

    // Check if the key contains dot (.) or square brackets ([ or ]), indicating a complex object
    if (/\[.*\]|\./.test(key)) {
      let levels = key.split(/[\.\[\]]/).filter(Boolean); // Split key into parts and remove empty strings
      let ref = params; // Reference to current level of params object
      levels.forEach((level, index) => {
        if (index === levels.length - 1) {
          // If it's the last level, assign the value
          if (Array.isArray(ref[level])) {
            // If it's already an array, push to it
            ref[level].push(value);
          } else if (ref[level] !== undefined) {
            // If the key already exists, convert to array
            ref[level] = [ref[level], value];
          } else {
            // Otherwise, just set the value
            ref[level] = value;
          }
        } else {
          // If not the last level, progress the reference deeper into the object
          if (!ref[level]) {
            // If the next level is an array index, initialize an array, otherwise an object
            // @ts-ignore
            ref[level] = isNaN(levels[index + 1]) ? {} : [];
          }
          ref = ref[level]; // Update reference to point to next level
        }
      });
    } else {
      // Handle simple key-value pairs
      if (params[key]) {
        // If key already exists, convert to array or push to existing array
        if (Array.isArray(params[key])) {
          params[key].push(value);
        } else {
          params[key] = [params[key], value];
        }
      } else {
        // Otherwise, just set the value
        params[key] = value;
      }
    }
  });

  return params;
}

function processRoute() {
  const { location } = window;
  const { pathname, search, hash } = location;
  const query = parseQueryParams(search);

  // Check to see which callbacks need to be called and call them
  Object.values(handlers).forEach(handler => {
    const { callback, filter/*, from*/ } = handler;
    try {
      let canCallCallback = true;
      if (filter) {
        if (filter instanceof RegExp) {
          //console.log({filter});
          canCallCallback = filter.test(location.pathname);
        }
        else {
          canCallCallback = location.pathname.startsWith(filter);
        }
      }

      if (canCallCallback) {
        //console.log(`onUpdate called from "${from}"`);
        callback({ pathname, search, query, hash: hash.slice(1) });
      }
    }

    catch (ex) {
      console.error('Handler failed.', ex.stack);
    }
  })
}

window.addEventListener("evoPushState", processRoute);
window.addEventListener("popstate", processRoute);
window.addEventListener("hashchange", processRoute);

// Export the router
export const router = {
  /**
   * @param {string} url - relative url to navigate to via pushState().
   * @param {object} state - An object which is associated with the history entry passed to pushState() or replaceState().
   * @param {boolean} [replace=false] - `true` call replaceState() instead of pushState().
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
      // The RegEx below will exclude the trailing '/'.
      // Now I need to integrate it into the code inside the if(key) block below
      // This is current output: /^\/test\/four\/?(?<thing>(?:[^/\n]+\/?)?)\/?$/
      // New output:             /^\/test\/four\/?(?<thing>[^/\n]+(?:\/[^/\n]+)*)\/?$/
      if (key) {
        key = key.slice(1);
        const lastOne = (index >= pathPartsMax) && !after;
        if (size) {
          if (!(before || after)) {
            key = `/?(?<${key}>(?${re ? `<re${++reIndex}>${re}` : `:[^/\\n${after ? reEscapeCharClasses(after[0]) : ''}]+`}/?)${size})`;
          }
          else {
            key = `(?<${key}>(?${re ? `<re${++reIndex}>${re}` : `:[^/\\n${after ? reEscapeCharClasses(after[0]) : ''}]+`})${size})`;
          }
        }
        else {
          key = `(?<${key}>(?${re ? `<re${++reIndex}>${re}` : `:[^/\\n${after ? reEscapeCharClasses(after[0]) : ''}]+`})${lastOne ? '?' : ''})`;
        }
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

    path = `^${parts.join('')}/?$`;
    const re = new RegExp(path);
    //console.log(re);
    return re;
  },
  onUpdate(callback, filter = '') {
    if (typeof callback !== 'function') {
      throw new TypeError('The "callback" must be a function');
    }

    const key = `h${handlerId++}`;
    const from = (new Error()).stack.split(/\r*\n/g)[2].replace('    at ', '');
    handlers[key] = { callback, filter, from };
    return () => {
      delete handlers[key];
    }
  }
}

/*
Route Transition Management updates based on conversation with chatGPT

Integrating Route Transition Management into the `processRoute` function can be a strategic
approach, especially if you aim to encapsulate the routing logic more tightly and ensure
that all route transitions go through a standardized process. This method allows you to
handle route transitions more dynamically based on the current `location` and execute
associated callbacks conditionally, with the ability to include before and after hooks as
part of your route handling logic.

To incorporate Route Transition Management effectively into `processRoute`, consider the
following enhancements:

### Enhancing `processRoute` for Transition Management

1. **Integration with Async Route Handlers**: If you plan to include asynchronous operations
   as part of your route transitions (e.g., data fetching, authentication checks), modify
   your callback execution to support `async` functions. This might involve marking the
   callback invocation with `await` and making `processRoute` an `async` function.

2. **Before and After Hooks**: Incorporate beforeEnter and afterEnter hooks directly within
   your route handling logic. You may also include beforeLeave hooks to manage transitions
   away from the current route. These hooks can be defined as part of your route definitions
   and checked within `processRoute`.

3. **Conditional Execution Based on Route Matching**: Enhance the filtering logic to not
   only decide whether a callback can be called based on the path but also to determine
   which route-specific beforeEnter and afterEnter hooks need to be executed. This requires
   keeping track of the current route and potentially the previous route to manage
   beforeLeave hooks.

4. **Error Handling and Fallbacks**: Ensure robust error handling within `processRoute`,
   especially when dealing with asynchronous operations. Provide fallbacks or redirects
   in case of errors or unauthorized access attempts detected by your route transition
   hooks.

### Example with Asynchronous Route Handlers and Hooks

Here's a conceptual example of how `processRoute` could be structured to incorporate these
concepts:

```javascript
class EvoRouter {
  constructor() {
    this.currentRoute = null;
    this.routes = []; // Array to store route definitions with hooks
    // Initialize other necessary properties
  }

  async processRoute() {
    const { location } = window;
    const matchingRoute = this.routes.find(route => / * logic to match route based on location.pathname * /);

    if (!matchingRoute) {
      console.error("No route matches the URL.");
      // Handle 404 or redirect to a default route
      return;
    }

    // Execute beforeLeave hook of the current route, if defined
    if (this.currentRoute && this.currentRoute.beforeLeave) {
      const canLeave = await this.currentRoute.beforeLeave();
      if (!canLeave) {
        console.log("Navigation cancelled by beforeLeave hook.");
        return;
      }
    }

    // Execute beforeEnter hook of the matching route
    if (matchingRoute.beforeEnter) {
      const canEnter = await matchingRoute.beforeEnter();
      if (!canEnter) {
        console.log("Navigation cancelled by beforeEnter hook.");
        return;
      }
    }

    // Update the view/component based on the matching route
    // This might involve loading the route component, setting properties, etc.

    // Update the current route reference
    this.currentRoute = matchingRoute;

    // Execute afterEnter hook of the matching route
    if (matchingRoute.afterEnter) {
      await matchingRoute.afterEnter();
    }

    // Additional logic to update the application state/UI
  }

  // Method to register routes with hooks
  registerRoute(parameters) {
    // Logic to register a new route with potential beforeEnter, afterEnter, beforeLeave hooks
  }

    // Additional methods and properties
  }
  ```

In this setup, `processRoute` becomes a central point for managing all aspects of route
transitions, including the execution of lifecycle hooks and dynamic component loading based
on the current route. This approach offers a flexible and powerful way to handle complex
routing scenarios, ensuring a smooth and responsive user experience.
*/