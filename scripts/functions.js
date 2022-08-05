const fs = require('fs')
const path = require('path')
const sizeOf = require('image-size')
const markdown = require('jstransformer-markdown-it')
const config = require('../src/website.config.js')
const color = require('./console-color.js')
const { contentDirectory } = require('../src/website.config.js')

// SVGアイコンファイルの格納先ディレクトリ
const iconPath = config.iconDirectory || 'src/icons'

// 画像ファイルの格納先ディレクトリ
const imagePath = config.imageDirectory || 'src/assets/images'

// コンテンツの格納先ディレクトリ
const contentPath = config.contentDirectory || 'src/contents'

/**
 * 所定のディレクトリから指定した名前のSVGアイコンを探し出し、その内容を返す。
 * @param {string} name アイコンのSVGファイル名（拡張子なし）
 * @returns {string} SVG文字列
 */
const getIcon = (name) => {
  let iconFile = null
  try {
    iconFile = fs.readFileSync(path.resolve(iconPath, `${name}.svg`))
  } catch(error) {
    console.log(`getIcon: ${color.red}${error}${color.default}`)
    return ''
  }
  return iconFile.toString()
}

/**
 * 所定のディレクトリから指定したイメージを探し出し、その幅と高さを返す。
 * @param {string} fileName 拡張子付きの画像ファイル名（画像までのパスは不要）
 * @returns {Object}
 */
const getImageData = (fileName) => {
  const filePath = path.resolve(imagePath, fileName)
  try {
    fs.readFileSync(filePath)
  } catch(error) {
    console.log(`getImageData: ${color.red}${error}${color.default}`)
    return {
      isError: true,
      message: `${filePath} not found`
    }
  }
  return sizeOf(filePath)
}

/**
 * 指定したディレクトリ以下にあるファイルを検索し、その情報を返す。
 * @param {string} dirPath 検索先のディレクトリ
 * @returns {array} 取得したファイルの情報。
 */
const searchFiles = dirPath => {
  let items
  const files = []
  if (!dirPath) {
    console.log(`${color.red}searchFiles: dirPath is invalid.${color.default}`)
    return files
  }
  try {
    items = fs.readdirSync(dirPath, { withFileTypes: true })
  } catch(error) {
    console.log(`${color.red}searchFiles: ${error}${color.default}`)
    return files
  }
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

/**
 * 指定したディレクトリ以下にあるディレクトリを検索し、その情報を返す。
 * @param {string} dirPath 検索先のディレクトリ
 * @returns {array} 取得したディレクトリの情報。
 */
const searchDirs = (dirPath) => {
  let items
  const dirs = []
  if (!dirPath) {
    console.log(`${color.red}searchDirs: dirPath is invalid.${color.default}`)
    return dirs
  }
  try {
    items = fs.readdirSync(dirPath, { withFileTypes: true })
  } catch(error) {
    console.log(`${color.red}searchDirs: ${error}${color.default}`)
    return dirs
  }
  for (const item of items) {
    if (item.isDirectory()) {
      const f = path.join(dirPath, item.name)
      dirs.push({
        path: path.join(dirPath, item.name),
        name: item.name,
      })
      dirs.push(searchDirs(f))
    }
  }
  return dirs.flat()
}

/**
 * マークダウン形式の文字列を受け取り、HTMLに変換して返す。
 * @param {string} markdownString
 * @param {object} options
 * @returns {string} HTML文字列
 */
const getHtmlFromMarkdown = (markdownString, options = {
  html: true, // マークダウン内のHTMLタグを有効にする
  linkify: true, // URLをリンクに変換する
  typographer: true, // 特定の文字列をスマートな形式に変換する
}) => {
  return markdown.render(markdownString, options)
}

/**
 *
 * @param {string} filePath
 * @returns
 */
const getContentFileData = (filePath) => {
  const extname = path.extname(filePath)
  const contentData = {
    path: filePath,
    slug: path.basename(filePath),
    content: ''
  }
  let fileData
  try {
    fileData = fs.readFileSync(filePath, 'utf8')
  } catch(error) {
    console.log(`${color.red}getContent: ${error}${color.default}`)
    contentData.isError = true
    return contentData
  }
  switch (extname) {
    case '.json':
      contentData.content = JSON.parse(fileData)
      break
    case '.md':
      contentData.content = getHtmlFromMarkdown(fileData.toString())
      break
    default:
      contentData.content = fileData.toString()
  }
  return contentData
}

const getContent = fileName => {
  const filePath = path.resolve(contentPath, fileName)
  return getContentFileData(filePath)
}

const getContentList = (dirPath) => {
  const searchPath = dirPath ? `${contentPath}/${dirPath}` : contentPath
  const files = searchFiles(searchPath)
  const contentDataList = []
  for (const file of files) {
    const fileData = getContentFileData(file.path)
    contentDataList.push(fileData)
  }
  return contentDataList
}

module.exports = {
  getIcon,
  getImageData,
  searchFiles,
  searchDirs,
  getHtmlFromMarkdown,
  getContent,
  getContentList,
}
