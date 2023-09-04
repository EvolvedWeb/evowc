const fs = require('fs');

const FILE_OPTIONS = {
  encoding: 'utf8'
}

function loadJson(fname) {
  const data = fs.readFileSync(fname, FILE_OPTIONS);
  return JSON.parse(data);
}

module.exports = loadJson;