import { debounce } from '../libraries/functions'

// ================
// 発生頻度を制御したスクロールイベント

const scrollHandler = debounce(() => {
  // console.log('scroll')
}, 1000)

window.addEventListener('scroll', scrollHandler)
