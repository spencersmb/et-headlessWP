const withPlugins = require('next-compose-plugins');
const sitemap = require('./plugins/sitemap');

module.exports = withPlugins([[sitemap]], {
  reactStrictMode: true,
  basePath: '',
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US'
  }
})
