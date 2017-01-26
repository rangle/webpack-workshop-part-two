const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  context: __dirname + '/src',
  entry: {
    vendor: 'whatwg-fetch',
    app: './main.ts'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.ts$/,
      enforce: 'pre',
      loader: 'tslint-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.js$/,
      enforce: 'pre',
      loader: 'eslint-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    },
    {
      test: /\.ts$/,
      use: [{ loader: 'awesome-typescript-loader', options: { transpileOnly: true } }],
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      exclude: /node_modules/,
    }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }),
    new StyleLintPlugin({
      configFile: './.stylelintrc',
      context: './src',
      files: '*.css',
      failOnError: false,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    })
  ],
  devServer: {
    noInfo: true,
    port: 8081
  }
};