/**
 * Does this set of properties have any events inside a looped section
 * @param {object} properties A set of properties
 * @returns {boolean} - True is this set of properties has any events within a looped section
 */
export function hasLoopedEvents(properties) {
  return Object.values(properties).some(prop => {
    return Object.values(prop?.elements).some(data => data?.forLoop?.forEventInfo?.length > 0);
  });
}
