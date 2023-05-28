function getChangeComparison(type) {
  let resp = `oldVal !== newVal`;
  switch (type) {
    case 'obj':
      // TODO: Need to make sure newVal is an Object
      resp = `compObjs(oldVal, newVal)`;
      break;

    case 'arr':
      // TODO: Need to make sure newVal is an Array
      resp = `compArrays(oldVal,newVal)`;
      break;

    case 'date':
      // TODO: Need to make sure newVal is a Date
      resp = `compDates(oldVal, newVal)`;
      break;
  }

  return resp;
}

module.exports = getChangeComparison;