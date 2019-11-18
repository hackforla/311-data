module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'css-loader',
          'style-loader',
          {
            loader: 'sass-loader',
              options: {
                minimize: true,
                sourceMap: true
            }
          }
        ],
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    open: true,
    contentBase: './public',
    compress: true,
    port: 8080,
    hot: true,
    historyApiFallback: true,
  }
};