const path = require('path');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: [
    'babel-polyfill',
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
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
