const evowc = require('../lib/evowc.js');
const getFileArrayFromGlob = require('../lib/getFileArrayFromGlob.js');
console.log(evowc);

async function run(args) {
  console.time('processing time');
  const options = {
    minify: {
      css: true,
      html: false
    }
  }
  const outputScriptName = 'static/js/components';

  if (args.length > 0) {
    const files  = getFileArrayFromGlob(process.cwd(), args[0]);

    for(let i=0; i < files.length; i++) {
      const componentFileName = files[i];
      await evowc(componentFileName, outputScriptName, options);
    }
  }

  console.timeEnd('processing time');
}

run(process.argv.slice(2));
