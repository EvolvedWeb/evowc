import { NODE_SERVER_TYPES } from './NODE_SERVER_TYPES.js';
const INIT_COMMAND = 'init';

export function getClOptions(args, version) {
  const resp = {
    version
  };

  // npx evowc init (with no additional params is the same as "npx evowc init -r src -o public -s")
  if (args.length === 1 && args[0].toLowerCase() === INIT_COMMAND) {
    return ({
      outputRoot: 'public',
      srcRoot: 'src',
      initServer: NODE_SERVER_TYPES.EXPRESS,
      command: INIT_COMMAND,
      version
    });
  }

  let i = 0;
  while (i < args.length) {
    const arg = args[i].trim();
    if (arg[0] === '-') {
      switch(arg.slice(1)) {
        case 'r':
          resp.srcRoot = args[i + 1];
          i++;
          break;

        case 'o':
          resp.outputRoot = args[i + 1];
          i++;
          break;

        case 's':
          // TODO: Once we support more server types then check the next arg to see which they chose.
          resp.initServer = NODE_SERVER_TYPES.EXPRESS;
          break;

        case 'f':
          // TODO: Once we support more server types then check the next arg to see which they chose.
          resp.force = true;
          break;

        default:
          throw new Error(`Unknown command line parameter "${arg}"`)
      }
    }
    else {
      resp.command = arg;
    }
    i++;
  }

  return resp;
}
