var path = require('path');

module.exports = {
    entry: {
        app: ['webpack/hot/dev-server', './src/index.js'],
        example: ['webpack/hot/dev-server', './example.js'],
    },
    output: {
        path: './dist',
        publicPath: '/dist/',
        filename: '[name].bundle.js'
    },
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
