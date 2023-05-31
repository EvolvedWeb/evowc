function getChangeComparison(type) {
  let resp = `oldVal !== newVal`;
  switch (type) {
    case 'arr':
    case 'obj':
      // TODO: Need to make sure newVal is an Object
      resp = `!sameObjs(oldVal, newVal)`;
      break;

    case 'date':
      // TODO: Need to make sure newVal is a Date
      resp = `!sameDates(oldVal, newVal)`;
      break;
  }

  return resp;
}

module.exports = getChangeComparison;