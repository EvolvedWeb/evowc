const glob = require('glob');
/*
 * Convert an array of Globby paths into an array of paths of existing files.
 */

function getFileArrayFromGlob(cwd, globList, options = {}) {
  let globArray = globList;
  if (!Array.isArray(globList)) {
    globArray = [globList];
  }

  var lastExclude = 0;
  var excludeList = globArray.reduce(
    (obj, pattern, idx) => {
      if (pattern[0] === '!') {
        obj[idx] = pattern.substr(1);
        lastExclude = idx+1;
      }

      return obj;
    }, {}
  );

  console.log({globArray});
  //console.log('excludeList', excludeList, lastExclude);

  return globArray.reduce(
    (obj, pattern, idx) => {
      console.log('globbing:', cwd, pattern);
      if (pattern[0] !== '!') {
        if (!glob.hasMagic(pattern)) {
          obj.push(pattern.replace(/\\/g, '/'));
        }
        else {
          var ignore = [];
          for(let i = idx; i < lastExclude; i++) {
            let exc = excludeList[i];
            if (exc) {
              ignore.push(exc);
            }
          }
          if (options.ignore) {
            ignore = ignore.concat(options.ignore);
          }

          //console.log(idx, ignore);
          const newList = glob.sync(pattern, {cwd, root:cwd, nomount: true, ignore});
          newList.forEach(function(item) {
            obj.push(item.replace(/\\/g, '/'));
          });
        }
      }

      return obj;
    }, []
  );
}

module.exports = getFileArrayFromGlob;
