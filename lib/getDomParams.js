export function getDomParams(html, css, shadow) {
  let ret = '{';
  ret += html ? `template,` : '';
  ret += css ? `appendStylesFn,` : '';
  ret += (shadow && shadow !== 'open') ? `shadowMode:'${shadow}',` : '';
  ret += 'componentName}';
  return ret;
}
