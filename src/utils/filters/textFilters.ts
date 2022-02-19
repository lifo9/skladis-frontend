export function uppercase(text) {
  return text.toUpperCase()
}

export function arrayToString(array, delimiter = ',') {
  if (!Array.isArray(array)) {
    return array
  }

  return array.join(delimiter + ' ')
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
