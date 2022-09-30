import imagemin from 'imagemin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'
import imageminGifsicle from 'imagemin-gifsicle'
import imageminSvgo from 'imagemin-svgo'
import { searchDirs } from './functions.js'

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
  const files = await imagemin([`${path}/*.{jpg,jpeg,png,gif,svg,webp,avif}`], {
    destination: `${outputDir}${structure}`,
    plugins: [
      imageminMozjpeg({
        quality: 75,
      }),
      imageminPngquant({
        speed: 6,
      }),
      imageminGifsicle({
        interlaced: true,
        optimizationLevel: 1,
      }),
      imageminSvgo({
        plugins: [
          {
            name: 'removeViewBox',
            active: false
          }
        ]
      })
    ]
  })
  console.log(files)
}

for (let path of inputDirs) {
  min(path)
}
