const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  context: __dirname + '/src',
  entry: {
    'whatwg-fetch': 'whatwg-fetch',
    app: './main.ts'
  },
  output: {
    path: __dirname + '/dist',
    filename: process.env.NODE_ENV === 'production' ? '[name].[chunkhash].js' : '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',
  module: {
    rules: [{
      test: /\.ts$/,
      enforce: 'pre',
      loader: 'tslint-loader',
      exclude: /node_modules/,
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
    new webpack.DefinePlugin({
      PRODUCTION: process.env.NODE_ENV === 'production',
      GET_DATA_URL: process.env.NODE_ENV === 'production' ? JSON.stringify('https://jsonplaceholder.typicode.com/posts/2')
        : JSON.stringify('https://jsonplaceholder.typicode.com/posts/3'),
      POST_ERROR_URL: JSON.stringify('http://jsonplaceholder.typicode.com/posts')
    })
  ].concat(process.env.NODE_ENV === 'production' ? [new webpack.optimize.UglifyJsPlugin({
    sourceMap: true
  })] : []),
  devServer: {
    noInfo: true,
    port: 8081
  }
};