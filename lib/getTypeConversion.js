function getTypeConversion(type, min = null, max = null) {
  let resp = [];
  switch (type) {
    case 'num':
      resp.push(`newVal = Number(newVal)`);
      if (min != null) {
        resp.push(`if (newVal < ${min}) newVal = ${min}`);
      }
      if (max != null) {
        resp.push(`if (newVal > ${max}) newVal = ${max}`);
      }
      break;

    case 'int':
      resp.push(`newVal = parseInt(newVal, 10)`);
      if (min != null) {
        resp.push(`if (newVal < ${min}) newVal = ${min}`);
      }
      if (max != null) {
        resp.push(`if (newVal > ${max}) newVal = ${max}`);
      }
      break;

    case 'bigint':
      resp.push(`newVal = BigInt(newVal)`);
      break;

    case 'bool':
      resp.push(`newVal = boolFromVal(newVal)`);
      break;

    case 'obj':
      resp.push(`newVal = (typeof newVal==='string' ? JSON.parse(newVal) : newVal)`);
      // TODO: Need to make sure newVal is an Object
      break;

    case 'arr':
      resp.push(`newVal = (typeof newVal === 'string' ? JSON.parse(newVal) : newVal)`);
      // TODO: Need to make sure newVal is an Array
      break;

    case 'date':
      resp.push(`newVal = (typeof newVal === 'string' ? new Date(newVal) : newVal) ?? null`);
      // TODO: Need to make sure newVal is a Date
      break;

    case 'null':
      break;

    case 'str':
    default:
      resp.push(`newVal = newVal == null ? null : ''+newVal`);
  }

  return resp.length > 0 ? `\n    ${resp.join(';\n    ')};` : '';
}

module.exports = getTypeConversion;