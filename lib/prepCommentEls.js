export function prepCommentEls(properties) {
  if (properties && typeof properties === 'object') {
    const commentEls = [];

    Object.values(properties).map(prop => {
      const { elements = {} } = prop;
      Object.entries(elements).forEach(([elName, data]) => {
        const { conditional } = data;
        if (conditional) {
          const element = elName.split('.').slice(-1);
          commentEls.push(`'${element}'`);
        }
      })
    })

    if (commentEls.length > 0) {
      return `\n    // Conditional & For Loop Comment Elements
      [${commentEls.join(',')}].forEach(name => {
        this.#comments[name] = comment(name, this.#els[name]);
      });
      Object.freeze(this.#comments);`;
    }
  }

  return '';
}
