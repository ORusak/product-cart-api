'use strict'

const event = 'unhandledRejection'

let _options

if (process.listenerCount(event) === 0) {
  setup()
}

function setup () {
  process.on(event, function (error) {
    const { log, handler, abort } = _options

    log.error(event, error)

    if (handler) {
      //  sync!
      handler()
    }

    if (abort) {
      process.abort()
    }

    process.exit(1)
  })
}

/**
 * 
 * @param {object} options -
 * @param {object} options.log -
 * @param {object} options.handler -
 * @param {object} options.abort -
 */
module.exports = function configure (options) {
  _options = options
}
