// @ts-ignore
const path = require('path');
const copyEvoFiles = require("./copyEvoFiles");
const fixEvoVersionInExampleFiles = require("./fixEvoVersionInExampleFiles");

async function updateEvo(options) {
  const { paths = {}, version } = options;
  console.log(`\n\x1B[95mUpdating your project for Evo-wc version ${version}\x1B[0m\n`);
  const { componentsRoot = 'src/public/js/components', templateRoot } = paths;
  const jsRoot = path.dirname(componentsRoot);

  await copyEvoFiles(jsRoot, version);
  await fixEvoVersionInExampleFiles(templateRoot, version);

  console.log(`"Evo files for version ${version} were updated in this project.\n`);

  console.log('\n\nNext, please run the following commands:\n');
  console.log('\x1B[95mnpm i\x1B[0m');
  console.log('\x1B[95mnpm run watch\x1B[0m\n');
}

module.exports = updateEvo;