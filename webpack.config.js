var webpack = require('webpack');
var plugins = [
    new webpack.ProvidePlugin({
        riot: 'riot'
    }),
    new webpack.HotModuleReplacementPlugin()
];
if(process.env.PRODUCTION) plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));

module.exports = {
    entry: './app/index',
    output: {
        path: __dirname + '/public/build/',
        filename: process.env.PRODUCTION ? 'bundle.min.js' : 'bundle.js'
    },
    plugins: plugins,
    module: {
        preLoaders: [
            { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader', query: { type: 'none' } }
        ],
        loaders: [
            { test: /\.js|\.tag|\.es6$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.scss$/, loaders: ["style", "css", "sass"]}
        ]
    },
    devServer: {
        contentBase: './public/build/',
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    }
};