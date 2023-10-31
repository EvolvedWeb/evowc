// @ts-ignore
const fs = require('fs');
const loadJson = require('./loadJson.js');
const NODE_SERVER_TYPES = require('./NODE_SERVER_TYPES.js');
const EXAMPLE_SERVER_NAME = 'evo_demo_app.js';
const EXPRESS_VERSION = '4.18.2';

const FILE_OPTIONS = {encoding: 'utf8'};

function initializeServer(packageFileName, initServer, srcRoot) {
  const packagejson = loadJson(packageFileName);

  packagejson.evo.node = {
    start: `${srcRoot}/${EXAMPLE_SERVER_NAME}`,
    watch: [
      `${srcRoot}/${EXAMPLE_SERVER_NAME}`
    ]
  }

  //------------------------------------------------------------------------------
  // Create the node demo server file
  switch (initServer) {
    case NODE_SERVER_TYPES.EXPRESS:
    default:
      packagejson.scripts.start = `node ${srcRoot}/${EXAMPLE_SERVER_NAME}`;
      packagejson.scripts.watch = `npm run build; evowc watch`;
      packagejson.dependencies ??= {};
      packagejson.dependencies.express ??= EXPRESS_VERSION;
      break;
  }

  fs.writeFileSync(packageFileName, JSON.stringify(packagejson, null, 2), FILE_OPTIONS);
}

module.exports = initializeServer;