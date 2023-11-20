function prepRootScript(rootScript) {
  return rootScript ? `\n// --------------------------------------------------------\n// Start of your root script code\n${rootScript}\n// End of your root script code\n// --------------------------------------------------------` : '';
}

module.exports = prepRootScript;