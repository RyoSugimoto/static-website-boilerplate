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
export const getScrollingElement = ():HTMLElement => {
  const documentObject:Document = document
  const ua = window.navigator.userAgent.toLowerCase();
  if ('scrollingElement' in document) {
    return document.scrollingElement as HTMLElement;
  }
  if (ua.indexOf('webkit') > 0) {
    return documentObject.body as HTMLBodyElement;
  }
  return documentObject.documentElement;
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

type EasingFunction = (number:number) => number

/**
 * スムーズスクロールを実行する。
 * @param {number} startTop 初期のスクロール位置
 * @param {number} anchorTop 到達先のスクロール位置
 * @param {number} duration デュレーション
 * @param {function} easing スクロールのイージング関数
 * @param {function} callback スクロール後に実行する関数
 */
export const runSmoothScroll = (
  startTop:number,
  anchorTop:number,
  duration:number = 500,
  easing:EasingFunction|null = null,
  callback:Function|null = null
) => {
  const startTime = new Date().getTime()
  const distance = anchorTop - startTop
  const animate = () => {
    const currentTime = new Date().getTime()
    const elapsed = currentTime - startTime
    const rate = elapsed / duration
    let d = rate
    if ( typeof easing === 'function') {
      d = distance * easing(rate)
    }
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
