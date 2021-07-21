const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const __DEV__ = process.env.NODE_ENV === 'development';
const __PROD__ = process.env.NODE_ENV === 'production';

module.exports = {
  mode: __DEV__ ? 'development' : 'production',
  target: 'web',
  entry: './src/index',
  devtool: __DEV__ ? 'cheap-module-source-map' : false,
  output: {
    filename: '[name].[fullhash].js',
    chunkFilename: '[name].[fullhash].js',
    path: __dirname + '/build',
  },
  stats: 'errors-only',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  devServer: {
    compress: true,
    port: 4010,
    hot: true,
    stats: 'errors-only',
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Your awesome app',
    }),
  ],
};
