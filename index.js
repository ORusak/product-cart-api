'use strict'

const http = require('http')
const config = require('config')

const appInit = require('_/app.js')
const log = require('_/instance/log')

const port = config.get('server.port')

async function initServer () {
  const app = await appInit()

  http.createServer(app)
  .listen(port, () => {
      // Отправим по возможности сообщение о готовности
    if (process.send) {
      log.debug('Send "READY" signal')
      process.send('ready')
    }

    const basePath = require('_/lib/swagger').swaggerDoc.basePath

    log.info('[Server] Your server is listening on port %d (http://localhost:%d%s)',
      config.server.port, config.server.port, basePath)
    log.info('[Server] Documentation (http://localhost:%d%s/docs)',
      config.server.port, basePath)
  })
}

initServer()

//  Обработчики процесса
//  обработка unhandledRejection
const abort = config.get('server.abort')

require('_/lib/unhandled-rejection')({
  log,
  abort
})

//  catch ctrl+c event
process.once('SIGINT', () => {
  log.error('exit by SIGINT')

  if (abort) {
    //  todo: возможно требуется присылать приложению соответствующий код для окончания с abort
    //  конфигурация не позволяет сделать это в динамике
    process.abort()
  } else {
    //  позволяем приложению закончить работу обработкой по умолчанию
    //  1. генерацией правильного кода выхода
    process.kill(process.pid, 'SIGINT')
  }
})
