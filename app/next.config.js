const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const withTM = require('next-transpile-modules')([
  'api',
  'mongodb2',
  'context-api',
]);
const withImages = require('next-images');

module.exports = withImages(
  withTM({
    future: {
      webpack5: true,
    },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.graphql?$/,
        loader: 'webpack-graphql-loader',
      });
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(
                __dirname,
                '../node_modules/onigasm/lib/onigasm.wasm'
              ),
              to: path.join(__dirname, 'public/onigasm.wasm'),
            },
          ],
        })
      );
      return config;
    },
  })
);
