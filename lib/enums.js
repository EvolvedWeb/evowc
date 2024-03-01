export const ATTRIBUTE_DECODING_LIST = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': '\'',
  '&#x2F;': '/',
};

export const ATTRIBUTE_DECODE_KEYS = `[${Object.keys(ATTRIBUTE_DECODING_LIST).join('')}]`;
export const ATTRIBUTE_DECODE_RE = RegExp(ATTRIBUTE_DECODE_KEYS, 'g');

export const ATTRIBUTE_ENCODING_LIST = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&apos;',
  '/': '&#x2F;'
};

export const ATTRIBUTE_ENCODE_KEYS = `[${Object.keys(ATTRIBUTE_ENCODING_LIST).join('')}]`;
export const ATTRIBUTE_ENCODE_RE = RegExp(ATTRIBUTE_ENCODE_KEYS, 'g');
export const HTML_ENTITIES_RE = RegExp(ATTRIBUTE_ENCODE_KEYS, 'gm');

export const BOOLEAN_ATTRIBUTES = [
  // cspell:disable
  'allowfullscreen', // iframe, embed
  'async', // script
  'autofocus', // input, button, select, textarea
  'autoplay', // audio, video
  'checked', // input[type='checkbox'], input[type='radio']
  'contenteditable', // Global attribute
  'controls', // audio, video
  'default', // track
  'defer', // script
  'disabled', // button, fieldset, input, select, textarea, optgroup, option, menuitem
  'draggable', // Global attribute
  'formnovalidate', // form
  'hidden', // Global attribute
  'inert', // Global attribute
  'ismap', // img, input[type='image']
  'itemscope', // Global attribute
  'loop', // audio, video
  'multiple', // input[type='file'], input[type='email'], input[type='url'], select
  'muted', // audio, video
  'nomodule', // script
  'novalidate', // form, input[type='submit'], input[type='image'], button[type='submit']
  'open', // details
  'playsinline', // video
  'readonly', // input, textarea
  'required', // input, select, textarea
  'reversed', // ol
  'selected', // input[type='option'], option
  'spellcheck', // Global attribute
  'translate', // Global attribute
  // cspell:enable
];

export const INVALID_ELEMENT_NAMES = [
  // cspell:disable
  'alt-glyph-def',
  'alt-glyph-item',
  'alt-glyph',
  'animate-color',
  'animate-motion',
  'animate-transform',
  'annotation-xml',
  'clip-path',
  'color-profile',
  'fe-blend',
  'fe-color-matrix',
  'fe-component-transfer',
  'fe-composite',
  'fe-convolve-matrix',
  'fe-diffuse-lighting',
  'fe-displacement-map',
  'fe-distant-light',
  'fe-flood',
  'fe-func-a',
  'fe-func-b',
  'fe-func-g',
  'fe-func-r',
  'fe-gaussian-blur',
  'fe-image',
  'fe-merge-node',
  'fe-merge',
  'fe-morphology',
  'fe-offset',
  'fe-point-light',
  'fe-specular-lighting',
  'fe-spot-light',
  'fe-tile',
  'fe-turbulence',
  'font-face-format',
  'font-face-name',
  'font-face-src',
  'font-face-uri',
  'font-face',
  'foreign-object',
  'glyph-ref',
  'linear-gradient',
  'missing-glyph',
  'radial-gradient',
  'text-path'
  // cspell:enable
];

/**
 * 2023-05-10 - Currently unused. Not sure what they were for
 */
export const VALID_FILTER_TAGS = [
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
export const TYPE_NORMALIZE = {
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

export const VALID_TYPES = Object.keys(TYPE_NORMALIZE);

export const DATA_TYPES = {
  'arr': 'Array',
  'bigint': 'bigint',
  'bool': 'boolean',
  'date': 'Date',
  'int': 'number',
  'null': 'null',
  'num': 'number',
  'obj': 'Object',
  'str': 'string',
};

/**
 * Tags that should not have a closing tag.
 * Used by the code that generates the template in the source code
 */
export const UNPAIRED_TAGS = [
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

export const HTML_MIN_SETTINGS = {
  collapseWhitespace: true,
  conservativeCollapse: true,
  html5: true,
  keepClosingSlash: true,
  minifyCSS: true,
  minifyJS: true,
  removeAttributeQuotes: true,
  removeComments: true,
};
