const xmlToComponentObj = require('./xmlToComponentObj');
const Generator = require('./Generator');

async function evowc(source, options) {
  const component = xmlToComponentObj(source);

  const generator = new Generator();
  component.html = await generator.srcFromComponent(component, options);

  return component;
}

module.exports = evowc;
