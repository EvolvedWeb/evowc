export function prepClassScript(classScript) {
  return classScript ? `

  // --------------------------------------------------------
  // Start of your code${classScript}// End of your code
  // --------------------------------------------------------` : '';
}
