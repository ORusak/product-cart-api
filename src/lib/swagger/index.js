'use strict'

const fs = require('fs')
const swaggerTools = require('swagger-tools')
const yaml = require('js-yaml')

let isConfigured = false
let _middleware = null

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
   * Инициализация
   * @param options
   * @return {Promise}
   */
  configure (options) {
    return new Promise((resolve) => {
            //  получение основных настроек
            // eslint-disable-next-line no-sync
      const swaggerYml = fs.readFileSync(options.document, 'utf8')
      const swaggerDoc = yaml.safeLoad(swaggerYml)

      swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
        _middleware = middleware

        isConfigured = true

        resolve(null)
      })
    })
  }
}
