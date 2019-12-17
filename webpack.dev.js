const HtmlWebPackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");

module.exports = {
    context: __dirname,
    entry: './src/index.js',
    mode: 'development',
    output: {
    publicPath: '/dist/',
    path: __dirname + '/dist/',
    filename: 'bundle.js'
    },
    devServer: {
        port: 3001
        },
    module: {
        rules: [
          {
            test: /\.csv$/,
            loader: 'file-loader',
            exclude: /node_modules/,
            options: {
              name: "[path][name].[ext]",
              emitFile: true,
            }
          },
            {
                test: /\.(jpg|jpeg|png|svg|gif|ico)$/,
                exclude: /node_modules/,
                use: ['file-loader?name=[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
              },
              {
                type: 'javascript/auto',
                test: /\.json$/,
                use: [
                    {
                      loader: 'file-loader',
                      options: {
                          name: "./plugin-config/[name].[ext]"
                      }
                    }
                ]
            },
            {
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env', '@babel/react']
                    }
                }
            }
            ,
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.scss$/,
                use: [
                  'style-loader',
                  'css-loader',
                  'sass-loader'
                ]
              },
            {
              test: /\.html$/,
              use: [
                {
                  loader: "html-loader"
                }
              ]
            },
            {
                test: /\.(frag|vert|glsl)$/,
                use: [
                  { 
                    loader: 'glsl-shader-loader',
                    options: {}  
                  }
                ]
              }
        ]
    },
  plugins: [
    new HtmlWebPackPlugin({
        template: __dirname + '/public/index.ejs',
        filename: 'index.html'
    }),
    new InterpolateHtmlPlugin({
          'PUBLIC_URL': 'Public'
    })
  ],
  devtool: 'inline-source-map'
  /*,
    resolve: {
        extensions: [".js", ".jsx"]
    }*/
};