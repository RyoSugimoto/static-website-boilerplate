const fs = require('fs')
const path = require('path')

// getIcon()の検索先ディレクトリ
const iconPath = '../src/icons'

/**
 * 所定のディレクトリから指定した名前のSVGアイコンを探し出し、その内容を返す。
 * @param {string} name アイコンのSVGファイル名（拡張子なし）
 * @returns {string} SVG文字列
 */
const getIcon = (name) => {
  let iconFile = null
  try {
    iconFile = fs.readFileSync(path.resolve(__dirname, `${iconPath}/${name}.svg`))
  } catch {
    //
  }
  if (!iconFile) return ''
  return iconFile.toString()
}

module.exports = {
  getIcon
}
