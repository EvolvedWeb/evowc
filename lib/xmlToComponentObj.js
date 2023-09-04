const { XMLParser } = require("fast-xml-parser");
const Component = require('./Component');
const { UNPAIRED_TAGS } = require('./enums');

const START_OF_TAGS_RE = /(<script[^>]*>|<style[^>]*>)/g;
const END_OF_TAGS_RE = /(<\/script>|<\/style>)/g;
const PARSER_OPTIONS = {
  allowBooleanAttributes: true,
  attributeNamePrefix: "",
  ignoreAttributes: false,
  parseTagValue: false,
  preserveOrder: true,
  processEntities: false,
  removeComments: true,
  textNodeName: "$",
  trimValues: false,
  unpairedTags: UNPAIRED_TAGS,
};

const xmlParser = new XMLParser(PARSER_OPTIONS);

/**
 * Convert an XML string into a ComponentObject
 *
 * @param {string} source - XML file contents as a string
 * @returns ComponentObject
 */
function xmlToComponentObj(source) {
  // Force the Style and Script sections to be in a CDATA block
  source = source.replace(START_OF_TAGS_RE, '$1<![CDATA[').replace(END_OF_TAGS_RE, ']]>$1');

  // Parse the XML file
  const sourceObj = xmlParser.parse(source).filter(item => item.component);

  // Check for parcing problems
  if (!Array.isArray(sourceObj)) {
    throw new Error("Source File did not process correctly.");
  }

  // Make sure there is only cne component in the XML file
  if (sourceObj.length !== 1) {
    throw new Error("Only one component per source file is allowed.");
  }

  // Convert XML object into a proper object
  const component = new Component(sourceObj[0][':@'], sourceObj[0].component);
  return component.toJSON();
}

module.exports = xmlToComponentObj;