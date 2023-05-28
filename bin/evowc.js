const fs = require('fs');
const path = require('path');
const fsp = fs.promises;

const evowc = require('../lib/evowc.js')
const getFileArrayFromGlob = require('../lib/getFileArrayFromGlob.js');
const FILE_OPTIONS = {
  encoding: 'utf8'
}

const TOTAL_TIME = 'Total processing time';
async function run(args) {
  console.time(TOTAL_TIME);
  // TODO: 2023-05-01 - Read config from package.json file
  const options = {
    // valid values for addDebug:
    //  boolean - add or not to every component
    //  string - classname of the component to add debug code
    //  array of strings - classnames of the components to add debug code
    //addDebug: ['SystemDialogElement'],
    output: 'static/js/components',
    minify: {
      css: true,
      html: true
    }
  };
  const outputScriptPath = options.output;
  let errors = [];

  if (args.length > 0) {
    const files  = getFileArrayFromGlob(process.cwd(), args[0]);

    for(let i=0; i < files.length; i++) {
      const componentFileName = files[i];
      try {
        console.info(`\n\x1B[49m\x1B[36mProcessing Component file: "${componentFileName}"\x1B[39m`);
        console.time('  time');
        let source = fs.readFileSync(componentFileName, FILE_OPTIONS);

        const component = await evowc(source, options);

        const outputScriptName = path.join(outputScriptPath, component.className+'.js');
        console.info(`   * Saving "${component.tag}" as ${outputScriptName}`);
        await fsp.writeFile(outputScriptName, component.html, FILE_OPTIONS)

        const componentDataFilename = outputScriptName + '.json';
        console.info(`   + Saving component data as ${componentDataFilename}`);
        let componentDataJson = JSON.stringify(component,0,2);
        await fsp.writeFile(componentDataFilename, componentDataJson, FILE_OPTIONS)
        /*
        scriptOutput = JSON.stringify(sourceObj, 0, 2);
        await fsp.writeFile(outputScriptName + '.orig.json', scriptOutput, FILE_OPTIONS)
        */
      }

      catch(ex) {
        errors.push(`${componentFileName}: \x1B[91m${ex.message}\x1B[0m`);
        console.log('\n'+ex.stack);
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

run(process.argv.slice(2));
