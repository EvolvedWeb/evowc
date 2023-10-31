const xmlToComponentObj = require('./xmlToComponentObj');
const Generator = require('./Generator');

function evowc(source, options) {
  const component = xmlToComponentObj(source);

  return {
    fileExt: component.fileExt,
    transpile: async (outputScriptPath) => {
      const generator = new Generator();
      component.html = await generator.srcFromComponent(component, options, outputScriptPath);

      return component;
    }
  };
}

module.exports = evowc;
