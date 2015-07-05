var path = require('path');

module.exports = {
    entry: {
        app: ['webpack/hot/dev-server', './src/index.js'],
        exampleSvg: ['webpack/hot/dev-server', './example/svg/app.js'],
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
