import Debug from "debug";
const debug = Debug("watch"); 
// @ts-ignore
import * as fs from 'node:fs';
// @ts-ignore
import * as path from 'node:path';
import keypress from 'keypress';
import nodeWatch from 'node-watch';
import micromatch from 'micromatch';
// @ts-ignore
import { spawn } from 'node:child_process';

// @ts-ignore
const isWin = process.platform === "win32";
const NPM = isWin ? 'npm.cmd' : 'npm';
const NODE = isWin ? 'node.exe' : 'node';

const DEFAULT_CONFIG = {
  root: 'src',
  componentFolder: 'components',
  componentOutputFolder: 'public/js/components',
  devBuild: false,
  nodeApp: 'evo_demo_app.js',
  nodeRestartFiles: [],
  runInDebug: false
};

// @ts-ignore
const cwd = process.cwd();
let childNode;
let nodePromise;
let config = DEFAULT_CONFIG;


export function watch() {
  try {
    config = getConfig();
  }

  catch(ex) {
    console.error(`Unable to process the config data from package.json\n${ex.stack}`);
    // @ts-ignore
    return Promise.reject(new Error(1));
  }

  try {
    const folder = path.resolve(config.root);
    // @ts-ignore
    process.chdir(folder);

    doNodeWatch(folder);
    handleKeyEvents(folder);

    console.info(`\x1b[92mWatching the folder '${folder}'\x1b[0m`);
  }

  catch(ex) {
    console.error(`Something went wrong.\n${ex.stack}`);
    // @ts-ignore
    return Promise.reject(new Error(1));
  }

  try {
    if (config.nodeRestartFiles) {
      nodePromise = spawnNode();
    }
  }

  catch(ex) {
    console.error(`Unable to start up node.\n${ex.stack}`);
    // @ts-ignore
    return Promise.reject(new Error(1));
  }

  return Promise.resolve();
}

export function relativeFolder(folder) {
  if ( folder == null) return folder;
  const src_re = new RegExp(`/?${config.root}/`);
  return folder.replace(src_re, '');
}

export function getConfig() {
  const tempConfig = DEFAULT_CONFIG;

  if (fs.existsSync('package.json')) {
    const temp = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const { wc, node } = temp?.evo;
    if (wc?.paths?.srcRoot) {
      tempConfig.root = wc?.paths?.srcRoot;
    }
    if (wc?.paths?.templateRoot) {
      tempConfig.componentFolder = relativeFolder(wc?.paths?.templateRoot);
    }
    if (wc?.paths?.componentsRoot) {
      tempConfig.componentOutputFolder = relativeFolder(wc?.paths?.componentsRoot);
    }
    if (node?.watch) {
      tempConfig.nodeRestartFiles = node.watch;
    }
    if (node?.start) {
      tempConfig.nodeApp = node.start;
    }
  }

  debug(`Config values: ${JSON.stringify(tempConfig, null, 2)}`)
  return tempConfig;
}

export function handleKeyEvents(folder) {
  // make `process.stdin` begin emitting "keypress" events
  // @ts-ignore
  keypress(process.stdin);

  // listen for the "keypress" event
  // @ts-ignore
  process.stdin.on('keypress',
    async (ch, key) => {
      switch (key?.name) { // eslint-disable-line default-case
        case 'c':
          if (key.ctrl) {
            await killNode()
            // @ts-ignore
            process.exit(0);
          }
          else {
            // @ts-ignore
            process.stdout.write('\x1b[0;0H\x1b[2J\x1bc\x1b[0;0H');
          }
          break;

        case 'd':
          config.runInDebug = !config.runInDebug;
          console.info(`\n\x1b[${config.runInDebug ? '41' : '42'}m\x1b[93m Debugging has been turned \x1b[97m${config.runInDebug ? 'on' : 'off'} \x1b[0m`);
          await killNode()
          nodePromise = spawnNode();
          console.info(`\n\n\x1b[92mStill watching the folder '${folder}'\x1b[0m`);
          break;

        case 'b':
          await spawnBuild();
          break;

        case 'r':
          await killNode()
          nodePromise = spawnNode();
          console.info(`\n\n\x1b[92mStill watching the folder '${folder}'\x1b[0m`);
          break;
      }
    }
  );

  try {
    // @ts-ignore
    process.stdin.setRawMode(true);
    // @ts-ignore
    process.stdin.resume();
  }

  catch (ex) {
    console.warn('Unable to turn on key handler. Key events may not work.');
  }
}

