/**
 * If there are any attributes we are to observe then create the static getter
 * @param {string} observedAttributes 
 * @returns {string}
 */
export function getObservables(observedAttributes) {
  return (observedAttributes) ? `
  // The attributes this component watches for changes
  static get observedAttributes() {
    return [${observedAttributes}];
  }
` : '';
}
