const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  context: __dirname + '/src',
  entry: {
    app: './main.ts'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    extensions: ['', '.ts', '.js'],
  },
  devtool: 'source-map',
  module: {
    preLoaders: [{
      test: /\.ts$/,
      loader: 'tslint',
      exclude: /node_modules/,
    }],
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: 'style!css',
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  ts: { transpileOnly: true },
  devServer: {
    noInfo: true,
    port: 8082
  }
};