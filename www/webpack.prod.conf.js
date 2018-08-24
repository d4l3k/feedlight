const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    app: './src/index',
    //feedlightForm: './src/components/feedlight-form',
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], { root: path.resolve(__dirname) }),
    new webpack.NormalModuleReplacementPlugin(
      /environments\/environment\.ts/,
      'environment.prod.ts'
    ),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './static'),
        to: 'static',
        ignore: ['.*']
      },
      {
        from: path.join(
          path.resolve(__dirname, './node_modules/@webcomponents/webcomponentsjs/')
        ),
        to: './webcomponentsjs',
      }
    ]),
    new webpack.IgnorePlugin(/vertx/),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
