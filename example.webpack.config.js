const webpack       = require( "webpack" )
const path          = require( 'path' )
const is_production = true

const example_entry = {
    autoplace: path.join( __dirname, 'examples/js/autoplace/autoplace.js' )
}

const example_output = {
    path    : path.join( __dirname, 'examples/js/main/' ),
    filename: '[name].js'
}


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
    entry  : example_entry,
    cache  : true,
    output : example_output,
    //uncomment the devtool key for development so that webpack will provide a map to your source
    devtool: is_production ? false : '#inline-source-map',
    module : {
        rules: [
            {
                test   : /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use    : {
                    loader : 'babel-loader',
                    options: {
                        presets    : [ 'env' ],
                        plugins    : [ "transform-flow-strip-types", "transform-object-rest-spread" ]
                    }
                }
            },
            {
                test  : /\.mustache$/,
                loader: 'mustache-loader'
            }
        ]
    },
    plugins: is_production ? prod_plugins : dev_plugins
}