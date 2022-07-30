/**
 * 指定したファイルをzip圧縮し、指定した場所に出力する。
 * archiverが必要。
 */

import archiver from 'archiver'
import fs from 'fs'

const inputGlob = process.argv[2] || null
const outputName = process.argv[3] || null

const zipName = outputName

const archive = archiver.create('zip', {})
const output = fs.createWriteStream(zipName)
archive.pipe(output);

archive.glob(inputGlob)

archive.finalize()

output.on('close', () => {
  console.log(`${archive.pointer()}`)
})
