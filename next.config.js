const withPlugins = require('next-compose-plugins');
const sitemap = require('./plugins/sitemap');
const feed = require('./plugins/feed');
const searchIndex = require('./plugins/searchIndex');

module.exports = withPlugins([[searchIndex],[feed],[sitemap]], {
  // env: {
  //   WORDPRESS_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_WP_API_URL,
  //   // WORDPRESS_MENU_LOCATION_NAVIGATION: process.env.WORDPRESS_MENU_LOCATION_NAVIGATION || 'PRIMARY',
  //   // WORDPRESS_PLUGIN_SEO: parseEnvValue(process.env.WORDPRESS_PLUGIN_SEO, false),
  // },

  // By enabling verbose logging, it will provide additional output details for
  // diagnostic purposes. By default is set to false.
  verbose: true,
  reactStrictMode: true,
  basePath: '',
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US'
  }
})
