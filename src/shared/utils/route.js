/**
 * Extra functions used to make routing easier to deal with
 */

// find a list of keys that match the start of the url after a prefix
const keysFromFragments = (pathname, prefix, keys) => {
  const compare = pathname.substr(prefix.length + 1)
  return keys.filter(k => compare.startsWith(k))
}

export {
  keysFromFragments
}
