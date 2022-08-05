const path = require('path')

const config = {
  name: 'Website Boilerplate',
  domain: 'websiteboilerplate.com',
  protocol: 'https',
  charset: 'UTF-8',
  language: 'ja',
  title: 'Website Boilerplate - A boilerplate for static websites',
  description: 'This project is for static websites.',
  keywords: ['boilerplate', 'static', 'website'],
  copyright: '© 2022 xxxx',
  themeColor: {
    light: 'white',
    dark: 'black'
  },
  getUrl() { return `${this.protocol}://${this.domain}` },
  imageDirectory: 'src/assets/images',
  iconDirectory: 'src/icons',
  contentDirectory: 'src/contents',
}

module.exports = config
