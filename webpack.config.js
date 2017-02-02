/**
 * Created by rbmenke on 1/19/17.
 */
const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry : {
        Tooltip     : './lib/js/Tooltip.js',
        // autoplace   : './examples/js/autoplace/autoplace.js'
    },
    // devtool : '#inline-source-map',
    cache : true,
    output : {
        path        : './dist/',
        // path        : './examples/js/main',
        filename    : '[name].js',
        libraryTarget : "umd"
    },
    module : {
        loaders : [
            {
                test : /\.js$/,
                loader : "babel?presets[]=es2015"
                // include : path.join(__dirname, 'lib')
            },
            {
                test: /\.mustache$/,
                // loader: 'mustache'
                loader: 'mustache?minify'
                // loader: 'mustache?{ minify: { removeComments: false } }'
                // loader: 'mustache?noShortcut'
            }
        ]
    },
    externals : {
        "jquery" : "jquery"
    },
    plugins : [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};