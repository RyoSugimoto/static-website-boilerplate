import ObjectFitImages from 'object-fit-images'
import 'mdn-polyfills/NodeList.prototype.forEach'
import './libraries/modernizr-only-webp'

console.log('main.js loaded')

// IEのときの処理
const isIe = document.documentMode
if (isIe) {
  document.body.setAttribute('data-loaded', '')
  // obejct-fitポリフィルを実行
  ObjectFitImages()
}

// ブラウザバック時に強制的に再読み込み
window.addEventListener('pageshow', event => {
  if (event.persisted) {
    window.location.reload()
  }
})

// スクロールさせる要素を取得
const scrollingElement = (() => {
  const ua = window.navigator.userAgent.toLowerCase();
  if ('scrollingElement' in document) return document.scrollingElement;
  if (ua.indexOf('webkit') > 0) return document.body;
  return document.documentElement;
})();

// vhの計算
function setVh() {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}
window.addEventListener('resize', setVh)
window.addEventListener('load', setVh)
setVh()

/**
 * 関数に実行頻度をコントロールする機能を付加する高階関数。
 * @param {function} fn
 * @param {number} time
 * @returns
 */
const reduceFrequency = (fn, time = 60) => {
  let timeout
  let isWaiting = false
  return (callback) => {
    if (!isWaiting) {
      fn.call(this, callback)
      isWaiting = true
      timeout = window.setTimeout(() => {
        isWaiting = false
        window.clearTimeout(timeout)
      }, time)
    }
  }
}

/**
 * 関数が連続で実行されたとき、最後のときだけコールバック関数を実行するようにする高階関数。
 * @param {function} fn
 * @param {number} time
 * @returns
 */
const debounce = (fn, time = 60) => {
  let timeout
  return (callback) => {
    window.clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      fn.call(this, callback)
    }, time)
  }
}

/**
 * 関数が連続で実行されたとき、最初のときだけコールバック関数を実行するようにする高階関数。
 * @param {function} fn
 * @param {number} time
 * @returns
 */
const debounceImmediate = (fn, time = 60) => {
  let timeout
  let isWaiting = false
  return (callback) => {
    if (!isWaiting) {
      fn.call(this, callback)
      isWaiting = true
    }
    window.clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      isWaiting = false
    }, time)
  }
}
