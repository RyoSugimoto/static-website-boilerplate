import ObjectFitImages from 'object-fit-images'
import 'mdn-polyfills/NodeList.prototype.forEach'
import './libraries/modernizr-only-webp'
import { getScrollingElement, setCorrectVh, debounce } from './functions'

console.log('main.js loaded')

// 要素
const elements = {
  root: document.documentElement,
  body: document.body,
  scroll: getScrollingElement(),
}

// IEのときの処理
const isIe = document.documentMode
if (isIe) {
  // CSSのobject-fitプロパティのポリフィルを実行
  ObjectFitImages()
}

// ブラウザバック時に強制的に再読み込み
window.addEventListener('pageshow', event => {
  if (event.persisted) {
    window.location.reload()
  }
})

// // html要素のCSSカスタムプロパティ「--vh」に実際の表示領域に基づく1vhの値を設定。
window.addEventListener('resize', () => { setCorrectVh() })
window.addEventListener('load', () => { setCorrectVh() })
setCorrectVh()

const scrollHandler = debounce(() => {
  console.log('scroll')
}, 1000)

window.addEventListener('scroll', scrollHandler)
