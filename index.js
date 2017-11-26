'use strict'

const http = require('http')
const config = require('config')

const app = require('_/app.js')
const log = require('_/instance/log')

const port = config.get('server.port')

const server = http.createServer(app)
    .listen(port, () => {
        // Отправим по возможности сообщение о готовности
      if (process.send) {
        log.debug('Send "READY" signal')
        process.send('ready')
      }

      log.info(`[App] Application listen HTTP on ${port}`)
    })
