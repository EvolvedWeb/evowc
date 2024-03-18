// @ts-ignore
import { lstatSync, readdirSync, copyFileSync } from 'node:fs';
// @ts-ignore
import * as path from 'node:path';
// import { fileURLToPath } from 'node:url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const READDIR_OPTIONS = { withFileTypes: true };

function readDirs(folder) {
  // @ts-ignore
  const files = [...readdirSync(folder, READDIR_OPTIONS)].filter(entry => entry.isFile());
  return files.map(entry => {
    const fullName = path.join(entry.path, entry.name);
    const mtime = lstatSync(fullName).mtimeMs;
    return {
      name: entry.name,
      path: entry.path,
      fullName,
      mtime
    };
  });
}

function getFilesToCopy(srcFiles, dstFiles) {
  const filesToCopy = dstFiles.reduce((acc, fi) => {
    const srcFile = srcFiles.find(file => file.name === fi.name && file.mtime > fi.mtime);
    if (srcFile ) {
      acc.push({
        src: srcFile.fullName,
        dst: fi.fullName
      })
    }
    return acc;
  }, []);

  return filesToCopy;
}

export function prepForDeploy( version, deploy ) {
  const { files } = deploy;

  files.forEach(({ src: srcPath, dst: dstPath }) => {
    console.info(`- Comparing "${srcPath}" to "${dstPath}"`);
    const srcFiles = readDirs(srcPath);
    const dstFiles = readDirs(dstPath);
    const filesToCopy = getFilesToCopy(srcFiles, dstFiles);

    filesToCopy.forEach(({ src, dst }) => {
      console.info(`  - Copying from "${src}" to "${dst}"`);
      copyFileSync(src, dst);
    });
  });
}
