var webpack = require('webpack');
var path = require('path');

var publicPath = 'http://localhost:3000/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

var devConfig = {
    entry: {
        page1: ['./views/index.ejs', hotMiddlewareScript]
    },
    output: {
        filename: './[name]/bundle.js',
        path: path.resolve('./public'),
        publicPath: publicPath
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.(png|jpg)$/,
            loader: 'url?limit=8192&context=client&name=[path][name].[ext]'
        }, {
            test: /\.scss$/,
            loader: 'style!css?sourceMap!resolve-url!sass?sourceMap'
        }, {
            test: /\.(tpl|ejs)$/,
            loader: 'ejs-loader?variable=data'
        }, {
            test: /\.scss$/,
            loader: 'style!css!scss'
        }]
    },
    plugins: [
        // new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoErrorsPlugin()
    ],
    resolve: {
        // root: [process.cwd() + '/src', process.cwd() + '/node_modules'],
        alias: {},
        extensions: ['.js', '.css', '.scss', '.ejs', '.png', '.jpg']
    }
};

module.exports = devConfig;