export function scrollTop() {
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 10)
}

export function arrayUnique(array) {
  const a = array.concat()
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1)
    }
  }

  return a
}

export function enableScroll() {
  document.body.classList.remove('modal-open')
}

export function disableScroll() {
  document.body.classList.add('modal-open')
}

export function debounce(fn, delay) {
  let timeoutID = null
  return function () {
    clearTimeout(timeoutID)
    const args = arguments
    const that = this
    timeoutID = setTimeout(function () {
      fn.apply(that, args)
    }, delay)
  }
}
