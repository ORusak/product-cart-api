'use strict'

const fs = require('fs')
const swaggerTools = require('swagger-tools')
const yaml = require('js-yaml')

let isConfigured = false
let _middleware = null
let _swaggerDoc = null

module.exports = {
  /**
   * Инициализированные обработчики миддлвар
   * @type {object}
   */
  get middleware () {
    if (isConfigured === false) {
      throw new Error(`Not configure swagger middleware`)
    }

    return _middleware
  },

  /**
   * Инициализированный конфиг swagger
   * @type {object}
   */
  get swaggerDoc () {
    if (isConfigured === false) {
      throw new Error(`Not configure swagger middleware`)
    }

    return _swaggerDoc
  },

  /**
   * Инициализация
   * @param options
   * @return {Promise}
   */
  configure (options) {
    const { document, log } = options

    return new Promise((resolve) => {
      //  получение основных настроек
      const resolveRefs = require('json-refs').resolveRefs
      const YAML = require('yaml-js')
      const fs = require('fs')

      const root = YAML.load(fs.readFileSync(document, 'utf8').toString())
      const options = {
        filter: ['relative', 'remote'],
        loaderOptions: {
          processContent: function (res, callback) {
            callback(null, YAML.load(res.text))
          }
        },
        resolveCirculars: false
      }

      resolveRefs(root, options)
        .then(result => {
          const swaggerDoc = result.resolved
          
          _swaggerDoc = swaggerDoc

          swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
            _middleware = middleware

            isConfigured = true

            log.info('[SwaggerTool] Initiated')
            log.info('[SwaggerTool] Config: %s', document)

            resolve(null)
          })
        })
    })
  }
}
