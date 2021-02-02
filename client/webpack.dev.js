const merge = require('webpack-merge');
const config = require('./webpack.config.js');
const path = require("path")

module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    contentBase: path.join(__dirname,'./dist'),
    publicPath:"/",
    writeToDisk: true,
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
});
