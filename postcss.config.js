const path = require('path')

module.exports = ctx => ({
  plugins: {
    'postcss-preset-env': {
      autoprefixer: {
        grid: 'no-autoplace'
      },
      stage: 2,
      features: {
        'custom-properties': true,
        'nesting-rules': true,
      },
      // カスタムプロパティの参照先ファイル
      // importFromは廃止される予定なので無効化
      // importFrom: path.resolve(__dirname, 'dist/assets/css/main.css'),
    },
    // Tailwind CSSでNestingを有効化
    // https://tailwindcss.com/docs/using-with-preprocessors#nesting
    'tailwindcss/nesting': {},
    // Tailwind CSS
    'tailwindcss': {},
    // CSSコードを圧縮
    'cssnano': {}
  },
  // htmlにpostcssを適用する際は、事前にimportFromの参照先ファイルが存在している必要がある。したがって、HTMLより先にCSSが生成されるようにコマンドの流れを構成する。
  syntax: ctx.file.extname === '.html' ? 'postcss-html' : null,
})
