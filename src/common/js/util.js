function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(ary) {
  let _ary = ary.slice()
  for (let i = 0; i < _ary.length; i++) {
    let j = getRandomInt(0, i)
    ;[_ary[i], _ary[j]] = [_ary[j], _ary[i]]
  }
  return _ary
}

// 截流函数
export function debounce(func, delay) {
  let timer

  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
