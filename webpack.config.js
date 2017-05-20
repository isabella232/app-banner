const path = require('path');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: [
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
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
