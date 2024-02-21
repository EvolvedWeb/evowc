// @ts-ignore
import fs from 'node:fs';
import { loadJson } from './loadJson.js';
import { NODE_SERVER_TYPES } from './NODE_SERVER_TYPES.js';
const EXAMPLE_SERVER_NAME = 'evo_demo_app.js';
const EXPRESS_VERSION = '4.18.2';

const FILE_OPTIONS = {encoding: 'utf8'};

export function initializeServer(packageFileName, initServer, srcRoot) {
  const packageJson = loadJson(packageFileName);

  packageJson.evo.node = {
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
      packageJson.scripts.start = `node ${srcRoot}/${EXAMPLE_SERVER_NAME}`;
      packageJson.scripts.watch = `npm run build; evowc watch`;
      packageJson.dependencies ??= {};
      packageJson.dependencies.express ??= EXPRESS_VERSION;
      break;
  }

  fs.writeFileSync(packageFileName, JSON.stringify(packageJson, null, 2), FILE_OPTIONS);
}
