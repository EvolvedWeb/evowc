import * as fs from 'node:fs';
import { posix as path } from 'node:path';
import { copyEvoFiles } from './copyEvoFiles.js';
import { loadJson } from './loadJson.js';
import { initializeServer } from './initializeServer.js';
import { copyExampleContentFiles } from './copyExampleContentFiles.js';
import { fixEvoVersionInExampleFiles } from './fixEvoVersionInExampleFiles.js';
const COMPONENTS = 'components';
const PACKAGE_FILE_NAME = 'package.json';

const FILE_OPTIONS = {encoding: 'utf8'};
const MKDIR_OPTIONS = {recursive: true};

export async function initEvo(options) {
  console.info('\n\x1B[95mInitializing your project for Evo-wc\x1B[0m\n');
  const { srcRoot = 'src', outputRoot = 'public', version, initServer = false/*, force = false*/ } = options;

  //------------------------------------------------------------------------------
  // Calculate all of the folders for all the different files
  const templateRoot = path.join(srcRoot, COMPONENTS);
  const publicRoot = path.join(srcRoot, outputRoot);
  const jsRoot = path.join(publicRoot, 'js');
  const componentsRoot = path.join(jsRoot, COMPONENTS);
  const componentsToBuild = '**/*.html';

  //------------------------------------------------------------------------------
  // Create the needed folders
  fs.mkdirSync(templateRoot, MKDIR_OPTIONS); // Create template source path
  fs.mkdirSync(componentsRoot, MKDIR_OPTIONS); // Create component output path
  console.info(`template folder and source folders were created.`);

  //------------------------------------------------------------------------------
  // Add the needed settings to the package.json file
  const packageJson = loadJson(PACKAGE_FILE_NAME);
  packageJson.scripts ??= {};
  packageJson.scripts.build = 'npm run evowc';
  packageJson.scripts.evowc = `evowc "${componentsToBuild}"`;
  packageJson.evo ??= {};
  packageJson.evo.wc = {
    addDebug: false,
    minify: {
      css: true,
      html: true
    },
    outExtname: '.js',
    paths: {
      srcRoot,
      templateRoot,
      componentsRoot,
      publicRoot
    }
  };
  fs.writeFileSync(PACKAGE_FILE_NAME, JSON.stringify(packageJson, null, 2), FILE_OPTIONS);

  await copyEvoFiles(jsRoot, version);
  await copyExampleContentFiles(srcRoot);
  await fixEvoVersionInExampleFiles(templateRoot, version);

  if (initServer) {
    initializeServer(PACKAGE_FILE_NAME, initServer, srcRoot);
  }

  console.info(`"\x1B[93m${PACKAGE_FILE_NAME}\x1B[0m" was initialized for Evo-wc.\n`);

  console.info('\n\nNext, please run the following commands:\n');
  console.info('\x1B[95mnpm i\x1B[0m');
  console.info('\x1B[95mnpm run watch\x1B[0m\n');
}
