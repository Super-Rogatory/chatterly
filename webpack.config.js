const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
dotenv.config();

const browserConfig = {
	entry: './client/index.js',
	output: {
		path: path.join(__dirname, '/public'),
		filename: 'clientbundle.js',
		publicPath: '/',
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-react'],
				},
				exclude: /node_modules/,
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
	plugins: [
		// ...
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(process.env),
		}),
		// ...
	],
	resolve: {
		alias: {
			process: 'process/browser',
		},
	},
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
};

module.exports = browserConfig;