export function doNodeWatch(folder) {
  const { devBuild, nodeRestartFiles } = config;

  let timeout;
  let currentChanges = {};

  // @ts-ignore
  nodeWatch(folder, { recursive: true }, (eventType, absName) => {
    /** @type {string} */
    const filename = path.relative(folder, absName);
    if (filename.startsWith(config.componentOutputFolder)) {
      return;
    }

    //console.log({ eventType, absName, filename });
    const exists = fs.existsSync(filename);
    let stats = null;
    if (exists) {
      stats = fs.statSync(filename);
      if (stats.isDirectory() && eventType !== 'remove') {
        // if a directory was changed then just ignore it.
        return;
      }
    }

    currentChanges[filename] = { eventType, exists, stats };
    debug(`Adding event for ${filename}: ${JSON.stringify(currentChanges[filename], null, 2)}`);

    // Provide a debounce and attempt to process multiple commands at the same time
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      var needToRestartNode = nodeRestartFiles && micromatch(Object.keys(currentChanges), nodeRestartFiles).length > 0;
      debug('currentChanges: ' + JSON.stringify(currentChanges, null, 2));

      spawnBuild(currentChanges, devBuild).then(
        () => {
          if (needToRestartNode) {
            killNode().then(() => {
              nodePromise = spawnNode();
              console.info(`\n\n\x1b[92mStill watching the folder '${folder}'\x1b[0m`);
            });
          }
          else {
            console.info(`\n\x1b[92mStill watching the folder '${folder}'\x1b[0m`);
          }
        }
      ).catch(() => {
        // @ts-ignore
        killNode().then(() => { process.exit(0); });
      });
      currentChanges = {};
    }, 10);
  });
  return { currentChanges, timeout };
}

export function killNode() {
  if (childNode) {
    childNode.on('exit', () => {
      childNode.stdin.pause();
      childNode = null;
    });

    console.info('Shutting down running instance of node');
    childNode.kill('SIGTERM');
  }

  return nodePromise;
}

export function spawnNode() {
  return new Promise(
    (resolve) => {
      const argList = [config.nodeApp];
      if (config.runInDebug) {
        argList.unshift('--inspect-brk');
      }

      console.info(`\nStarting Node...`);
      childNode = spawn(NODE, argList, {cwd});

      childNode.stdout.on('data', (data) => {
        // @ts-ignore
        process.stdout.write(data);
      });

      childNode.stderr.on('data', (data) => {
        // @ts-ignore
        process.stderr.write(data);
      });

      childNode.on('close', (code) => {
        console.info('Finished. Exited with code:', code);
        resolve(code);
      });

      childNode.on('error', (err) => {
        console.info('Failed to start the build.', err);
        resolve(err);
      });
    }
  );
}

export function spawnBuild(changes = [], isDevBuild = false) {
  return new Promise(
    (resolve, reject) => {
      //console.info(JSON.stringify(changes, 0, 2));
      console.info('Running build...');
      const args = ['run'];
      args.push(isDevBuild ? 'build-dev': 'build');

      const del = [];
      Object.entries(changes).forEach(
        ([key, value]) => {
          if (value.exists === false) {
            del.push('--del');
            del.push(`"src/${key.replace(/\\/g, '/')}"`);
          }
        }
      );
      console.info(`Running: \x1b[32mnpm ${args.join(' ')}\x1b[0m`, del.join(' '));
      // @ts-ignore
      const child = spawn(NPM, args, {cwd, env: process.env});

      child.stdout.on('data', (data) => {
        // @ts-ignore
        process.stdout.write(data);
      });

      child.stderr.on('data', (data) => {
        // @ts-ignore
        process.stderr.write(data);
      });

      child.on('close', (code) => {
        console.info('Finished. Exited with code:', code);
        if (code !== 0) {
          reject(code);
        } else {
          resolve(code);
        }
      });

      child.on('error', (err) => {
        console.info('Failed to start the build.', err);
        resolve(err);
      });
    }
  );
}
