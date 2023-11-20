import fs from "fs";

export function afterAll() {
  try {
    fs.unlinkSync('static/js/EvoRouter.mjs');
  }
  catch(ex) {
    console.log(ex.stack);
  }
}

export function beforeAll() {
  fs.copyFileSync('static/js/EvoRouter.js', 'static/js/EvoRouter.mjs')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
}
const events = {};
global.window = {
  location: null,
  addEventListener(name, cb) {
    events[name] ??= [];
    events[name].push(cb);
  },
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
  global.window.location = new URL(path);
}
setPath('/');
global.history = {
  replaceState(newState, skip, url) {
    setPath(url);
  },
  pushState(newState, skip, url) {
    setPath(url);
  }
}