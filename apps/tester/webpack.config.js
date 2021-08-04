const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  mode: 'none',
  devtool: false,
  entry: path.join(__dirname, './src/entry.ts'),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'tester-lambda.js',
    libraryTarget: 'commonjs',
  },
  externals: [
    function ({ context, request }, callback) {
      if (
        /^aws-sdk|^chrome-aws-lambda|^puppeteer-core|^puppeteer/.test(request)
      ) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    },
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          // configFile: path.resolve(__dirname, 'tsconfig.api-build.json'),
          transpileOnly: true,
        },
      },
    ],
  },
};
