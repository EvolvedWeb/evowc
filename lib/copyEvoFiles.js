// @ts-ignore
import { existsSync, mkdirSync, rmSync, promises } from 'node:fs';
// @ts-ignore
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getFileArrayFromGlob } from './getFileArrayFromGlob.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { copyFile } = promises;

const MKDIR_OPTIONS = {
  recursive: true
};

/**
 * Copy the Evo library files from ../static/js into the new project folder
 * `public/js/Evo-x.y.z/*` where x.y.z represents the current version of Evo.
 * @param {string} outputJsPath root path for all of the js files
 * @param {string} evoVersion current version of evowc
 */
export async function copyEvoFiles(outputJsPath, evoVersion) {
  const outputFilePath = path.join(outputJsPath, `Evo-${evoVersion}`);
  mkdirSync(outputFilePath, MKDIR_OPTIONS); // Create evo versioned output path

  // @ts-ignore
  const evowcSourcePath = path.join(__dirname, '../static/js');
  const evoFilesToCopy = getFileArrayFromGlob(evowcSourcePath, 'Evo*.js');

  const promiseList = evoFilesToCopy.map(filenameToCopy => {
    const srcFile = path.join(evowcSourcePath, filenameToCopy);
    const dstFile = path.join(outputFilePath, filenameToCopy);
    if (existsSync(dstFile)) {
      rmSync(dstFile); // Remove the previous copy
    }
    console.info(`Creating "\x1B[92m${dstFile}\x1B[0m"`);
    return copyFile(srcFile, dstFile); // Create new copy
  });

  await Promise.all(promiseList);
  console.info(`Copied Evo library files to your source folder: "\x1B[92m${outputJsPath}\x1B[0m"\n`);
}
