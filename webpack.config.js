module.exports = {
    entry: [
       "webpack-dev-server/client?http://localhost:8080"
       , "./src/app.js"
    ]
    , module: {
        loaders: [
            {
                test: /\.js/
                , exclude: /node_modules/
                , loader: "babel"
            }
            , {
                test: /\.css/
                , exclude: /node_modules/
                , loader: "style!css"
            }
            , {
                test: /\.scss$/
                , loader: 'style!css!sass'
            }
            , {
                test: /\html$/
                , loader: "html"
            }
        ]
    }
    , resolve: {
        extensions: [ "", ".js", ".css" ]
    }
    , output: {
        path: __dirname + "/dist"
        , filename: "bundle.js"
    }
    , devServer: {
        contentBase: './dist'
    }
};
