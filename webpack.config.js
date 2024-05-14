var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
const CleanWebpackPlugin = require('webpack-cleanup-plugin');

module.exports = {
  entry: {
    'library/loremsition': './src/main.js',
    'examples': './index.js'
  },
  optimization: {
    minimize: false
 },
  mode: "production",
  devServer: {
    host: '0.0.0.0',
    historyApiFallback: true,
    http2: true
   },
   performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
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
            presets: ['@babel/preset-env']
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
            attributes: {
              list : [
                {
                  attribute: "data-src",
                  type: "src"
                },
              ]
            }
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
    }),
    new CleanWebpackPlugin()
  ]
};