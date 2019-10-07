import { Seq } from 'immutable';

export function fromJSOrdered(js) {
  return typeof js !== 'object' || js === null ? js :
    Array.isArray(js) ?
      Seq(js).map(fromJSOrdered).toList() :
      Seq(js).map(fromJSOrdered).toOrderedMap();
}

export const setToneValue = (node, value, valueName) => {
  node[valueName] = value
}

export const setToneSignalValue = (node, value, valueName) => {
  node[valueName].value = value
}