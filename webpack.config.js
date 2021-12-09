const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const browserConfig = {
	entry: './client/src/index.js',
	output: {
		path: path.join(__dirname, '/public'),
		filename: 'clientbundle.js',
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-react'],
				},
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: 'file-loader',
					},
				],
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
};

const serverConfig = {
	entry: './server/index.js',
	target: 'node',
	externals: [nodeExternals()], // externals, modules that should not be bundled. when bundling for the backend, you don't want to bundle its node_modules.
	output: {
		path: path.join(__dirname, '/public'),
		filename: 'serverbundle.js',
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
			},
		],
	},
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
};

module.exports = [browserConfig, serverConfig];
