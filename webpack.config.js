const webpack = require('webpack');

module.exports = {
	context: __dirname + "/src",
	entry: [
		'./index',
	],
	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js',
	},
	module: {
		loaders: [{
			test: /.js$/,
			loader: 'babel-loader',
		}]
	},
};