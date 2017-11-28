'use strict'

const log = require('_/instance/log')

module.exports = function handler (ctx, job) {
  log.info('[JobCron.Handler] Process', { ctx, name: job.name })

  return null
}
