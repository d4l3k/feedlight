const webpack = require('webpack');
const path = require('path');

const prod = require('./webpack.prod.conf.js')

module.exports = {
  mode: 'development',
  entry: {
    ...prod.entry,
    app: [
        'webpack-dev-server/client?http://localhost:8080',
        './src/index'
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true
  },
  output: {
    filename: '[name].js',
    chunkFilename: "[name].[chunkhash].chunk.js",
    path: path.resolve(__dirname, '..', 'dist')
  },
  module: prod.module,
  resolve: prod.resolve,
  plugins: [
    new webpack.DefinePlugin({
      'config.BACKEND_ADDR': JSON.stringify('http://localhost:8081'),
    }),
    ...prod.plugins,
    new webpack.HotModuleReplacementPlugin(),
  ],
  optimization: prod.optimization
};
