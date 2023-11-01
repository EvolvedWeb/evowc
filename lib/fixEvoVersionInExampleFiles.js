// @ts-ignore
const { promises: { readFile, writeFile } } = require('fs');
// @ts-ignore
const path = require('path');
const getFileArrayFromGlob = require('./getFileArrayFromGlob.js');

const FILE_OPTIONS = { encoding: 'utf8' };
const EVO_VERSION_RE = /(import(?:\s+.+from)?\s+)(["'])(\.\.\/)(?:Evo-\d+\.\d+\.\d+\/)?(Evo.+\.js\2;?)/g;

async function fixEvoVersionInExampleFiles(templateRoot, evoVersion) {
  /** @type {string[]} */ let sourceFiles = getFileArrayFromGlob(templateRoot, '**/*.*');

  /** @type {Promise[]} */
  let promises = sourceFiles.map(async temp => {
    const srcFile = path.join(templateRoot, temp);
    let content = await readFile(srcFile, FILE_OPTIONS);
    content = content.replace(EVO_VERSION_RE, `$1$2$3Evo-${evoVersion}/$4`)
    return await writeFile(srcFile, content, FILE_OPTIONS);
  });
  await Promise.all(promises);
  console.log(`Updated Evo version in component files in your source folder: "\x1B[92m${templateRoot}\x1B[0m"\n\x1B[93mYou may also need to update other source files that used the older version of Evo.\x1B[0m`);
}

module.exports = fixEvoVersionInExampleFiles;