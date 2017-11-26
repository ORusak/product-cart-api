/*
* Модуль инциализации middleware
*/

'use strict'

const _ = require('lodash')
const util = require('util')

let optionsGlobal
let isConfigured = false

/**
 *
 */
const middlewares = require('require-all')({
  dirname: `${__dirname}/middlewares`,
  resolve (middleware) {
    const middelwareFactory = (options = {}) => {
      const log = optionsGlobal.log
      const name = middleware.name || ''

      log.debug(`[Middleware.${name}] Start init`)

      const skip = options.skip

      if (skip) {
        log.info(`[Middleware] Skipped: %s`, name)

        return null
      }
      const optionsInit = Object.assign({}, optionsGlobal, options)

      log.info(`[Middleware] Initiated: %s`, name, util.inspect(optionsInit, { depth: 0 }))

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

    log.debug('[Module.Middlware] Start configure')

    optionsGlobal = options

    isConfigured = true
  },

  get list () {
    if (isConfigured === false) {
      throw new Error(`Not configure swagger middleware`)
    }

    return moduleMiddlewaresInit
  }
}
