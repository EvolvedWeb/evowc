const fs = require('fs');
const { minify: htmlMin } = require('html-minifier-terser');
const formatDate = require('./formatDate');
const xmlToComponentObj = require('./xmlToComponentObj');
const Generator = require('./Generator');
const FILE_OPTIONS = {
  encoding: 'utf8'
};

/**
 * Helper functions that do not need to be in the class
 */
const isObject = (val) => (typeof val === 'object' && !Array.isArray(val) && val !== null);

/**
 * 
 */
class Evowc {
  #jsIndex = 0;
  constructor() {
    this.compileDate = formatDate(new Date());
  }

  async processSource(source, options) {
    const component = xmlToComponentObj(source);

    if (options.componentFile ) {
      fs.writeFileSync(options.componentFile, JSON.stringify(component, 0, 2), FILE_OPTIONS);
    }

    const generator = new Generator();
    const sourceCode = await generator.srcFromComponent(component, options);

    return sourceCode;
  }
}

async function test() {
  const PROCESS_OPTIONS = {
    srcFile: '/Users/mikecollins/projects/mine/evowc/components/SpecialThingElement.html',
    componentFile: '/Users/mikecollins/projects/mine/evowc/SpecialThingElement.json',
    saveComponent: true,
    minify: true
  }

  const a = new Evowc();
  const source = fs.readFileSync(PROCESS_OPTIONS.srcFile, FILE_OPTIONS);
  const resp = await a.processSource(source, PROCESS_OPTIONS);
  console.log(`"${resp}"`);
}

test();