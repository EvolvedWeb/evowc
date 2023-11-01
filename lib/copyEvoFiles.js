// @ts-ignore
const { existsSync, mkdirSync, rmSync, promises: { copyFile } } = require('fs');
// @ts-ignore
const path = require('path');
const getFileArrayFromGlob = require('./getFileArrayFromGlob.js');

const MKDIR_OPTIONS = {
  recursive: true
};

/**
 * Copy the Evo library files from ../static/js into the new project folder
 * `public/js/Evo-x.y.z/*` where x.y.z represents the current version of Evo.
 * @param {string} outputJsPath root path for all of the js files
 * @param {string} evoVersion current version of evowc
 */
async function copyEvoFiles(outputJsPath, evoVersion) {
  const outputFilePath = path.join(outputJsPath, `Evo-${evoVersion}`);
  mkdirSync(outputFilePath, MKDIR_OPTIONS); // Create evo versioned output path

  // @ts-ignore
  const evowcSourcePath = path.join(__dirname, '../static/js');
  const evoFilesToCopy = getFileArrayFromGlob(evowcSourcePath, 'Evo*.js');

  const promises = evoFilesToCopy.map(filenameToCopy => {
    const srcFile = path.join(evowcSourcePath, filenameToCopy);
    const dstFile = path.join(outputFilePath, filenameToCopy);
    if (existsSync(dstFile)) {
      rmSync(dstFile); // Remove the previous copy
    }
    console.log(`Creating "\x1B[92m${dstFile}\x1B[0m"`);
    return copyFile(srcFile, dstFile); // Create new copy
  });

  await Promise.all(promises);
  console.log(`Copied Evo library files to your source folder: "\x1B[92m${outputJsPath}\x1B[0m"\n`);
}

module.exports = copyEvoFiles;