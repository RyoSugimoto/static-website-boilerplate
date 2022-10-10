import { isPhone } from '../libraries/functions'

// ================
// 要素を取得

const Elements = {
  root: document.documentElement,
}

// ================
// スマートフォンからのアクセスかどうかに応じて`html`要素に属性を付与する。

Elements.root.setAttribute(isPhone() ? 'data-is-phone' : 'data-is-not-phone', '')
