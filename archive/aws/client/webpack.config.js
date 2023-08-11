const Dotenv = require('dotenv-webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SocialTags = require('social-tags-webpack-plugin');

const description = 'Hack for LA’s 311-Data Team has partnered with the Los Angeles Department of Neighborhood Empowerment and LA Neighborhood Councils to create 311 data dashboards to provide all City of LA neighborhoods with actionable information at the local level.';

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
      '@theme': path.resolve(__dirname, 'theme'),
      '@components': path.resolve(__dirname, 'components'),
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@reducers': path.resolve(__dirname, 'redux/reducers'),
      '@styles': path.resolve(__dirname, 'styles'),
      '@assets': path.resolve(__dirname, 'assets'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@settings': path.resolve(__dirname, 'settings'),

    },
  },
  module: {
    rules: [
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
            options: {
              hmr: true,
            },
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
        use: [
          'file-loader',
        ],
      },
      // {
      //   test: /\.svg$/,
      //   use: [
      //     {
      //       loader: 'babel-loader',
      //     },
      //     {
      //       loader: 'react-svg-loader',
      //       options: {
      //         jsx: true,
      //       },
      //     },
      //   ],
      // },
    ],
  },
  plugins: [
    new Dotenv({
      path: './.env',
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: '311-Data Neighborhood Engagement Tool',
      favicon: './public/favicon.png',
      meta: {
        description,
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new SocialTags({
      appUrl: 'https://www.311-data.org/',
      facebook: {
        'og:type': 'website',
        'og:url': 'https://www.311-data.org/',
        'og:title': '311-Data Neighborhood Engagement Tool',
        'og:image': './public/social-media-card-image.png',
        'og:description': description,
        'og:locale': 'en_US',
        // 'fb:app_id': 'placeholder',
      },
      twitter: {
        'twitter:card': 'summary_large_image',
        'twitter:url': 'https://www.311-data.org/',
        'twitter:title': '311-Data Neighborhood Engagement Tool',
        'twitter:image': './public/social-media-card-image.png',
        'twitter:description': description,
        'twitter:site': '@data_311',
      },
    }),
  ],
};