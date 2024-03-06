import { HTML_MIN_SETTINGS } from './enums.js';

const nonCollapseWhitespaceTags = ['script', 'style', 'pre', 'textarea'];
const nonTrimWhitespaceTags = ['pre', 'textarea'];

/**
 * Get the set of options for minifying HTML
 *
 * @param {string[]} additionalElements a list of elements that should be treated like <pre> and not minified
 * @returns the set of options for minifying HTML
 */
export function getHtmlMinifySettings(additionalElements) {
  /** @type {any} */
  const settings = { ...HTML_MIN_SETTINGS };
  if (additionalElements.length > 0) {
    const collapseTags = [...nonCollapseWhitespaceTags, ...additionalElements];
    const reCollapseWhitespace = new RegExp(`^(?:${collapseTags.join('|')})$`);
    const trimTags = [...nonTrimWhitespaceTags, ...additionalElements];
    const reTrimWhitespace = new RegExp(`^(?:${trimTags.join('|')})$`);
    settings.canCollapseWhitespace = tag => !reCollapseWhitespace.test(tag);
    settings.canTrimWhitespace = tag => !reTrimWhitespace.test(tag);
  }

  return settings;
}
