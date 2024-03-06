import { HTML_ENTITIES_RE, ATTRIBUTE_ENCODING_LIST } from './enums.js';

export const textToHtmlElements = (str='') =>
  ('' + str).replace(HTML_ENTITIES_RE, (key) => ATTRIBUTE_ENCODING_LIST[key]);
