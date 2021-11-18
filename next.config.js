const withPlugins = require('next-compose-plugins');
const sitemap = require('./plugins/sitemap');
const feed = require('./plugins/feed');
const searchIndex = require('./plugins/searchIndex');
const staticWpData = require('./plugins/staticWpData');
const { nanoid } = require('nanoid');
const crypto = require('crypto');


const generateCsp = () => {
  const hash = crypto.createHash('sha256');
  hash.update(nanoid());
  const production = process.env.NODE_ENV === 'production';

  return `default-src 'self'; style-src https://fonts.googleapis.com 'self' 'unsafe-inline'; script-src 'sha256-${hash.digest(
    'base64'
  )}' 'self' 'unsafe-inline' ${
    production ? '' : "'unsafe-eval'"
  }; font-src https://fonts.gstatic.com 'self' data:; img-src https://lh3.googleusercontent.com https://res.cloudinary.com https://s.gravatar.com 'self' data:;`;
};
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: generateCsp()
  }
]
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
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       // headers: securityHeaders,
  //     }
  //
  //   ]
  // },
})
