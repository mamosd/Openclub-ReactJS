/**
 * These functions make dealing with objects easier.
 * Things like strong dot notations and object diffing
 */
import _ from 'lodash'

// Find all the keys in a, that have different values to those in
// b. Equality is only checked in a shallow manner
const shallowObjectDiff = (a, b) => {
  if (typeof a !== 'object' || !a) a = {};
  if (typeof b !== 'object' || !b) b = {};
  const output = {}
  _.keys(a)
    .filter(k => a[k] !== b[k])
    .forEach(k => { output[k] = a[k] })
  return output
}

// this takes an object where the keys are all string notation ids
// and ensures the target object only contains those leaves
const stringKeyObjectFilter = (obj, fields, exclusions = []) => {
  const output = {}
  _.keys(fields).forEach(k => {
    let a = _.get(obj, k)
    exclusions.forEach(e => {
      if (a[e]) delete a[e];
    })
    _.set(output, k, a)
  })
  return output
}

const deepOmit = (obj, keys) => _.cloneDeepWith(obj, v => {
  if (v && typeof v === 'object') {
    keys.forEach(k => {
      if (v[k]) delete v[k]
    });
  }
  return v;
})

export {
  shallowObjectDiff,
  stringKeyObjectFilter,
  deepOmit
}
