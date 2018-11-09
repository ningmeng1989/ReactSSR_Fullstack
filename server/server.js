/**
 * Created by JianBo.Wang on 2018/11/9.
 */
const express = require('express')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const app = express()

if (!isDev) {
  const serverEntry = require('../dist/server-entry').default
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8')
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', function (req, res) {
    const appString = ReactSSR.renderToString(serverEntry)
    // res.send(appString)
    res.send(template.replace('<!-- app -->', appString))
  })
} else {
  const devStatic = require('./util/dev.static.js')
  devStatic(app)
}

app.listen(3333, function () {
  console.log('server is listening on 3333')
})

