/*
*
*/

'use strict'

const timeoutMiddlweare = require('connect-timeout')

const DEFAULT_TIMEOUT_SECONDS = 60

module.exports = function timeout (options) {
  const requestTimeoutInit = options.timeout || DEFAULT_TIMEOUT_SECONDS

  return timeoutMiddlweare(requestTimeoutInit)
}
