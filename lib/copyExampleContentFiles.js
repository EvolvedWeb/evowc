import { existsSync, mkdirSync, rmSync, promises } from 'node:fs';
const { copyFile } = promises;
import { posix as path } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getFileArrayFromGlob } from './getFileArrayFromGlob.js';
import { fixPath } from './fixPath.js';

const __filename = fixPath(fileURLToPath(import.meta.url));
const __dirname = path.dirname(__filename);

const MKDIR_OPTIONS = { recursive: true };

export async function copyExampleContentFiles(srcRoot) {
  //------------------------------------------------------------------------------
  // Save the default sample component
  // @ts-ignore
  /** @type {string} */ let evowcSourcePath = path.join(__dirname, '../init-files/src');
  /** @type {string[]} */ let sourceFiles = getFileArrayFromGlob(evowcSourcePath, '**/*.*');

  /** @type {Promise[]} */
  let promiseList = sourceFiles.map(temp => {
    const srcFile = path.join(evowcSourcePath, temp);
    const dstFile = path.join(srcRoot, temp);
    let tempFolder = path.dirname(dstFile);
    mkdirSync(tempFolder, MKDIR_OPTIONS);
    if (existsSync(dstFile)) {
      rmSync(dstFile); // Remove the previous copy
    }
    //console.info(`Copying "\x1B[92m${srcFile}\x1B[0m" to "\x1B[92m${dstFile}\x1B[0m"`);
    console.info(`Creating "\x1B[92m${dstFile}\x1B[0m"`);
    return copyFile(srcFile, dstFile);
  });
  await Promise.all(promiseList);
  console.info(`Copied Evo sample content files to your source folder: "\x1B[92m${srcRoot}\x1B[0m"\n`);
}
