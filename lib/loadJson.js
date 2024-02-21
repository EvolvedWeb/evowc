// @ts-ignore
import * as fs from 'node:fs';

const FILE_OPTIONS = {
  encoding: 'utf8'
}

export function loadJson(fname) {
  const data = fs.readFileSync(fname, FILE_OPTIONS);
  return JSON.parse(data);
}
