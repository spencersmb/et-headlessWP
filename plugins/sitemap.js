const path = require('path');
const { getSitemapData, generateSitemap, generateRobotsTxt } = require('./util');

const WebpackPluginCompiler = require('./plugin-compiler');

module.exports = function sitemap(nextConfig = {}) {
  const {env, outputDirectory, outputName, verbose = false} = nextConfig;
  const plugin = {
    name: 'Sitemap',
    outputDirectory: outputDirectory || './public',
    outputName: outputName || 'sitemap.xml',
    getData: getSitemapData,
    generate: generateSitemap,
    postcreate: generateRobotsTxt,
  };

  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (config.watchOptions) {
        config.watchOptions.ignored.push(path.join('**', plugin.outputDirectory, plugin.outputName));
      }

      config.plugins.push(
        new WebpackPluginCompiler({
          url: process.env.NEXT_PUBLIC_WP_API_URL,
          plugin,
          verbose,
          count: process.env.NEXT_GET_ALL_PAGES_COUNT
        })
      );

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
}
