/**
 * pug-cliの実行前に実行される処理。
 * エクスポートしたオブジェクトはpugテンプレートからグローバルに参照可能になる。
 */

// コンテンツデータ（JSON、Markdown）
const data = require('./read-contents.cjs')

// 関数を定義するファイル
const functions = require('./functions.cjs')

// ウェブサイトの設定
// このファイルは制作時に内容を編集するため、srcディレクトリ以下に存在する。
const config = require('../src/website.config.js')

module.exports = {
  Data: data,
  Config: config,
  getIcon: functions.getIcon
}
