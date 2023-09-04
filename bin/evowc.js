#! /usr/bin/env node
/* eslit-env node:true */
// @ts-ignore
const fs = require('fs');
// @ts-ignore
const path = require('path');
const fsp = fs.promises;

const evowc = require('../lib/evowc.js')
const getFileArrayFromGlob = require('../lib/getFileArrayFromGlob.js');
const initEvo = require('../lib/initEvo.js');
const loadJson = require('../lib/loadJson.js');
const getClOptions = require('../lib/getClOptions.js');

const TOTAL_TIME = 'Total processing time';
const FILE_OPTIONS = {
  encoding: 'utf8'
}
const MKDIR_OPTIONS = {
  recursive: true
};

/**
* @typedef {Object} Options
* @property {boolean | string | string[] } addDebug - Not implamented yet
* @property {string} outExtname - File extention to use on the transpiled files.
* @property {boolean} saveDebugJson - If 'true' then output the debug json files.
*
* @property {object} paths - Paths to everything on init.
* @property {string} paths.srcRoot - Path to the root of the source folder
* @property {string} paths.templateRoot - Path to the component template files
* @property {string} paths.publicRoot - Path to the root of the public folder
* @property {string} paths.componentsRoot - Path to the transpiled component js files
* @property {string} paths.componentsToBuild - Path for the component to be built
*
* @property {object} minify
* @property {boolean} minify.css - Should the CSS be minified?
* @property {boolean} minify.html - Should the HTML be minified?
*/

function getOptions(clOptions) {
  // @ts-ignore
  const { evo: { wc = {} } = {} } = loadJson(path.join(process.cwd(), "package.json"));

  /** @type string */ const srcRoot = clOptions.srcRoot || wc.paths?.srcRoot || 'src';
  /** @type string */ const templateRoot = path.join(srcRoot, 'components');
  /** @type string */ let publicRoot;

  if (clOptions.paths?.publicRoot) {
    publicRoot = path.join(srcRoot, clOptions.paths?.publicRoot);
  }
  else {
    publicRoot = wc.paths?.publicRoot || path.join(srcRoot, 'public');
  }
  /** @type string */ const componentsRoot = wc.paths?.componentsRoot || path.join(publicRoot, 'js/component');

  console.log({});
  /** @type Options */
  const options = {
    addDebug: wc.addDebug ?? false,
    // The code to use addDebug is not written yet
    // valid values for addDebug:
    //   true/false - add or not to every component
    //   'SystemDialogElement' - classname of the component to add debug code
    //   ['SystemDialogElement','MyComponentElement'] - Array of classnames of the components to add debug code
    saveDebugJson: wc.saveDebugJson || false, // true - Ouput the debug JSON files
    minify: {
      css: Boolean(wc.minify?.css ?? true),
      html: Boolean(wc.minify?.html ?? true)
    },
    outExtname: wc.outExtname || '.js', // Default File extension for output files
    paths: {
      srcRoot,
      templateRoot,
      publicRoot,
      componentsRoot,
      componentsToBuild: clOptions.command || wc.componentsToBuild || '/**/*.html'
    }
  };

  // Make sure that our extension starts with a period
  if (options.outExtname[0] !== '.') {
    options.outExtname = `.${options.outExtname}`;
  }

  return options;
}

async function run(args) {
  console.time(TOTAL_TIME);

  let errors = [];

  const clOptions = getClOptions(args);
  if (clOptions.command.toLowerCase() === 'init') {
    initEvo(clOptions);
    return;
  }

  if (args.length > 0) {
    /** @type Options */
    const options = getOptions(clOptions);
    const { templateRoot, componentsToBuild, componentsRoot } = options.paths;

    // @ts-ignore
    const files = getFileArrayFromGlob(templateRoot, componentsToBuild);

    for(let i=0; i < files.length; i++) {
      const componentFileName = files[i];
      try {
        console.info(`\n\x1B[49m\x1B[36mProcessing Component file: "${componentFileName}"\x1B[39m`);
        console.time('  time');
        const srcName = path.join(templateRoot, componentFileName);
        const extname = path.extname(componentFileName);
        const dirname = path.dirname(componentFileName);
        const tempName = path.basename(componentFileName, extname);
        const outputPath = path.join(componentsRoot, dirname);

        //console.log({ srcName, extname, dirname, tempName, outputPath });

        let source = fs.readFileSync(srcName, FILE_OPTIONS);
        const component = await evowc(source, options);

        const outExtname = component.fileExt || options.outExtname;
        fs.mkdirSync(outputPath, MKDIR_OPTIONS);
        const outputScriptName = path.join(outputPath, tempName + outExtname);
        console.info(`   * Saving "${component.tag}" as ${outputScriptName}`);
        await fsp.writeFile(outputScriptName, component.html, FILE_OPTIONS)

        if (options.saveDebugJson) {
          const componentDataFilename = outputScriptName + '.json';
          console.info(`   + Saving component data as ${componentDataFilename}`);
          // @ts-ignore
          let componentDataJson = JSON.stringify(component,0,2);
          await fsp.writeFile(componentDataFilename, componentDataJson, FILE_OPTIONS)
        }

        // scriptOutput = JSON.stringify(sourceObj, 0, 2);
        // await fsp.writeFile(outputScriptName + '.orig.json', scriptOutput, FILE_OPTIONS)
      }

      catch(ex) {
        errors.push(`${componentFileName}: \x1B[91m${ex.message}\x1B[0m`);
        console.info('\n'+ex.stack);
      }

      finally {
        console.timeEnd('  time');
      }
    }
  }
  else {
    console.log('No source files specified. Nothing to process');
  }

  console.log('\n');
  console.timeEnd(TOTAL_TIME);

  if(errors.length) {
    console.log(errors.length === 1 ? `There was 1 error during compile.\n` : `There were ${errors.length} errors during compile.\n`);
    errors.forEach(err => {
      console.log(err);
    });
    console.log('\n');
  }
}

// @ts-ignore
run(process.argv.slice(2));
