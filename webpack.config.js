const Dotenv = require('dotenv-webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const description =
  'Hack for LA’s 311-Data Team has partnered with the Los Angeles Department of Neighborhood Empowerment and LA Neighborhood Councils to create 311 data dashboards to provide all City of LA neighborhoods with actionable information at the local level.';

module.exports = {
  entry: './index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@root': __dirname,
      '@data': path.resolve(__dirname, 'data'),
      '@theme': path.resolve(__dirname, 'theme'),
      '@components': path.resolve(__dirname, 'components'),
      '@dashboards': path.resolve(__dirname, 'components/Dashboards'),
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@reducers': path.resolve(__dirname, 'redux/reducers'),
      '@styles': path.resolve(__dirname, 'styles'),
      '@assets': path.resolve(__dirname, 'assets'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@settings': path.resolve(__dirname, 'settings'),
      '@db': path.resolve(__dirname, 'components/db'),
    },
  },
  module: {
    rules: [
      {
        test: /\.worker\.(js|cjs|mjs)$/,
        use: { loader: 'worker-loader' },
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              // options
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: '.env',
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      title: '311-Data Neighborhood Engagement Tool',
      favicon: './public/favicon.png',
      meta: {
        description,
        'twitter:card': { name: 'twitter:card', content: 'summary_large_image' },
        'twitter:url': { name: 'twitter:url', content: 'https://www.311-data.org/' },
        'twitter:title': { name: 'twitter:title', content: '311-Data Neighborhood Engagement Tool' },
        'twitter:image': { name: 'twitter:image', content: './public/social-media-card-image.png' },
        'twitter:description': { name: 'twitter:description', content: description },

        'og:type': { property: 'og:type', content: 'website' },
        'og:url': { property: 'og:url', content: 'https://www.311-data.org/' },
        'og:title': { property: 'og:title', content: '311-Data Neighborhood Engagement Tool' },
        'og:image': { property: 'og:image', content: './public/social-media-card-image.png' },
        'og:description': { property: 'og:description', content: description },
      },
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public', to: '.' }],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
