import { setCorrectVh } from '../libraries/functions'

// ================
// html要素のCSSカスタムプロパティ「--vh」に実際の表示領域に基づく1vhの値を設定。

window.addEventListener('resize', () => { setCorrectVh() })
window.addEventListener('load', () => { setCorrectVh() })
setCorrectVh()
