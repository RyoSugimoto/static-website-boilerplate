import imagemin from 'imagemin'
import imageminAvif from 'imagemin-avif'
import { searchDirs, searchFiles } from './functions.js'
import fs from 'fs'

const inputDir = process.argv[2] || null
const outputDir = process.argv[3] || null

/**
 * 入力ディレクトリ以下のディレクトリのパスをすべて取得し
 * 入力ディレクトリ自体のパス情報と結合する。
 */
const inputDirs = [
  inputDir,
  ...(searchDirs(inputDir).map(dir => dir.path))
]

/**
 * 指定したパス直下にある画像ファイルにimageminを適用する。
 * @param {string} path
 */
const min = async(path) => {
  // 出力先パスを設定するために入力ディレクトリ以下のディレクトリ構造を抽出。
  const structure = path.replace(new RegExp(`^.*${inputDir}`), '')

  // imagemin-avifは書き出すファイルの拡張子を変更してくれない。
  // 事前に対象のファイルをコピーし拡張子を.avifに変更しておき、
  // それを変換元のファイルとしてimageminに渡す。
  const dirents = fs.readdirSync(path, { withFileTypes: true, })
  const targetFiles = dirents.filter(dirent => dirent.isFile())
  for (let targetFile of targetFiles) {
    if (! /.+\.(jpe?g|png)$/.test(targetFile.name)) {
      // JPEGとPNG以外の場合はスルー。
      continue
    }
    fs.mkdirSync(`${outputDir}${structure}`, {
      recursive: true
    })
    fs.copyFileSync(`${path}/${targetFile.name}`, `${outputDir}${structure}/${targetFile.name.replace(/^(.+)\.(jpe?g|png)$/, '$1.avif')}`)
  }

  const files = await imagemin([`${outputDir}${structure}/*.avif`], {
    destination: `${outputDir}${structure}`,
    plugins: [
      imageminAvif({
        quality: 50,
      }),
    ]
  })
  console.log(files.map(file => {
    return {
      data: file.data,
      destinationPath: file.destinationPath,
    }
  }))
}

for (let path of inputDirs) {
  min(path)
}
