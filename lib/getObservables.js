function getObservables(observedAttributes) {
  return (observedAttributes) ? `
  // The attributes this component watches for changes
  static get observedAttributes() {
    return [${observedAttributes}];
  }
` : '';
}

module.exports = getObservables;