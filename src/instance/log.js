'use strict'

const winston = require('winston')
const config = require('config')

const logger = new winston.Logger()

const level = config.get('logger.level')
const depth = config.get('logger.depth')

logger.configure({
  transports: [
    new (winston.transports.Console)({
      level,
      colorize: true,
      prettyPrint: true,
      depth,
      timestamp: () => new Date()
    })
  ]
})
logger.info('[Logger] Initiated')
logger.info('[Logger] Set logger level: %s', level)

module.exports = logger
