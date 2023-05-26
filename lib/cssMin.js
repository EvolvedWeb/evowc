/**
 * Simple minification of a CSS file
 *
 * @param {string} css - String of the CSS file
 * @returns string
 */
function cssMin(css) {
  return css.replace(/\s{\s/g, '{').replace(/\s}\s/g, '}').replace(/:\s/g, ':').replace(/;\s/g, ';').replace(/;}/g, '}').trim();
}

module.exports = cssMin;