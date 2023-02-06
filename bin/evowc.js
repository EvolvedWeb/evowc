import { evowc } from "../lib/evowc.js"

async function run(args) {
  console.time('processing time');
  const options = {
    minify: {
      css: true,
      html: true
    }
  }

  const componentFileName = 'components/*.html';
  const outputScriptName = 'static/js/components';
  await evowc(componentFileName, outputScriptName, options);

  console.timeEnd('processing time');
}

run(process.argv.slice(1));