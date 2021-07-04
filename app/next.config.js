const withTM = require('next-transpile-modules')([
  'api',
  'mongodb2',
  'context-api',
]);
const withImages = require('next-images');

module.exports = withImages(
  withTM({
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.graphql?$/,
        loader: 'webpack-graphql-loader',
      });

      return config;
    },
  })
);
