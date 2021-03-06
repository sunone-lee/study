const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	mode: 'development',
	//production 배포용일 경우 알아서 최적화가 됨

	entry: {
		index: './src/index.js',
		entry: './src/js/entry.js'
	},

	output: {
		path: path.resolve(__dirname, 'dist'),
		//path.resolve([from…], to)전달받은 경로의 절대 경로를 리턴합니다'C:\\from\\to'
		//__dirname 은 항상 현재 파일의 디렉토리

		//publicPath: '/dist',
		// 클라이언트가 빌드된 파일에 접근할 수 있도록 서버가 제공할 path
		// CDN 주소 사용 가능

		filename: '[name].bundle.js'
		// 결과물 파일명
		// app.js -> app.js
		// [name].js -> entry에서 설정한 이름(object key).js
		// [hash].js -> 빌드마다 변경되는 해시.js
		// [chunkhash].js -> 파일 고유의 해시(파일이 달라질 경우 변경됨).js
	},

	module: {
		rules: [
			// {//bundle.js로 합쳐짐
			//     test:/\.(s*)css$/,
			//     use: ['style-loader','css-loader','sass-loader']
			// },

			{//css로 추출 플러그인 사용
				test: /\.(s*)css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader?sourceMap', 'sass-loader?sourceMap'],
				})
			},

			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},

			{
				test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'url-loader',
				options: {
					name: '[hash].[ext]',
					limit: 10000
				}
			},

			{
				test: /\.html$/,
				loader: "raw-loader"
			}
		]
	},

	plugins: [
		//build전에 결과물이 생성되는 파일을 비워줌
		new CleanWebpackPlugin(['dist']),

		//jquery
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),

		// HMR을 전체적으로 사용할수 있도록 설정
		//new webpack.HotModuleReplacementPlugin(),
		//package.json  --hot 추가해도 작동함

		//css추출 플러그인
		new ExtractTextPlugin({
			//filename: "styles.css",

			filename : '[name].css',
			// // entry에 선언된 객체의 각 프로퍼티가 [name]과 치환되어 파일이 생성
			// disable : false,
			allChunks : true
		}),

		//html build
		new HtmlWebpackPlugin({
			title: 'index',
			hash: true,
			filename: 'index.html',
			chunks: ['index', 'entry'],
			template: path.join(__dirname, 'index.html')
		}),
		new HtmlWebpackPlugin({
			title: 'main',
			hash: true,
			filename: 'index2.html',
			chunks: ['entry'],
			template: path.join(__dirname, './src/main.html')
		})

	],


	//최적화
	optimization: {
		minimize: true
	},

	resolve: {
		modules: ['node_modules'],
		extensions: ['.js', '.json', '.jsx', '.css']
	},

	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		//output path를 match하도록 합니다.
		//path.join(path1, path2…) 파라미터로 전달받은 경로를 이어서 하나의 경로로 만듭니다 'path1\\path2'

		hot: true
		//server에 HMR을 사용할수 있도록 설정

		//publicPath: '/dist'
		//publicPath의 ouput 같게 설정
	},

	devtool: 'eval-source-map',

	performance: {
		hints: process.env.NODE_ENV === 'production' ? "warning" : false
	}
};
