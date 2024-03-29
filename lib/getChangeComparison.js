export function getChangeComparison(type) {
  let resp;
  switch (type) {
    case 'arr':
    case 'obj':
      // TODO: Need to make sure newVal is an Object or Array
      resp = `!sameObjs(oldVal, newVal)`;
      break;

    case 'date':
      // TODO: Need to make sure newVal is a Date
      resp = `!sameDates(oldVal, newVal)`;
      break;

    default:
      resp = `oldVal !== newVal`;
      break;
  }

  return resp;
}
