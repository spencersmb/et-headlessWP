const path = require('path');
const { getAllPosts, generateIndexSearch } = require('./util');

const WebpackPluginCompiler = require('./plugin-compiler');

module.exports = function indexSearch(nextConfig = {}) {
  const { env, outputDirectory, outputName, verbose = false } = nextConfig;

  const plugin = {
    name: 'SearchIndex',
    outputDirectory: outputDirectory || './public',
    outputName: outputName || 'wp-search.json',
    getData: getAllPosts,
    generate: generateIndexSearch,
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
          count: process.env.NEXT_GET_ALL_PAGES_COUNT,
          verbose,
        })
      );

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
