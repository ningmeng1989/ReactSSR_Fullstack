/**
 * Created by JianBo.Wang on 2018/11/9.
 */
const express = require('express')
// const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const session = require('express-session')
const serverRender = require('./util/server.render')

const isDev = process.env.NODE_ENV === 'development'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'react cnode class'
}))

app.use(favicon(path.join(__dirname, '../favicon.ico')))

app.use('/api/user', require('./util/handleLogin'))
app.use('/api', require('./util/proxy'))

if (!isDev) {
  // const serverEntry = require('../dist/server-entry').default
  const serverEntry = require('../dist/server-entry')
  // const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8')
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf-8')
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', function (req, res, next) {
    // const appString = ReactSSR.renderToString(serverEntry)
    // res.send(appString)
    // res.send(template.replace('<!-- app -->', appString))
    serverRender(serverEntry, template, req, res).catch(next)
  })
} else {
  const devStatic = require('./util/dev.static.js')
  devStatic(app)
}

app.use(function (err, req, res, next) {
  console.log(err)
  res.status(500).send(err)
})

app.listen(3333, function () {
  console.log('server is listening on 3333')
})

