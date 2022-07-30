import imagemin from 'imagemin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'
import imageminGifsicle from 'imagemin-gifsicle'
import imageminSvgo from 'imagemin-svgo'

const inputDir = process.argv[2] || null
const outputDir = process.argv[3] || null

const run = async () => {
  const files = await imagemin([`${inputDir}/*.{jpg,jpeg,png,gif,svg}`], {
    destination: outputDir,
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

run()
