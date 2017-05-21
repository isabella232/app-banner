const path = require('path');
const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');

const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
];

let alias = {};

const DEBUG = process.env.NODE_ENV !== 'production';

if (!DEBUG) {
  plugins.push(
    new BabiliPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.NoEmitOnErrorsPlugin()
  );

  alias = {
    'react': 'preact',
    'react-dom': 'preact',
  };
}

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: [
    'whatwg-fetch',
    './index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
    }, {
      test: /\.scss$/,
      loader: 'style-loader!css-loader!sass-loader',
    }, {
      test: /\.svg$/,
      loader: 'url-loader',
    }],
  },
  plugins,
  resolve: {
    alias,
    extensions: ['.js', '.jsx'],
  },
};
