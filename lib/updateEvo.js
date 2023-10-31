// @ts-ignore
const path = require('path');
const COMPONENTS = 'components';

const copyEvoFiles = require("./copyEvoFiles");
const fixEvoVersionInExampleFiles = require("./fixEvoVersionInExampleFiles");

async function updateEvo(options) {
  console.log(`\n\x1B[95mUpdating your project for Evo-wc version ${options.version}\x1B[0m\n`);
  const { srcRoot = 'src', outputRoot = 'public', version } = options;

  //------------------------------------------------------------------------------
  // Calculate all of the folders for all the different files
  const templateRoot = path.join(srcRoot, COMPONENTS);
  const publicRoot = path.join(srcRoot, outputRoot);
  const jsRoot = path.join(publicRoot, 'js');

  await copyEvoFiles(jsRoot, version);
  await fixEvoVersionInExampleFiles(templateRoot, version);

  console.log(`"Evo files for version ${version} were updated in this project.\n`);

  console.log('\n\nNext, please run the following commands');
  console.log('\nnpm i');
  console.log('\nnpm run watch');
}

module.exports = updateEvo;