var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  entry: {
    'library/loremsition': './src/main.js',
    'examples': './index.js'
  },
  mode: "production",
  devServer: {
    historyApiFallback: true,
        contentBase: './'
   },
  output: {
    library: 'Loremsition',
    path: path.resolve(__dirname, './prod'),
    filename: '[name].js',
  },
  module: {
    rules: [
      { 
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ["syntax-dynamic-import"]
          }
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src']
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template : "./index.html",
    //   chunks: ['app'],
    //   filename: 'index.html'
    // }),
    new HtmlWebpackPlugin({
      template : "./index.html",
      chunks: ['examples'],
      filename: 'index.html'
    })
  ]
};