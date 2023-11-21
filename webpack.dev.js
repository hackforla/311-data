const { merge } = require("webpack-merge");
const path = require("path");
const config = require("./webpack.config.js");

module.exports = merge(config, {
  mode: "development",
  devServer: {
    open: true,
    static: {
      directory: path.join(__dirname, "./dist"),
    },
    port: 3000,
    hot: true,
    devMiddleware: {
      writeToDisk: true,
    },
  },
});