export function scrollTop () {
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 10)
}

export function arrayUnique (array) {
  let a = array.concat()
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1)
    }
  }

  return a
}
