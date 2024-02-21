// @ts-ignore
import * as path from 'node:path';
import { copyEvoFiles } from "./copyEvoFiles.js";
import { fixEvoVersionInExampleFiles } from "./fixEvoVersionInExampleFiles.js";

export async function updateEvo(options) {
  const { paths = {}, version } = options;
  console.info(`\n\x1B[95mUpdating your project for Evo-wc version ${version}\x1B[0m\n`);
  const { componentsRoot = 'src/public/js/components', templateRoot } = paths;
  const jsRoot = path.dirname(componentsRoot);

  await copyEvoFiles(jsRoot, version);
  await fixEvoVersionInExampleFiles(templateRoot, version);

  console.info(`"Evo files for version ${version} were updated in this project.\n`);

  console.info('\n\nNext, please run the following commands:\n');
  console.info('\x1B[95mnpm i\x1B[0m');
  console.info('\x1B[95mnpm run watch\x1B[0m\n');
}
