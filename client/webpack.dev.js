const merge = require('webpack-merge');
const path = require('path');
const config = require('./webpack.config.js');

module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    contentBase: path.join(__dirname, './dist'),
    publicPath: '/',
    writeToDisk: true,
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
});
