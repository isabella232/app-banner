const path = require('path');
const webpack = require('webpack');

const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
];

let alias = {};

const DEBUG = process.env.NODE_ENV !== 'production';

if (!DEBUG) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.NoEmitOnErrorsPlugin()
  );

  alias = {
    'react': 'preact-compat',
    'react-dom': 'preact-compat',
  };
}

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: [
    //'babel-polyfill',
    './index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
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
      test: [/\.svg$/, /\.png$/],
      loader: 'url-loader'
    }],
  },
  plugins,
  resolve: {
    alias,
    extensions: ['.js', '.jsx'],
  },
};
