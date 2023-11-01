// @ts-ignore
const fs = require('fs');
// @ts-ignore
const path = require('path');
const copyEvoFiles = require('./copyEvoFiles.js');
const loadJson = require('./loadJson.js');
const initializeServer = require('./initializeServer.js');
const copyExampleContentFiles = require('./copyExampleContentFiles.js');
const fixEvoVersionInExampleFiles = require('./fixEvoVersionInExampleFiles.js');
const COMPONENTS = 'components';
const PACKAGE_FILE_NAME = 'package.json';

const FILE_OPTIONS = {encoding: 'utf8'};
const MKDIR_OPTIONS = {recursive: true};

async function initEvo(options) {
  console.log('\n\x1B[95mInitializing your project for Evo-wc\x1B[0m\n');
  const { srcRoot = 'src', outputRoot = 'public', version, initServer = false, force = false } = options;

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
  console.log(`template folder and source folders were created.`);

  //------------------------------------------------------------------------------
  // Add the needed settings to the package.json file
  const packagejson = loadJson(PACKAGE_FILE_NAME);
  packagejson.scripts ??= {};
  packagejson.scripts.build = 'npm run evowc';
  packagejson.scripts.evowc = `evowc "${componentsToBuild}"`;
  packagejson.evo ??= {};
  packagejson.evo.wc = {
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
  fs.writeFileSync(PACKAGE_FILE_NAME, JSON.stringify(packagejson, null, 2), FILE_OPTIONS);

  await copyEvoFiles(jsRoot, version);
  await copyExampleContentFiles(srcRoot);
  await fixEvoVersionInExampleFiles(templateRoot, version);

  if (initServer) {
    initializeServer(PACKAGE_FILE_NAME, initServer, srcRoot);
  }

  console.log(`"\x1B[93m${PACKAGE_FILE_NAME}\x1B[0m" was initalized for Evo-wc.\n`);

  console.log('\n\nNext, please run the following commands');
  console.log('\nnpm i');
  console.log('\nnpm run watch');
}

module.exports = initEvo;
