const ATTRIBUTE_DECODING_LIST = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': '\'',
  '&#x2F;': '/',
};

const ATTRIBUTE_DECODE_KEYS = `[${Object.keys(ATTRIBUTE_DECODING_LIST).join('')}]`;
const ATTRIBUTE_DECODE_RE = RegExp(ATTRIBUTE_DECODE_KEYS, 'g');

const ATTRIBUTE_ENCODING_LIST = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&apos;',
  '/': '&#x2F;'
};

const ATTRIBUTE_ENCODE_KEYS = `[${Object.keys(ATTRIBUTE_ENCODING_LIST).join('')}]`;
const ATTRIBUTE_ENCODE_RE = RegExp(ATTRIBUTE_ENCODE_KEYS, 'g');
const HTML_ENTITIES_RE = RegExp(ATTRIBUTE_ENCODE_KEYS, 'gm');

const BOOLEAN_ATTRIBUTES = [
  'allowfullscreen',
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'controls',
  'default',
  'defer',
  'disabled',
  'formnovalidate',
  'inert',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nomodule',
  'novalidate',
  'open',
  'playsinline',
  'readonly',
  'required',
  'reversed',
  'selected',
];

/**
 * 2023-05-10 - Currently unused. Not sure what they were for
 */
const VALID_FILTER_TAGS = [
  'input',
  'textarea'
];

/**
 * Normalization table for attribute types.
 * The user can use any of the keys as a type.
 * These types are then converted to the associated value
 * For example, if the user enters :title="string:Alert"
 * then, internally, we use the style of `str` instead of `string`
 */
const TYPE_NORMALIZE = {
  'arr': 'arr',
  'array': 'arr',
  'bigint': 'bigint',
  'bool': 'bool',
  'boolean': 'bool',
  'date': 'date',
  'int': 'int',
  'null': 'null',
  'num': 'num',
  'number': 'num',
  'obj': 'obj',
  'object': 'obj',
  'str': 'str',
  'string': 'str',
};

const VALID_TYPES = Object.keys(TYPE_NORMALIZE);

/**
 * Tags that should not have a closing tag.
 * Used by the code that generates the template in the source code
 */
const UNPAIRED_TAGS = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

const HTML_MIN_SETTINGS = {
  collapseWhitespace: true,
  conservativeCollapse: true,
  html5: true,
  minifyCSS: true,
  minifyJS: true,
  removeAttributeQuotes: true,
};

module.exports = {
  ATTRIBUTE_DECODE_KEYS,
  ATTRIBUTE_DECODING_LIST,
  ATTRIBUTE_DECODE_RE,
  ATTRIBUTE_ENCODE_KEYS,
  ATTRIBUTE_ENCODING_LIST,
  ATTRIBUTE_ENCODE_RE,
  BOOLEAN_ATTRIBUTES,
  HTML_ENTITIES_RE,
  HTML_MIN_SETTINGS,
  TYPE_NORMALIZE,
  UNPAIRED_TAGS,
  VALID_FILTER_TAGS,
  VALID_TYPES,
};