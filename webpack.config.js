var webpack = require("webpack");

const path = require('path');

module.exports = {
  // mode: 'none',
 
  entry: './src/main.js',
  output: {
    library: 'Loremsition', // set as global var
    filename: 'loremsition.js',
    path: path.resolve(__dirname, 'prod')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false, // don't look in .babelrc file ( used by parcel and jest )
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};

