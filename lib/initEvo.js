// @ts-ignore
const fs = require('fs');
// @ts-ignore
const path = require('path');
const fsp = fs.promises;
const getFileArrayFromGlob = require('./getFileArrayFromGlob.js');
const loadJson = require('./loadJson.js');
const NODE_SERVER_TYPES = require('./NODE_SERVER_TYPES.js');
const EXPRESS_VERSION = '4.18.2';
const COMPONENTS = 'components';
const PACKAGE_FILE_NAME = 'package.json';

const FILE_OPTIONS = {
  encoding: 'utf8'
}
const MKDIR_OPTIONS = {
  recursive: true
};

const EXAMPLE_COMPONENT_TAG = 'my-component';
const EXAMPLE_COMPONENT_NAME = 'MyComponentElement.html';
const EXAMPLE_COMPONENT_CONTENT = `<component tag="${EXAMPLE_COMPONENT_TAG}" :message="str:Evo is working!">
  <template>
    <h1 :text="message"></h1>
  </template>
  <style>
  :host {
    align-items: center;
    display: flex;
    inset: 0;
    justify-content: center;
    position: fixed;
  }
  h1 {
    color: navy;
  }
  </style>
</component>`;

const EXAMPLE_HTML_NAME = 'index.html';
const getHtmlContent = (componentFile) => `<!DOCTYPE html>
<html>
<head>
  <title>Evo Test</title>
</head>
<body>
  <${EXAMPLE_COMPONENT_TAG}></${EXAMPLE_COMPONENT_TAG}>
  <script type="module">
    import "${componentFile}";
  </script>
</body>
</html>`;

const EXAMPLE_SERVER_NAME = 'evo_test_app.js';
const getServerContent = (staticRoot) => `const PORT = 12345;
const express = require('express');

const app = express();
app.use(express.static('${staticRoot}'));
console.log(\`Sample server listening on port \${ PORT }\`);
app.listen(PORT, '0.0.0.0');`;


async function initEvo(options) {
  console.log('\n\x1B[95mAttempting to initialize your project for Evo-wc\x1B[0m\n');
  const { srcRoot = 'src', outputRoot = 'public', initServer = false, force = false } = options;

  //------------------------------------------------------------------------------
  // Calculate all of the folders for all the different files
  const templateRoot = path.join(srcRoot, COMPONENTS);
  const publicRoot = path.join(srcRoot, outputRoot);
  const jsRoot = path.join(publicRoot, 'js');
  const componentsRoot = path.join(jsRoot, COMPONENTS);
  const componentsToBuild = '**/*.html';

  //------------------------------------------------------------------------------
  // Create the needed folders
  fs.mkdirSync(templateRoot, MKDIR_OPTIONS); // Create template source path
  fs.mkdirSync(componentsRoot, MKDIR_OPTIONS); // Create component output path
  console.log(`template folder and source folders were created.`);

  //------------------------------------------------------------------------------
  // Add the needed settings to the package.json file
  const data = loadJson(PACKAGE_FILE_NAME);
  data.scripts ??= {};
  data.scripts.evowc = `evowc "${componentsToBuild}"`;
  data.evo ??= {};
  data.evo.wc = {
    addDebug: false,
    minify: {
      css: true,
      html: true
    },
    outExtname: '.js',
    paths: {
      srcRoot,
      templateRoot,
      componentsRoot,
      publicRoot
    }
  };

  //------------------------------------------------------------------------------
  // Save the default sample component
  const templateFileName = path.join(templateRoot, EXAMPLE_COMPONENT_NAME);
  console.log({ templateFileName });
  if (force || !fs.existsSync(templateFileName)) {
    fs.writeFileSync(templateFileName, EXAMPLE_COMPONENT_CONTENT, FILE_OPTIONS)
    console.log(`Example component template file created: "${templateFileName}".`);
  }

  //------------------------------------------------------------------------------
  // Copy the Evo library files into the public/js folder
  // @ts-ignore
  const sourcePath = path.join(__dirname, '../static/js');
  /** @type string[] */ const sourceFiles = getFileArrayFromGlob(sourcePath, 'Evo*.js');
  /** @type Promise[] */ const promises = sourceFiles.map(temp => {
    const srcFile = path.join(sourcePath, temp);
    const dstFile = path.join(jsRoot, temp);
    console.log(`Copying "${srcFile}" to "${dstFile}"`);
    return fsp.cp(srcFile, dstFile );
  });
  await Promise.all(promises);
  console.log(`Copied Evo library files to your source folder: "${jsRoot}"`);

  //------------------------------------------------------------------------------
  // Create the node demo server file
  switch (options.initServer) {
    case NODE_SERVER_TYPES.EXPRESS:
    default:
      {
        data.scripts.start = `node ${EXAMPLE_SERVER_NAME}`;
        data.dependencies ??= {};
        data.dependencies.express ??= EXPRESS_VERSION;

        const htmlFileName = path.join(publicRoot, EXAMPLE_HTML_NAME);
        const outputComponetName = path.join(jsRoot, EXAMPLE_COMPONENT_NAME);
        console.log({ options: jsRoot });

        //if (!fs.existsSync(htmlFileName)) {
          const ext = path.extname(outputComponetName);
          let fname = path.basename(outputComponetName, ext) + '.js';
          console.log({ fname });
          fname = `/js/components/${fname}`;
          console.log({ fname });
          fs.writeFileSync(htmlFileName, getHtmlContent(fname), FILE_OPTIONS)
          console.log(`Example HTML test page file created: "${htmlFileName}".`);
        //}

        if (initServer) {
          fs.writeFileSync(EXAMPLE_SERVER_NAME, getServerContent(publicRoot), FILE_OPTIONS)
          console.log(`Example test SERVER page file created: "${EXAMPLE_SERVER_NAME}".`);
        }
      }
      break;
  }

  //------------------------------------------------------------------------------
  // Save the package.json file
  fs.writeFileSync(PACKAGE_FILE_NAME, JSON.stringify(data, null, 2), FILE_OPTIONS);
  console.log(`"\x1B[93m${PACKAGE_FILE_NAME}\x1B[0m" was initalized for Evo-wc.\n`);

  console.log('\n\nNext, please run the following commands');
  console.log('\nnpm i');
  console.log('\nnpm run evowc');
  console.log('\nnpm start');
}

module.exports = initEvo;