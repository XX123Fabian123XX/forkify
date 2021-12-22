const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    mode:"development",
    entry:"./src/js/main.js",
    output: {
        path:path.join(__dirname, "dist"),
        filename:"main.js",
        publicPath:""
    },

    devServer:{
        static:"./dist",
        hot:false,
        devMiddleware: {
            publicPath:'/dist',
            writeToDisk:true
        }
    },

    plugins:[new HtmlWebpackPlugin({
        template:"./src/template.html"
    })],
    module:{
        rules:[
            {
                test:/\.scss$/,
                use:["style-loader", "css-loader", "sass-loader"]
            },
            {
                test:/\.(svg|png|jpg|gif)$/,
                use:{
                    loader:"file-loader",
                    options:{
                        name:"[name].[ext]",
                        outputPath:"img"
                    }
                }
            },
            {
                test:/\.html$/,
                use:["html-loader"]
            }
        ]
    }
}