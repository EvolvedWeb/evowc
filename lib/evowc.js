const fs = require('fs');
const { minify: htmlMin } = require('html-minifier-terser');
const formatDate = require('./formatDate');
const xmlToComponentObj = require('./xmlToComponentObj');
const Generator = require('./Generator');
const FILE_OPTIONS = {
  encoding: 'utf8'
};

async function evowc(source, options) {
  this.compileDate = formatDate(new Date());
  const component = xmlToComponentObj(source);

  const generator = new Generator();
  component.html = await generator.srcFromComponent(component, options);

  return component;
}

module.exports = evowc;
