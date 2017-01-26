const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  context: __dirname + '/src',
  entry: { vendor: ['whatwg-fetch'] },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    library: 'vendor_lib'
  },
  plugins: [new webpack.DllPlugin({
    name: 'vendor_lib',
    path: 'dist/vendor-manifest.json',
  })]
};