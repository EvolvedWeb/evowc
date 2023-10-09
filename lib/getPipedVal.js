function getPipedVal({ pipes, setterProp, defaultVal = null }, el) {
  if (pipes) {
    return `${[...pipes].reverse().join('(')}(structuredClone(${setterProp} ?? ${defaultVal})${pipes.map(() => `, ${el}.dataset)`).join('')}`;
  }

  return `${setterProp} ?? ${defaultVal}`;
}

module.exports = getPipedVal;