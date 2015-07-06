var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        exampleSvg: ['webpack/hot/dev-server', './example/svg/app.js'],
        exampleCanvas: ['webpack/hot/dev-server', './example/canvas/app.js'],
        exampleImg: ['webpack/hot/dev-server', './example/img/app.js']
    },
    output: {
        path: './dist',
        publicPath: '/dist/',
        filename: '[name].bundle.js'
    },
    plugins: [
        //new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    optional: 'runtime'
                }
            }
        ]
    }
};
