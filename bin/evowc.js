const evowc = require('../lib/evowc.js');
const getFileArrayFromGlob = require('../lib/getFileArrayFromGlob.js');
//console.log(evowc);

const TOTAL_TIME = 'Total processing time';
async function run(args) {
  console.time(TOTAL_TIME);
  const options = {
    minify: {
      css: true,
      html: true
    }
  };
  const outputScriptName = 'static/js/components';

  if (args.length > 0) {
    const files  = getFileArrayFromGlob(process.cwd(), args[0]);

    for(let i=0; i < files.length; i++) {
      const componentFileName = files[i];
      try {
        await evowc(componentFileName, outputScriptName, options);
      }

      catch(ex) {
        console.log('\n'+ex.stack);
      }
    }
  }

  console.log('\n');
  console.timeEnd(TOTAL_TIME);
}

run(process.argv.slice(2));
