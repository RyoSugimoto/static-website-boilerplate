import ObjectFitImages from 'object-fit-images'
import 'mdn-polyfills/NodeList.prototype.forEach'
import './libraries/modernizr-only-webp'
import Drawer from './libraries/drawer-module'
import { getScrollingElement, setCorrectVh, debounce, runSmoothScroll } from './functions'

// ================
// 要素を取得

const Elements = {
  root: document.documentElement,
  body: document.body,
  scroll: getScrollingElement(),
  links: document.querySelectorAll('[data-link]'),
}

// ================
// IEのときの処理

const isIe = document.documentMode
if (isIe) {
  // CSSのobject-fitプロパティのポリフィルを実行
  ObjectFitImages()
}

// ================
// ブラウザバック時に強制的に再読み込み

window.addEventListener('pageshow', event => {
  if (event.persisted) {
    window.location.reload()
  }
})

// ================
// html要素のCSSカスタムプロパティ「--vh」に実際の表示領域に基づく1vhの値を設定。

window.addEventListener('resize', () => { setCorrectVh() })
window.addEventListener('load', () => { setCorrectVh() })
setCorrectVh()

// ================
// ドロワー

const drawer = new Drawer({
  drawer: '#drawer',
  switch: '[data-drawer-trigger]',
  inert: '[data-drawer-inert]',
})

// 画面のリサイズ時にドロワーを閉じる。

window.addEventListener('resize', () => {
  if (drawer.isExpanded) {
    drawer.close()
  }
})

// ドロワーの中のリンクをクリックするとドロワーを閉じる。

const drawerElement = drawer.drawerElement

if (drawerElement) {
  const linksInDrawer = drawer.drawerElement.querySelectorAll('a')
  if (linksInDrawer.length !== 0) {
    for (let link of linksInDrawer) {
      link.addEventListener('click', () => {
        if (drawer.isExpanded) {
          drawer.close()
        }
      })
    }
  }
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

      runSmoothScroll(scrollTop, newScrollTop, linkInterval)

    } else {
      // リンク先が別のページの場合
      Elements.root.setAttribute('data-loading-state', 'loading')
      setTimeout(() => {
        window.location.href = link.href
      }, linkInterval)
    }
  })
}

window.addEventListener('popstate', event => {
  const scrollTop = Elements.scroll.scrollTop
  let newScrollTop = 0
  if (event.state && event.state.scrollTop) {
    newScrollTop = event.state.scrollTop
  }
  runSmoothScroll(scrollTop, newScrollTop, linkInterval)
})

window.addEventListener('DOMContentLoaded', () => {
  Elements.root.setAttribute('data-loading-state', 'loading')
})

window.addEventListener('load', () => {
  Elements.root.setAttribute('data-loading-state', 'loaded')
})

// ================
// 発生頻度を制御したスクロールイベント

const scrollHandler = debounce(() => {
  // console.log('scroll')
}, 1000)

window.addEventListener('scroll', scrollHandler)
