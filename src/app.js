'use strict'

const config = require('config')
const app = require('express')

const log = require('_/instance/log')

const packageInfo = require('./package')

log.info(`[App] ${packageInfo.name} v${packageInfo.version}`)

const nodeEnv = config.get('server.environment')

log.info(`[App] Start init application (environment=${nodeEnv})`)

try {
  appInit()
} catch (error) {
  log.error('[App] Error on init application: ', error, error.stack)

  process.exit(1)
}

//  Обработчики процесса
//  обработка unhandledRejection
const abort = config.get('server.abort')

require('src/lib/unhandled-rejection')({
  log,
  abort
})

//  catches ctrl+c event
process.once('SIGINT', () => {
  log.error('exit by SIGINT')

  if (abort) {
    process.abort()
  } else {
    process.exit(1)
  }
})

async function appInit () {
  //  отключаем заголовки
  //  не передаем информацию о сервере для безопасности
  app.disable('x-powered-by')

  //  Инициализация подключения к БД

  //  Инициализация swagger-tools
  const swaggerTools = require('_/lib/swagger')
  const swaggerConfig = config.get('swagger')

  await swaggerTools.configure({
    document: swaggerConfig.document
  })

  //  todo: cors, hal, cookieParser, security
  //  Инициализация middleware
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
    swaggerUi: '/audit-documents/docs',
    skip: false
  }))

  app.use(swagger.metadata())

  app.use(swagger.validate(swaggerConfig.validator))
  //  todo: add security for auth
  //  todo: добавить ленивую загрузку контроллеров
  app.use(swagger.router(swaggerConfig.router))

  app.use(errors({ environment: config.get('server.environment') }))
}

module.exports = app
