import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'

const inputDir = process.argv[2] || null
const outputDir = process.argv[3] || null

const run = async () => {
  const files = await imagemin([`${inputDir}/*.{jpg,jpeg,png}`], {
    destination: outputDir,
    plugins: [
      imageminWebp({
        quality: 75,
      }),
    ]
  })
  console.log(files)
}

run()
