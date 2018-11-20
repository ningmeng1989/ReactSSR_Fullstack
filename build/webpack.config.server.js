/**
 * Created by JianBo.Wang on 2018/11/9.
 */
const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = webpackMerge(baseConfig, {
  target: 'node',
  mode: "development",
  entry: {
    app: path.join(__dirname, '../client/server-entry.js')
  },
  externals: Object.keys(require('../package.json').dependencies),
  output: {
    filename: 'server-entry.js',
    // path: path.join(__dirname, '../dist'),
    // publicPath: '/public',
    libraryTarget: 'commonjs2'
  }
})
