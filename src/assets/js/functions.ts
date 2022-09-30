/**
 * スマートフォンかどうかを判別する。
 * @returns {boolean}
 */
export const isPhone = (): boolean => {
  const pattern = new RegExp('iPhone|Android.*Mobile')
  return pattern.test(navigator.userAgent)
}

/**
 * スクロールを制御する要素を取得する。
 * @returns {HTMLElement}
 */
export const getScrollingElement = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  if ('scrollingElement' in document) return document.scrollingElement;
  if (ua.indexOf('webkit') > 0) return document.body;
  return document.documentElement;
};

/**
 * 実際の表示領域に基づく1vhのサイズをピクセル値で取得し、
 * 指定した要素のCSSカスタムプロパティに設定する。
 * 要素を指定しない場合は、html要素に設定する。
 * @param {HTMLElement} element プロパティをセットする要素
 */
export const setCorrectVh = (element: HTMLElement = document.documentElement) => {
  const vh = window.innerHeight * 0.01
  element.style.setProperty('--vh', `${vh}px`)
}

/**
 * 関数に実行頻度をコントロールする機能を付加する高階関数。
 */
export const reduceFrequency = (fn: Function, time: number = 60) => {
  let timeout: number | undefined
  let isWaiting = false
  return (callback: Function) => {
    if (!isWaiting) {
      fn(callback)
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
 */
export const debounce = (fn: Function, time: number = 60) => {
  let timeout: number | undefined
  return (callback: Function) => {
    window.clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      fn(callback)
    }, time)
  }
}

/**
 * 関数が連続で実行されたとき、最初のときだけコールバック関数を実行するようにする高階関数。
 */
export const debounceImmediate = (fn: Function, time: number = 60) => {
  let timeout: number | undefined
  let isWaiting = false
  return (callback: Function) => {
    if (!isWaiting) {
      fn(callback)
      isWaiting = true
    }
    window.clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      isWaiting = false
    }, time)
  }
}

/**
 *
 * @param {*} startTop
 * @param {*} anchorTop
 * @param {*} duration
 * @param {*} callback
 */
export const runSmoothScroll = (startTop, anchorTop, duration, callback: Function | null = null) => {
  const startTime = new Date().getTime()
  const distance = anchorTop - startTop
  const animate = () => {
    const currentTime = new Date().getTime()
    const elapsed = currentTime - startTime
    const rate = elapsed / duration
    const d = distance * (Math.sqrt(1 - Math.pow(rate - 1, 2)))
    const scrollingElement = getScrollingElement()
    if (! scrollingElement || undefined === scrollingElement.scrollTop) {
      return
    }
    window.requestAnimationFrame(() => {
      if (rate <= 1) {
        scrollingElement.scrollTop = startTop + d
        animate()
      } else {
        scrollingElement.scrollTop = anchorTop
        if (typeof callback === 'function') {
          callback()
        }
      }
    })
  }
  animate()
}
