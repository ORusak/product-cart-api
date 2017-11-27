'use strict'

const config = require('config')
const express = require('express')

const log = require('_/instance/log')

const packageInfo = require('./../package')

log.info(`[App] ${packageInfo.name} v${packageInfo.version}`)

const nodeEnv = config.get('server.environment')

log.info(`[App] Start init application (environment=${nodeEnv})`)

module.exports = function init () {
  try {
    return appInit()
  } catch (error) {
    log.error('[App] Error on init application: ', error, error.stack)

    throw new Error('[App] Error init express app')
  }
}

async function appInit () {
  // Инициализация ExpressJS
  const app = express()

  //  отключаем заголовки
  //  не передаем информацию о сервере для безопасности
  app.disable('x-powered-by')

  //  Инициализация подключения к БД
  await require('_/instance/db')

  //  миграции начальных данных
  const migration = require('../migration')

  await migration.migrate()

  //  Инициализация swagger-tools для этапа инициализации middleware
  const swaggerTools = require('_/lib/swagger')
  const swaggerConfig = config.get('swagger')

  await swaggerTools.configure({
    document: swaggerConfig.document,
    log
  })

  //  Инициализация middleware
  const middlewares = require('_/middlewares')

  middlewares.configure({ log })

  //  todo: cors, hal, cookieParser, security
  const {
    timeout,
    incomingRequest,
    swagger,
    errors
  } = middlewares.list

  const requestTimeout = config.get('server.timeout')

  app.use(timeout({
    timeout: requestTimeout,
    skip: Boolean(requestTimeout) === false
  }))

  app.use(incomingRequest({
    timeout: requestTimeout,
    skip: Boolean(requestTimeout) === false
  }))

  app.use(swagger.ui({
    swaggerUi: `${swaggerTools.swaggerDoc.basePath}/docs`,
    skip: false
  }))

  app.use(swagger.metadata())

  app.use(swagger.validate(swaggerConfig.validator))
  //  todo: add security for auth
  //  todo: добавить ленивую загрузку контроллеров
  app.use(swagger.router(swaggerConfig.router))

  app.use(errors({ environment: config.get('server.environment') }))

  return app
}
