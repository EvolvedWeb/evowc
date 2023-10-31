// @ts-ignore
const { existsSync, mkdirSync, rmSync, promises: { copyFile } } = require('fs');
// @ts-ignore
const path = require('path');
const getFileArrayFromGlob = require('./getFileArrayFromGlob.js');
const MKDIR_OPTIONS = { recursive: true };

async function copyExampleContentFiles(srcRoot) {
  //------------------------------------------------------------------------------
  // Save the default sample component
  // @ts-ignore
  /** @type {string} */ let evowcSourcePath = path.join(__dirname, '../init-files/src');
  /** @type {string[]} */ let sourceFiles = getFileArrayFromGlob(evowcSourcePath, '**/*.*');

  /** @type {Promise[]} */
  let promises = sourceFiles.map(temp => {
    const srcFile = path.join(evowcSourcePath, temp);
    const dstFile = path.join(srcRoot, temp);
    let tempFolder = path.dirname(dstFile);
    mkdirSync(tempFolder, MKDIR_OPTIONS);
    if (existsSync(dstFile)) {
      rmSync(dstFile); // Remove the previous copy
    }
    //console.log(`Copying "\x1B[92m${srcFile}\x1B[0m" to "\x1B[92m${dstFile}\x1B[0m"`);
    console.log(`Creating "\x1B[92m${dstFile}\x1B[0m"`);
    return copyFile(srcFile, dstFile);
  });
  await Promise.all(promises);
  console.log(`Copied Evo sample content files to your source folder: "\x1B[92m${srcRoot}\x1B[0m"\n`);
}

module.exports = copyExampleContentFiles;