/**
 * Return a shallow copy of `obj` containing only the whitelisted `keys`
 * that are present. Guards controllers against mass-assignment.
 */
export const pick = (obj = {}, keys = []) =>
  keys.reduce((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key];
    return acc;
  }, {});

export default pick;
