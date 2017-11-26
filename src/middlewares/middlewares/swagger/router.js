/*
*
*/

'use strict'

const _ = require('lodash')
const { join, sep } = require('path')
const { lstatSync, readdirSync } = require('fs')

const swagger = require('_/lib/swagger')

const root = process.cwd()

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory)

module.exports = function swaggerRouter (options) {
  //  подключаем модули контроллеров для инициализации swagger router
  const controllersPath = options.controllers
  const moduleControllers = getDirectories(`${root}${controllersPath}`)

  options.controllers = moduleControllers.reduce((result, pathController) => {
    const handlers = require(pathController)
    const nameController = _.camelCase(_.last(pathController.split(sep)))
    const handlersPlainList = _.mapKeys(handlers, (value, key) => {

      return `${nameController}_${key}`
    })

    Object.assign(result, handlersPlainList)

    return result
  }, {})

  return swagger.middleware.swaggerRouter(options)
}
