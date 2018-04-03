var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var chalk = require('chalk');


const VENDOR_LIBS = [ 'react', 'react-dom', 'react-router-dom', 'lodash', 'axios' ];

module.exports = {
  entry: {
    bundle: './src/index.js',
    vendor: VENDOR_LIBS
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use : {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'es2015', 'react', 'stage-0'],
              "plugins": ["transform-react-pug", "transform-react-jsx"]
            }
        }
      },
      {
        test: /\.(css|scss|sass)$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader','sass-loader']
        })),
      },
      {
      test: /\.(jpe?g|png|gif|svg)$/,
      use: [
        { loader: 'url-loader',
          options: {limit: 40000}},
        'image-webpack-loader']
      },
      {
       test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
       use: 'url-loader?limit=10000&mimetype=application/font-woff'
     },
     {
       test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
       use: 'url-loader?limit=10000&mimetype=application/octet-stream'
     },
     {
       test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
       use: 'file-loader'
     },
     {
       test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
       use: 'url-loader?limit=10000&mimetype=image/svg+xml'
     }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8080,
    disableHostCheck: true
  },
  watchOptions: {
  ignored: /node_modules/
  },
  plugins: [
    new ProgressBarPlugin({
      format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
      clear: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new ExtractTextPlugin({
    filename: 'styles.css',
    allChunks: true
  }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
};
