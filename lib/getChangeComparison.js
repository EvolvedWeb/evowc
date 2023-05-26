function getChangeComparison(type) {
  let resp = `newVal !== oldVal`;
  switch (type) {
    case 'obj':
      resp = `compObjs(newVal, oldVal)`;
      // TODO: Need to make sure newVal is an Object
      break;

    case 'arr':
      resp = `compArrays(newVal,oldVal)`;
      // TODO: Need to make sure newVal is an Array
      break;

    case 'date':
      resp = `compDates(newVal, oldVal)`;
      // TODO: Need to make sure newVal is a Date
      break;
  }

  return resp;
}

module.exports = getChangeComparison;