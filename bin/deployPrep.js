import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepForDeploy } from '../lib/prepForDeploy.js';
import { loadJson } from '../lib/loadJson.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_FILE_NAME = join(__dirname, '../package.json');

console.log(`\x1b[92mDeploy Prep (deployPrep.js)\x1b[0m`);
console.log(`\x1b[95mGet everything ready for a deploy to NPM.\x1b[0m\n`);

const packageJson = loadJson(PACKAGE_FILE_NAME);
const { version, evo } = packageJson;
const { deploy } = evo;

await prepForDeploy( version, deploy );

console.log(`
\x1b[31m-------------------------------------------\x1b[0m
\x1b[91mRemember to do the following in this order:\x1b[0m
\x1b[31m-------------------------------------------\x1b[0m
  1 \x1b[95mRun \x1b[93mnpm outdated\x1b[0m
    * \x1b[95mUpdate all outdated repos.\x1b[0m
  2 \x1b[95mRun \x1b[93mnpm run test\x1b[0m
    * \x1b[95mFix any broken tests\x1b[0m
  3 \x1b[95mUpdate the version number:\x1b[0m
    * \x1b[96mpackage.json\x1b[95m and check all other files.\x1b[0m
  3 \x1b[95mRun \x1b[93mnpm i\x1b[0m
  4 \x1b[95mUpdate \x1b[96mREADME.md\x1b[95m as needed.\x1b[0m
    * \x1b[95mReview \x1b[96mREADME.md\x1b[95m to make sure it displays correctly.\x1b[0m
  5 \x1b[95mUpdate \x1b[96mUPDATELOG.md\x1b[95m - Version, date and descriptions of changes.\x1b[0m
    * \x1b[95mReview \x1b[96mUPDATELOG.md\x1b[95m to make sure it displays correctly.\x1b[0m
  6 \x1b[95mUpdate all docs and files in evowc.com repo\x1b[0m
  7 \x1b[95mTest evowc init:\x1b[0m
    * \x1b[93mmkdir delme\x1b[0m
    * \x1b[93mcd delme\x1b[0m
    * \x1b[93mnpm init\x1b[0m
    * \x1b[93mnpm link @evolvedweb/wc\x1b[0m
    * \x1b[93mnpx evowc init\x1b[0m
    * \x1b[93mnpm i\x1b[0m
    * \x1b[93mnpm run watch\x1b[0m
    * \x1b[95mBrowser to: \x1b[93mhttp://localhost:12345\x1b[0m
  8 \x1b[95mAdd, commit and push to GIT\x1b[0m
  9 \x1b[95mRun \x1b[93mnpm publish\x1b[0m
 10 \x1b[95mPublish Evowc.com repo as well\x1b[0m

If everything passes then you can deploy.
\x1b[91mDo not deploy if you have not followed ALL of these steps!\x1b[0m
`);