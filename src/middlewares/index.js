/*
* Модуль инциализации middleware
*/

'use strict'

const _ = require('lodash')

let optionsGlobal
let isConfigured = false

/**
 *
 */
const middlewares = require('require-all')({
  dirname: `${__dirname}/middlewares`,
  resolve (middleware) {
    const middelwareFactory = options => {
      const log = optionsGlobal.log
      const name = middleware.name || ''

      log.debug(`[Module.Middleware.${name}] Start init`)

      const skip = options.skip

      if (skip) {
        log.debug(`[Module.Middleware.${name}] Skipped`)

        return null
      }
      const optionsInit = Object.assign({}, optionsGlobal, options)

      log.debug(`[Module.Middleware.Timeout] Options: `, optionsInit)

      return middleware(optionsInit)
    }

    return middelwareFactory
  }
})

const moduleMiddlewaresInit = _.mapKeys(middlewares, (value, key) => _.camelCase(key))

module.exports = {
    /**
     * @param {object} options -
     * @param {Logger} options.log -
     *
     * */
  configure (options) {
    //  todo: ora: Проверка на обязательные параметры
    const log = options.log

    log.info('[Module.Middlware] Start configure with options:', {
      options: {
        log: log.name
      }
    })

    optionsGlobal = options

    isConfigured = true
  },

  list: moduleMiddlewaresInit
}
