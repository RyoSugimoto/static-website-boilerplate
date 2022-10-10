import { runSmoothScroll, getScrollingElement } from '../libraries/functions'
import { easeOutCirc } from '../libraries/easing'

// ================
// 要素を取得

const Elements = {
  root: document.documentElement,
  scroll: getScrollingElement(),
  links: document.querySelectorAll('[data-link]'),
}

// ================
// 内部リンクをクリックしたときの処理

const linkInterval = 500

for (let link of Elements.links) {
  const pageUrlPattern = /(https?:\/\/.+\/?)([#].*)/
  const targetPageUrl = link.href.replace(pageUrlPattern, '$1')
  const hash= link.href.match(/[#].*/)
  const currentUrl = window.location.href.replace(pageUrlPattern, '$1')
  link.addEventListener('click', e => {
    e.preventDefault()
    if (currentUrl === targetPageUrl) {
      // リンク先が同一ページの場合

      let targetAnchor = null

      if (hash) {
        targetAnchor = document.querySelector(hash)
      }

      const scrollTop = Elements.scroll.scrollTop

      // スクロール前のスクロール位置を記憶
      history.pushState({
        scrollTop: scrollTop
      }, null, null)

      let newScrollTop = 0

      if (targetAnchor) {
        newScrollTop = targetAnchor.getBoundingClientRect().top + window.pageYOffset
      }

      history.pushState({
        scrollTop: newScrollTop
      }, null, `${hash || '#'}`)

      runSmoothScroll(scrollTop, newScrollTop, 1000, easeOutCirc)

    } else {
      // リンク先が別のページの場合
      if (link.target === '_blank') {
        window.open(link.href, '_blank')
      } else {
        Elements.root.setAttribute('data-loading-state', 'loading')
        setTimeout(() => {
          window.location.href = link.href
        }, linkInterval)
      }
    }
  })
}

window.addEventListener('popstate', event => {
  const scrollTop = Elements.scroll.scrollTop
  let newScrollTop = 0
  if (event.state && event.state.scrollTop) {
    newScrollTop = event.state.scrollTop
  }
  runSmoothScroll(scrollTop, newScrollTop, 1000, easeOutCirc)
})

window.addEventListener('DOMContentLoaded', () => {
  Elements.root.setAttribute('data-loading-state', 'loading')
})

window.addEventListener('load', () => {
  Elements.root.setAttribute('data-loading-state', 'loaded')
})

// ================
// ブラウザバック時に強制的に再読み込み

window.addEventListener('pageshow', event => {
  if (event.persisted) {
    window.location.reload()
  }
})
