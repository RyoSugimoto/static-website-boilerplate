module.exports = ctx => ({
  plugins: {
    'tailwindcss': {},
    'postcss-preset-env': {
      stage: 2,
    },
    'cssnano': {}
  },
})
