/**
 * Get the list of import items based on the code
 * @param {*} properties 
 * @returns Array
 */
export function getImports(properties, rootScript, classScript, usesAel, usesCss) {
  const script = `${rootScript}
${classScript}`;
  let usesBool = script.includes('boolFromVal');
  let usesComments = script.includes('comment');
  let usesConditional = script.includes('cond');
  let usesDates = script.includes('sameDates');
  let usesEvents = usesAel || script.includes('ael');
  let usesObjects = script.includes('sameObjs');
  let usesSetAttr = script.includes('setAttr');
  let usesCreateStyles = usesCss || script.includes('createStyles');

  Object.values(properties).forEach(prop => {
    const { type, setHostAttr, elements = {} } = prop;
    usesBool ||= (type === 'bool');
    usesObjects ||= ((type === 'obj') || (type === 'arr'));
    usesDates ||= (type === 'date');
    usesSetAttr ||= !!setHostAttr;
    Object.values(elements).forEach(data => {
      const { binding, conditional, forLoop, events } = data;
      usesComments ||= !!conditional || !!forLoop;
      usesConditional ||= !!conditional;
      usesSetAttr ||= !!forLoop;
      usesEvents ||= !!events;
      binding?.forEach(b => {
        /* istanbul ignore else*/
        if (['aria', 'attr'].includes(b.type)) {
          usesSetAttr = true;
        }

        /* istanbul ignore else*/
        if (b.add2WayBinding) {
          usesEvents = true;
        }
      });
    });
  });

  const imports = ['EvoElement'];
  /* istanbul ignore else*/
  if (usesBool) imports.push('boolFromVal');
  /* istanbul ignore else*/
  if (usesSetAttr) imports.push('setAttr');
  /* istanbul ignore else*/
  if (usesConditional) imports.push('cond');
  /* istanbul ignore else*/
  if (usesObjects) imports.push('sameObjs');
  /* istanbul ignore else*/
  if (usesDates) imports.push('sameDates');
  /* istanbul ignore else*/
  if (usesComments) imports.push('comment');
  /* istanbul ignore else*/
  if (usesEvents) imports.push('ael');
  /* istanbul ignore else*/
  if (usesCreateStyles) imports.push('createStyles')

  return imports;
}
