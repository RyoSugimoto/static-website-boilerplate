const fs = require('fs')
const path = require('path')
const markdown = require('jstransformer-markdown-it')

const encode = 'utf8'

// コンテンツファイルが格納されているディレクトリ
const dirName = 'src/contents'

// マークダウンをHTMLに変換する際のオプション
const markdownOptions = {
  html: true, // マークダウン内のHTMLタグを有効にする
  linkify: true, // URLをリンクに変換する
  typographer: true, // 特定の文字列をスマートな形式に変換する
}

/**
 * 最終的にエクスポートするオブジェクト。
 * データを容易に取得するためのメソッドを含む。
 */
const data = {
  /**
   * 単一のデータを指定して取得する
   * @param {string} type フォルダ名
   * @param {string} slug ファイル名
   * @returns {object}
   */
  get(type, slug) {
    if (!this[type]) return
    const filtered = this[type].filter(typeData => {
      return typeData.slug === slug
    })
    if (!filtered.length) return
    return filtered[0].content
  },
  /**
   * すべてのデータを配列形式で取得する
   * @param {string} type フォルダ名
   * @param {Object} options オプション
   * @returns {array}
   */
  getList(type, options = {}) {
    if (!this[type]) return []
    const list = this[type]
    if (options.sort) {

    }
    return list
  }
}

/**
 * コンテンツファイルを検索し、その情報を返す。
 * @param {string} dirPath コンテンツファイルの検索先ディレクトリ
 * @returns {array} 取得したファイルの情報。
 */
const searchFiles = (dirPath) => {
  const items = fs.readdirSync(dirPath, { withFileTypes: true })
  const files = []
  for (const item of items) {
    if (item.isDirectory()) {
      const f = path.join(dirPath, item.name)
      files.push(searchFiles(f))
    } else if (item.isFile()) {
      files.push({
        path: path.join(dirPath, item.name),
        name: item.name,
        extname: path.extname(item.name)
      })
    }
  }
  return files.flat()
}

// ファイル情報を取得
const files = searchFiles(dirName)

/**
 * 取得したファイル情報を元にエクスポートオブジェクトを更新する。
 */
for (const file of files) {
  const content = fs.readFileSync(file.path, encode)
  const key = file.path.replace(new RegExp(`^${dirName}/(.+)/.+$`), '$1')
  if (!data[key]) {
    data[key] = []
  }
  // テンプレートからデータを取得する際のキーとなる文字列をslugとして定義
  const slug = file.name.replace(new RegExp(`(.+)${file.extname}`), '$1')
  // ファイルの種類に応じてデータを生成してエクスポートオブジェクトに格納する。
  switch (file.extname) {
    case '.json':
      const jsonData = {
        slug,
        content: JSON.parse(content)
      }
      data[key].push(jsonData)
      break
    case '.md':
      data[key].push({
        slug,
        content: markdown.render(content.toString(), markdownOptions)})
      break
    default:
      const contentData = content.toString()
      data[key].push({
        slug,
        content: contentData
      })
      break
  }
}

module.exports = data
