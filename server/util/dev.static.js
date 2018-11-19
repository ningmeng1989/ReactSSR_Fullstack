/**
 *
 * Created by JianBo.Wang on 2018/11/9.
 */
const path = require('path')
const axios = require('axios')
const webpack = require('webpack')
const memoryFs = require('memory-fs')
const proxy = require('http-proxy-middleware')
const asyncBootstrap = require('react-async-bootstrapper')
const serialize = require('serialize-javascript')
const ejs = require('ejs')
const ReactSSR = require('react-dom/server')

const serverConfig = require('../../build/webpack.config.server')

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    // axios.get('http://localhost:8888/public/index.html')
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

const Module = module.constructor

const mfs = new memoryFs()
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs
let serverBundle, createStoreMap
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.error(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = new Module()
  m._compile(bundle, 'server-entry.js')
  serverBundle = m.exports.default
  createStoreMap = m.exports.createStoreMap
})

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))

  app.get('*', function (req, res) {
    getTemplate().then(template => {
      // const appString = ReactSSR.renderToString(serverBundle)
      const routerContext = {}
      const stores = createStoreMap()
      const app = serverBundle(stores, routerContext, req.url)
      asyncBootstrap(app).then(() => {
        const state = getStoreState(stores)
        const appString = ReactSSR.renderToString(app)

        if(routerContext.url) {
          res.status(302).setHeader('Location', routerContext.url)
          res.end()
          return
        }

        const html = ejs.render(template, {
          appString: appString,
          initialState: serialize(state)
        })

        // console.log(stores.appState.count)
        // res.send(template.replace('<!-- app -->', appString))
        res.send(html)
      })
    })
  })
}
