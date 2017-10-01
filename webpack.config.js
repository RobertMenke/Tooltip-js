const webpack     = require( "webpack" )
const path = require('path')
const is_prod     = true
const dev_plugins = [
    new webpack.DefinePlugin( {
        'process.env': {
            NODE_ENV: JSON.stringify( 'development' )
        }
    } )
]

const prod_plugins = [
    new webpack.DefinePlugin( {
        'process.env': {
            NODE_ENV: JSON.stringify( 'production' )
        }
    } ),
    new webpack.optimize.UglifyJsPlugin( {
        compress: {
            warnings: false
        }
    } )
]

module.exports = {
    entry  : {
        Tooltip: path.join(__dirname, 'lib/js/Tooltip.js'),
    },
    devtool: is_prod ? false : '#inline-source-map',
    cache  : true,
    output : {
        path         : path.join(__dirname, 'dist/'),
        filename     : '[name].js',
        libraryTarget: "umd"
    },
    module : {
        rules: [
            {
                test   : /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use    : {
                    loader : 'babel-loader',
                    options: {
                        presets: [ 'env' ],
                        plugins: [ "transform-flow-strip-types", "transform-object-rest-spread" ]
                    }
                }
            }
        ]
    },
    plugins: is_prod ? prod_plugins : dev_plugins
}