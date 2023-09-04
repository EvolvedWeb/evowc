const { HTML_ENTITIES_RE, ATTRIBUTE_ENCODING_LIST } = require("./enums");

const textToHtmlElements = (str) => ('' + str).replace(HTML_ENTITIES_RE, (key) => ATTRIBUTE_ENCODING_LIST[key]);

module.exports = textToHtmlElements;