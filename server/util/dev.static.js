/**
 *
 * Created by JianBo.Wang on 2018/11/9.
 */
const path = require('path')
const axios = require('axios')
const webpack = require('webpack')
const memoryFs = require('memory-fs')
const proxy = require('http-proxy-middleware')
// const asyncBootstrap = require('react-async-bootstrapper')
// const serialize = require('serialize-javascript')
// const ejs = require('ejs')
// const ReactSSR = require('react-dom/server')
// const Helmet = require('react-helmet').default

const serverRender = require('./server.render')

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

const NativeModule = require('module')
const vm = require('vm')

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}

const mfs = new memoryFs()
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs
// let serverBundle, createStoreMap
let serverBundle
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
  // const m = new Module()
  // m._compile(bundle, 'server-entry.js')
  const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m.exports
  // serverBundle = m.exports.default
  // createStoreMap = m.exports.createStoreMap
})

// const getStoreState = (stores) => {
//   return Object.keys(stores).reduce((result, storeName) => {
//     result[storeName] = stores[storeName].toJson()
//     return result
//   }, {})
// }

module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))

  app.get('*', function (req, res, next) {
    getTemplate().then(template => {
      return serverRender(serverBundle, template, req, res)
      // const appString = ReactSSR.renderToString(serverBundle)

      // const routerContext = {}
      // const stores = createStoreMap()
      // const app = serverBundle(stores, routerContext, req.url)
      // asyncBootstrap(app).then(() => {
      //   if(routerContext.url) {
      //     res.status(302).setHeader('Location', routerContext.url)
      //     res.end()
      //     return
      //   }
      //   const helmet = Helmet.rewind()
      //   const state = getStoreState(stores)
      //   const appString = ReactSSR.renderToString(app)
      //
      //   const html = ejs.render(template, {
      //     appString: appString,
      //     initialState: serialize(state),
      //     meta: helmet.meta.toString(),
      //     title: helmet.title.toString(),
      //     style: helmet.style.toString(),
      //     link: helmet.link.toString(),
      //   })
      //
      //   // console.log(stores.appState.count)
      //   // res.send(template.replace('<!-- app -->', appString))
      //   res.send(html)
      // })
    }).catch(next)
  })
}
