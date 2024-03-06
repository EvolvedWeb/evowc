const events = {};
global.window = {
  location: null,
  addEventListener(name, cb) {
    events[name] ??= [];
    events[name].push(cb);
  },
  // @ts-ignore
  dispatchEvent(name) {
    if (events[name]) {
      events[name].forEach(cb => cb());
    }
  }
}
/**
 * 
 * @param {string} path 
 */
function setPath(path) {
  if (!path.startsWith('http')) {
    path = `https://www.test.com${path}`;
  }
  // @ts-ignore
  global.window.location = new URL(path);
}
setPath('/');
// @ts-ignore
global.history = {
  replaceState(newState, skip, url) {
    setPath(url);
  },
  pushState(newState, skip, url) {
    setPath(url);
  }
}