export function uppercase (text) {
  return text.toUpperCase()
}

export function arrayToString (array, delimiter = ',') {
  if (!Array.isArray(array)) {
    return array
  }

  return array.join(delimiter + ' ')
}
