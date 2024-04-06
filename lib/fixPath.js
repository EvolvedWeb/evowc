export function fixPath(pathToFix) {
  if (!pathToFix || typeof pathToFix !== 'string') {
    return pathToFix;
  }

  return pathToFix.replace(/\\/g, '/');
}
