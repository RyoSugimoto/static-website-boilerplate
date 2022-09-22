const path = require('path')
const functions = require('../scripts/functions.js')

console.log(functions.getContent('works/work01.json'))
console.log(functions.getImageData('building.jpg'))
console.log(functions.getIcon('bell'))

const markdown = `
## +-heading2

http://example.com

<dl></dl>
`
console.log(functions.getHtmlFromMarkdown(markdown, {
  html: true, // マークダウン内のHTMLタグを有効にする
  linkify: true, // URLをリンクに変換する
  typographer: true, // 特定の文字列をスマートな形式に変換する
}))
console.log(functions.getHtmlFromMarkdown(markdown, {
  html: false,
  linkify: false,
  typographer: false,
}))

console.log(functions.getContentList('article'))
